document.addEventListener('DOMContentLoaded', function(){
    var content = document.querySelector('main');
    let currentTheme = localStorage.getItem('theme');

    // Lazy image loading
    var images = content.querySelectorAll('img');

    images.forEach((img) => {
        img.setAttribute('loading', 'lazy');
    });

    // tocbot
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

    // link (for hover effect)
    var links = content.querySelectorAll('a:not(.related-item a)');

    links.forEach((link) => {
        link.setAttribute('data-content', link.innerText);
    });

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

    // Initialize/Change Giscus theme
    var giscusTheme = "light";

    const giscus_repo = $('meta[name="giscus-repo"]').attr("content");
    const giscus_repoId = $('meta[name="giscus-repoId"]').attr("content");
    const giscus_category = $('meta[name="giscus-category"]').attr("content");
    const giscus_categoryId = $('meta[name="giscus-categoryId"]').attr("content");

    if (giscus_repo !== undefined) {
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
    }

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

    // Tag EventListener
    const searchPage = document.querySelector("#search");

    document.querySelectorAll('.tag-box').forEach(function(tagButton){
        tagButton.addEventListener('click', function() {
            const contentID = tagButton.getAttribute('contentID');
            searchPage.classList.add('active');

            $('#search-input').val(contentID);
            $('#search-input').trigger('keyup');
        });
    });

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
    
            if (scrollPos < 512){
                arrowButton.classList.remove('arrow-open');
            }
            else {
                arrowButton.classList.add('arrow-open');
            }
        }, 1000);
    }

    // Code highlighter
    if (currentTheme === 'dark'){
        // Disable highlighter default color theme
        document.getElementById("highlight-default").disabled=true;
    }
    else {
        // Disable highlighter dark color theme
        document.getElementById("highlight-dark").disabled=true;
    }

    hljs.highlightAll();

    // Disable code highlights to the plaintext codeblocks
    document.querySelectorAll('.language-text, .language-plaintext').forEach(function(codeblock){
        codeblock.querySelectorAll('.hljs-keyword, .hljs-meta, .hljs-selector-tag').forEach(function($){
            $.outerHTML = $.innerHTML;
        });
    });
});