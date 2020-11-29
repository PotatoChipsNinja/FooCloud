function loadList() {
  $.get({
    url: '/api/memo/getNotes',
    headers: { Authorization: 'Bearer ' + token },
    success: (res) => {
      $('#content').empty();
      memoList = res.notes;
      let item;
      for (let i = 0; i < res.noteNum; i++) {
        item = memoList[i]
        $('#content').append(`
          <div class="card">
            <div class="card-content valign-wrapper">
              <div>
                <span class="card-title grey-text text-darken-4 file-name">${item.title}</span>
                <p class="memo-time">${new Date(item.time).toLocaleString()}</p>
                <pre class="memo-content">${item.content}</pre>
              </div>
            </div>
            <div class="card-action right-align">
              <a href="javascript:void(0)" class="center-align circle op-button tooltipped" data-position="bottom" data-tooltip="编辑" onclick="edit(${i});">
                <i class="material-icons">edit</i>
              </a>
              <a href="javascript:void(0)" class="center-align circle op-button tooltipped" data-position="bottom" data-tooltip="删除" onclick="del(${i});">
                <i class="material-icons">delete</i>
              </a>
            </div>
          </div>
        `);
      }

      if (!res.noteNum) {
        $('#content').append(`
          <h4 style="color: rgba(0, 0, 0, 0.5);"><i class="material-icons">error</i> 您目前无备忘</h4>
        `);
      }
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
  $('#modal-title').text('新建备忘');
  $('#note-title').val('');
  $('#note-title-label').removeClass('active');
  $('#note-content').val('');
  M.textareaAutoResize($('#note-content'));
  $('#note-content-label').removeClass('active');
  $('#modal-button').attr('onclick', 'createNote();');
  M.Modal.getInstance($('#modal')).open();
}

function createNote() {
  let title = $('#note-title').val();
  let content = $('#note-content').val();
  if (!title) {
    $('#note-title').addClass('invalid');
    return;
  }

  $.post({
    url: '/api/memo/createNote',
    headers: { Authorization: 'Bearer ' + token },
    data: { title: title, content: content },
    success: (res) => {
      M.Modal.getInstance($('#modal')).close();
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

function del(index) {
  $.post({
    url: '/api/memo/deleteNote',
    headers: { Authorization: 'Bearer ' + token },
    data: { uuid: memoList[index].uuid },
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

function edit(index) {
  $('#modal-title').text('修改备忘');
  $('#note-title').val(memoList[index].title);
  $('#note-title-label').addClass('active');
  $('#note-content').val(memoList[index].content);
  M.textareaAutoResize($('#note-content'));
  $('#note-content-label').addClass('active');
  $('#modal-button').attr('onclick', `editNote('${memoList[index].uuid}')`);
  M.Modal.getInstance($('#modal')).open();
}

function editNote(UUID) {
  let title = $('#note-title').val();
  let content = $('#note-content').val();
  if (!title) {
    $('#note-title').addClass('invalid');
    return;
  }

  $.post({
    url: '/api/memo/editNote',
    headers: { Authorization: 'Bearer ' + token },
    data: { uuid: UUID, title: title, content: content },
    success: (res) => {
      M.Modal.getInstance($('#modal')).close();
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
  M.Modal.init($('#modal'), { endingTop: '30%' });
});

var token = localStorage.getItem('token');
var memoList = [];
if (!token) {
  window.location.href = '/login';
}

loadList();
