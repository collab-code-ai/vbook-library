# Cài VBook Personal Library vào ứng dụng VBook

## Điều kiện trước khi cài

Repository phải có đủ:
- `extensions/vbook-personal-library/plugin.zip`: extension đã build bằng VBook CLI.
- `plugin.json` ở root: registry trỏ tới ZIP.
- Repository ở chế độ Public để VBook tải Raw GitHub.

Hiện source code và icon đã được tạo. ZIP và root registry chưa được publish vì còn bước kiểm thử/build bằng VBook CLI trên thiết bị.

## URL registry

Sau khi publish root `plugin.json`, dùng URL:

`https://raw.githubusercontent.com/collab-code-ai/vbook-library/main/plugin.json`

## Thêm kho trong ứng dụng

Theo hướng dẫn của kho extension VBook hiện tại:

1. Mở ứng dụng **VBook**.
2. Vào **Cài đặt**.
3. Chọn **Kho tiện ích**.
4. Nhấn **Thêm kho**.
5. Dán URL registry ở trên.
6. Xác nhận và làm mới danh sách.
7. Tìm **VBook Personal Library** và chọn cài đặt.
8. Quay lại danh sách nguồn/tiện ích và mở **VBook Personal Library**.

## Sử dụng

- **Toàn bộ thư viện**: mọi đầu sách trong `library/catalog.json`.
- **Mới cập nhật**: sắp xếp theo `updatedAt` mới nhất.
- **Đang phát hành**: sách có trạng thái khác `completed`.
- **Đã hoàn thành**: sách có `status = completed`.
- Dùng tìm kiếm VBook để lọc theo tên sách, tác giả, mô tả hoặc thể loại.

Catalog ban đầu đang rỗng. Sau khi ChatGPT thêm sách và cập nhật `catalog.json`, VBook sẽ hiển thị sách khi tải lại nguồn.

## Khắc phục sự cố

1. Mở URL registry trên trình duyệt; phải trả về JSON.
2. Kiểm tra `path` trong registry trỏ tới ZIP có tồn tại.
3. Kiểm tra `source` trong registry và `metadata.source` trong extension đều trỏ tới thư mục `library`.
4. Kiểm tra repository Public.
5. Làm mới Kho tiện ích hoặc đóng/mở lại VBook.
6. Nếu extension cài được nhưng chưa thấy sách, kiểm tra `library/catalog.json`.
