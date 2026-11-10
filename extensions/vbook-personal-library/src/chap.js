// Chapter content is stored as an HTML fragment in the GitHub library.
load("library.js");

function execute(url) {
    var response = fetch(libraryUrl(url), { timeout: 30000 });
    if (!response.ok) {
        return Response.error("Không tải được nội dung chương: HTTP " + response.status);
    }

    var html = response.text() + "";
    if (!html.trim()) {
        return Response.error("File chương đang rỗng.");
    }

    return Response.success(html);
}
