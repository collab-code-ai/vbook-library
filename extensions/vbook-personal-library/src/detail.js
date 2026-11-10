// Book detail from library/books/<book-id>/book.json.
load("library.js");

function execute(url) {
    var result = readLibraryJson(url);
    if (result.error) {
        return Response.error("Không tải được thông tin sách: " + result.error);
    }

    var book = result.data || {};
    var name = (book.title || book.name || "") + "";
    if (!name) {
        return Response.error("book.json thiếu trường title.");
    }

    var status = ((book.status || "ongoing") + "").toLowerCase();
    var statusLabel = status === "completed" ? "Hoàn thành" :
        (status === "hiatus" ? "Tạm ngưng" : "Đang phát hành");

    var chapterCount = 0;
    var directChapters = book.chapters || [];
    chapterCount += directChapters.length;

    var volumes = book.volumes || [];
    for (var i = 0; i < volumes.length; i++) {
        chapterCount += (volumes[i].chapters || []).length;
    }

    var genres = [];
    var rawGenres = book.genres || [];
    for (var j = 0; j < rawGenres.length; j++) {
        var genre = (rawGenres[j] || "") + "";
        if (genre) {
            genres.push({
                title: genre,
                input: "@genre:" + genre,
                script: "gen.js"
            });
        }
    }

    return Response.success({
        name: name,
        cover: book.cover ? libraryUrl(book.cover) : "",
        host: BASE_URL,
        author: (book.author || "") + "",
        description: (book.description || "") + "",
        detail: "Trạng thái: " + statusLabel + "<br>Số chương: " + chapterCount,
        ongoing: status !== "completed",
        genres: genres.length > 0 ? genres : undefined
    });
}
