// Build a VBook table of contents from book.json.
load("library.js");

function execute(url) {
    var result = readLibraryJson(url);
    if (result.error) {
        return Response.error("Không tải được mục lục: " + result.error);
    }

    var book = result.data || {};
    var toc = [];
    var volumes = book.volumes || [];

    if (volumes.length > 0) {
        for (var i = 0; i < volumes.length; i++) {
            var volume = volumes[i] || {};
            toc.push({
                name: (volume.title || ("Tập " + (i + 1))) + "",
                type: "section"
            });

            var volumeChapters = volume.chapters || [];
            for (var j = 0; j < volumeChapters.length; j++) {
                var chapter = volumeChapters[j] || {};
                if (!chapter.path) continue;

                toc.push({
                    name: (chapter.title || ("Chương " + (j + 1))) + "",
                    url: libraryUrl(chapter.path),
                    host: BASE_URL
                });
            }
        }
    } else {
        var chapters = book.chapters || [];
        for (var k = 0; k < chapters.length; k++) {
            var item = chapters[k] || {};
            if (!item.path) continue;

            toc.push({
                name: (item.title || ("Chương " + (k + 1))) + "",
                url: libraryUrl(item.path),
                host: BASE_URL
            });
        }
    }

    if (toc.length === 0) {
        return Response.error("Sách chưa có chương nào trong book.json.");
    }

    return Response.success(toc);
}
