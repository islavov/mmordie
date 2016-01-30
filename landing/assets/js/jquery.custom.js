$(window).scroll(function() {
  if ($(document).scrollTop() > 50) {
    $('#main-nav').addClass('shrink');
  } else {
    $('#main-nav').removeClass('shrink');
  }
});
var img = $('.animate.character');
if(img.length > 0){
    var offset = img.offset();
    function mouse(evt){
        var center_x = (offset.left) + (img.width()/2);
        var center_y = (offset.top) + (img.height()/2);
        var mouse_x = evt.pageX; var mouse_y = evt.pageY;
        var radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
        var degree = (radians * (180 / Math.PI) * -1) - 15;
        img.css('-moz-transform', 'rotate('+degree+'deg)');
        img.css('-webkit-transform', 'rotate('+degree+'deg)');
        img.css('-o-transform', 'rotate('+degree+'deg)');
        img.css('-ms-transform', 'rotate('+degree+'deg)');
    }
    $(document).mousemove(mouse);
}
