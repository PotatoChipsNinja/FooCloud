function register() {
  var username = $('#username').val();
  var password = $('#password').val();
  var repeat = $('#repeat').val();

  if (!username) {
    $('#username-helper').attr('data-error', '请输入用户名');
    $('#username').addClass('invalid');
    return;
  } else if (!password) {
    $('#password-helper').attr('data-error', '请输入密码');
    $('#password').addClass('invalid');
    return;
  } else if (repeat != password) {
    $('#repeat-helper').attr('data-error', '两次输入的密码不一致');
    $('#repeat').addClass('invalid');
    return;
  }

  $.post('/api/user/register', {username: username, password: password}, (res) => {
    M.Modal.getInstance($('.modal')).open();
  })
  .fail((res) => {
    var code = res.responseJSON.code;
    switch (code) {
      case 203:
        $('#username-helper').attr('data-error', '用户名须在 5-20 个字符之间');
        $('#username').addClass('invalid');
        break;
      case 204:
        $('#password-helper').attr('data-error', '密码须在 8-32 个字符之间');
        $('#password').addClass('invalid');
        break;
      case 205:
        $('#username-helper').attr('data-error', '用户名已被占用');
        $('#username').addClass('invalid');
        break;
    }
  });
}

function clearErr(obj) {
  $(obj).removeClass('invalid');
}

$(document).ready(() => {
  M.Modal.init($('.modal'), { onCloseEnd: () => {
    window.location.href = '/login';
  }, endingTop: '40%' });
});