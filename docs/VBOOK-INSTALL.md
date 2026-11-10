# Cài VBook Personal Library vào ứng dụng VBook

## Điều kiện

Trước khi thêm nguồn vào app, repository phải có đủ:
- `extension/plugin.zip`: gói extension đã build bằng VBook CLI.
- `plugin.json` ở root: registry trỏ đến ZIP đó.

Hiện source scaffold đã được tạo; chưa thêm registry root và ZIP cho đến khi hoàn tất bước build hợp lệ.

## Cài nguồn

Khi hai file trên đã được publish, dùng URL registry:

`https://raw.githubusercontent.com/collab-code-ai/vbook-library/main/plugin.json`

Trong VBook (tên menu có thể khác nhẹ theo phiên bản):
1. Mở **Cài đặt**.
2. Vào **Kho tiện ích** (Extension repositories).
3. Chọn **Thêm kho**.
4. Dán URL registry ở trên và xác nhận.
5. Làm mới danh sách tiện ích.
6. Tìm **VBook Personal Library** và chọn **Cài đặt**.
7. Mở lại khu vực tiện ích/nguồn truyện. Chọn VBook Personal Library để xem các tab thư viện.

Ở một số phiên bản giao diện cũ, đường dẫn có thể là **Cá nhân → Phần mở rộng → dấu ba chấm → Quản lý extensions → Tất cả**.

## Sau khi cài

- Tab **Toàn bộ thư viện** hiển thị mọi sách trong `library/catalog.json`.
- Tab **Mới cập nhật** lọc theo thứ tự `updatedAt`.
- Tab **Đang phát hành** lọc `status` khác `completed`.
- Tab **Hoàn thành** lọc `status = completed`.
- Dùng chức năng tìm kiếm của VBook để tìm theo tiêu đề, tác giả hoặc mô tả.

## Nếu không thấy nguồn hoặc sách

1. Kiểm tra URL registry mở được trên trình duyệt và trả về JSON.
2. Kiểm tra `plugin.json` root có entry `VBook Personal Library`.
3. Kiểm tra trường `path` trỏ tới `extension/plugin.zip` và URL ZIP mở được.
4. Kiểm tra repository là Public.
5. Làm mới kho tiện ích hoặc thoát/mở lại VBook.
6. Nếu extension đã cài nhưng chưa có sách, kiểm tra `library/catalog.json`; danh mục ban đầu đang rỗng.
