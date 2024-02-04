---
title: "Manage blog comments with Giscus"
tags:
    - user manual
    - utility
    - giscus
date: "2024-02-03"
thumbnail: "https://i.ibb.co/V9j2Qsg/giscus-Wl0-X3byd-az-U68-1.webp"
bookmark: true
---

[![goatcounter](https://opengraph.githubassets.com/4f866d5b634e7cd5422af77f8dbfb6d48dd288b7c5c18326544c1973210320ed/giscus/giscus){:class="img-lg"}](https://www.goatcounter.com/)

**Giscus** is a free **comments system** powered without your own database. Giscus uses the Github Discussions to store and load associated comments based on a chosen mapping (URL, pathname, title, etc.).

To comment, visitors must authorize the giscus app to post on their behalf using the GitHub OAuth flow. Alternatively, visitors can comment on the GitHub Discussion directly. You can moderate the comments on GitHub.

# Prerequisites
---

## Create a github repo

You need a GitHub repository first. If you gonna use *GitHub Pages* for hosting your website, you can choose the corresponding repository (i.e., `[userID].github.io`)

The repository should be **public**, otherwise visitors will not be able to view the discussion.

## Turn on Discussion feature

In your GitHub repository Settings, make sure that `General` > `Features` > `Discussions` feature is enabled.

![Discussion](https://i.ibb.co/P1FV02D/giscus-00.png)

# Activate Giscus API
---

Follow the steps in [Configuration guide](https://giscus.app/). Make sure the verification of your repository is successful.

![Verification](https://i.ibb.co/y87w8rB/giscus-02.png)

Then, scroll down from the manual page and choose the `Discussion Category` options. You don't need to touch other configs.

![Verification](https://i.ibb.co/0hqLWX0/giscus-03.png)

## Copy  `_config.yml`

Now, you get the giscus script. Copy the four properties marked with a red box as shown below:

![](https://i.ibb.co/Z154x8P/giscus-04.png)

Paste those values to `_config.yml` placed in the root directory.

```
# External API
giscus_repo: "[ENTER REPO HERE]"
giscus_repoId: "[ENTER REPO ID HERE]"
giscus_category: "[ENTER CATEGORY NAME HERE]"
giscus_categoryId: "[ENTER CATEGORY ID HERE]"
```