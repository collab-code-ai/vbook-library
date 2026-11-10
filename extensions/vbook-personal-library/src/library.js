// Shared data helpers for VBook Personal Library.
// This URL must match metadata.source in plugin.json.
var BASE_URL = "https://raw.githubusercontent.com/collab-code-ai/vbook-library/main/library";

function libraryUrl(path) {
    var value = path === undefined || path === null ? "" : path + "";
    if (value.indexOf("https://") === 0 || value.indexOf("http://") === 0) {
        return value;
    }
    if (value.charAt(0) === "/") {
        return BASE_URL + value;
    }
    return BASE_URL + "/" + value;
}

function readLibraryJson(url) {
    var response = fetch(url, { timeout: 20000 });
    if (!response.ok) {
        return { error: "HTTP " + response.status };
    }

    try {
        var raw = response.text() + "";
        return { data: JSON.parse(raw) };
    } catch (error) {
        return { error: "JSON parse error: " + (error + "") };
    }
}

function listBooks(filter, page) {
    var result = readLibraryJson(libraryUrl("catalog.json"));
    if (result.error) {
        return Response.error("Không tải được catalog.json: " + result.error);
    }

    var catalog = result.data || {};
    var books = catalog.books || [];
    var keyword = filter === undefined || filter === null ? "" : (filter + "").toLowerCase().trim();
    var pageValue = page === undefined || page === null || page === "" ? "1" : page + "";
    var pageNumber = parseInt(pageValue, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 1;
    }

    var filtered = [];
    for (var i = 0; i < books.length; i++) {
        var book = books[i] || {};
        var status = (book.status || "unknown") + "";
        status = status.toLowerCase();
        var matches = true;

        if (keyword === "@completed") {
            matches = status === "completed";
        } else if (keyword === "@ongoing") {
            matches = status !== "completed";
        } else if (keyword.indexOf("@genre:") === 0) {
            var wantedGenre = keyword.substring(7);
            var genres = book.genres || [];
            matches = false;
            for (var g = 0; g < genres.length; g++) {
                if (((genres[g] || "") + "").toLowerCase() === wantedGenre) {
                    matches = true;
                    break;
                }
            }
        } else if (keyword === "@recent" || keyword === "@all" || keyword === "") {
            matches = true;
        } else {
            var haystack = [
                book.title || "",
                book.author || "",
                book.description || "",
                (book.genres || []).join(" ")
            ].join(" ").toLowerCase();
            matches = haystack.indexOf(keyword) !== -1;
        }

        if (matches) {
            filtered.push(book);
        }
    }

    if (keyword === "@recent") {
        filtered.sort(function (a, b) {
            var left = (a.updatedAt || "") + "";
            var right = (b.updatedAt || "") + "";
            if (left < right) return 1;
            if (left > right) return -1;
            return 0;
        });
    }

    var pageSize = 30;
    var start = (pageNumber - 1) * pageSize;
    var end = Math.min(start + pageSize, filtered.length);
    var items = [];

    for (var j = start; j < end; j++) {
        var item = filtered[j] || {};
        var id = (item.id || "") + "";
        if (!id) continue;

        var bookPath = item.bookPath || ("books/" + id + "/book.json");
        var cover = item.cover ? libraryUrl(item.cover) : "";
        var statusLabel = ((item.status || "") + "").toLowerCase() === "completed"
            ? "Hoàn thành"
            : "Đang phát hành";

        items.push({
            name: (item.title || id) + "",
            link: libraryUrl(bookPath),
            cover: cover,
            description: ((item.latestChapter || item.description || "") + ""),
            host: BASE_URL,
            tag: statusLabel
        });
    }

    var nextPage = end < filtered.length ? String(pageNumber + 1) : null;
    return Response.success(items, nextPage);
}
