document.addEventListener('DOMContentLoaded', function(){
    // Init theme
    let currentTheme = localStorage.getItem('theme');
    let isDarkMode = false;

    if (currentTheme === 'dark'){
        isDarkMode = true;
        const themeIcons = document.querySelectorAll(".ico-dark, .ico-light");

        themeIcons.forEach((ico) => {
            ico.classList.add('active');
        });
    }
    else {
        isDarkMode = false;
    }

    // navigation (mobile)
    var siteNav = document.querySelector('#navigation');
    var siteContact = document.querySelector('#contact');
    var menuButton = document.querySelector("#btn-nav");

    menuButton.addEventListener('click', function() {
        if (menuButton.classList.toggle('nav-open')) {
            siteNav.classList.add('nav-open');
            siteContact.classList.add('contact-open');
        } else {
            siteNav.classList.remove('nav-open');
            siteContact.classList.remove('contact-open');
        }
    });

    // kept nav opened
    var firstNavs = document.querySelectorAll('#nav-first');
    var baseurl = document.querySelector('meta[name="baseurl"]').content;
    var page_path = window.location.pathname.replace(/%20/g, " ");
    page_path = page_path.replace(baseurl, "");
    var page_tree = page_path.split('/');

    Array.prototype.forEach.call(firstNavs, function (nav_first) {
        if (page_tree[1] === nav_first.ariaLabel){
            nav_first.classList.add('active');

            var secondNavs = nav_first.querySelectorAll('#nav-second');

            Array.prototype.forEach.call(secondNavs, function (nav_second) {
                if (page_tree[2] === nav_second.ariaLabel){
                    nav_second.classList.toggle('active');

                    var thirdNavs = nav_second.querySelectorAll('#nav-third');

                    Array.prototype.forEach.call(thirdNavs, function (nav_third) {
                        if (page_tree[3] === nav_third.ariaLabel){
                            nav_third.classList.toggle('active');
                        }
                    });
                }
            });
        }
    });

    // navigation (toogle sub-category)
    document.addEventListener('click', function(e){
        var target = e.target;

        while (target && !(target.classList && target.classList.contains('nav-list-expander'))) {
            target = target.parentNode;
        }

        if (target) {
            e.preventDefault();
            var nav_item = target.parentNode;
            target.ariaPressed = nav_item.parentNode.classList.toggle('active');
        }
    });

    document.querySelectorAll('.nav-item').forEach((nav_item) => {
        if (nav_item.parentNode.classList.contains('active')){
            nav_item.classList.add('selected');
        }
        else {
            nav_item.classList.remove('selected');
        }
    });

    // Change Datk/Light Theme
    const themeButton = document.querySelectorAll("#btn-brightness");
    const innerContent = document.querySelector('main');

    themeButton.forEach((btn) => {
        btn.addEventListener('click', function() {
            const moonIcons = document.querySelectorAll(".ico-dark");
            const sunIcons = document.querySelectorAll(".ico-light");

            moonIcons.forEach((ico) => {
                ico.classList.toggle('active');
            });

            sunIcons.forEach((ico) => {
                ico.classList.toggle('active');
            });

            document.body.classList.toggle('dark-theme');

            if (isDarkMode){
                localStorage.setItem('theme', 'default');
                // Disable highlighter dark color theme
                Array.from(innerContent.querySelectorAll('pre')).forEach(function (codeblock){
                    codeblock.classList.remove('pre-dark');
                });
                changeGiscusTheme('light');
                isDarkMode = false;
            }
            else {
                localStorage.setItem('theme', 'dark');
                // Disable highlighter default color theme
                Array.from(innerContent.querySelectorAll('pre')).forEach(function (codeblock){
                    codeblock.classList.add('pre-dark');
                });
                changeGiscusTheme('noborder_gray');
                isDarkMode = true;
            }
        });
    });

    function changeGiscusTheme(theme) {
        const iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe) return;

        const message = {
            setConfig: {
                theme: theme
            }
        };

        iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    }

    // search box
    const searchButton = document.querySelectorAll("#btn-search");
    const cancelButton = document.querySelector('#btn-clear');
    const searchPage = document.querySelector("#search");

    if (searchButton) {
        searchButton.forEach((btn) => {
            btn.addEventListener('click', function() {
                searchPage.classList.add('active');
                document.getElementById("search-input").focus();
            });
        });
    }

    if (searchPage) {
        searchPage.addEventListener('click', function(event) {
            const searchBar = document.querySelector(".search-box");
            var target = event.target;

            if (searchBar.contains(target))
                return;

            searchPage.classList.remove('active');
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            document.getElementById('btn-clear').style.display = 'none';
            document.getElementById('search-input').value = "";

            Array.from(document.querySelectorAll('.result-item')).forEach(function (item) {
                item.remove();
            });
        });
    }
});

function searchPost(pages){
    document.getElementById('search-input').addEventListener('keyup', function() {
        var keyword = this.value.toLowerCase();
        var matchedPosts = [];
        const searchResults = document.getElementById('search-result');
        const prevResults = document.querySelector(".result-item");
    
        if (keyword.length > 0) {
            searchResults.style.display = 'block';
            document.getElementById('btn-clear').style.display = 'block';
        } else {
            searchResults.style.display = 'none';
            document.getElementById('btn-clear').style.display = 'none';
        }
        
        Array.from(document.querySelectorAll('.result-item')).forEach(function (item) {
            item.remove();
        });
    
        for (var i = 0; i < pages.length; i++) {
            var post = pages[i];
    
            if (post.title === 'Home' && post.type == 'category') continue;
    
            if (post.title.toLowerCase().indexOf(keyword) >= 0
            || post.path.toLowerCase().indexOf(keyword) >= 0
            || post.tags.toLowerCase().indexOf(keyword) >= 0){
                matchedPosts.push(post);
            }
        }
    
        if (matchedPosts.length === 0) {
            insertItem('<span class="description">There is no search result.</span>');

            return;
        } 
    
        matchedPosts.sort(function (a, b) {
            if (a.type == 'category') return 1;
    
            return -1;
        });
    
        for (var i = 0; i < matchedPosts.length; i++) {
            var highlighted_path = highlightKeyword(matchedPosts[i].path, keyword);
    
            if (highlighted_path === '')
                highlighted_path = "Home";
    
            if (matchedPosts[i].type === 'post'){
                var highlighted_title = highlightKeyword(matchedPosts[i].title, keyword);
                var highlighted_tags = highlightKeyword(matchedPosts[i].tags, keyword);
    
                if (highlighted_tags === '')
                    highlighted_tags = "none";

                insertItem('<a href="' +
                    matchedPosts[i].url +
                    '"><table><thead><tr><th><svg class="ico-book" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg></th><th>' + highlighted_title +  
                    '</th></tr></thead><tbody><tr><td><svg class="ico-folder" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"/></svg></td><td>' + highlighted_path +
                    '</td></tr><tr><td><svg class="ico-tags" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg></td><td>' + highlighted_tags +
                    '</td></tr><tr><td><svg class="ico-calendar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"/></svg></td><td>' + matchedPosts[i].date +
                    '</td></tr></tbody></table></a>'
                );
            }
            else {
                insertItem('<a href="' +
                    matchedPosts[i].url +
                    '"><table><thead><tr><th><svg class="ico-folder" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"/></svg></th><th>' + highlighted_path + 
                    '</th></tr></thead></table></a>'
                );
            }
        }

        function insertItem(inner_html){
            let contents = document.createElement("li");
            contents.classList.add("result-item");
            contents.innerHTML = inner_html;
            searchResults.append(contents);
        }
    });

    function highlightKeyword(txt, keyword) {
        var index = txt.toLowerCase().lastIndexOf(keyword);
    
        if (index >= 0) { 
            out = txt.substring(0, index) + 
                "<span class='highlight'>" + 
                txt.substring(index, index+keyword.length) + 
                "</span>" + 
                txt.substring(index + keyword.length);
            return out;
        }
    
        return txt;
    }
}

function searchRelated(pages){
    const refBox = document.getElementById('related-box');
    const refResults = document.getElementById('related-posts');

    if (!refBox) return;

    var relatedPosts = [];
    var currPost = pages.find(obj => {return obj.url === location.pathname});

    let currTags = currPost.tags.split(', ');
    let currCategory = currPost.path.split(' > ').pop();

    for (var i = 0; i < pages.length; i++) {
        let page = pages[i];

        if (page.type === 'category') continue;

        if (page.title === currPost.title) continue;

        let tags = page.tags.split(', ');
        let category = page.path.split(' > ').pop();
        let correlationScore = 0;

        for (var j = 0; j < currTags.length; j++){
            if (tags.indexOf(currTags[j]) != -1) correlationScore += 1;
        }

        if (category === currCategory) correlationScore += 1;

        if (correlationScore == 0) continue;

        relatedPosts.push({
            'title': page.title,
            'date': page.date,
            'category': category,
            'url': page.url,
            'thumbnail': page.image,
            'score': correlationScore
        });
    }

    relatedPosts.sort(function (a, b) {
        if(a.hasOwnProperty('score')){
            return b.score - a.score;
        }
    });

    if (relatedPosts.length == 0){
        refBox.style.display = 'none';
        return;
    }

    for (var i = 0; i < Math.min(relatedPosts.length, 6); i++){
        let post = relatedPosts[i];
        let date = '-';
        let category = 'No category';

        if (post.date !== '1900-01-01'){
            date = new Date(post.date);
            date = date.toLocaleString('en-US', {day: 'numeric', month:'long', year:'numeric'});
        }

        if (post.category !== '') category = post.category;

        if (post.thumbnail === ''){
            post.thumbnail = "/assets/img/thumbnail/empty.jpg";
        }

        let contents = document.createElement("li");
        contents.classList.add("related-item");
        contents.innerHTML = '<a href="' + post.url +
            '"><img src="' + post.thumbnail + 
            '"/><p class="category">' + category +  
            '</p><p class="title">' + post.title + 
            '</p><p class="date">' + date +
            '</p></a>';

        refResults.append(contents);
    }
}