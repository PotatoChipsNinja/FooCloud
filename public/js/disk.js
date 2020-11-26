$(document).ready(() => {
  M.Dropdown.init($('.dropdown-trigger'), {});
  M.FloatingActionButton.init($('.fixed-action-btn'), {});
  M.Tooltip.init($('.tooltipped'), {});
  M.Modal.init($('#create-dir-modal'), { endingTop: '30%' });
  M.Modal.init($('#upload-modal'), { endingTop: '20%' });
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
      $('#path-list').append(`<i class="material-icons path-arrow">navigate_next</i>`);
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
        selected = $(e.target).parents('.item');
        select();
      });

      $('.item').dblclick((e) => {
        console.log('double click');
        if (selected && selected.length) {
          if (selected.children()[1].firstChild.innerText == 'folder') {
            // 进入目录
            setPath(path + (path == '/' ? '' : '/') + selected.children()[1].lastChild.innerText);
            clearSelect();
            $('#sub-menu').fadeOut(100);
          }
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
  if (!$(e.target).parents('.item').length) {
    clearSelect();
    $('#sub-menu').fadeOut(100);
  }
})

function select() {
  if (selected && selected.length) {
    selected.addClass('active');
    $('#item-name').text(selected.children()[1].lastChild.innerText);
    if (selected.children()[1].firstChild.innerText == 'folder') {
      $('#file-size').text('');
      $('#op-list').append(`<li><a href="javascript:void(0)" onclick="rm('${selected.children()[1].lastChild.innerText}', 'dir');"><i class="material-icons">delete</i></a></li>`);
    } else {
      $('#file-size').text(` (${selected.children()[2].innerText})`);
      $('#op-list').append(`<li><a href="javascript:void(0)" onclick="rm('${selected.children()[1].lastChild.innerText}', 'file');"><i class="material-icons">delete</i></a></li>`);
      $('#op-list').append(`<li><a href="javascript:void(0)" onclick="dl('${selected.children()[1].lastChild.innerText}');"><i class="material-icons">cloud_download</i></a></li>`);
    }
    $('#sub-menu').fadeIn(100);
  }
}

function clearSelect() {
  if (selected && selected.length) {
    selected.removeClass('active');
    selected = null;
    $('#op-list').empty();
  }
}

function dl(filename) {
  $.get({
    url: '/api/disk/download',
    headers: { Authorization: 'Bearer ' + token },
    data: { name: filename, path: path },
    success: (res) => {
      window.location.href = res.url;
    },
    error: (res) => {
      let code = res.responseJSON.code;
      if (code == 101) {
        window.location.href = '/login';
      }
    }
  });
}

function rm(filename, type) {
  $.post({
    url: '/api/disk/remove',
    headers: { Authorization: 'Bearer ' + token },
    data: { name: filename, type: type, path: path },
    success: (res) => {
      loadList();
    },
    error: (res) => {
      let code = res.responseJSON.code;
      if (code == 101) {
        window.location.href = '/login';
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

function formatTime(time) {
  return new Date(time).toLocaleString();
}

function clearErr(obj) {
  $(obj).removeClass('invalid');
}

function callModal() {
  $('#dir-name').val('');
  $('#dir-name-label').removeClass('active');
  M.Modal.getInstance($('#create-dir-modal')).open();
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
      M.Modal.getInstance($('#create-dir-modal')).close();
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

$('#file').change((e) => {
  if ($('#file')[0].files.length) {
    // 上传文件
    let fromData = new FormData();
    let filename = $('#file')[0].files[0].name;
    fromData.append('name', filename);
    fromData.append("path", path);
    fromData.append("file", $('#file')[0].files[0]);
    
    $('.collection').append(`
      <li class="collection-item avatar">
        <i class="material-icons circle green">insert_drive_file</i>
        <span class="title">${filename}</span>
        <p class="info"><span class="status">上传中：</span><span class="percent">0%</span></p>
        <a href="javascript:void(0)" class="secondary-content tooltipped" data-position="bottom" data-tooltip="取消任务" onclick="cancel(${uploadList.length});">
          <i class="material-icons">cancel</i>
        </a>
      </li>
    `);

    let obj = $('.collection').children().last();
    
    let ajaxObj = $.post({
      url: '/api/disk/upload',
      headers: {
        Authorization: 'Bearer ' + token
      },
      contentType: false,
      processData: false,
      data: fromData,
      success: (res) => {
        obj.children('.info').children('.status').text('已完成');
        obj.children('.info').children('.percent').text('');
        obj.children('a').hide();
        loadList();
      },
      xhr: () => {
        myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          // 绑定progress事件的回调函数
          myXhr.upload.addEventListener('progress', (event) => {
            let loaded = Math.floor(100 * (event.loaded / event.total));  // 已经上传的百分比
            obj.children('.info').children('.percent').text(loaded + '%');
            setProgressBar(obj, loaded);
          }, false);
        }
        return myXhr;
      },
      error: (res) => {
        if (res.responseJSON) {
          let code = res.responseJSON.code;
          if (code == 101) {
            window.location.href = '/login';
          } else if (code == 303) {
            obj.children('.info').children('.status').text('错误：文件已经存在');
            obj.children('.info').children('.percent').text('');
            obj.children('a').hide();
            obj.css('background-image', 'unset');
          }
        }
      }
    });

    uploadList.push({ eleObj: obj, ajaxObj: ajaxObj });
    $('#file').val('');
    M.Modal.getInstance($('#upload-modal')).open();
  }
});

function cancel(index) {
  uploadList[index].eleObj.children('.info').children('.status').text('已取消');
  uploadList[index].eleObj.children('.info').children('.percent').text('');
  uploadList[index].eleObj.children('a').hide();
  uploadList[index].eleObj.css('background-image', 'unset');
  uploadList[index].ajaxObj.abort();
}

function setProgressBar(obj, percent) {
  obj.css('background-image', `linear-gradient(to right, rgba(0, 100, 255, 0.2) ${percent}%, rgba(0, 0, 0, 0) ${percent}%)`);
}

var token = localStorage.getItem('token');
var path = '/';
var sort = 0;
var selected;
var uploadList = [];
if (!token) {
  window.location.href = '/login';
}
setPath(path);