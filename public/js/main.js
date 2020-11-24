function sidebar() {
  var side = $('#side');
  var content = $('#content');
  if (side.is(':visible')) {
    content.addClass('expand');
    side.hide();
  } else {
    content.removeClass('expand');
    side.show();
  }
}