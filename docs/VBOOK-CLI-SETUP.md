# VBook CLI v2 — Build và kiểm thử extension

## Vì sao cần bước này?

VBook cài extension từ một gói `plugin.zip` được liệt kê trong registry `plugin.json`. Repository hiện lưu source code; ZIP cần được build bằng VBook CLI và cần kiểm thử trên runtime Rhino của ứng dụng.

## 1. Chuẩn bị trên máy tính

Clone công cụ VBook CLI v2:

```bash
git clone https://github.com/dat-bi/ext-vbook.git
```

Copy thư mục `extensions/vbook-personal-library` từ repository này vào:

```text
ext-vbook/extensions/vbook-personal-library/
```

Cài dependencies:

```bash
cd ext-vbook/vbook-tool
npm install
```

## 2. Lấy địa chỉ Web Server từ ứng dụng VBook

1. Mở VBook trên điện thoại.
2. Mở tab **Web Server** trong app.
3. Bật Web Server nếu đang tắt.
4. Ghi lại IP và port mà app hiển thị.
5. Đảm bảo máy tính và điện thoại ở cùng mạng LAN.

Tạo file `ext-vbook/vbook-tool/.env`:

```env
author=collab-code-ai
VBOOK_IP=192.168.1.XX
VBOOK_PORT=8080
GITHUB_REPO=collab-code-ai/vbook-library
```

Thay `192.168.1.XX` bằng IP thật trên màn hình VBook. Nếu app hiển thị port khác 8080, dùng đúng port đó.

## 3. Chạy kiểm tra

Mở terminal tại:

```text
ext-vbook/extensions/vbook-personal-library/
```

Chạy các lệnh sau:

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

`test-all` đi qua Home → Gen → Detail → TOC → Chapter. `catalog.json` hiện đang rỗng nên chưa thể có một lượt test-all hoàn chỉnh.

## 4. Build

Chỉ build sau khi validation và kiểm thử thiết bị đạt yêu cầu:

```bash
node ../../vbook-tool/index.js build
```

CLI tạo:

```text
extensions/vbook-personal-library/plugin.zip
```

Gửi `plugin.zip` vừa build lại cho ChatGPT hoặc upload vào đúng đường dẫn trong repository. Sau khi ZIP được upload, root registry `plugin.json` mới được publish và VBook mới có thể cài từ kho.

## Lưu ý

- VBook CLI v2 dùng Rhino; không dùng `async/await`, optional chaining, nullish coalescing, spread hoặc default parameters trong extension.
- `chap.js` phải trả về HTML string qua `Response.success(...)`.
- `nextPage` phải là string hoặc `null`, không phải number.
- Nếu `check-env` báo thiết bị không truy cập được, kiểm tra Web Server, IP, port, firewall và mạng LAN. Không đoán IP.
