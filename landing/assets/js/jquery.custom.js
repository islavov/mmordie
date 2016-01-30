$(window).scroll(function() {
  if ($(document).scrollTop() > 50) {
    $('#main-nav').addClass('shrink');
  } else {
    $('#main-nav').removeClass('shrink');
  }
});
