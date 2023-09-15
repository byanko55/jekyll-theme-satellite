document.addEventListener('DOMContentLoaded', function(){
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

    // helper
    var helper = document.querySelector('.help_box');
    var helperMsg = document.querySelector('.speech_bubble');
    var helperComment=0;

    helper.onclick = helperTalk;

    function helperTalk()  {
        switch (helperComment) {
            case 0:
                helperMsg.innerText="잘 봤냐 맨이야~";
                break;
            case 1:
                helperMsg.innerText="쓰니의 정성을 알까?\n⬇️공감💖 누르기⬇️";
                break;
            case 2:
                helperMsg.innerText="왕댓글/왕좋아요 주신분\n왕감사~👍";
                break;
            case 3:
                helperMsg.innerText="왜 그만둬, 왜?\n이제 내용 파악 다했는데";
                break;
            case 4:
                helperMsg.innerText="글을 스크랩해도 좋은데, 원문 전체를 대놓고 가져가는 건 안된단다!💢";
                break;
            case 5:
                helperMsg.innerText="뽈롱";
                break;
            case 6:
                helperMsg.innerText="다른 글들이 궁금하면\n좌측의 목차를 살펴보렴";
                break;
            case 7:
                helperMsg.innerText="🐔 최·강·한·화 🐔";
                break;
            default:
                helperMsg.innerText="얘, 뭐가 잘 안되니?\n⬇️질문✏️ 남기기⬇️";
            }
        
        helperComment = (helperComment + 1)%9;
    }
});