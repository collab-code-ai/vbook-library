load('config.js');

function execute(url) {
    var result = readJson(url);
    if (result.error) {
        return Response.error("Không tải được thông tin sách: " + result.error);
    }

    var book = result.data || {};
    var title = book.title || book.name || "";
    if (!title) {
        return Response.error("book.json thiếu trường title.");
    }

    var status = String(book.status || "ongoing").toLowerCase();
    var statusLabel = status === "completed" ? "Hoàn thành" :
        (status === "hiatus" ? "Tạm ngưng" : "Đang phát hành");

    var chapterCount = 0;
    var directChapters = book.chapters || [];
    chapterCount += directChapters.length;

    var volumes = book.volumes || [];
    for (var i = 0; i < volumes.length; i++) {
        chapterCount += (volumes[i].chapters || []).length;
    }

    var cover = book.cover ? libraryUrl(book.cover) : "";
    var detailText = "Trạng thái: " + statusLabel + "\nSố chương: " + chapterCount;

    return Response.success({
        name: title,
        author: book.author || "",
        cover: cover,
        description: book.description || "",
        detail: detailText,
        url: url,
        type: "novel",
        format: "novel",
        ongoing: status !== "completed",
        locale: book.language || "vi"
    });
}
