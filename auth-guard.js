/* Client-side navigation guard. Database access must still be enforced by Supabase RLS. */
(async function () {
  const reveal = () => {
    document.documentElement.classList.remove('dashboard-auth-pending');
    if (document.body) document.body.style.visibility = 'visible';
  };
  try {
    if (!window.supabase || !window.SCIENCE_LAB_SUPABASE_URL || !window.SCIENCE_LAB_SUPABASE_KEY) {
      window.location.replace('./teacher-login.html');
      return;
    }
    const client = window.supabase.createClient(window.SCIENCE_LAB_SUPABASE_URL, window.SCIENCE_LAB_SUPABASE_KEY);
    const { data, error } = await client.auth.getSession();
    if (error || !data.session) {
      window.location.replace('./teacher-login.html');
      return;
    }
    window.SCIENCE_LAB_AUTH_CLIENT = client;
    const profileName = data.session.user.user_metadata?.display_name || data.session.user.email || 'Teacher';
    const nameNode = document.querySelector('.profile-chip b');
    if (nameNode) nameNode.textContent = profileName;
    reveal();
  } catch (_) {
    window.location.replace('./teacher-login.html');
  }
})();
