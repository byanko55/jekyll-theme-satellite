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
    var menuButton = document.querySelector("#open-nav");

    menuButton.addEventListener('click', function() {
        if (menuButton.classList.toggle('nav-open')) {
            siteNav.classList.add('nav-open');
        } else {
            siteNav.classList.remove('nav-open');
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
            target.ariaPressed = target.parentNode.classList.toggle('active');
        }
    });

    // tocbot
    var content = document.querySelector('.inner-content');
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
        tocSelector: '.toc-fixed',
        contentSelector: '.inner-content',
        headingSelector:'h1, h2',
        hasInnerContainers: false
    });

    // typing effect
    var category_title = document.querySelector('#category');

    if (category_title) {
        var raw_text = category_title.innerText;
        var typing_speed = 50;
        var i = 0;

        category_title.innerHTML = "";

        function typeWriter() {
            if (i < raw_text.length) {
                category_title.innerHTML += raw_text.charAt(i);
                i++;
                setTimeout(typeWriter, typing_speed);
            }
        }

        typeWriter();
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
});