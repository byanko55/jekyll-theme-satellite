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

    // code highlighter
    hljs.highlightAll();

    // navigation (mobile)
    var siteNav = document.querySelector('#site-nav');
    var menuButton = document.querySelector("#btn-nav");

    menuButton.addEventListener('click', function() {
        if (menuButton.classList.toggle('nav-open')) {
            siteNav.classList.add('nav-open');
        } else {
            siteNav.classList.remove('nav-open');
        }
    });

    // kept nav opened
    var firstNavs = document.querySelectorAll('#nav-first');
    var page_path = window.location.pathname.replace(/%20/g, " ");
    var page_tree = page_path.split('/');

    Array.prototype.forEach.call(firstNavs, function (nav_first) {
        if (page_tree[2] === nav_first.ariaLabel){
            nav_first.classList.add('active');

            var secondNavs = nav_first.querySelectorAll('#nav-second');

            Array.prototype.forEach.call(secondNavs, function (nav_second) {
                if (page_tree[3] === nav_second.ariaLabel){
                    nav_second.classList.toggle('active');

                    var thirdNavs = nav_second.querySelectorAll('#nav-third');

                    Array.prototype.forEach.call(thirdNavs, function (nav_third) {
                        if (page_tree[4] === nav_third.ariaLabel){
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
    var content = document.querySelector('main');

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

    // pagination
    const paginationNumbers = document.querySelector("#pagination-numbers");
    const paginatedList = document.querySelector(".paginated-list");

    if (paginatedList) {
        const listItems = paginatedList.querySelectorAll("li");
        const nextButton = document.querySelector("#next-button");
        const prevButton = document.querySelector("#prev-button");

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
        };

        window.addEventListener("load", () => {
            getPaginationNumbers();
            setCurrentPage(1);

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
    async function copyCode(block, button) {
        let code = block.querySelector("code");
        let text = code.innerText;
      
        await navigator.clipboard.writeText(text);
    }

    let blocks = document.querySelectorAll("pre");

    blocks.forEach((block) => {
        // only add button if browser supports Clipboard API
        if (navigator.clipboard) {
            let clip_btn = document.createElement("button");
            let clip_img = document.createElement("i");

            clip_btn.setAttribute('title', "Copy Code");
            clip_img.classList.add("fa");
            clip_img.classList.add("fa-copy");
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
    }
    else {
        isDarkMode = false;
    }

    const themeButton = document.querySelector("#btn-brightness");

    themeButton.addEventListener('click', function() {
        const moonIco = document.querySelector(".fa-moon");
        const sunIco = document.querySelector(".fa-sun");

        moonIco.classList.toggle('active');
        sunIco.classList.toggle('active');
        document.body.classList.toggle('dark-theme');

        if (isDarkMode){
            localStorage.setItem('theme', 'default');
            isDarkMode = false;
        }
        else {
            localStorage.setItem('theme', 'dark');
            isDarkMode = true;
        }
    });

    
    // search box
    const searchButton = document.querySelector("#btn-search");
    const cancelButton = document.querySelector('#btn-clear');
    const searchPage = document.querySelector("#search");

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            searchPage.classList.add('active');
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

    var posts = [];

    $.getJSON('/search.json', function (data) {
        posts = data;
    })
    .done(function() { console.log('getJSON request succeeded!'); })
    .fail(function(jqXHR, textStatus, errorThrown) { console.log('getJSON request failed! ' + textStatus); })
    .always(function() { console.log('getJSON request ended!'); });

    $('#search-input').on('keyup', function () {
        var keyword = this.value.toLowerCase();
        var searchResult = [];

        if (keyword.length > 0) {
            $('#search-result').show();
            $('#btn-clear').show();
        } else {
            $('#search-result').hide();
            $('#btn-clear').hide();
        }
        
        $('.result-item').remove();

        for (var i = 0; i < posts.length; i++) {
            var post = posts[i];

            if ((post.type === 'post' && post.title.toLowerCase().indexOf(keyword) >= 0)
            || (post.type === 'category' && post.path.toLowerCase().indexOf(keyword) >= 0)){
                searchResult.push(post);
            }
        }

        if (searchResult.length === 0) {
            $('#search-result').append(
                '<li class="result-item"><span class="description">There is no search result.</span></li>'
            );
        } else {
            for (var i = 0; i < searchResult.length; i++) {
                if (searchResult[i].type === 'post'){
                    var highlighted = highlightKeyword(searchResult[i].title, keyword);

                    $('#search-result').append(
                        '<li class="result-item"><a href="' +
                            searchResult[i].url +
                            '"><div><i class="fa-solid fa-book"></i><span class="title">' + highlighted +  
                            '</span></div><div><i class="fa-solid fa-folder"></i>' + searchResult[i].path +
                            '</div><div><i class="fa-solid fa-tags"></i>Type: post' + 
                            '</div><div><i class="fa-regular fa-calendar-days"></i>' + searchResult[i].date +
                            '</div></a></li>'
                    );
                }
                else {
                    var highlighted = highlightKeyword(searchResult[i].path, keyword);

                    $('#search-result').append(
                        '<li class="result-item"><a href="' +
                            searchResult[i].url +
                            '"><div><i class="fa-solid fa-folder"></i><span class="title">' + highlighted + 
                            '</span></div><div><i class="fa-solid fa-tags"></i>Type: category' + 
                            '</div></a></li>'
                    );
                }
            }
        }
    });

    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            $('.result-item').remove();
            $('#search-input').val("");
            $('#btn-clear').hide();
        });
    }

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
});