document.addEventListener('DOMContentLoaded', function(){
    // Loading page
    window.addEventListener("load", () => {
        var load_div = document.querySelector('#loading');

        if(load_div != null){
            setTimeout(function(){
                load_div.style.transition = '.75s';
                load_div.style.opacity = '0';
                load_div.style.visibility = 'hidden';
            }, 800);
        }
    });

    // Lazy image loading
    var content = document.querySelector('main');

    if (content){
        var images = content.querySelectorAll('img');

        images.forEach((img) => {
            img.setAttribute('loading', 'lazy');
        });
    }

    function loadImage(image) {
        var i = new Image();

        i.onload = function() {
            image.classList.add('lazy-loaded')
            image.src = image.dataset.lazySrc
        }

        i.onerror = function() {image.classList.add('lazy-error')}
        i.src = image.dataset.lazySrc
    }

    function onIntersection(entries) {
        for (var e in entries) {
            if(entries[e].intersectionRatio <= 0) continue
            observer.unobserve(entries[e].target) // Stop watching
            loadImage(entries[e].target)
        }
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
    var page_path = window.location.pathname.replace(/%20/g, " ");
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

    // tocbot
    if (content){
        var headings = content.querySelectorAll('h1, h2');
        var headingMap = {};

        Array.prototype.forEach.call(headings, function (heading) {
            var id = heading.id ? heading.id : heading.textContent.trim().toLowerCase()
                    .split(' ').join('-').replace(/[\!\@\#\$\%\^\&\*\(\):]/ig, '');

            headingMap[id] = !isNaN(headingMap[id]) ? ++headingMap[id] : 0;

            if (headingMap[id]) {
                heading.id = id + '-' + headingMap[id];
            } else {
                heading.id = id;
            }
        })

        tocbot.init({
            tocSelector: '.toc-board',
            contentSelector: '.inner-content',
            headingSelector:'h1, h2',
            hasInnerContainers: false
        });
    }

    // link (for hover effect)
    if (content){
        var links = content.querySelectorAll('a');

        links.forEach((link) => {
            link.setAttribute('data-content', link.innerText);
        });
    }

    // pagination
    const paginationNumbers = document.querySelector("#pagination-numbers");
    const paginatedList = document.querySelector(".paginated-list");

    if (paginatedList) {
        const listItems = paginatedList.querySelectorAll("li");
        const nextButton = document.querySelector("#next-button");
        const prevButton = document.querySelector("#prev-button");
        const pageKey = "pageKey=" + document.URL;

        const paginationLimit = 5;
        const pageCount = Math.ceil(listItems.length / paginationLimit);
        let currentPage = 1;

        const disableButton = (button) => {
            button.classList.add("disabled");
            button.setAttribute("disabled", true);
        };
        
        const enableButton = (button) => {
            button.classList.remove("disabled");
            button.removeAttribute("disabled");
        };

        const handlePageButtonsStatus = () => {
            if (currentPage === 1) {
                disableButton(prevButton);
            } else {
                enableButton(prevButton);
            }
        
            if (pageCount === currentPage) {
                disableButton(nextButton);
            } else {
                enableButton(nextButton);
            }
        };

        const handleActivePageNumber = () => {
            document.querySelectorAll(".pagination-number").forEach((button) => {
                button.classList.remove("active");
                
                const pageIndex = Number(button.getAttribute("page-index"));

                if (pageIndex == currentPage) {
                    button.classList.add("active");
                }
            });
        };

        const appendPageNumber = (index) => {
            const pageNumber = document.createElement("button");

            pageNumber.className = "pagination-number";
            pageNumber.innerHTML = index;
            pageNumber.setAttribute("page-index", index);
            pageNumber.setAttribute("aria-label", "Page " + index);

            paginationNumbers.appendChild(pageNumber);
        };

        const getPaginationNumbers = () => {
            for (let i = 1; i <= pageCount; i++) {
                appendPageNumber(i);
            }
        };

        const setCurrentPage = (pageNum) => {
            currentPage = pageNum;
            
            handleActivePageNumber();
            handlePageButtonsStatus();

            const prevRange = (pageNum - 1) * paginationLimit;
            const currRange = pageNum * paginationLimit;

            listItems.forEach((item, index) => {
                item.classList.add("hidden");

                if (index >= prevRange && index < currRange) {
                    item.classList.remove("hidden");
                }
            });

            $('html, body').scrollTop(0);
            localStorage.setItem(pageKey, currentPage);
        };

        window.addEventListener("load", (event) => {
            // Load last visited page number
            if (event.persisted 
            || (window.performance && window.performance.navigation.type == 2)) {
                currentPage = localStorage.getItem(pageKey);
            }

            getPaginationNumbers();
            setCurrentPage(currentPage);

            prevButton.addEventListener("click", () => {
                setCurrentPage(currentPage - 1);
            });
            
            nextButton.addEventListener("click", () => {
                setCurrentPage(currentPage + 1);
            });

            document.querySelectorAll(".pagination-number").forEach((button) => {
                const pageIndex = Number(button.getAttribute("page-index"));

                if (pageIndex) {
                    button.addEventListener("click", () => {
                        setCurrentPage(pageIndex);
                    });
                }
            });
        });
    }

    // code clipboard copy button
    async function copyCode(block) {
        let code = block.querySelector("code");
        let text = code.innerText;
      
        await navigator.clipboard.writeText(text);
    }

    let blocks = document.querySelectorAll("pre");

    blocks.forEach((block) => {
        // only add button if browser supports Clipboard API
        if (navigator.clipboard) {
            let clip_btn = document.createElement("button");
            let clip_img = document.createElement("svg");

            clip_btn.setAttribute('title', "Copy Code");
            clip_img.ariaHidden = true;

            block.appendChild(clip_btn);
            clip_btn.appendChild(clip_img);

            clip_btn.addEventListener("click", async () => {
                await copyCode(block, clip_btn);
            });
        }
    });

    // dark mode
    let currentTheme = localStorage.getItem('theme');
    let isDarkMode = false;

    if (currentTheme === 'dark'){
        isDarkMode = true;
        document.body.classList.add('dark-theme');

        const moonIcons = document.querySelectorAll(".ico-dark");
        const sunIcons = document.querySelectorAll(".ico-light");

        moonIcons.forEach((ico) => {
            ico.classList.add('active');
        });

        sunIcons.forEach((ico) => {
            ico.classList.add('active');
        });

        // Disable highlighter default color theme
        document.getElementById("highlight-default").disabled=true;
    }
    else {
        isDarkMode = false;
        // Disable highlighter dark color theme
        document.getElementById("highlight-dark").disabled=true;
    }

    const themeButton = document.querySelectorAll("#btn-brightness");

    themeButton.forEach((btn) => {
        btn.addEventListener('click', function() {
            const moonIcons = document.querySelectorAll(".btn-dark");
            const sunIcons = document.querySelectorAll(".btn-light");

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
                document.getElementById("highlight-default").disabled=false;
                document.getElementById("highlight-dark").disabled=true;
                changeGiscusTheme('light');
                isDarkMode = false;
            }
            else {
                localStorage.setItem('theme', 'dark');
                // Disable highlighter default color theme
                document.getElementById("highlight-default").disabled=true;
                document.getElementById("highlight-dark").disabled=false;
                changeGiscusTheme('noborder_gray');
                isDarkMode = true;
            }
        });
    });

    // Initialize/Change Giscus theme
    const commentBox = document.getElementById('giscus');

    if (commentBox) {
        var giscusUserInfos = [];
        var giscusTheme = "light";

        const giscus_repo = $('meta[name="giscus-repo"]').attr("content");
        const giscus_repoId = $('meta[name="giscus-repoId"]').attr("content");
        const giscus_category = $('meta[name="giscus-category"]').attr("content");
        const giscus_categoryId = $('meta[name="giscus-categoryId"]').attr("content");

        if (giscus_repo === '') return;

        if (currentTheme === 'dark'){
            giscusTheme = "noborder_gray";
        }

        let giscusAttributes = {
            "src": "https://giscus.app/client.js",
            "data-repo": giscus_repo,
            "data-repo-id": giscus_repoId,
            "data-category": giscus_category,
            "data-category-id": giscus_categoryId,
            "data-mapping": "pathname",
            "data-reactions-enabled": "1",
            "data-emit-metadata": "1",
            "data-theme": giscusTheme,
            "data-lang": "en",
            "crossorigin": "anonymous",
            "async": "",
        };

        let giscusScript = document.createElement("script");
        Object.entries(giscusAttributes).forEach(([key, value]) => giscusScript.setAttribute(key, value));
        document.body.appendChild(giscusScript);

        // Giscus IMetadataMessage event handler
        function handleMessage(event) {
            if (event.origin !== 'https://giscus.app') return;
            if (!(typeof event.data === 'object' && event.data.giscus)) return;
          
            const giscusData = event.data.giscus;

            if (giscusData && giscusData.hasOwnProperty('discussion')) {
                $('#num-comments').text(giscusData.discussion.totalCommentCount);
            }
            else {
                $('#num-comments').text('0');
            }
        }
          
        window.addEventListener('message', handleMessage);
    }

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
                $('#search-input').focus();
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
            $('.result-item').remove();
            $('#search-input').val("");
            $('#btn-clear').hide();
        });
    }

    // Tag EventListener
    document.querySelectorAll('.tag-box').forEach(function(tagButton){
        tagButton.addEventListener('click', function() {
            const contentID = tagButton.getAttribute('contentID');
            searchPage.classList.add('active');

            $('#search-input').val(contentID);
            $('#search-input').trigger('keyup');
        });
    });

    // Related Posts
    function displayRelatedPosts(pages){
        const refBox = document.getElementById('related-box');

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
            $('#related-box').hide();
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

            $('#related-posts').append(
                '<li class="related-item"><a href="' + post.url +
                    '"><img src="' + post.thumbnail + 
                    '"/><p class="category">' + category +  
                    '</p><p class="title">' + post.title + 
                    '</p><p class="date">' + date +
                    '</p></a></li>'
            );
        }
    }

    // Page Hits
    const pageHits = document.getElementById('page-hits');

    if (pageHits) {
        const goatcounterCode = pageHits.getAttribute('usercode');
        const requestURL = 'https://' 
            + goatcounterCode 
            + '.goatcounter.com/counter/' 
            + encodeURIComponent(location.pathname) 
            + '.json';

        var resp = new XMLHttpRequest();
        resp.open('GET', requestURL);
        resp.onerror = function() { pageHits.innerText = "0"; };
        resp.onload = function() { pageHits.innerText = JSON.parse(this.responseText).count; };
        resp.send();
    }

    // Sweat Scroll
    const scroller = new SweetScroll({
        /* some options */
    });

    // Move to Top
    if (document.querySelector('.thumbnail')){
        const arrowButton = document.querySelector('.top-arrow');

        setInterval(function(){
            var scrollPos = document.documentElement.scrollTop;
            console.log(scrollPos);
    
            if (scrollPos < 512){
                arrowButton.classList.remove('arrow-open');
            }
            else {
                arrowButton.classList.add('arrow-open');
            }
        }, 1000);
    }

    // Code highlighter
    hljs.highlightAll();

    // Disable code highlights to the plaintext codeblocks
    document.querySelectorAll('.language-text, .language-plaintext').forEach(function(codeblock){
        codeblock.querySelectorAll('.hljs-keyword, .hljs-meta, .hljs-selector-tag').forEach(function($){
            $.outerHTML = $.innerHTML;
        });
    });
});