function sidebar() {
  var side = $('#side');
  var content = $('#content');
  if (side.is(':visible')) {
    content.animate({'left': 0}, 200);
    side.animate({'width': 0, 'opacity': 0}, 200, () => {
      side.hide();
    });
  } else {
    side.show();
    content.animate({'left': '15rem'}, 200);
    side.animate({'width': '15rem', 'opacity': 1}, 200);
  }
}