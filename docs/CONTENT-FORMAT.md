# Content format — schemaVersion 1

## 1. Nguyên tắc

- `catalog.json` là chỉ mục nhẹ để trang chủ/tìm kiếm không phải tải toàn bộ metadata của mọi sách.
- Mỗi sách có một `book.json`.
- Nội dung mỗi chương là một file `.html` UTF-8 độc lập.
- Đường dẫn trong JSON là tương đối từ thư mục `library/`, không bắt đầu bằng `/`.
- ID sách, tập và chương phải ổn định, duy nhất và không đổi khi chỉ sửa tiêu đề/nội dung.
- Sách không chia tập dùng `chapters[]`; sách chia tập dùng `volumes[].chapters[]`.
- Không đưa JavaScript, iframe, form, token, cookie hoặc mã nhúng không tin cậy vào nội dung chương.

## 2. library/catalog.json

```json
{
  "schemaVersion": 1,
  "libraryName": "VBook Personal Library",
  "updatedAt": "2026-11-11T00:00:00+07:00",
  "books": [
    {
      "id": "book-0001",
      "title": "Tên sách",
      "author": "Tên tác giả",
      "description": "Mô tả ngắn",
      "cover": "books/book-0001/cover.jpg",
      "status": "ongoing",
      "updatedAt": "2026-11-11T00:00:00+07:00",
      "latestChapter": "Chương 12",
      "bookPath": "books/book-0001/book.json"
    }
  ]
}
```

Quy tắc:
- `id`: bắt buộc, duy nhất.
- `title`: bắt buộc.
- `author`, `description`, `cover`, `latestChapter`: tùy chọn.
- `status`: `ongoing`, `completed`, `hiatus` hoặc `unknown`.
- `updatedAt`: ISO 8601; dùng để sắp xếp sách mới cập nhật.
- `bookPath`: đường dẫn tương đối đến `book.json`.
- `cover`: đường dẫn tương đối từ `library/`; ảnh bìa là tùy chọn.

## 3. book.json — không chia tập

```json
{
  "schemaVersion": 1,
  "id": "book-0001",
  "title": "Tên sách",
  "author": "Tên tác giả",
  "description": "Mô tả đầy đủ",
  "cover": "books/book-0001/cover.jpg",
  "language": "vi",
  "status": "completed",
  "genres": ["Fantasy", "Adventure"],
  "updatedAt": "2026-11-11T00:00:00+07:00",
  "chapters": [
    {
      "id": "chapter-0001",
      "title": "Chương 1: Khởi đầu",
      "order": 1,
      "path": "books/book-0001/chapters/chapter-0001.html"
    },
    {
      "id": "chapter-0002",
      "title": "Chương 2: Hành trình",
      "order": 2,
      "path": "books/book-0001/chapters/chapter-0002.html"
    }
  ],
  "volumes": []
}
```

## 4. book.json — chia tập

```json
{
  "schemaVersion": 1,
  "id": "book-0002",
  "title": "Tên bộ sách",
  "author": "Tên tác giả",
  "description": "Mô tả",
  "cover": "books/book-0002/cover.jpg",
  "language": "vi",
  "status": "ongoing",
  "genres": [],
  "updatedAt": "2026-11-11T00:00:00+07:00",
  "chapters": [],
  "volumes": [
    {
      "id": "volume-0001",
      "title": "Tập 1",
      "order": 1,
      "chapters": [
        {
          "id": "chapter-0001",
          "title": "Chương 1",
          "order": 1,
          "path": "books/book-0002/volumes/volume-0001/chapter-0001.html"
        }
      ]
    },
    {
      "id": "volume-0002",
      "title": "Tập 2",
      "order": 2,
      "chapters": [
        {
          "id": "chapter-0001",
          "title": "Chương 1",
          "order": 1,
          "path": "books/book-0002/volumes/volume-0002/chapter-0001.html"
        }
      ]
    }
  ]
}
```

## 5. Chapter HTML

File chương là HTML fragment, không cần `html`, `head` hoặc `body`.

```html
<h2>Chương 1: Khởi đầu</h2>
<p>Đoạn văn thứ nhất...</p>
<p>Đoạn văn thứ hai...</p>
<blockquote>Trích dẫn...</blockquote>
```

Khuyến nghị dùng các thẻ phổ thông: `h2`, `h3`, `p`, `br`, `strong`, `em`, `blockquote`, `ul`, `ol`, `li`. Không dùng script, iframe hoặc CSS/JS từ bên ngoài.

## 6. Đồng bộ catalog

Mỗi lần thêm/sửa/xóa sách:
1. Cập nhật `book.json` và file chương liên quan.
2. Cập nhật đúng một entry tương ứng trong `catalog.json`.
3. Giữ `bookPath` trỏ đúng `book.json`.
4. Cập nhật `updatedAt` và `latestChapter`.
5. Kiểm tra ID không trùng và mọi đường dẫn đều tồn tại.

Extension dùng `catalog.json` để tìm kiếm; `detail.js` và `toc.js` đọc `book.json`; `chap.js` đọc file HTML chương.
