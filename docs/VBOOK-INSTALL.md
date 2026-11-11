# Cài VBook Personal Library

## Cách A: chọn file ZIP trên điện thoại

Đây là cách phù hợp khi **Thêm extension** mở bộ chọn file.

1. Tải [plugin.zip](../extensions/vbook-personal-library/plugin.zip) về điện thoại. Trên GitHub, dùng **Download raw file** ở trang file nếu cần.
2. Mở VBook → màn hình quản lý extension → **Thêm extension**.
3. Chọn đúng `plugin.zip` vừa tải.
4. Mở nguồn **VBook Personal Library**.

Không chọn ZIP của toàn repository và không cần giải nén trước. Cách này không cần máy tính kết nối điện thoại, Web Server, root registry hoặc đưa extension vào kho cộng đồng.

Gói đã build thành công và đạt kiểm tra cục bộ, gồm Rhino với API giả lập. Chưa xác nhận thao tác cài và hiển thị bằng app Android thật. Xem [BUILD-VERIFICATION.md](BUILD-VERIFICATION.md).

## Dữ liệu hiện tại

`library/catalog.json` đang có `books: []`, nên nguồn sẽ chưa hiển thị sách. Khi thêm sách/chương lên GitHub, tải lại nguồn để lấy dữ liệu mới; không cần cài lại ZIP. Khi thay đổi mã extension, cần build và cài bản mới.

## Cách B: thêm kho riêng qua GitHub, tùy chọn

Cách này chỉ dùng sau khi tạo root `plugin.json` từ `docs/plugin-registry.template.json` và bảo đảm đường dẫn ZIP của registry đã tồn tại trên nhánh `main`.

URL registry dự kiến:

```text
https://raw.githubusercontent.com/collab-code-ai/vbook-library/main/plugin.json
```

Chưa tạo root registry trong đợt build này. Không dán URL dự kiến vào app khi file chưa tồn tại. Việc cài file ZIP không phụ thuộc vào registry.

## Tự build lại

Xem [VBOOK-CLI-SETUP.md](VBOOK-CLI-SETUP.md). Lệnh `build` của bản CLI đã kiểm tra chạy hoàn toàn trên máy tính; kết nối điện thoại chỉ cần khi debug hoặc cài từ xa.
