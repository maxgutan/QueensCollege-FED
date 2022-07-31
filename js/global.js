function getWindowWidth() {
    return $(window).width();

}
function getWindowHeight() {
    return $(window).height();

}

function ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {


    var result = {width: 0, height: 0, fScaleToTargetWidth: true};

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
        return result;
    }

    // scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

    // scale to the target height
    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

    // now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth) {
        fScaleOnWidth = fLetterBox;
    } else {
        fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth) {
        result.width = Math.floor(scaleX1);
        result.height = Math.floor(scaleY1);
        result.fScaleToTargetWidth = true;
    } else {
        result.width = Math.floor(scaleX2);
        result.height = Math.floor(scaleY2);
        result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
}

function RememberOriginalSize(img) {
    if (!img.originalsize) {
        img.originalsize = {width: $(img).actual('width'), height: $(img).actual('height')};
    }
}

function FixImage(fLetterBox, div, img, animation) {
    RememberOriginalSize(img);
    var targetwidth = $(div).width() != 0 ? $(div).width() : $(div).actual('width');
    var targetheight = $(div).width() != 0 ? $(div).height() : $(div).actual('height');

    //console.log(targetwidth + '|' + targetheight);

    var srcwidth = img.originalsize.width;
    var srcheight = img.originalsize.height;

    var result = ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox);

    img.width = result.width;
    img.height = result.height;

    if (animation) {
        $(img).transition({
            "left": result.targetleft,
            "top": result.targettop
        }, 100, function () {
            $(this).parent().transition({
                "opacity": 1
            }, 600);
        });
    } else {
        $(img).css({
            "left": result.targetleft,
            "top": result.targettop
        });
    }
}

function IsImageOk(img) {
    if (!img.complete) {
        return false;
    }

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return false;
    }

    return true;
}

function FixImages(fLetterBox, target, animation) {
    var goodToGo = false;
    var len = target.length;
    target.each(function (index, div) {

        $(div).find("img").each(function () {
            var img = $(this).get(0);
            var myInt2 = setInterval(function () {
                if (IsImageOk(img)) {
                    FixImage(fLetterBox, div, img, animation);
                    goodToGo = true;
                    clearInterval(myInt2);
                } else {
                    goodToGo = false;
                }
            }, 100);

        })
    });

    return goodToGo;
}

function resizeMainImg(el, animation) {
    return FixImages(false, el, animation);
}

function addListClasses() {
    $('.secondLvlCss ul li,.secondLvlCss ol li').each(function () {
        if ($(this).index() % 2 == 0) {
            $(this).addClass('odd');
        } else {
            $(this).addClass('even');
        }
    })
}

function addTableClasses() {
    $('.secondLvlCss table tr').each(function () {
        if ($(this).index() % 2 == 0) {
            $(this).addClass('odd');
        } else {
            $(this).addClass('even');
        }
    });
    $('.secondLvlCss table tr th').each(function () {
        if ($(this).index() % 2 == 0) {
            $(this).addClass('odd');
        } else {
            $(this).addClass('even');
        }
    });
}

function specialHref() {
    $('.secondLvlCss a[href$=".pdf"]:not(".downloadBtn")').each(function () {
        if (!$(this).find('>img').length)
            $(this).addClass('filepdf');
    });

    $('.secondLvlCss a[target="_blank"]:not(".downloadBtn, .filepdf")').each(function () {
        if (!$(this).find('>img').length)
            $(this).addClass('external');
    });

    $('.secondLvlCss a[href^="mailto"]:not(".downloadBtn")').each(function () {
        if (!$(this).find('>img').length)
            $(this).addClass('mail');
    });
    /*$('.secondLvlCss a.downloadBtn').each(function(){
        $(this).append('<span />');
    });*/
}

function styleIframe() {
    $('.secondLvlCss iframe').each(function () {
        if ($(this).attr('src').indexOf("youtube") != -1) {
            $(this).wrap('<div class="iframe-holder iframe-video" />');
        } else {
            $(this).wrap('<div class="iframe-holder" />');
        }

    });
}

function styleTables() {
    $('.secondLvlCss table').each(function () {
        $(this).wrap('<div class="table-wrapper"><div class="table-overflow" /></div>');
    });
}

function firstParagraph() {
    $('.secondLvlCss:first > p:first').addClass('introParagraph');
}

function triggerAccordion() {
    var icons = {
        header: "ui-icon-plus",
        activeHeader: "ui-icon-minus"
    };
    $(".accordion").accordion({
        collapsible: true,
        active: false,
        clearStyle: true,
        heightStyle: "content",
        icons: icons,
        header: ">h2",
        autoHeight: false,
        animate: {easing: 'easeInOutQuad', duration: 250},
        beforeActivate: function (event, ui) {
            /*console.log($(ui.newHeader).length + '|' + $(ui.oldPanel).length);
             //$(ui.newHeader).parent().toggleClass('open');

             if($(ui.newHeader).length) $(ui.newHeader).parent().addClass('open');
             if($(ui.oldPanel).length) $(ui.oldPanel).parent().removeClass('open');*/


        }
    });
}

function styleContentImages() {
    $('.secondLvlCss p img').each(function () {
        var getSide = $(this).css('float');
        $(this).parents('p').addClass('specialBlock side-' + getSide);
        $(this).parents('p').contents().eq(1).wrap('<span />');
    });
}

function random(option) {
    //return a random number up to the option number
    return Math.floor(Math.random() * option)
}

function checkDevice() {
    var ua = navigator.userAgent.toLowerCase();
    isAndroid = ua.indexOf("android") > -1 ? true : false; //&& ua.indexOf("mobile");
    if (isAndroid) {
        // Do something!
        // Redirect to Android-site?
        isAndroid = true;
    }
}

$.fn.textWidth = function () {
    var html_org = $(this).html();
    var html_calc = '<i class="text-width">' + html_org + '</i>';
    $('body').append(html_calc);
    var width = $('body').find('>i:last').actual('width') + 180;
    $('body > i:last').remove();
    return width;
};


function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemOffset = 0;
    var transitionTime = Modernizr.touch ? 0 : 800;

    if (elem.attr('data-offset') != undefined) {
        elemOffset = elem.attr('data-offset');
    }
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    if (elemOffset != 0) { // custom offset is updated based on scrolling direction
        if (docViewTop - elemTop >= 0) {
            // scrolling up from bottom
            elemTop = $(elem).offset().top + elemOffset;
        } else {
            // scrolling down from top
            elemBottom = elemTop + $(elem).height() - elemOffset
        }
    }

    if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
        // once an element is visible exchange the classes
        //$(elem).removeClass('notViewed').addClass('viewed');
        var direction = $(elem).attr('data-position');

        $(elem).removeClass('notViewed');


        switch (direction) {

            case 'bottom' :
                $(elem).transition({
                    '-webkit-transform': 'translateY(0)',
                    'transform': 'translateY(0)',
                    'opacity': 1
                }, transitionTime, function () {
                    $(elem).addClass('viewed');
                });
                break;
        }


        var animElemsLeft = $('.animBlock.notViewed').length;
        if (animElemsLeft == 0) {
            // with no animated elements left debind the scroll event
            //$(window).off('scroll');
        }
    }
}

function fitVideo(object) {
    //video needs to report to its parent holder and not window
    var $target = object.parent();
    var naturalHeight = ($target.width() * object.height()) / object.width();
    if (naturalHeight >= $target.height()) {
        object.css({
            'height': 'auto',
            'width': $target.width(),
            'top': (-(object.height() - $target.height()) / 2),
            'left': 0
        });
        object.css('top', -(object.height() - $target.height()) / 2);
    } else {
        object.css({'height': $target.height(), 'width': 'auto', 'top': 0});
        object.css('left', -(object.width() - $target.width()) / 2);
    }
}

$.fn.moveIt = function () {
    var $window = $(window);
    var instances = [];

    $(this).each(function () {
        instances.push(new moveItItem($(this)));
    });

    window.onscroll = function () {
        var scrollTop = $window.scrollTop();
        instances.forEach(function (inst) {
            inst.update(scrollTop);
        });
    }
}

var moveItItem = function (el) {
    this.el = $(el);
    this.speed = parseInt(this.el.attr('data-scroll-speed'));
};

moveItItem.prototype.update = function (scrollTop) {
    var pos = scrollTop / this.speed;
    this.el.css('transform', 'translateY(' + pos + 'px)');
};


var initDesktopImg,
    landscapeSlider,
    teamSlider,
    keySlider,
    keySliderOptions = {
        auto: true,
        speed: 800,
        pause: 4600,
        pager: false,
        controls: true,
        minSlides: getWindowWidth() > 1201 ? getWindowHeight() > 600 ? getWindowHeight() > 740 ? 3 : 2 : 1 : 2,
        infiniteLoop: true,
        slideMargin: 0,
        //useCss:true,
        mode: 'vertical',
        nextSelector: '.keylinks-holder .nav.next',
        prevSelector: '.keylinks-holder .nav.prev',
        moveSlides: 1,
        adaptiveHeight: false
    },
    landscapeSliderOptions = {
        auto: true,
        speed: 800,
        pause: typeof autoScrollDelay == "undefined" ? 4600 : autoScrollDelay,
        pager: true,
        controls: false,
        //useCss:true,
        mode: 'fade',
        onSliderLoad: function (currentIndex) {
            resizeMainImg($('.background-holder .img-bg'), false);
            //$('.background-slider .img-bg').eq(currentIndex).addClass('current pt-page-fadeUp');
            setTimeout(function () {
                if (!$('.background-holder.complete').length) {
                    setTimeout(function () {
                        $('.background-slider').transition({
                            'opacity': 1
                        }, 600, function () {
                            $('.background-holder').addClass('complete');
                            if (!Modernizr.touch) $('[data-scroll-speed]').moveIt();
                            $('.alert-holder').addClass('open');
                            $('.landing-holder .txt-holder').addClass('animated');
                            //$('.background-slider .img-bg').eq(currentIndex).removeClass('pt-page-fadeUp');
                        });
                    }, 100);
                }
            }, 100);
        }/*,
        onSlideBefore: function ($slideElement, oldIndex, newIndex) {
            $('.background-slider .img-bg').eq(oldIndex).addClass('pt-page-scaleDownUp');
            $('.background-slider .img-bg').eq(newIndex).addClass('current pt-page-scaleUp pt-page-delay300');
        },
        onSlideAfter: function ($slideElement, oldIndex, newIndex) {
            setTimeout(function () {
                $('.background-slider .img-bg').eq(oldIndex).removeClass('current pt-page-scaleDownUp');
                $('.background-slider .img-bg').eq(newIndex).removeClass('pt-page-scaleUp pt-page-delay300');
            },100);

        }*/
    },
    landscapeSliderOptionsContent = {
        auto: true,
        speed: 400,
        pause: 4600,
        pager: true,
        controls: false,
        mode: 'fade',
        onSliderLoad: function (currentIndex) {


            resizeMainImg($('.background-slider .img-bg'), false);

            if (!$('.background-holder').hasClass('complete')) {
                setTimeout(function () {
                    $('.background-slider').transition({
                        'opacity': 1
                    }, 1200, function () {
                        $('.background-holder').addClass('complete');
                    });
                }, 100);

            }
        }
    },
    teamSliderOptions = {
        auto: true,
        speed: 400,
        pause: 4000,
        mode: 'horizontal',
        slideMargin: 0,
        minSlides: 4,
        maxSlides: 4,
        slideWidth: getWindowWidth() > 767 ? 66 : 50,
        moveSlides: 1,
        adaptiveHeight: false,
        infiniteLoop: true,
        controls: true,
        pager: false,
        nextSelector: '.team-slider-wrapper .nav.next',
        prevSelector: '.team-slider-wrapper .nav.prev',
        //pagerCustom:'.team-thumbs',
        onSliderLoad: function (currentIndex) {
            $('.team-slider-wrapper .team-slider .team-item').css({
                "opacity": 0,
                "visibility": "hidden"
            });
            $('.team-thumbs ul li a').removeClass('active');

            var imgEl = '<img class="current" src="' + $('.team-item').eq(currentIndex).find(".img-holder img").attr('src') + '" />';
            $('.team-slider-wrapper .img-wrapper .img-holder').append(imgEl);
            resizeMainImg($('.team-slider-wrapper .img-wrapper .img-holder'), false);

            $('body').on('click', '.team-thumbs ul li a', function (e) {
                e.preventDefault();

                teamSlider.goToSlide($(e.target).attr('data-slide-index'));

            });

            $('.team-thumbs ul li a[data-slide-index="' + currentIndex + '"]').addClass('active');

            $('.team-slider-wrapper .img-wrapper a').attr('href', $('.team-slider-wrapper .team-slider .team-item').eq(currentIndex).find('a.whole-link').attr('href'));

            setTimeout(function () {
                $('.team-slider-wrapper .team-slider .team-item').eq(currentIndex).transition({
                    "opacity": 1,
                    "visibility": "visible"
                }, 200);
                $('.team-slider-wrapper .img-wrapper .img-holder img').transition({
                    "opacity": 1
                }, 200);
            }, 100);


        },
        onSlideAfter: function ($slideElement, oldIndex, newIndex) {
            //var imgEl = '<img src="'+$('.team-item .txt-holder').eq(newIndex).attr('data-image')+'" />';
            //$('.team-slider-wrapper .img-wrapper').html(imgEl);
            //resizeMainImg($('.team-slider-wrapper .img-wrapper'), false);
            /*setTimeout(function () {
                $('.team-slider-wrapper .img-wrapper img').transition({
                    "opacity":1
                },200);
            },100);*/


            $('.team-slider-wrapper .img-wrapper .img-holder  img.current').transition({
                "opacity": 0
            }, 400, function () {
                $(this).remove();
            });
            $('.team-slider-wrapper .img-wrapper .img-holder  img.next').transition({
                "opacity": 1
            }, 400, function () {
                $(this).removeClass().addClass('current');
            });

        },
        onSlideBefore: function ($slideElement, oldIndex, newIndex) {
            var imgEl = '<img class="next" src="' + $('.team-item').eq(newIndex).find(".img-holder img").attr('src') + '" />';
            $('.team-slider-wrapper .img-wrapper .img-holder ').prepend(imgEl);
            resizeMainImg($('.team-slider-wrapper .img-wrapper .img-holder '), false);

            $('.team-slider-wrapper .team-slider .team-item').eq(oldIndex).transition({
                "opacity": 0,
                "visibility": "hidden"
            }, 600);
            $('.team-slider-wrapper .team-slider .team-item').eq(newIndex).transition({
                "opacity": 1,
                "visibility": "visible"
            }, 600);

            $('.team-thumbs ul li a[data-slide-index="' + oldIndex + '"]').removeClass('active');
            $('.team-thumbs ul li a[data-slide-index="' + newIndex + '"]').addClass('active');

            $('.team-slider-wrapper .img-wrapper a').attr('href', $('.team-slider-wrapper .team-slider .team-item').eq(newIndex).find('a.whole-link').attr('href'));


        }

    };


var welcomeSlide,
    statsSlider,
    storySliderEl,
    storySliderInit = false,
    nextSlider,
    nextSliderInit = false,
    teamSliderInit = false;


var keyLinksSliderHtml = $(".addons-wrapper .keylinks-holder").html();


var imagesArray = [
    ['./Images/img/bg/landing-img1.jpg', './Images/img/bg/landing-img1-mobile.jpg'],
    ['./Images/img/bg/landing-img2.jpg', './Images/img/bg/landing-img2-mobile.jpg'],
    ['./Images/img/bg/landing-img1.jpg', './Images/img/bg/landing-img1-mobile.jpg']/*,
    ['./Images/img/bg/bg-img4.jpg','./Images/img/bg/bg-img4-mobile.jpg'],
    ['./Images/img/bg/bg-img5.jpg','./Images/img/bg/bg-img5-mobile.jpg']*/
];


function getUnique(count) {
    // Make a copy of the array
    var tmp = imagesArray.slice(imagesArray);
    var ret = [];

    for (var i = 0; i < count; i++) {
        var index = Math.floor(Math.random() * tmp.length);
        var removed = tmp.splice(index, 1);
        // Since we are only removing one element
        ret.push(removed[0]);
    }
    return ret;
}


var hpRender = {
    init: function () {
        var self = this;
        self.initSliderImgs();
        self.setupMenu();
        self.initScrolls();
        if ($('.messages-holder').length) self.initMessages();
    },
    initOnLoad: function () {
        var self = this;
        setTimeout(self.initMedia, 100);
    },
    initOnResize: function () {
        var self = this;
        self.checkDevice();
        if (getWindowWidth() > 991) self.initAnimations();
    },

    initSliderImgs: function () {

        var random = getUnique(3);

        for (var i = 0; i < random.length; i++) {
            $('.background-slider').append('<div class="img-bg" data-desktop="' + random[i][0] + '" data-mobile="' + random[i][1] + '" />');
        }


        if (getWindowWidth() > 767) {
            $('.background-slider .img-bg').each(function (ind, el) {
                var img = $('<img >');
                img.attr('src', $(el).attr('data-desktop'));
                img.attr('data-scroll-speed', 3);
                img.appendTo(el);
            });

            initDesktopImg = true;
        } else {
            $('.background-slider .img-bg').each(function (ind, el) {
                var img = $('<img >');
                img.attr('src', $(el).attr('data-mobile'));
                img.attr('data-scroll-speed', 3);
                img.appendTo(el);
            });
            initDesktopImg = false;
        }

        hpRender.initLandingSlider();
    },
    checkDevice: function () {
        if (getWindowWidth() > 767) {
            if (!initDesktopImg) {

                $('.background-slider .img-bg').each(function (ind, el) {
                    $(el).find('img').remove();
                    var img = $('<img >');
                    img.attr('src', $(el).attr('data-desktop'));
                    img.attr('data-scroll-speed', 3);
                    img.appendTo(el);
                });

                initDesktopImg = true;
            }
        } else {
            if (initDesktopImg) {
                $('.background-slider .img-bg').each(function (ind, el) {
                    $(el).find('img').remove();
                    var img = $('<img >');
                    img.attr('src', $(el).attr('data-mobile'));
                    img.attr('data-scroll-speed', 3);
                    img.appendTo(el);
                });
                initDesktopImg = false;
            }
        }

        hpRender.initLandingSlider();
    },
    initLandingSlider: function () {
        //console.log('here');

        if (typeof landscapeSlider != "undefined") {
            //landscapeSlider.reloadSlider(landscapeSliderOptions);
            resizeMainImg($('.background-holder .img-bg'), false);
        } else {
            $('.background-slider').waitForImages(function () {
                landscapeSlider = $('.background-slider').bxSlider(landscapeSliderOptions);
            });
        }

    },


    initMessages: function () {
        var bodyClass = "_messages-open";

        $('body').addClass(bodyClass);

        $('.messages-holder .message:first').fadeIn();

        //closeBtn
        $('body').on('click', '.message-wrap .close-btn', function () {

            var self = $(this);

            $('.messages-holder').addClass("_close");
            setTimeout(function () {
                self.parents('.message').fadeOut();
                $('body').removeClass(bodyClass);
                $('.messages-holder').removeClass("_close");
            }, 300);

        });

        $('body').on('click', '.messages-triggers-holder .message-trigger', function () {
            var elndex = $(this).index();

            console.log(elndex);

            $('body').addClass(bodyClass);

            $('.messages-holder .message').eq(elndex).fadeIn();
        });


    },
    initScrolls: function () {
        $('.explore-holder a').click(function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: getWindowHeight() - 50
            }, 1200);
        });

        $('.scroll-top-mobile, .scroll.top').click(function (e) {
            e.stopImmediatePropagation();

            $('html, body').animate({
                scrollTop: -100
            }, 1200);
        });
    },
    setupMenu: function () {
        //setup Mobile
        //$('body').append('<nav id="menu" />');

        //$('#menu').prepend($('.main-menu').clone());


        $('.navigation-holder .main-menu > li > ul').each(function () {
            $(this).parent().addClass('has-sub').append('<span />');
        });

        $('.navigation-holder .main-menu > li > ul > li > ul').each(function () {
            $(this).parent().addClass('has-sub').append('<span />');
        });


        $('.navigation-holder').addClass('complete');


        setTimeout(hpRender.initMenuNew, 100);
    },
    initMenuNew: function () {

        var posTop;


        $('.menu-trigger').click(function (e) {
            e.stopImmediatePropagation();
            $('body').toggleClass('menu-open');
            $(this).toggleClass('close');

            if ($('body').hasClass('menu-open')) {
                posTop = $(window).scrollTop();
                setTimeout(function () {
                    $('body').addClass('fixed');
                }, 100);

            } else {
                $('body').removeClass('fixed');

                $('html, body').animate({
                    scrollTop: posTop
                }, 0);
                setTimeout(function () {

                    $('html, body').animate({
                        scrollTop: posTop - 10
                    }, 0);
                }, 1);

                $('.stage-lvl3  span.back-top').trigger('click');
                $('.stage-lvl2  span.back-top').trigger('click');

            }
        });

        $('.navigation-holder .menu-trigger').click(function (e) {
            e.stopImmediatePropagation();
            $('body').toggleClass('menu-open');

            if ($('body').hasClass('menu-open')) {
                posTop = $(window).scrollTop();
                setTimeout(function () {
                    $('body').addClass('fixed');
                }, 400);

            } else {
                $('body').removeClass('fixed');

                $('html, body').animate({
                    scrollTop: posTop
                }, 0);
                setTimeout(function () {
                    $('html, body').animate({
                        scrollTop: posTop - 10
                    }, 0);
                }, 1);


                if ($('.menu-wrapper').hasClass('lvl-3-active')) {
                    $('.stage-lvl3  span.back-top').trigger('click');
                }
                if ($('.menu-wrapper').hasClass('lvl-2-active')) {
                    $('.stage-lvl2  span.back-top').trigger('click');
                }
            }


        });


        /*$(window).click(function() {
//Hide the menus if visible
            if($('.menu-wrapper').hasClass('lvl-3-active')) {
                $('.stage-lvl2  span.back-top').trigger('click');
            }


        });

        $('.menu-wrapper .menu-holder').click(function(event){
            event.stopPropagation();
        });*/


        /*$('body').on('click', '.menu-wrapper >span', function () {
            if ($('.menu-wrapper').hasClass('lvl-3-active') || $('.menu-wrapper').hasClass('lvl-2-active')) {
                $('.stage-lvl2  span.back-top').trigger('click');
            }
        })*/


        /*open 2nd level menu*/
        $('.menu-holder  .primary-menu > li > span, .menu-holder  .primary-menu > li > a').click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var elTitle = $(this).parent().find('>a').text(),
                elMenu = $(this).parent().find('>ul').html(),
                el = $(this).parent();

            el.parent().find('> li').removeClass('active');
            el.addClass('active');

            if ($('.menu-wrapper').hasClass('lvl-3-active')) {
                $('.stage-lvl3  span.back-top').trigger('click');
            }

            $('.stage-lvl2 .back-top').html('back');
            $('.stage-lvl2 ul.main-menu').html(elMenu);

            $('.menu-wrapper').addClass('lvl-2-active');

            /*$('.stage-lvl2').transition({
                'opacity':1,
                'visibility':'visible'
            },800);*/
        });

        $('body').on('click', '.stage-lvl2 .main-menu > li > span, .stage-lvl2 .main-menu > li > a', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var elTitle = $(this).parent().find('>a').text(),
                elMenu = $(this).parent().find('>ul').html(),
                el = $(this).parent();

            el.parent().find('> li').removeClass('active');
            el.addClass('active');


            $('.stage-lvl3 .back-top').html('back');
            $('.stage-lvl3 ul.main-menu').html(elMenu);

            $('.menu-wrapper').addClass('lvl-3-active');

            /*$('.stage-lvl3').transition({
                'opacity':1,
                'visibility':'visible'
            },800);*/
        });

        $('body').on('click', '.stage-lvl2  span.back-top', function () {
            if ($('.menu-wrapper').hasClass('lvl-3-active')) {
                $('.stage-lvl3  span.back-top').trigger('click');
            }

            $('.menu-wrapper').removeClass('lvl-2-active');
            $('.stage-lvl2 h3').html('');
            $('.stage-lvl2 ul.main-menu').html('');

            /*$('.stage-lvl2').transition({
               'opacity':0,
               'visibility':'hidden'
           },400, function () {

           });*/
        });
        $('body').on('click', '.stage-lvl3  span.back-top', function () {
            $('.menu-wrapper').removeClass('lvl-3-active');
            $('.stage-lvl3 h3').html('');
            $('.stage-lvl3 ul.main-menu').html('');
        });


        $(".menu-stage.stage-lvl1").click(function (e) {
            if (e.target != this) return; // only continue if the target itself has been clicked
            // this section only processes if the .nav > li itself is clicked.
            $('.stage-lvl3  span.back-top').trigger('click');
            $('.stage-lvl2  span.back-top').trigger('click');
        });


    },
    initFeaturedEvent: function () {
        setTimeout(function () {
            $('.featured-event-holder').addClass('complete');
        }, 200);
    },
    initMedia: function () {
        //$.HompageMedia.AddMediaItems(hpRender.setupStories,$('.stories-wrapper'),hpRender.initFeaturedEvent, '.landing-addon-layer .txt-holder');
        $.HompageMedia.AddMediaItems(hpRender.setupStories, $('.stories-wrapper'), hpRender.initFeaturedEvent, $('.landing-holder'), hpRender.setupHistorySlider, $('.history-slider'), 135);
    },
    setupStories: function () {
        //stories here

        $('.stories-wrapper .story-item').each(function (ind, el) {
            var htmlEl = '<div class="story-txt-item ' + $(el).attr('class') + '">' + $(el).find('.txt-holder').html() + '<a href="' + CDN_URL + '"/media/" class="brand-link link-dark">all stories</a></div>'

            $('.stories-slider').append(htmlEl);
        });

        hpRender.initNewsSliders();
    },
    initNewsSliders: function () {

        var storiesSlider = $('.stories-slider').bxSlider({
            mode: 'fade',
            auto: false,
            controls: true,
            pager: false,
            nextText: '<span />',
            prevText: '<span />',
            adaptiveHeight: true,
            onSliderLoad: function () {
                $('.stories-wrapper .story-item:first').addClass('_active');

                $('body').on('mouseenter', '.stories-wrapper .story-item', function () {
                    var index = $(this).index();

                    storiesSlider.goToSlide(index);
                });
            },
            onSlideAfter: function ($el, oldIndex, newIndex) {
                $('.stories-wrapper .story-item').removeClass('_active');
                $('.stories-wrapper .story-item').eq(newIndex).addClass('_active');

            }
        });


        if (getWindowWidth() > 991) hpRender.initAnimations();
    },
    initAnimations: function () {

        $('.welcome-holder').each(function (ind, el) {
            if (!$(el).hasClass('animate')) {
                $(el).waypoint(function () {
                    $(el).addClass('animate');
                }, {
                    offset: '60%'
                });
            }
        });

        $('.stories-holder').each(function (ind, el) {
            if (!$(el).hasClass('animate')) {
                $(el).waypoint(function () {
                    $(el).addClass('animate');
                }, {
                    offset: '60%'
                });
            }
        });


        $('.footer-holder').each(function (ind, el) {
            if (!$(el).hasClass('animate')) {
                $(el).waypoint(function () {
                    $(el).addClass('animate');
                }, {
                    offset: '80%'
                });
            }
        });


    },
    setupHistorySlider: function () {
        var historySlider = $('.history-slider').bxSlider({
            mode: 'fade',
            pause: 5000,
            speed: 0,
            auto: false,
            controls: true,
            pager: false,
            nextText: '<span />',
            prevText: '<span />',
            infiniteLoop: false,
            stopAutoOnClick: true,
            hideControlOnEnd: true,
            onSliderLoad: function () {

                //historySlider.stopAuto();


                $('.history-holder').each(function (ind, el) {
                    if (!$(el).hasClass('animate')) {
                        $(el).waypoint(function () {
                            $(el).addClass('animate');
                            $('.history-slider-wrapper').addClass('_timing');
                            historySlider.startAuto();
                        }, {
                            offset: '60%'
                        });
                    }
                });


            },
            onSlideBefore: function () {
                $('.history-slider-wrapper').removeClass('_timing');
            },
            onSlideAfter: function () {
                $('.history-slider-wrapper').addClass('_timing');
            },
            onSlideNext: function () {
                historySlider.stopAuto();
                historySlider.startAuto();
            },
            onSlidePrev: function () {
                historySlider.stopAuto();
                historySlider.startAuto();
            }
        });
    }
};


var newsSliderDesktop,
    newsSliderMobile,
    newsSliderDesktopInit = false,
    newsSliderMobileInit = false,
    initRelatedNews = false;

var helpSlider = false;

var whereNextCarouselInit = false,
    $carouselWhereNext;

var eventCarouselInit = false,
    $carouselEvents;


var slRender = {
    init: function () {
        var self = this;
        self.initSecondLevelCss();
        //self.sectionNav();
        //self.initPromoSlider();
        hpRender.initScrolls();
        hpRender.setupMenu();
        //self.initButtons();
        if ($('.background-holder').length) self.initLandscapeSlider();
        if ($('.wherenext-holder').length) self.initWhereNextSliders();

    },
    initOnLoad: function () {
        var self = this;
        if ($('.related-news-holder').length) {
            setTimeout(slRender.initMediaNews, 100);
        }
        setTimeout(slRender.initSecondLvlAnimations, 100);

    },
    initOnResize: function () {
        var self = this;
        if ($('.background-holder').length) self.initLandscapeSlider();
        if ($('.wherenext-holder').length) self.initWhereNextSliders();
        if($('.related-events-holder').length) self.initEventsSliders();
        //if($('.related-news-holder').length) self.initNewsSliders();
        //if ($('.widget-upcoming-events').length) self.resizeWidgetEvents();


    },
    initSecondLevelCss: function () {
        addListClasses();
        addTableClasses();
        specialHref();
        firstParagraph();
        triggerAccordion();
        styleContentImages();
        styleIframe();
        styleTables();
        //styleFeaturedImages();

    },
    initPromoSlider: function () {
        $('.promos-slider').bxSlider({
            mode: 'fade',
            controls: false,
            auto: true
        })
    },
    sectionNav: function () {
        if ($('.submenu-nav').length) {
            $('.submenu-nav > li > ul').each(function () {
                $(this).parent().append('<span><i></i></span>');
            });

            //$('.mobile-submenu-holder .submenu-holder').html($('.sidebar .submenu-holder').html());
        }
        ;

        $('body').on('click', '.submenu-nav > li > span', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var $target = $(this).parent();
            //$(this).parents('li').find('>ul').slideDown();

            if ($target.hasClass('active')) {
                $target.toggleClass('active').find('>ul').slideToggle();
            } else {
                $('.submenu-nav > li.active').removeClass('active').find('>ul').slideToggle();
                $target.toggleClass('active').find('>ul').slideToggle();
            }
        });


        if ($('.submenu-nav > li > ul > li > a.active').length) {
            $('.submenu-nav > li > ul > li > a.active').parent('li').parent('ul').parent('li').find('span').trigger('click')
        }
        ;

    },
    initLandscapeSlider: function () {
        //console.log(landscapeSlider)
        if (typeof landscapeSlider != "undefined") {
            resizeMainImg($('.background-holder .img-bg'), false);
        } else {
            landscapeSlider = $('.background-slider').bxSlider(landscapeSliderOptionsContent);
        }
    },
    initMediaNews: function () {
        if ($('.widget-upcoming-events').length || $('.related-events-holder').length) {
            $('body').append('<div class="temp-events" />');
        }

        $.SecondLevel.AddMediaItems($('.stories-slider'), slRender.setupStories, $('.temp-events'), slRender.setupEvents);

    },
    setupStories: function () {
        //stories here
        $('.related-news-holder').show();


        //$('.stories-slider').append("<div class='story-item' />");
        $('.stories-slider').waitForImages(function () {
            slRender.initNewsSliders();
        });


    },

    initNewsSliders: function () {
        var $textHolder = $('.stories-text-wrapper .txt-holder'),
            $carousel = $('.stories-slider').flickity({
                cellAlign: 'center',
                contain: false,
                wrapAround: true,
                pageDots: false,
                prevNextButtons: false,
                adaptiveHeight: getWindowWidth() > 767 ? false : true,
                on: {
                    ready: function () {
                        //console.log('Flickity is ready');

                        $('.stories-slider .story-item:not(.is-selected)').click(function (e) {
                            e.preventDefault();
                            var thisIndex = $(this).index();

                            $carousel.flickity( 'selectCell', thisIndex );


                        });

                    },
                    change: function (index) {
                        //console.log( 'Slide changed to' + index );
                        //console.log($('.stories-slider .story-item.is-selected').find('.txt-holder').html());
                        $textHolder.html($('.stories-slider .story-item.is-selected').find('.txt-holder').html())
                    },
                    select: function (index) {
                        //console.log( 'Slide selected to' + index );
                        //console.log($('.stories-slider .story-item.is-selected').find('.txt-holder').html());
                        $textHolder.html($('.stories-slider .story-item.is-selected').find('.txt-holder').html())
                    }
                }
            });


        $('.stories-wrapper .nav.nav-prev').click(function () {
            $carousel.flickity('previous');
        }).hover(
            function () {
                $('.stories-slider .flickity-viewport').transit({
                    'transform':'translateX(10px)'
                }, 200);
            },
            function () {
                $('.stories-slider .flickity-viewport').transit({
                    'transform':'translateX(0)'
                }, 200);
            }
        );
        $('.stories-wrapper .nav.nav-next').click(function () {
            $carousel.flickity('next');
        }).hover(
            function () {
                $('.stories-slider .flickity-viewport').transit({
                    'transform':'translateX(-10px)'
                }, 200);
            },
            function () {
                $('.stories-slider .flickity-viewport').transit({
                    'transform':'translateX(0)'
                }, 200);
            }
        );;
    },

    setupEvents: function () {
        //stories here
        if ($('.temp-events .event-item').length) {
            if ($('.widget-upcoming-events').length) {
                $('.widget-upcoming-events .events-holder').html($('.temp-events .event-item').slice(0, 2).clone());

                //resizeMainImg($('.widget-upcoming-events .event-item .img-holder'),false);

                $('.widget-upcoming-events').show();

                if (!Modernizr.touch && Modernizr.csstransforms) {

                    $('.widget-upcoming-events .event-item').each(function (ind, el) {
                        setTimeout(function () {
                            if (!$(el).hasClass('animated')) {
                                $(el).waypoint(function () {
                                    $(el).transition({
                                        'opacity': 1,
                                        '-webkit-transform': 'translateY(0)',
                                        'transform': 'translateY(0)'
                                    }, 800, function () {
                                        $(el).addClass('animated');
                                    });
                                }, {
                                    offset: '80%'
                                });
                            }
                        }, ind * 400);
                    });
                }
            }

            if ($('.related-events-holder').length) {
                $('.related-events-holder').show();
                $('.temp-events .event-item:first').addClass('active');

                $('.related-events-holder .events-img-holder').html($('.temp-events').html());
                $('.related-events-holder .events-txt-holder').html($('.temp-events').html());

                $('.related-events-holder .events-img-holder').waitForImages(function () {
                    slRender.initEventsSliders();
                });
            }
        }

        $('body').on('mouseenter', '.events-wrapper .events-txt-holder .event-item', function (e) {
            var elIndex = $(this).index();

            $('.events-wrapper .events-txt-holder .event-item').eq(elIndex).addClass('active').siblings().removeClass('active');
            $('.events-wrapper .events-img-holder .event-item').eq(elIndex).addClass('active').siblings().removeClass('active');
        });
    },

    resizeWidgetEvents: function () {
        //resizeMainImg($('.widget-upcoming-events .story-item .img-holder'),false);
    },

    initEventsSliders: function () {

        if (getWindowWidth() < 768) {
            if(!eventCarouselInit) {
                $carouselEvents = $('.events-img-holder').flickity({
                    cellAlign: 'center',
                    contain: false,
                    wrapAround: true,
                    pageDots: false,
                    prevNextButtons: false,
                    on: {
                        ready: function () {
                            eventCarouselInit = true;
                        }
                    }
                });


                $('.events-wrapper .nav.nav-prev').click(function () {
                    $carouselEvents.flickity('previous');
                });
                $('.events-wrapper .nav.nav-next').click(function () {
                    $carouselEvents.flickity('next');
                });
            }
        } else {
            if(eventCarouselInit) {
                $carouselEvents.flickity('destroy');
                eventCarouselInit = false;
                $('.events-wrapper .nav.nav-prev, .events-wrapper .nav.nav-next').off('click');
            }
        }


    },

    initWhereNextSliders: function () {


        if (getWindowWidth() > 767) {
            if(!whereNextCarouselInit) {
                $carouselWhereNext = $('.wherenext-slider').flickity({
                    cellAlign: 'center',
                    contain: false,
                    wrapAround: true,
                    pageDots: false,
                    prevNextButtons: false,
                    on: {
                        ready: function () {
                            whereNextCarouselInit = true;
                        }
                    }
                });


                $('.wherenext-controls .nav.nav-prev').click(function () {
                    $carouselWhereNext.flickity('previous');
                }).hover(
                    function () {
                        $('.wherenext-slider .flickity-viewport').transit({
                            'transform':'translateX(10px)'
                        }, 200);
                    },
                    function () {
                        $('.wherenext-slider .flickity-viewport').transit({
                            'transform':'translateX(0)'
                        }, 200);
                    }
                );
                $('.wherenext-controls .nav.nav-next').click(function () {
                    $carouselWhereNext.flickity('next');
                }).hover(
                    function () {
                        $('.wherenext-slider .flickity-viewport').transit({
                            'transform':'translateX(-10px)'
                        }, 200);
                    },
                    function () {
                        $('.wherenext-slider .flickity-viewport').transit({
                            'transform':'translateX(0)'
                        }, 200);
                    }
                );
            }

        } else {
            if(whereNextCarouselInit) {
                $carouselWhereNext.flickity('destroy');
                whereNextCarouselInit = false;
                $('.wherenext-controls .nav.nav-prev, .wherenext-controls .nav.nav-next').off('click');
            }
        }


    },

    initButtons: function () {
        //mobile clicks
        $('.backTop').click(function (e) {
            $('html, body').animate({
                scrollTop: -100
            }, 1200);
        });


        $('.submenu-link').click(function () {
            $('html, body').animate({
                scrollTop: $('.submenu-holder').offset().top - 60
            }, 1200);
        });


    },

    arrangeElements: function () {
        //console.log('aaa');
        if ($('.sidebar-holder').length) {
            //      console.log(111);
            if (getWindowWidth() > 767) {
                $('.sidebar-holder').insertBefore('.wrap > .content-wrapper > .content-holder');
                $('.sidebar-holder').prepend($('.submenu-holder'));
            } else {
                $('.sidebar-holder').insertAfter('.wrap > .content-wrapper > .content-holder');
                $('.sidebar-holder').append($('.submenu-holder'));
            }
        }
    },

    initSecondLvlAnimations: function () {
        if (!Modernizr.touch && Modernizr.csstransforms) {

            $('.widget-related-links .related-link').each(function (ind, el) {
                setTimeout(function () {
                    if (!$(el).hasClass('animated')) {
                        $(el).waypoint(function () {
                            $(el).transition({
                                'opacity': 1,
                                '-webkit-transform': 'translateY(0)',
                                'transform': 'translateY(0)'
                            }, 800, function () {
                                $(el).addClass('animated');
                            });
                        }, {
                            offset: '80%'
                        });
                    }
                }, ind * 400);
            });


            $('blockquote').each(function (ind, el) {
                if (!$(el).hasClass('animated')) {
                    $(el).waypoint(function () {
                        /*$(el).transition({
                         'opacity': 1,
                         '-webkit-transform': 'translateY(0)',
                         'transform': 'translateY(0)'
                         }, 800, function () {*/
                        $(el).addClass('animated');
                        /*});*/
                    }, {
                        offset: '80%'
                    });
                }
            });

            $('hr').each(function (ind, el) {
                if (!$(el).hasClass('animated')) {
                    $(el).waypoint(function () {
                        $(el).addClass('animated');
                    }, {
                        offset: '80%'
                    });
                }
            });

            $('.secondLvlCss img').each(function (ind, el) {
                if (!$(el).hasClass('animated')) {
                    $(el).waypoint(function () {
                        $(el).addClass('animated');
                    }, {
                        offset: '80%'
                    });
                }
            });

            $('.table-wrapper').each(function (ind, el) {
                if (!$(el).hasClass('animated')) {
                    $(el).waypoint(function () {
                        /*$(el).transition({
                         'opacity': 1,
                         '-webkit-transform': 'translateY(0)',
                         'transform': 'translateY(0)'
                         }, 800, function () {*/
                        $(el).addClass('animated');
                        /*});*/
                    }, {
                        offset: '80%'
                    });
                }
            });


        }
    }
}