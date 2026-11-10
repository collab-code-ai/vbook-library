function execute() {
    return Response.success([
        { title: "Toàn bộ thư viện", input: "@all", script: "search.js" },
        { title: "Mới cập nhật", input: "@recent", script: "search.js" },
        { title: "Đang phát hành", input: "@ongoing", script: "search.js" },
        { title: "Đã hoàn thành", input: "@completed", script: "search.js" }
    ]);
}
