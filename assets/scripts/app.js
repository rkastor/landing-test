var header = document.querySelector('.header'),
    burger = document.querySelector('.burger'),
    headerBurger = document.querySelector('.header__burger-menu'),
    headerSourceBottom = header.getBoundingClientRect().bottom ,
    swiperContainer = document.querySelector('.slider__container');
    swiperTestimonials = document.querySelector('.testimonials');

burger.addEventListener("click", function () { 
    this.classList.toggle('active');
    headerBurger.classList.toggle('showed');
});

window.onscroll = function () {
    if (header.classList.contains('fixed') && window.pageYOffset < headerSourceBottom) {
        header.classList.remove('fixed');
    } else if (window.pageYOffset > headerSourceBottom) {
        header.classList.add('fixed');
    }
};

AOS.init({
    duration: 1000,
});

var mySwiper = new Swiper(swiperContainer, {
    speed: 500,
    spaceBetween: 0,
    loop: true,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    slidesPerView: 1,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

var activeSlideColor = mySwiper.slides[1].getAttribute('data-color'),
    parentDiv        = mySwiper.$el;

    mySwiper.slides[1].parentNode.parentNode.setAttribute("style", "background-color:" + activeSlideColor);

mySwiper.on('slideChange', function () {
    var activeIndex       = mySwiper.activeIndex,
        currentSLide      = mySwiper.slides[activeIndex],
        activeSlideColor  = mySwiper.slides[activeIndex].getAttribute('data-color');

    currentSLide.parentNode.parentNode.setAttribute("style", "background-color:" + activeSlideColor);
});


var mySwiperTestimon = new Swiper(swiperTestimonials, {
    speed: 500,
    spaceBetween: 25,
    loop: true,
    centeredSlides: false,
    centerInsufficientSlides: true,
    slidesPerView: 2.3,
    loopedSlides: 0,
});



// gallery images random position

var gallArr = document.getElementsByClassName('gallery__item');

// console.log(gallArr);

Array.from(gallArr).forEach(function (item, i, arr) {
    // console.log(item);
    // console.log(item.offsetWidth);
    // console.log(item.offsetHeight);
    // console.log('-----------');

    var bodyWidth = (item.parentNode.offsetWidth * 0.5 - item.clientWidth) / 2;
    var bodyHeight = (item.parentNode.offsetHeight * 0.5 - item.clientHeight) / 2;
    // var randPosX = Math.floor(Math.random() * bodyWidth);
    // var randPosY = Math.floor(Math.random() * bodyHeight);
    var randPosX = Math.random() * bodyWidth;
    var randPosY = Math.random() * bodyHeight;

    console.log(randPosX);
    console.log(randPosY);
    console.log('-----------');

    // console.log('item ' + i + ' posXY: ' + randPosX + " " + randPosY);
    
    // item.setAttribute('style', 'left:' + randPosX + 'px');
    // item.setAttribute('style', 'top:' + randPosY + 'px');
    item.style.top = randPosY + 'px';
    item.style.left = randPosX + 'px';
});





// function getRandomPosition(element) {
//     var y = document.body.offsetWidth - element.clientWidth;
//     var x = document.body.offsetHeight - element.clientHeight;
//     var randomX = Math.floor(Math.random() * x);
//     var randomY = Math.floor(Math.random() * y);
//     return [randomX, randomY];
// }
// window.onload = function () {
//     var img = document.createElement('img');
//     img.setAttribute("style", "position:absolute;");
//     img.setAttribute("src", "some-image.jpg");
//     document.body.appendChild(img);
//     var xy = getRandomPosition(img);
//     img.style.top = xy[0] + 'px';
//     img.style.left = xy[1] + 'px';
// }