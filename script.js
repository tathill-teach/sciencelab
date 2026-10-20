/* Science Lab shared interactions. Page-specific features initialize only when present. */
document.addEventListener('DOMContentLoaded', () => {
  // Home screen: teacher placeholder modal.
  const teacherBtn = document.getElementById('teacherBtn');
  const teacherModal = document.getElementById('teacherModal');
  const closeModalBtn = document.getElementById('closeModal');
  const confirmModalBtn = document.getElementById('confirmModal');
  if (teacherBtn && teacherModal) {
    teacherBtn.addEventListener('click', () => {
      teacherModal.classList.add('open');
      if (closeModalBtn) closeModalBtn.focus();
    });
    const closeTeacherModal = () => {
      teacherModal.classList.remove('open');
      teacherBtn.focus();
    };
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeTeacherModal);
    if (confirmModalBtn) confirmModalBtn.addEventListener('click', () => {
      window.alert('Teacher authentication will be connected when the secure login service is configured.');
      closeTeacherModal();
    });
    teacherModal.addEventListener('click', event => {
      if (event.target === teacherModal) closeTeacherModal();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && teacherModal.classList.contains('open')) closeTeacherModal();
    });
  }

  const studentBtn = document.getElementById('studentBtn');
  if (studentBtn) studentBtn.addEventListener('click', () => {
    window.alert('The Student portal will open to class selection after that screen is built.');
  });

  // Teacher Login screen: show/hide password toggle.
  const password = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  if (password && togglePassword) {
    togglePassword.addEventListener('click', () => {
      const showing = password.type === 'text';
      password.type = showing ? 'password' : 'text';
      togglePassword.textContent = showing ? '👁️' : '🙈';
      togglePassword.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  }

  // Teacher Login screen: placeholder feedback until secure authentication is connected.
  const loginForm = document.getElementById('loginForm');
  const errorModal = document.getElementById('errorModal');
  const closeErrorBtn = document.getElementById('closeError');
  if (loginForm && errorModal) {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      errorModal.classList.add('open');
      if (closeErrorBtn) closeErrorBtn.focus();
    });
    const closeError = () => {
      errorModal.classList.remove('open');
      if (password) password.focus();
    };
    if (closeErrorBtn) closeErrorBtn.addEventListener('click', closeError);
    errorModal.addEventListener('click', event => {
      if (event.target === errorModal) closeError();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && errorModal.classList.contains('open')) closeError();
    });
  }
});
