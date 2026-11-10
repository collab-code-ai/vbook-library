// Shared helpers for the GitHub-hosted personal library.
// Keep this base URL aligned with metadata.source in plugin.json.
var LIBRARY_BASE = "https://raw.githubusercontent.com/collab-code-ai/vbook-library/main/library";

function libraryUrl(path) {
    var value = String(path || "");
    if (value.indexOf("https://") === 0 || value.indexOf("http://") === 0) {
        return value;
    }
    if (value.indexOf("/") === 0) {
        return LIBRARY_BASE + value;
    }
    return LIBRARY_BASE + "/" + value;
}

function readJson(url) {
    var response = fetch(url, { timeout: 20000 });
    if (!response.ok) {
        return { error: "HTTP " + response.status };
    }
    try {
        return { data: response.json() };
    } catch (error) {
        return { error: "Invalid JSON: " + String(error) };
    }
}
