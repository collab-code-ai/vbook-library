// Run with Mozilla Rhino 1.7.15 (Java required):
// java -cp /path/to/rhino-1.7.15.jar org.mozilla.javascript.tools.shell.Main \
//   -version 200 tests/rhino-smoke.js /path/to/unpacked/plugin [live-catalog.json]
// Tests real extension scripts with simulated VBook fetch/load/Response APIs.
// This is not the Android app and does not verify its installer or UI.
var extensionRoot = String(arguments[0] || "extensions/vbook-personal-library");
var liveCatalogPath = arguments[1] ? String(arguments[1]) : null;
var cx = Packages.org.mozilla.javascript.Context.getCurrentContext();
var base = "https://raw.githubusercontent.com/collab-code-ai/vbook-library/main/library";
var sources = {};
var files = ["home.js", "gen.js", "search.js", "detail.js", "toc.js", "chap.js", "library.js"];
for (var i = 0; i < files.length; i++) {
    sources[files[i]] = String(readFile(extensionRoot + "/src/" + files[i], "UTF-8"));
}
var checks = [];
var bootstrap = [
    'var Response = {success:function(data,next){return {code:0,data:data,data2:next};},',
    'error:function(message){return {code:1,message:message};}};',
    'function load(name){',
    ' if (!Object.prototype.hasOwnProperty.call(SOURCES,name)) throw new Error("Unknown script: "+name);',
    ' Packages.org.mozilla.javascript.Context.getCurrentContext().evaluateString(this,SOURCES[name],name,1,null);',
    '}',
    'function fetch(url,options){',
    ' url=String(url); var item=HTTP[url];',
    ' if(!item) throw new Error("Unexpected HTTP request: "+url);',
    ' return {ok:item.status>=200 && item.status<300,status:item.status,',
    ' text:function(){return new java.lang.String(item.body);}};',
    '}'
].join("\n");

function run(file, args, responses) {
    var scope = cx.initStandardObjects();
    cx.evaluateString(scope, "var SOURCES=" + JSON.stringify(sources) +
        ";var HTTP=" + JSON.stringify(responses || {}) + ";", "fixtures", 1, null);
    cx.evaluateString(scope, bootstrap, "vbook-api-simulation", 1, null);
    cx.evaluateString(scope, sources[file], file, 1, null);
    var json = cx.evaluateString(scope,
        "JSON.stringify(execute.apply(null," + JSON.stringify(args || []) + "))", file, 1, null);
    return JSON.parse(String(json));
}
function assert(condition, message) {
    if (!condition) throw new Error(message);
}
function check(name, fn) {
    try { fn(); checks.push({name:name, passed:true}); }
    catch (error) { checks.push({name:name, passed:false, error:String(error)}); }
}
function jsonResponse(value) { return {status:200, body:JSON.stringify(value)}; }
var books = [];
for (var n = 1; n <= 32; n++) {
    books.push({id:"book-" + n, title:"Sách " + n, author:"Tác giả thử nghiệm",
        description:"Nội dung tiếng Việt", genres:["Công nghệ"],
        status:n % 2 === 0 ? "completed" : "ongoing",
        updatedAt:"2026-11-" + (n < 10 ? "0" : "") + n});
}
// Explicit timestamps for sorting, independent of invalid calendar dates.
books[31].updatedAt = "2026-12-01T00:00:00+07:00";
var bookUrl = base + "/books/book-1/book.json";
var chapterPath = "books/book-1/chapters/chapter-1.html";
var book = {title:"Sách tiếng Việt", author:"Tác giả", status:"completed", genres:["Công nghệ"],
    chapters:[{title:"Chương 1", path:chapterPath},
        {title:"Chương 2", path:"books/book-1/chapters/chapter-2.html"}]};
var http = {};
http[base + "/catalog.json"] = jsonResponse({books:books});
http[bookUrl] = jsonResponse(book);
http[base + "/" + chapterPath] = {status:200, body:"<h2>Chương 1</h2><p>Nội dung tiếng Việt có dấu.</p>"};

check("Home exposes four working list scripts", function() {
    var result = run("home.js");
    assert(result.code === 0 && result.data.length === 4, "Missing home tabs");
    for (var k = 0; k < result.data.length; k++) {
        var tab = result.data[k];
        assert(sources[tab.script], "Missing tab script");
        assert(run(tab.script, [tab.input, "1"], http).code === 0, "Tab execution failed");
    }
});
check("Pagination: 30 then 2 books; next token is string then null", function() {
    var first = run("gen.js", ["@all", "1"], http);
    var second = run("gen.js", ["@all", first.data2], http);
    assert(first.data.length === 30 && first.data2 === "2", "Wrong first page");
    assert(second.data.length === 2 && second.data2 === null, "Wrong last page");
    assert(first.data[0].link === bookUrl, "Wrong book URL");
});
check("Search matches Vietnamese author and handles no results", function() {
    assert(run("search.js", ["tác giả thử nghiệm", "1"], http).data.length === 30, "Author search failed");
    assert(run("search.js", ["không có kết quả", "1"], http).data.length === 0, "No-match search failed");
});
check("Completed, ongoing, genre and recent filters", function() {
    assert(run("gen.js", ["@completed", "1"], http).data.length === 16, "Completed filter failed");
    assert(run("gen.js", ["@ongoing", "1"], http).data.length === 16, "Ongoing filter failed");
    assert(run("gen.js", ["@genre:Công nghệ", "1"], http).data.length === 30, "Genre filter failed");
    assert(run("gen.js", ["@recent", "1"], http).data[0].name === "Sách 32", "Recent ordering failed");
});
check("Invalid and zero page inputs fall back to first page", function() {
    assert(run("gen.js", ["@all", "bad"], http).data.length === 30, "Invalid page failed");
    assert(run("gen.js", ["@all", "0"], http).data.length === 30, "Zero page failed");
});
check("Book detail returns title, completed flag, genre and chapter count", function() {
    var detail = run("detail.js", [bookUrl], http).data;
    assert(detail.name === book.title && detail.ongoing === false, "Wrong book detail");
    assert(detail.detail.indexOf("Số chương: 2") >= 0, "Wrong chapter count");
    assert(detail.genres[0].script === "gen.js", "Genre action failed");
});
check("Full flow: Home > Gen > Detail > TOC > Chapter HTML", function() {
    var tab = run("home.js").data[0];
    var item = run(tab.script, [tab.input, "1"], http).data[0];
    assert(run("detail.js", [item.link], http).code === 0, "Detail failed");
    var toc = run("toc.js", [item.link], http).data;
    assert(toc.length === 2, "Wrong TOC length");
    assert(toc[0].url === base + "/" + chapterPath, "Chapter URL failed");
    var chapter = run("chap.js", [toc[0].url], http);
    assert(chapter.code === 0 && typeof chapter.data === "string", "Chapter must return HTML string");
    assert(chapter.data.indexOf("tiếng Việt có dấu") >= 0, "Unicode chapter content failed");
});
check("Volume TOC preserves sections and resolves chapter URLs", function() {
    var responses = {};
    responses[bookUrl] = jsonResponse({title:"Sách chia tập", volumes:[
        {title:"Tập 1", chapters:[book.chapters[0]]},
        {title:"Tập 2", chapters:[book.chapters[1]]}]});
    var toc = run("toc.js", [bookUrl], responses).data;
    assert(toc.length === 4 && toc[0].type === "section" && toc[2].name === "Tập 2", "Volume TOC failed");
    assert(toc[3].url.indexOf("https://") === 0, "Relative chapter URL");
});
check("Catalog HTTP and malformed JSON errors are reported", function() {
    var responses = {};
    responses[base + "/catalog.json"] = {status:404, body:"Not found"};
    assert(run("gen.js", ["@all", "1"], responses).code !== 0, "HTTP error ignored");
    responses[base + "/catalog.json"] = {status:200, body:"{broken-json"};
    assert(run("gen.js", ["@all", "1"], responses).code !== 0, "Invalid JSON ignored");
});
check("Missing title and empty TOC return errors", function() {
    var responses = {};
    responses[bookUrl] = jsonResponse({chapters:[]});
    assert(run("detail.js", [bookUrl], responses).code !== 0, "Missing title ignored");
    assert(run("toc.js", [bookUrl], responses).code !== 0, "Empty TOC ignored");
});
check("Chapter HTTP error and blank HTML return errors", function() {
    var responses = {};
    responses[base + "/" + chapterPath] = {status:404, body:"Not found"};
    assert(run("chap.js", [chapterPath], responses).code !== 0, "Chapter HTTP error ignored");
    responses[base + "/" + chapterPath] = {status:200, body:" \n "};
    assert(run("chap.js", [chapterPath], responses).code !== 0, "Blank chapter ignored");
});
if (liveCatalogPath) {
    check("Live GitHub catalog snapshot loads in Rhino", function() {
        var responses = {};
        var raw = String(readFile(liveCatalogPath, "UTF-8"));
        var catalog = JSON.parse(raw);
        responses[base + "/catalog.json"] = {status:200, body:raw};
        var result = run("gen.js", ["@all", "1"], responses);
        assert(result.code === 0 && result.data.length === Math.min(30, catalog.books.length), "Live catalog failed");
    });
}
var failed = 0;
for (var c = 0; c < checks.length; c++) if (!checks[c].passed) failed++;
print(JSON.stringify({engine:"Mozilla Rhino 1.7.15", api:"Simulated VBook APIs", androidVerified:false,
    total:checks.length, passed:checks.length-failed, failed:failed, checks:checks}, null, 2));
if (failed) quit(1);
