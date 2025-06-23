document.addEventListener("DOMContentLoaded", () => {

  let carrosel = document.querySelector('.main-carousel');

    let options = {
      contain: true,
      draggable: true,
      autoplay:1500,
      wrapAround: true,
      pageDots: false
    };

  if (window.innerWidth < 1024) {
    options.prevNextButtons = false;
  } else {
    options.prevNextButtons = true;
  }

  new Flickity(carrosel, options);

})