function login() {
  var username = $('#username').val();
  var password = $('#password').val();

  if (!username) {
    $('#username-helper').attr('data-error', '请输入用户名');
    $('#username').addClass('invalid');
    return;
  } else if (!password) {
    $('#password-helper').attr('data-error', '请输入密码');
    $('#password').addClass('invalid');
    return;
  }

  $.post('/api/user/login', {username: username, password: password}, (res) => {
    localStorage.setItem('token', res.token);  // 存储 token
    M.Modal.getInstance($('.modal')).open();
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  })
  .fail((res) => {
    var code = res.responseJSON.code;
    switch (code) {
      case 201:
        $('#username-helper').attr('data-error', '不存在该用户');
        $('#username').addClass('invalid');
        break;
      case 202:
        $('#password-helper').attr('data-error', '密码错误');
        $('#password').addClass('invalid');
        break;
    }
  });
}

function clearErr(obj) {
  $(obj).removeClass('invalid');
}

$(document).ready(() => {
  M.Modal.init($('.modal'), { onCloseEnd: () => {
    window.location.href = '/';
  }, endingTop: '40%' });
});