$(document).ready(() => {
  M.Dropdown.init($('.dropdown-trigger'), {});
});

function setPath(p) {
  path = p;
  $('#path-list').empty();
  let arr = p.split('/');
  let currPath = '';
  $('#path-list').append(`<a class="waves-effect waves-teal btn-flat path-item" onclick="setPath('/');">/</a>`);
  if (path != '/') {
    for (let i = 1; i < arr.length; i++) {
      currPath += '/' + arr[i];
      $('#path-list').append(`<i class="material-icons path-arrow">keyboard_arrow_right</i>`);
      $('#path-list').append(`<a class="waves-effect waves-teal btn-flat path-item" onclick="setPath('${currPath}');">${arr[i]}</a>`);
    }
  }
  loadList();
}

function sort(s) {
  sort = s;
  loadList();
}

function loadList() {
  $.get({
    url: '/api/disk/directory',
    headers: { Authorization: 'Bearer ' + token },
    data: { path: path, sort: sort },
    success: (res) => {
      console.log('success', res);
    },
    error: (res) => {
      let code = res.responseJSON.code;
      if (code == 101) {
        window.location.href = '/login';
      }
    }
  });
}

var token = localStorage.getItem('token');
var path = '/';
var sort = 0;
if (!token) {
  window.location.href = '/login';
}
setPath(path);