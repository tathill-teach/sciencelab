/* Science Lab shared interactions. Page-specific features initialize only when present. */
document.addEventListener('DOMContentLoaded', () => {
  // The Teacher card is a normal link to teacher-login.html. The Student portal is
  // intentionally disabled until the class-selection screen is implemented.

  // Teacher Login exact-artwork page: password visibility and modal feedback.
  const password = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  if (password && togglePassword) {
    togglePassword.addEventListener('click', () => {
      const showing = password.type === 'text';
      password.type = showing ? 'password' : 'text';
      togglePassword.textContent = showing ? '◉' : '◎';
      togglePassword.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  }

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
