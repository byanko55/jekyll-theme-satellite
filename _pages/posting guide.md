---
title: "Publishing your blog post"
tags:
    - user manual
    - writing format
date: "2024-02-04"
thumbnail: "/assets/img/thumbnail/sample.png"
bookmark: true
---

This section deals with the step-by-step process of how to write and publish posts on your site.

# Make `_pages` directory
---
Create a directory named `_pages` in root if you do not have it.

```
$ mkdir _pages
$ cd _pages
```

# Organize your directory structure
---
Our theme provides a hierarchical directory structure. You may create subdirectories (let's say `Category A`) in `_pages`, and then all post entities placed in the `Category A` directory will be categorized as such.

```txt
._pages
├── Category A
├── Category B
|   ├── Subcatecory b
|   ├── Subcatecory c
```

## Note: Make sure all directories have an `index.md` inside of them.

The next step is, placing `index.md` files in both `_pages` directory and its subdirectories. The inner content of each `index.md` should be just two dashed lines as shown below:

```
---
---
```

Or you can type the following command from each directory.

```
$ echo -e "---\n---" > index.md
```

Your `_pages` structure now looks like this:

```txt
._pages
└── index.md
├── Category A
|   └── index.md
├── Category B
|   └── index.md
|   ├── Subcatecory b
|       └── index.md
|   ├── Subcatecory c
|       └── index.md
```

# Write a blog post
---

Create a post with file extension: `.md` (ex., *Post-name.md*).  

All blog post files must begin with front matter typically used to set a title or other metadata.

**Note that the `title` and `date` fields can't be left blank.** 

For a simple example:

```
---
title: "Example Post"
date: "2023-12-01"
---

# Welcome

**Hello world**, this is my first Jekyll blog post.

I hope you like it!
```

## Setting a Post Thumbnail Image

Add `thumbnail` attribute to the post that you'd like to show a representative image when rendered.

```
---
title: "Example Post: thumbnail exists"
date: "2023-12-02"
thumbnail: "/assets/img/thumbnail/bricks.webp"
---
```

![](https://i.ibb.co/T8Rsb6L/21312.webp){:class="img-lg"}

## Category Tag

You can use a grouping of post topics by specifying the `tags` field. It is helpful when you'd like to search related posts or pin them on the bottom of the page.

```
---
title: "Classic Literature #1: Romeo and Juliet"
tags:
    - book
    - epic novel
    - romance
date: "2023-12-04"
thumbnail: "/assets/img/thumbnail/nightgardenflower.jpg"
---
```

![](https://i.ibb.co/LDKJC7p/1231.webp){:class="img-lg"}

Note that the `tags` attribute won't be reflected to the sidebar navigation.

## Bookmark

Setting `bookmark: true` makes the sidebar nav list display the corresponding post entity.

```
---
title: "Markdown from A to Z"
tags:
    - user manual
    - markdown
    - writing format
date: "2023-09-05"
thumbnail: "https://i.ibb.co/MRzw6T9/sample.webp"
bookmark: true
---
```

![](https://i.ibb.co/2sFZNNK/21313.webp){:class="img-sm"}

# Example `_pages` structure
---

Here is the structure introduced in our repo:

```txt
._pages
└── index.md
└── markdown guide.md
├── Category A
|   └── index.md
|   ├── Subcatecory a
|       └── index.md
|       └── post-01.md
|       └── post-02.md
├── Category B
|   └── index.md
|   ├── Subcatecory b    
|       └── index.md
|       └── post-03.md
|       ├── Subsubcategory 1
|           └── index.md
|           └── post-04.md
|       ├── Subsubcategory 2
|           └── index.md
|           └── post-05.md
|   ├── Subcatecory c
|       └── index.md
```