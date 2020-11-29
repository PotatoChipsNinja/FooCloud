function loadList() {
  $.get({
    url: '/api/share/list',
    headers: { Authorization: 'Bearer ' + token },
    success: (res) => {
      $('#content').empty();
      shareList = res.shares;
      let item, showPassEle;
      for (let i = 0; i < res.count; i++) {
        item = shareList[i]
        showPassEle = `
          <a href="javascript:void(0)" class="center-align circle op-button tooltipped" data-position="bottom" data-tooltip="查看密码" onclick="showPassword(${i});">
            <i class="material-icons">visibility</i>
          </a>
        `;
        $('#content').append(`
          <div class="card">
            <div class="card-content valign-wrapper">
              <i class="material-icons circle center-align item-icon">insert_drive_file</i>
              <div class="share-info">
                <span class="card-title grey-text text-darken-4 file-name">${item.name}</span>
                <p class="file-time">${new Date(item.time).toLocaleString()}</p>
              </div>
            </div>
            <div class="card-action right-align">
              <a href="javascript:void(0)" class="center-align circle op-button tooltipped" data-position="bottom" data-tooltip="查看链接" onclick="showLink(${i});">
                <i class="material-icons">link</i>
              </a>
              ${item.password ? showPassEle : ''}
              <a href="javascript:void(0)" class="center-align circle op-button tooltipped" data-position="bottom" data-tooltip="取消分享" onclick="cancel(${i});">
                <i class="material-icons">delete</i>
              </a>
            </div>
          </div>
        `);
      }

      if (!res.count) {
        $('#content').append(`
          <h4 style="color: rgba(0, 0, 0, 0.5);"><i class="material-icons">error</i> 您目前没有任何分享</h4>
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

function showLink(index) {
  $('#share-link-label').addClass('active');
  $('#share-link').val(`${window.location.protocol}//${window.location.host}${shareList[index].link}`);
  M.Modal.getInstance($('#link-modal')).open();
}

function showPassword(index) {
  $('#share-password-label').addClass('active');
  $('#share-password').val(shareList[index].password);
  M.Modal.getInstance($('#password-modal')).open();
}

function cancel(index) {
  $.post({
    url: '/api/share/cancel',
    headers: { Authorization: 'Bearer ' + token },
    data: { UUID: shareList[index].UUID },
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
  M.Modal.init($('#link-modal'), { endingTop: '30%' });
  M.Modal.init($('#password-modal'), { endingTop: '30%' });
});

var token = localStorage.getItem('token');
var shareList = [];
if (!token) {
  window.location.href = '/login';
}

loadList();
