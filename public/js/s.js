function getInfo() {
  let password = $('#password').val();
  $.get({
    url: '/api/share/getInfo',
    data: { link: shareURL, password: password },
    success: (res) => {
      shareInfo = res;
      shareInfo.password = password;
      loadInfo();
      $('#auth').hide();
      $('#info').show();
    },
    error: (res) => {
      let code = res.responseJSON.code;
      if (code == 306) {
        // 密码错误
        $('#password').addClass('invalid');
      }
    }
  });
}

function formatSize(value) {
  if (value == 0) {
    return '0 B';
  }
  let unitArr = new Array("B","KB","MB","GB","TB","PB","EB","ZB","YB");
  let index = Math.floor(Math.log(parseFloat(value)) / Math.log(1024));
  let size = parseFloat(value) / Math.pow(1024, index);
  return Math.round(size * 100) / 100 + ' ' + unitArr[index];
}

function loadInfo() {
  $('#username').text(shareInfo.username);
  $('#file-name').text(shareInfo.name);
  $('#file-time').text(new Date(shareInfo.time).toLocaleString());
  $('#file-size').text(formatSize(shareInfo.size));
}

function dl() {
  $.get({
    url: '/api/share/download',
    data: { UUID: shareInfo.UUID, password: shareInfo.password },
    success: (res) => {
      window.location.href = res.url;
    }
  });
}

var shareURL = window.location.pathname;
var shareInfo;
$.get({
  url: '/api/share/getInfo',
  data: { link: shareURL },
  success: (res) => {
    shareInfo = res;
    loadInfo();
    $('#info').show();
  },
  error: (res) => {
    let code = res.responseJSON.code;
    if (code == 305) {
      // 分享不存在
      $('#no-share').show();
    } else if (code == 306) {
      // 需要密码
      $('#auth').show();
    }
  }
});