document.addEventListener('DOMContentLoaded', function(){
    var innerContent = document.querySelector('main');
    let currentTheme = localStorage.getItem('theme');

    // tocbot
    var headings = innerContent.querySelectorAll('h1, h2');
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
    var links = innerContent.querySelectorAll('a:not(.related-item a)');

    links.forEach((link) => {
        link.setAttribute('data-content', link.innerText);
    });

    // Tag EventListener
    const searchPage = document.querySelector("#search");

    document.querySelectorAll('.tag-box .tag').forEach(function(tagButton){
        tagButton.addEventListener('click', function() {
            const contentID = tagButton.getAttribute('contentID');
            const inpuxBox = document.getElementById('search-input');
            searchPage.classList.add('active');

            inpuxBox.value = contentID;
            inpuxBox.dispatchEvent(new KeyboardEvent('keyup'));
        });
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

        arrowButton.addEventListener('click', function(){
            window.scroll({top:0, behavior:'smooth'});
        });
    }

    // Move to Comment
    document.getElementById('comments-counter').addEventListener('click', function(){
        document.getElementById("giscus").scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Code highlighter
    if (currentTheme === 'dark'){
        // Disable highlighter default color theme
        Array.from(innerContent.querySelectorAll('pre')).forEach(function (codeblock){
            codeblock.classList.add('pre-dark');
        });
    }
    else {
        // Disable highlighter dark color theme
        Array.from(innerContent.querySelectorAll('pre')).forEach(function (codeblock){
            codeblock.classList.add('pre-light');
        });
    }
});

window.addEventListener('load', function(){
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

    // Highlighter
    hljs.highlightAll();

    // Disable code highlights to the plaintext codeblocks
    document.querySelectorAll('.language-text, .language-plaintext').forEach(function(codeblock){
        codeblock.querySelectorAll('.hljs-keyword, .hljs-meta, .hljs-selector-tag').forEach(function($){
            $.outerHTML = $.innerHTML;
        });
    });

    // Initialize/Change Giscus theme
    var giscusTheme = "light";

    const giscus_repo = document.querySelector('meta[name="giscus_repo"]').content;
    const giscus_repoId = document.querySelector('meta[name="giscus_repoId"]').content;
    const giscus_category = document.querySelector('meta[name="giscus_category"]').content;
    const giscus_categoryId = document.querySelector('meta[name="giscus_categoryId"]').content;

    if (giscus_repo !== undefined) {
        let currentTheme = localStorage.getItem('theme');

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

    // Giscus IMetadataMessage event handler
    function handleMessage(event) {
        if (event.origin !== 'https://giscus.app') return;
        if (!(typeof event.data === 'object' && event.data.giscus)) return;
        
        const giscusData = event.data.giscus;
        const commentCount = document.getElementById('num-comments');

        if (giscusData && giscusData.hasOwnProperty('discussion')) {
            commentCount.innerText = giscusData.discussion.totalCommentCount;
        }
        else {
            commentCount.innerText = '0';
        }
    }
        
    window.addEventListener('message', handleMessage);
});