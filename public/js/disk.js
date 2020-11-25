$(document).ready(() => {
  M.Dropdown.init($('.dropdown-trigger'), {});
  M.FloatingActionButton.init($('.fixed-action-btn'), {});
  M.Tooltip.init($('.tooltipped'), {});
  M.Modal.init($('.modal'), { endingTop: '40%' });
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

function sortList(s) {
  sort = s;
  loadList();
}

function loadList() {
  $.get({
    url: '/api/disk/directory',
    headers: { Authorization: 'Bearer ' + token },
    data: { path: path, sort: sort },
    success: (res) => {
      $('#file-num').text(res.fileNum);
      $('#dir-num').text(res.dirNum);

      $('#items').empty();
      for (let i = 0; i < res.items.length; i++) {
        $('#items').append(`
          <tr class="item">
            <td></td>
            <td><i class="material-icons">${res.items[i].type == 'dir' ? 'folder' : 'insert_drive_file'}</i><span>${res.items[i].name}</span></td>
            <td>${res.items[i].type == 'dir' ? '' : formatSize(res.items[i].size)}</td>
            <td>${formatTime(res.items[i].time)}</td>
          </tr>
        `);
      }

      $('.item').click((e) => {
        clearSelect();
        selected = $(e.target).parent('.item');
        selected.addClass('active');
      });

      $('.item').dblclick((e) => {
        clearSelect();
        selected = $(e.target).parent('.item');
        selected.addClass('active');

        if (selected.children()[1].firstChild.innerText == 'folder') {
          // 进入目录
          setPath(path + (path == '/' ? '' : '/') + selected.children()[1].lastChild.innerText);
        }
      });
    },
    error: (res) => {
      let code = res.responseJSON.code;
      if (code == 101) {
        window.location.href = '/login';
      }
    }
  });
}

$('#content').click((e) => {
  if (!$(e.target).parent('.item').length) {
    clearSelect();
  }
})

function clearSelect() {
  if (selected) {
    selected.removeClass('active');
  }
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

function formatTime(time) {
  return new Date(time).toLocaleString();
}

function clearErr(obj) {
  $(obj).removeClass('invalid');
}

function callModal() {
  $('#dir-name').val('');
  $('#dir-name-label').removeClass('active');
  M.Modal.getInstance($('.modal')).open();
}

function createDir() {
  var dirName = $('#dir-name').val();

  if (!dirName) {
    $('#dir-name-helper').attr('data-error', '请输入目录名');
    $('#dir-name').addClass('invalid');
    return;
  }

  $.post({
    url: '/api/disk/createDir',
    headers: { Authorization: 'Bearer ' + token },
    data: { name: dirName, path: path },
    success: (res) => {
      M.Modal.getInstance($('.modal')).close();
      loadList();
    },
    error: (res) => {
      let code = res.responseJSON.code;
      if (code == 101) {
        window.location.href = '/login';
      } else if (code == 302) {
        $('#dir-name-helper').attr('data-error', '目录已经存在');
        $('#dir-name').addClass('invalid');
      }
    }
  });
}

var token = localStorage.getItem('token');
var path = '/';
var sort = 0;
var selected;
if (!token) {
  window.location.href = '/login';
}
setPath(path);