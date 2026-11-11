# VBook CLI v2: build ZIP trên máy tính

## 1. Chuẩn bị

Cài Git và Node.js. Clone công cụ và thư viện vào cùng thư mục cha:

```bash
git clone https://github.com/dat-bi/ext-vbook.git
git clone https://github.com/collab-code-ai/vbook-library.git
cd ext-vbook/vbook-tool
npm ci --ignore-scripts --no-audit --no-fund
```

Đã kiểm tra với `dat-bi/ext-vbook` commit `e54f7ea1b586a69e35e49434a533721301113977`, VBook CLI 2.0.0, Node.js 24.22.1. Trong bản này, `commands/build.js` đóng gói bằng `archiver` ngay trên máy tính, không gọi `/extension/build` trên điện thoại.

## 2. Validate và build, không cần điện thoại

Từ `ext-vbook/vbook-tool` sau bước trên:

```bash
cd ../../vbook-library/extensions/vbook-personal-library
node ../../../ext-vbook/vbook-tool/index.js validate
node ../../../ext-vbook/vbook-tool/index.js build
```

Kết quả: `vbook-library/extensions/vbook-personal-library/plugin.zip`.

ZIP chứa `plugin.json`, `icon.png` và `src/` ngay ở gốc. Không dùng nút Download ZIP của toàn repository để cài extension.

Không cần copy extension vào repo công cụ. Không cần `.env`, IP, Web Server, VS Code hoặc giả lập Android để đóng gói. Không chạy `publish` tại repo công cụ nếu chỉ muốn build extension cá nhân, vì lệnh đó còn cập nhật registry của repo công cụ.

## 3. Cài file ZIP trên điện thoại

1. Tải hoặc chuyển `plugin.zip` sang điện thoại.
2. Mở VBook → màn hình quản lý extension → **Thêm extension**.
3. Chọn file ZIP vừa tải.
4. Mở nguồn **VBook Personal Library**.

Catalog đang rỗng nên danh sách sách sẽ rỗng. Thêm sách vào GitHub không yêu cầu build lại extension.

## 4. Kiểm tra bằng Rhino trên máy tính

Đã chạy 12 kiểm tra với Rhino 1.7.15 trên các script giải nén từ chính ZIP, xem [BUILD-VERIFICATION.md](BUILD-VERIFICATION.md). Để chạy lại, tải JAR Rhino từ Maven Central và chạy tại gốc `vbook-library`:

```bash
java -cp /path/to/rhino-1.7.15.jar org.mozilla.javascript.tools.shell.Main -version 200 tests/rhino-smoke.js extensions/vbook-personal-library
```

API `fetch`, `load`, `Response` được giả lập. Kết quả này xác nhận logic JavaScript trong Rhino, chưa xác nhận bộ cài, giao diện, mạng hoặc toàn bộ API của ứng dụng Android.

## 5. Debug trực tiếp trên VBook, khi cần

Web Server chỉ cần cho debug, `test-all` và cài từ xa. Bật Web Server trong VBook, lấy IP/port app hiển thị, đảm bảo máy tính và điện thoại cùng LAN rồi đặt `VBOOK_IP`, `VBOOK_PORT` trong `ext-vbook/vbook-tool/.env`.

Từ thư mục extension:

```bash
node ../../../ext-vbook/vbook-tool/index.js check-env
node ../../../ext-vbook/vbook-tool/index.js debug src/home.js
node ../../../ext-vbook/vbook-tool/index.js debug src/gen.js --input "@all"
```

Sau khi catalog có sách, tiếp tục `test-all` và `install` nếu cần. Nếu Web Server không kết nối được, vẫn có thể build và chuyển ZIP thủ công theo các bước trên.
