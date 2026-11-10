load('config.js');

function execute(query, page) {
    var result = readJson(libraryUrl("catalog.json"));
    if (result.error) {
        return Response.error("Không tải được catalog.json: " + result.error);
    }

    var catalog = result.data || {};
    var books = catalog.books || [];
    var keyword = String(query || "").toLowerCase();
    var pageNumber = parseInt(page || "1", 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 1;
    }

    var filtered = [];
    for (var i = 0; i < books.length; i++) {
        var book = books[i] || {};
        var status = String(book.status || "unknown").toLowerCase();
        var matches = true;

        if (keyword === "@completed") {
            matches = status === "completed";
        } else if (keyword === "@ongoing") {
            matches = status !== "completed";
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
            var left = String(a.updatedAt || "");
            var right = String(b.updatedAt || "");
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
        var id = String(item.id || "");
        if (!id) continue;

        var bookPath = item.bookPath || ("books/" + id + "/book.json");
        var cover = item.cover ? libraryUrl(item.cover) : "";
        var statusLabel = String(item.status || "").toLowerCase() === "completed" ? "Hoàn thành" : "Đang phát hành";

        items.push({
            name: item.title || id,
            link: libraryUrl(bookPath),
            cover: cover,
            description: item.latestChapter || item.description || "",
            tag: statusLabel
        });
    }

    var nextPage = end < filtered.length ? String(pageNumber + 1) : "";
    return Response.success(items, nextPage);
}
