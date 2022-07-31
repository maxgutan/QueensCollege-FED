$(document).ready(function () {

    // activate bxSlider
    $('.background-slider').bxSlider({
        mode: "fade",
        auto: true,
        pager: true,
        speed: 400
    });

    $(".menu-trigger").click(function () {
        console.log('click');
        $('body').toggleClass('menu-open');
    });




});

