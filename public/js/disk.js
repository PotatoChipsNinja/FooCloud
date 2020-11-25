if (!localStorage.getItem('token')) {
  window.location.href = '/login';
}

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
}

var path = '/';
setPath(path);