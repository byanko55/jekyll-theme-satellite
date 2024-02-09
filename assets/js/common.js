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

    // Change Datk/Light Theme
    const themeButton = document.querySelectorAll("#btn-brightness");

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