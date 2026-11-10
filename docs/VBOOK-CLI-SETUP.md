# VBook CLI v2 — Build và kiểm thử extension

## Vì sao cần bước này?

VBook hỗ trợ cài extension trực tiếp vào app qua Web Server để debug. Để phân phối lâu dài qua GitHub, extension cần được build thành `plugin.zip` và đăng ký trong root `plugin.json`.

## 1. Chuẩn bị trên máy tính

Clone công cụ VBook CLI v2:

```bash
git clone https://github.com/dat-bi/ext-vbook.git
```

Clone repository thư viện nếu chưa có:

```bash
git clone https://github.com/collab-code-ai/vbook-library.git
```

Copy thư mục extension vào workspace của CLI:

```text
vbook-library/extensions/vbook-personal-library/
    ↓ copy to
ext-vbook/extensions/vbook-personal-library/
```

Cài dependencies:

```bash
cd ext-vbook/vbook-tool
npm install
```

## 2. Kết nối VBook trên điện thoại

1. Mở VBook trên điện thoại.
2. Mở tab **Web Server** trong app.
3. Bật Web Server nếu đang tắt.
4. Ghi lại IP và port app hiển thị.
5. Đảm bảo máy tính và điện thoại ở cùng mạng LAN.

Tạo file `ext-vbook/vbook-tool/.env` và điền IP/port thực tế:

```env
VBOOK_IP=192.168.1.XX
VBOOK_PORT=8080
```

Không dùng IP ví dụ nếu chưa đối chiếu với màn hình điện thoại. Nếu app hiển thị port khác 8080, dùng đúng port đó.

## 3. Validate và debug

Mở terminal tại:

```text
ext-vbook/extensions/vbook-personal-library/
```

Chạy:

```bash
node ../../vbook-tool/index.js check-env
node ../../vbook-tool/index.js validate
node ../../vbook-tool/index.js debug src/home.js
node ../../vbook-tool/index.js debug src/gen.js --input "@all"
```

Sau khi có ít nhất một sách trong `library/catalog.json`, đồng bộ dữ liệu vào thư mục extension đang làm việc rồi chạy:

```bash
node ../../vbook-tool/index.js test-all
```

`test-all` đi qua Home → Gen → Detail → TOC → Chapter. Catalog hiện đang rỗng nên chưa thể có một lượt test-all hoàn chỉnh.

## 4. Cài trực tiếp vào VBook để dùng thử

Sau khi `validate` đạt và debug không có lỗi, chạy:

```bash
node ../../vbook-tool/index.js install
```

CLI sẽ gửi extension từ thư mục làm việc vào VBook thông qua Web Server. Đây là cách cài thử/dev install; không cần ZIP hoặc root registry. Mở lại danh sách nguồn/extension trong VBook để tìm **VBook Personal Library**.

## 5. Build gói để phân phối qua GitHub

Sau khi test trên thiết bị đạt yêu cầu:

```bash
node ../../vbook-tool/index.js build
```

CLI tạo `plugin.zip` trong thư mục extension. Upload file đó vào:

```text
extensions/vbook-personal-library/plugin.zip
```

Sau đó tạo root `plugin.json` từ `docs/plugin-registry.template.json`. Khi hai file đã được publish, VBook có thể cài qua Kho tiện ích.

## Lưu ý

- VBook CLI v2 dùng Rhino; không dùng `async/await`, optional chaining, nullish coalescing, spread hoặc default parameters trong extension.
- `chap.js` phải trả về HTML string qua `Response.success(...)`.
- `nextPage` phải là string hoặc `null`, không phải number.
- Nếu `check-env` báo thiết bị không truy cập được, kiểm tra Web Server, IP, port, firewall và mạng LAN. Không đoán IP.
