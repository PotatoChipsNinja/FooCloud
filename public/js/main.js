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

function logout() {
  localStorage.removeItem('token');
  window.location = '/login';
}

function nightMode() {
  localStorage.setItem('nightMode', 1);
  $('body').append(css);
  styleObj = $('body').children().last();
  $('#switch-mode').attr('onclick', 'dayMode();');
  $('#switch-mode').children().text('brightness_5');
}

function dayMode() {
  localStorage.setItem('nightMode', 0);
  styleObj.remove();
  $('#switch-mode').attr('onclick', 'nightMode();');
  $('#switch-mode').children().text('brightness_4');
}

var ts = [
  'img',
  'video',
  'iframe',
  'embed',
  'object',
  '[style*="background:url"]',
  '[style*="background-image:url"]',
  '[style*="background: url"]',
  '[style*="background-image: url"]',
  '[style*="background-image"][style*="image-set"]'
];
ts = '#content,#side,' + ts.join(',') + '{filter:invert(100%);}'
    + ts.map(function (p) { return ts.map(function (p2) { return p + ' ' + p2 }).join(',') }).join(',') + '{filter:invert(0%);}'
    + 'body{background-color:rgba(0,0,0,0.9)!important;}:root,html{background-color:rgba(0,0,0,0)!important;}';
 
var css = document.createElement('style');
css.innerHTML = ts;
var styleObj;

if (localStorage.getItem('nightMode') == 1) {
  nightMode();
}