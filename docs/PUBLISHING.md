# Publishing workflow

## Thêm một đầu sách

1. Chọn ID không trùng, ví dụ `book-0001`. Giữ ID ổn định sau khi đã được VBook lưu vào thư viện.
2. Tạo `library/books/<book-id>/`.
3. Tạo `book.json` theo [CONTENT-FORMAT.md](CONTENT-FORMAT.md).
4. Chuyển mỗi chương thành HTML fragment UTF-8 và lưu đúng đường dẫn `path`.
5. Sách có tập dùng `volumes/<volume-id>/`; sách không chia tập dùng `chapters/`.
6. Thêm hoặc cập nhật entry tương ứng trong `library/catalog.json`.
7. Kiểm tra JSON, ID, đường dẫn, thứ tự tập/chương và số lượng chương.
8. Commit các file dữ liệu lên nhánh `main`.

## Sửa hoặc thêm chương

- Giữ nguyên `book-id`, `volume-id`, `chapter-id` và đường dẫn nếu chỉ sửa nội dung.
- Không ghi đè chương khác.
- Cập nhật `updatedAt`, `latestChapter` trong catalog.
- Khi cập nhật GitHub, đọc SHA hiện tại trước để tránh ghi đè thay đổi mới.

## Build extension

Extension nằm tại `extensions/vbook-personal-library/`. Quy trình build theo VBook CLI v2 của `dat-bi/ext-vbook`; không tự đóng ZIP bằng công cụ nén khác.

1. Làm theo [VBOOK-CLI-SETUP.md](VBOOK-CLI-SETUP.md).
2. Chạy `validate`.
3. Chạy `build` từ thư mục extension để tạo `plugin.zip`. Lệnh build chạy cục bộ, không cần điện thoại.
4. Lưu ZIP vào `extensions/vbook-personal-library/plugin.zip`, chuyển sang điện thoại và dùng **Thêm extension** để chọn file.
5. Khi có sách và thiết bị kết nối được, chạy debug các script, `test-all` và xác nhận giao diện Android.
6. Nếu muốn dùng kho riêng để phân phối, tạo root `plugin.json` từ `docs/plugin-registry.template.json` rồi kiểm tra Raw URL của registry, ZIP và icon. Bước này không bắt buộc cho cài file ZIP.

Không đánh dấu extension đã kiểm thử trên thiết bị nếu chưa có output debug/test-all từ VBook thật.
