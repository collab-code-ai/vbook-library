load('config.js');

function execute(url) {
    var result = readJson(url);
    if (result.error) {
        return Response.error("Không tải được mục lục: " + result.error);
    }

    var book = result.data || {};
    var chapters = [];
    var volumes = book.volumes || [];

    if (volumes.length > 0) {
        for (var i = 0; i < volumes.length; i++) {
            var volume = volumes[i] || {};
            chapters.push({
                name: volume.title || ("Tập " + (i + 1)),
                type: "section"
            });

            var volumeChapters = volume.chapters || [];
            for (var j = 0; j < volumeChapters.length; j++) {
                var chapter = volumeChapters[j] || {};
                if (!chapter.path) continue;
                chapters.push({
                    name: chapter.title || ("Chương " + (j + 1)),
                    url: libraryUrl(chapter.path),
                    description: "",
                    lock: false,
                    pay: false
                });
            }
        }
    } else {
        var directChapters = book.chapters || [];
        for (var k = 0; k < directChapters.length; k++) {
            var directChapter = directChapters[k] || {};
            if (!directChapter.path) continue;
            chapters.push({
                name: directChapter.title || ("Chương " + (k + 1)),
                url: libraryUrl(directChapter.path),
                description: "",
                lock: false,
                pay: false
            });
        }
    }

    return Response.success(chapters);
}
