function loadList() {
  $.get({
    url: '/api/share/list',
    headers: { Authorization: 'Bearer ' + token },
    success: (res) => {
      $('#content').empty();
      let item;
      for (let i = 0; i < res.count; i++) {
        item = res.shares[i]
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
              <a href="javascript:void(0)" class="center-align circle op-button tooltipped" data-position="bottom" data-tooltip="查看链接">
                <i class="material-icons">link</i>
              </a>
              <a href="javascript:void(0)" class="center-align circle op-button tooltipped" data-position="bottom" data-tooltip="查看密码">
                <i class="material-icons">visibility</i>
              </a>
              <a href="javascript:void(0)" class="center-align circle op-button tooltipped" data-position="bottom" data-tooltip="取消分享">
                <i class="material-icons">delete</i>
              </a>
            </div>
          </div>
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

$(document).ready(() => {
  M.Dropdown.init($('.dropdown-trigger'), {});
  M.Tooltip.init($('.tooltipped'), {});
  M.Modal.init($('#create-dir-modal'), { endingTop: '30%' });
  M.Modal.init($('#upload-modal'), { endingTop: '20%' });
});

var token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/login';
}

loadList();
