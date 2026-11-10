# VBook Personal Library

Thư viện sách/truyện cá nhân được lưu trên GitHub và đọc bằng ứng dụng VBook thông qua một extension duy nhất.

## Kiến trúc

- `library/catalog.json`: danh mục nhẹ để VBook hiển thị và tìm kiếm sách.
- `library/books/<book-id>/book.json`: metadata, tập và chương của một đầu sách.
- `library/books/.../*.html`: nội dung chương HTML fragment UTF-8.
- `extensions/vbook-personal-library/`: extension VBook type `novel`.
- `docs/`: schema dữ liệu, quy trình nhập sách, build và cài đặt.

GitHub Public là nguồn dữ liệu gốc cho MVP. Nội dung trong repository có thể được truy cập công khai; chỉ đưa lên nội dung bạn sở hữu hoặc có quyền phân phối. Không lưu token/cookie trong repository.

## Trạng thái

- [x] Tạo cấu trúc thư viện Book / Volume / Chapter.
- [x] Tạo mã nguồn extension theo cấu trúc `extensions/<name>` của VBook CLI v2.
- [x] Tạo icon extension.
- [ ] Chạy `vbook validate`, debug và `test-all` trên thiết bị VBook.
- [ ] Build `plugin.zip` bằng VBook CLI.
- [ ] Publish root `plugin.json` registry và cài từ ứng dụng VBook.

**Chưa thêm repository vào VBook:** cần hoàn thành build `plugin.zip` và tạo root `plugin.json` trước để app có thể tải gói cài đặt hợp lệ.

## Cấu trúc repository

```text
vbook-library/
├── README.md
├── docs/
│   ├── CONTENT-FORMAT.md
│   ├── PUBLISHING.md
│   ├── VBOOK-CLI-SETUP.md
│   ├── VBOOK-INSTALL.md
│   └── plugin-registry.template.json
├── extensions/
│   └── vbook-personal-library/
│       ├── plugin.json
│       ├── icon.png
│       └── src/
│           ├── library.js
│           ├── home.js
│           ├── gen.js
│           ├── search.js
│           ├── detail.js
│           ├── toc.js
│           └── chap.js
└── library/
    ├── catalog.json
    └── books/
        └── README.md
```

## Cách thêm sách

Khi bạn gửi file hoặc nội dung sách/truyện, ChatGPT sẽ:

1. Phân tích tên sách, tác giả, mô tả, trạng thái, tập và chương.
2. Tạo ID ổn định cho đầu sách.
3. Chuyển từng chương thành HTML fragment UTF-8.
4. Tạo/cập nhật `book.json`, file chương và `catalog.json`.
5. Kiểm tra đường dẫn, thứ tự tập/chương, JSON và nội dung.
6. Commit trực tiếp các thay đổi lên GitHub.

Extension đọc `catalog.json`, `book.json` và HTML chương. Thêm sách mới không yêu cầu build lại extension.

## URL

- Repository: https://github.com/collab-code-ai/vbook-library
- Registry (chỉ hoạt động sau khi publish root `plugin.json`): https://raw.githubusercontent.com/collab-code-ai/vbook-library/main/plugin.json

Chi tiết: [CONTENT-FORMAT](docs/CONTENT-FORMAT.md), [PUBLISHING](docs/PUBLISHING.md), [VBOOK-CLI-SETUP](docs/VBOOK-CLI-SETUP.md), [VBOOK-INSTALL](docs/VBOOK-INSTALL.md).
