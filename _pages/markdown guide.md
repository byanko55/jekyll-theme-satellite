---
title: "Markdown from A to Z"
tags:
    - user manual
    - markdown
    - writing format
date: "2023-09-05"
thumbnail: "/assets/img/thumbnail/sample.png"
bookmark: true
---

# Headings
---

To create a heading, add number signs (#) in front of a word or phrase. The number of number signs you use should correspond to the heading level. For example, to create a heading level three (`<h3>`), use three number signs (e.g., `### My Header`).


|Markdown|HTML|Rendered Output|
|---|---|---|
|\# Header 1|<h1>Header 1</h1>|<span class="sh1">Header 1</span>|
|\#\# Header 2|<h2>Header 2</h2>|<span class="sh2">Header 2</span>|
|\#\#\# Header 3|<h3>Header 3</h3>|<span class="sh3">Header 3</span>|

# Emphasis
---
You can add emphasis by making text bold or italic.


### Bold
To bold text, add <u>two asterisks</u> (e.g., `**text**` = **text**) or underscores before and after a word or phrase. To bold the middle of a word for emphasis, add two asterisks without spaces around the letters.

### Italic
To italicize text, add <u>one asterisk</u> (e.g., `*text*` = *text*) or underscore before and after a word or phrase. To italicize the middle of a word for emphasis, add one asterisk without spaces around the letters.

### Blockquotes
To create a blockquote, add a `>` in front of a paragraph.

```
> Yongha Kim is the best developer in the world.
>
> Factos 👍👀
```

> Yongha Kim is the best developer in the world.
>
> Factos 👍👀

# Lists
You can organize items into ordered and unordered lists.

### Ordered Lists
To create an ordered list, add line items with numbers followed by periods. The numbers don’t have to be in numerical order, but the list should start with the number one.

```
1. First item
2. Second item
3. Third item
4. Fourth item
```

1. First item
2. Second item
3. Third item
4. Fourth item

### Unordered Lists
To create an unordered list, add dashes (`-`), asterisks (`*`), or plus signs (`+`) in front of line items. Indent one or more items to create a nested list.

```
* First item
* Second item
* Third item
* Fourth item
```

* First item
* Second item
* Third item
* Fourth item

# Code
To denote a word or phrase as code, enclose it in backticks (`).

|Markdown|HTML|Rendered Output|
|---|---|---|
|At the command prompt, type \`nano\`.|At the command prompt, type \<code>nano\</code>.|At the command prompt, type `nano`.|

### Escaping Backticks
If the word or phrase you want to denote as code includes one or more backticks, you can escape it by enclosing the word or phrase in double backticks (``).

|Markdown|HTML|Rendered Output|
|---|---|---|
|\`\`Use \`code\` in your Markdown file.\`\`|\<code>Use \`code\` in your Markdown file.\</code>|``Use `code` in your Markdown file.``|

### Code Blocks
To create code blocks that spans multiple lines of code, set the text inside three or more backquotes ( ``` ) or tildes ( ~~~ ).

```xml
<html>
  <head>
  </head>
</html>
```

```python
def foo():
  a = 1
  for i in [1,2,3]:
    a += i
```

# Horizontal Rules
To create a horizontal rule, use three or more asterisks (`***`), dashes (`---`), or underscores (`___`) on a line by themselves.

```text
***

---

_________________
```

# Links
To create a link, enclose the link text in brackets (e.g., [Blue Archive]) and then follow it immediately with the URL in parentheses (e.g., (https://bluearchive.nexon.com)).

```text
My favorite mobile game is [Blue Archive](https://bluearchive.nexon.com).
```

The rendered output looks like this:

My favorite mobile game is [Blue Archive](https://bluearchive.nexon.com).


### Adding Titles

You can optionally add a title for a link. This will appear as a tooltip when the user hovers over the link. To add a title, enclose it in quotation marks after the URL.

```text
My favorite mobile game is [Blue Archive](https://bluearchive.nexon.com "All senseis are welcome!").
```

The rendered output looks like this:

My favorite mobile game is [Blue Archive](https://bluearchive.nexon.com "All senseis are welcome!").


### URLs and Email Addresses
To quickly turn a URL or email address into a link, enclose it in angle brackets.

```text
<https://www.youtube.com/>
<fake@example.com>
```

The rendered output looks like this:
<https://www.youtube.com/>
<fake@example.com>

# Images
To add an image, add an exclamation mark (`!`), followed by alt text in brackets, and the path or URL to the image asset in parentheses. You can optionally add a title in quotation marks after the path or URL.

```text
![Tropical Paradise](/assets/img/example.jpg "Maldives, in October")
```

The rendered output looks like this: ![Tropical Paradise](/assets/img/example.jpg "Maldives, in October")

### Linking Images
To add a link to an image, enclose the Markdown for the image in brackets, and then add the link in parentheses.

```text
[![La Mancha](/assets/img/La-Mancha.jpg "La Mancha: Spain, Don Quixote")](https://www.britannica.com/place/La-Mancha)
```

The rendered output looks like this: [![La Mancha](/assets/img/La-Mancha.jpg "La Mancha: Spain, Don Quixote")](https://www.britannica.com/place/La-Mancha)

# Escaping Characters
To display a literal character that would otherwise be used to format text in a Markdown document, add a backslash (`\`) in front of the character.

```text
\* Without the backslash, this would be a bullet in an unordered list.
```

The rendered output looks like this:

\* Without the backslash, this would be a bullet in an unordered list.

### Characters You Can Escape
You can use a backslash to escape the following characters.

|Character|Name|
|---|---|
|\`|backtick|
|\*|asterisk|
|\_|underscore|
|\{\}|curly braces|
|\[\]|brackets|
|\<\>|angle brackets|
|\(\)|parentheses|
|\#|pound sign|
|\+|plus sign|
|\-|minus sign \(hyphen\)|
|\.|dot|
|\!|exclamation mark|
|\||pipe|

# HTML
Many Markdown applications allow you to use `HTML` tags in Markdown-formatted text. This is helpful if you prefer certain `HTML` tags to Markdown syntax. For example, some people find it easier to use `HTML` tags for images. Using `HTML` is also helpful when you need to change the attributes of an element, like specifying the color of text or changing the width of an image.

To use `HTML`, place the tags in the text of your Markdown-formatted file.

```
This **word** is bold. This <span style="font-style: italic;">word</span> is italic.
```

The rendered output looks like this:

This **word** is bold. This <span style="font-style: italic;">word</span> is italic.
