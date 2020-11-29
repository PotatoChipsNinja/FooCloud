function loadList() {
  $.get({
    url: '/api/todo/list',
    headers: { Authorization: 'Bearer ' + token },
    success: (res) => {
      $('#undo-list').empty();
      $('#finished-list').empty();
      todoList = res.items;
      let undoNum = 0;
      let finishedNum = 0;
      let item, listObj, checkEle;
      for (let i = 0; i < res.count; i++) {
        item = todoList[i]
        if (item.finished) {
          listObj = $('#finished-list');
          checkEle = 'checked="checked"';
          finishedNum++;
        } else {
          listObj = $('#undo-list');
          checkEle = '';
          undoNum++;
        }
        listObj.append(`
          <div class="item z-depth-2 left-align">
            <div class="side-border"></div>
            <label class="checkbox">
              <input type="checkbox" class="filled-in" ${checkEle} onclick="switchItem(${i});" />
              <span class="checkbox-span"></span>
            </label>
            <span class="todo-content">${item.content}</span>
            <a href="javascript:void(0)" class="center-align circle op-button tooltipped" data-position="bottom" data-tooltip="删除此项" onclick="deleteItem(${i});">
              <i class="material-icons">remove_circle</i>
            </a>
          </div>
        `);
      }

      $('#undo-num').text(undoNum);
      $('#finished-num').text(finishedNum);
    },
    error: (res) => {
      let code = res.responseJSON.code;
      if (code == 101) {
        window.location.href = '/login';
      }
    }
  });
}

function add() {
  let content = $('#new-todo').val();
  if (!content) {
    $('#new-todo').addClass('invalid');
    return;
  }

  $.post({
    url: '/api/todo/add',
    headers: { Authorization: 'Bearer ' + token },
    data: { content: content },
    success: (res) => {
      $('#new-todo').val('');
      $('#new-todo-label').removeClass('active');
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

function deleteItem(index) {
  $.post({
    url: '/api/todo/delete',
    headers: { Authorization: 'Bearer ' + token },
    data: { UUID: todoList[index].UUID },
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

function switchItem(index) {
  $.post({
    url: '/api/todo/switch',
    headers: { Authorization: 'Bearer ' + token },
    data: { UUID: todoList[index].UUID },
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

$(document).ready(() => {
  M.Tooltip.init($('.tooltipped'), {});
});

var token = localStorage.getItem('token');
var todoList = [];
if (!token) {
  window.location.href = '/login';
}

loadList();