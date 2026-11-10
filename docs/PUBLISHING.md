# Publishing workflow

## Khi thêm một đầu sách

1. Chọn ID không trùng, ví dụ `book-0001`. Không đổi ID sau khi đã được VBook lưu vào thư viện.
2. Tạo thư mục `library/books/<book-id>/`.
3. Tạo `book.json` theo [CONTENT-FORMAT.md](CONTENT-FORMAT.md).
4. Chuyển mỗi chương thành HTML fragment UTF-8 và lưu đúng `path`.
5. Nếu có tập, đặt chương dưới `volumes/<volume-id>/`; nếu không, dùng `chapters/`.
6. Thêm/cập nhật entry trong `library/catalog.json`.
7. Kiểm tra JSON hợp lệ, thứ tự chương/tập, đường dẫn, số chương và nội dung.
8. Commit các file liên quan lên nhánh `main`.

## Khi sửa một chương

- Giữ nguyên `book-id`, `chapter-id` và đường dẫn nếu chỉ cập nhật nội dung.
- Không ghi đè chương khác.
- Cập nhật `updatedAt` trong `book.json` và catalog.
- Đọc SHA hiện tại của file trước khi cập nhật GitHub để tránh ghi đè thay đổi mới.

## Khi thêm một tập

- Thêm một phần tử mới trong `volumes[]`.
- Dùng `volume-id` duy nhất.
- Thêm các file chương và cập nhật catalog.
- Extension tự đọc `volumes[]`; không cần sửa hoặc build lại mã nguồn extension.

## Khi publish extension

Extension source nằm trong `extension/`. Việc build ZIP phải dùng công cụ chính thức `scripts/vbook.js` từ repository `Darkrai9x/vbook-extensions`, kết nối với VBook developer server. Không tự đóng ZIP bằng công cụ nén khác.

Sau khi build:
1. Kiểm tra ZIP được tạo thành công.
2. Upload ZIP vào `extension/plugin.zip`.
3. Tạo/cập nhật `plugin.json` ở root theo `docs/plugin-registry.template.json`.
4. Kiểm tra URL Raw của registry và ZIP.
5. Cài hoặc cập nhật extension trong VBook.

Việc build/cài trên thiết bị chưa được xác nhận cho đến khi CLI kết nối và kiểm thử thành công với VBook developer server.
