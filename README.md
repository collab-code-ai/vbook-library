# VBook Personal Library

Thư viện sách/truyện cá nhân được phân phối qua GitHub và đọc bằng ứng dụng VBook.

## Kiến trúc

- `library/catalog.json`: danh mục tất cả đầu sách.
- `library/books/<book-id>/book.json`: metadata và cấu trúc chương/tập của một đầu sách.
- `library/books/.../*.html`: nội dung chương dạng HTML fragment.
- `extension/`: mã nguồn VBook extension (type `novel`).
- `docs/`: quy ước dữ liệu, quy trình nhập sách và hướng dẫn cài đặt.

GitHub là nguồn dữ liệu công khai (source of truth) cho bản MVP. Không lưu token, cookie hoặc dữ liệu riêng tư trong repository.

## Trạng thái triển khai

- [x] Khởi tạo cấu trúc dữ liệu và mã nguồn extension.
- [x] Định nghĩa quy ước Book / Volume / Chapter.
- [ ] Build `extension/plugin.zip` bằng VBook CLI và developer server.
- [ ] Tạo registry `plugin.json` ở root sau khi ZIP đã được build và upload.
- [ ] Cài từ Kho tiện ích trên VBook và kiểm thử trên thiết bị.

**Lưu ý:** Chưa thêm repository này vào VBook cho đến khi `extension/plugin.zip` và root `plugin.json` đã được publish. Làm vậy để tránh VBook hiển thị một gói chưa tồn tại.

## Cấu trúc

```text
vbook-library/
├── README.md
├── docs/
│   ├── CONTENT-FORMAT.md
│   ├── PUBLISHING.md
│   ├── VBOOK-INSTALL.md
│   └── plugin-registry.template.json
├── extension/
│   ├── plugin.json
│   └── src/
│       ├── config.js
│       ├── home.js
│       ├── search.js
│       ├── detail.js
│       ├── toc.js
│       └── chap.js
└── library/
    ├── catalog.json
    └── books/
        └── README.md
```

## Thêm sách

Khi cung cấp một bản sách/truyện, hãy yêu cầu ChatGPT:

1. Đọc và xác định metadata, chương và tập.
2. Đề xuất ID ổn định cho sách.
3. Chuyển nội dung từng chương thành HTML fragment UTF-8.
4. Tạo/cập nhật `book.json`, các file chương và `catalog.json`.
5. Kiểm tra đường dẫn, thứ tự chương, số lượng chương và JSON.
6. Commit các thay đổi lên GitHub.

Chi tiết: [docs/CONTENT-FORMAT.md](docs/CONTENT-FORMAT.md) và [docs/PUBLISHING.md](docs/PUBLISHING.md).

## Cài vào VBook

Sau khi hoàn tất build và publish gói extension, làm theo [docs/VBOOK-INSTALL.md](docs/VBOOK-INSTALL.md).

Repository URL:
`https://github.com/collab-code-ai/vbook-library`

Registry URL (sẽ hoạt động sau khi publish root `plugin.json`):
`https://raw.githubusercontent.com/collab-code-ai/vbook-library/main/plugin.json`
