# Books directory

Mỗi đầu sách có một thư mục riêng theo ID ổn định:

```text
books/
└── <book-id>/
    ├── book.json
    ├── cover.jpg                 # tùy chọn
    ├── chapters/                 # sách không chia tập
    │   ├── chapter-0001.html
    │   └── chapter-0002.html
    └── volumes/                  # sách chia tập
        ├── volume-0001/
        │   ├── volume.json       # tùy chọn metadata tập
        │   ├── chapter-0001.html
        │   └── chapter-0002.html
        └── volume-0002/
            └── chapter-0001.html
```

`book.json` là nguồn dữ liệu chi tiết của một đầu sách. `catalog.json` ở thư mục cha là chỉ mục để VBook tìm kiếm và hiển thị sách.

Không cần tạo cả `chapters/` và `volumes/` cho cùng một sách. Xem `docs/CONTENT-FORMAT.md` để biết schema chính thức.
