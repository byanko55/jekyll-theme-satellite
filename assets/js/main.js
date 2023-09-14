document.addEventListener('DOMContentLoaded', function () {
    const scroller = new SweetScroll({
        /* some options */
    });

    var btn_on;

    // Check scroll position for every 0.25 sec
    setInterval(function(){
        var scroll_pos = document.documentElement.scrollTop;

        if (scroll_pos == 0){
            btn_on = true;
        }
        else {
            btn_on = false;
        }

        toggleButton();
    }, 250);

    function toggleButton(){
        var down_btn = document.querySelector('#about-down');
        var about_page = document.querySelector('#about');

        if (btn_on) {
            down_btn.classList.add('btn-open');
            about_page.classList.remove('fold');
        }
        else {
            down_btn.classList.remove('btn-open');
            about_page.classList.add('fold');
        }
    }
});