# Kết quả build và kiểm tra, 11/11/2026

Đã tạo `extensions/vbook-personal-library/plugin.zip` bằng lệnh `build` nguyên bản của VBook CLI 2.0.0. Không dùng điện thoại, Web Server hoặc giả lập Android để đóng gói.

| Mục | Kết quả |
| --- | --- |
| Source extension | `collab-code-ai/vbook-library` commit `d3eac98b7e70852bbbe049f2041cea0d3d9f2ccd` |
| Công cụ build | `dat-bi/ext-vbook` commit `e54f7ea1b586a69e35e49434a533721301113977` |
| Node.js | 24.22.1 |
| CLI validate | 0 lỗi, 0 cảnh báo |
| ZIP | 6.58 KiB, 6,743 bytes; kiểm tra CRC đạt |
| SHA-256 ZIP | `207b1d3048e608fc82060b0d2c33473ffcfc855df76712cdcab6501650ea936c` |
| Rhino | Mozilla Rhino 1.7.15, language version 200; 12/12 kiểm tra đạt |
| API trong kiểm tra Rhino | `fetch`, `load`, `Response` được giả lập; `text()` trả Java String |
| Catalog GitHub | Tải thành công qua HTTPS; `books: []`; chạy snapshot này trong Rhino đạt |
| Android | Chưa cài/chạy app Android thật hoặc giả lập Android |

## Nội dung ZIP

`plugin.json`, `icon.png`, `src/chap.js`, `src/detail.js`, `src/gen.js`, `src/home.js`, `src/library.js`, `src/search.js`, `src/toc.js`.

Đã giải nén chính ZIP để kiểm tra; các script và icon khớp byte với source. `plugin.json` khớp dữ liệu JSON, chỉ khác xuống dòng cuối file do CLI tạo lại JSON.

## Phạm vi kiểm tra Rhino

1. Trang chủ có bốn tab và gọi được script danh sách.
2. Phân trang 32 sách: trang đầu 30, trang sau 2; token là string rồi null.
3. Tìm kiếm tác giả tiếng Việt và trường hợp không có kết quả.
4. Bộ lọc hoàn thành, đang phát hành, thể loại, mới cập nhật.
5. Số trang sai hoặc bằng 0 quay về trang đầu.
6. Chi tiết sách, trạng thái, thể loại, số chương.
7. Luồng Home → Gen → Detail → TOC → Chapter với HTML tiếng Việt.
8. Mục lục có nhiều tập và URL chương tuyệt đối.
9. Catalog HTTP 404 và JSON lỗi.
10. Thiếu tiêu đề sách và mục lục rỗng.
11. Chương HTTP lỗi và HTML rỗng.
12. Đọc snapshot catalog GitHub hiện tại bằng Rhino.

32 sách và chương dùng để kiểm tra là fixture cục bộ, không được thêm vào thư viện thật. Kiểm tra section của mục lục xác nhận dữ liệu do script trả về, chưa xác nhận cách app Android hiển thị section.

## Giới hạn và bước tiếp theo

Rhino với API giả lập chưa thay thế kiểm tra bộ cài, giao diện hoặc mạng trong VBook Android. Tải ZIP về điện thoại → **Thêm extension** → chọn file. Catalog đang rỗng nên chưa có sách để đọc; cần thêm nội dung thật để kiểm tra tiếp trên app.

Không cần build lại khi chỉ thêm/sửa dữ liệu sách và chương. Cần build lại khi mã extension hoặc metadata thay đổi.
