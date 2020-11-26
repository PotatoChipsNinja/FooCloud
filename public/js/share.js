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
