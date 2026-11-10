// Home tabs for the personal library.
// Each tab calls gen.js with the corresponding filter token.
function execute() {
    return Response.success([
        { title: "Toàn bộ thư viện", input: "@all", script: "gen.js" },
        { title: "Mới cập nhật", input: "@recent", script: "gen.js" },
        { title: "Đang phát hành", input: "@ongoing", script: "gen.js" },
        { title: "Đã hoàn thành", input: "@completed", script: "gen.js" }
    ]);
}
