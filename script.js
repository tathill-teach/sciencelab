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
  const errorTitle = document.getElementById('errorTitle');
  const errorMessage = errorModal ? errorModal.querySelector('p') : null;

  const showFeedback = (title, message) => {
    if (errorTitle) errorTitle.textContent = title;
    if (errorMessage) errorMessage.textContent = message;
    if (errorModal) errorModal.classList.add('open');
    if (closeErrorBtn) closeErrorBtn.focus();
  };

  if (loginForm && errorModal) {
    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      const client = window.supabase && window.SCIENCE_LAB_SUPABASE_URL && window.SCIENCE_LAB_SUPABASE_KEY
        ? window.supabase.createClient(window.SCIENCE_LAB_SUPABASE_URL, window.SCIENCE_LAB_SUPABASE_KEY)
        : null;
      if (!client) {
        showFeedback('Sign-in setup needed', 'The secure sign-in library could not load. Check your internet connection and try again.');
        return;
      }
      const email = window.prompt('Enter the email address for your teacher account:');
      if (!email) return;
      const passwordValue = password ? password.value : '';
      const submitButton = loginForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      try {
        const { error } = await client.auth.signInWithPassword({ email: email.trim(), password: passwordValue });
        if (error) {
          showFeedback('Sign-in unsuccessful', 'That email and password combination was not accepted. Check your details or ask the project administrator to confirm your teacher account.');
          if (password) { password.value = ''; password.focus(); }
          return;
        }
        window.location.replace('./teacher-dashboard.html');
      } catch (err) {
        showFeedback('Unable to sign in', 'We could not reach the sign-in service. Please try again in a moment.');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
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
