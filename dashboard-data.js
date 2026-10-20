/* Loads and saves the signed-in teacher's unit library through Supabase RLS. */
(() => {
  const starterUnits = [
    { title: 'Properties of Matter', teks: 'K.6A', sort_order: 1 },
    { title: 'Force and Motion', teks: 'K.7A', sort_order: 2 },
    { title: 'Energy', teks: 'K.8AB', sort_order: 3 },
    { title: 'Earth’s Materials', teks: 'K.10A', sort_order: 4 },
    { title: 'Natural Resources', teks: 'K.11A', sort_order: 5 },
    { title: 'Objects and Patterns in the Sky', teks: 'K.9AB', sort_order: 6 },
    { title: 'Weather and Air', teks: 'K.10BC', sort_order: 7 },
    { title: 'Environments', teks: 'K.12A–B', sort_order: 8 },
    { title: 'Structures of Organisms', teks: 'K.13AB', sort_order: 9 },
    { title: 'Life Cycles', teks: 'K.13CD', sort_order: 10 }
  ];
  const numberClasses = ['pink-number','blue-number','yellow-number','green-number','purple-number'];
  const lineClasses = ['pink-line','blue-line','yellow-line','green-line','purple-line'];
  const notice = (message) => {
    const node = document.getElementById('prototypeNotice');
    if (!node) return;
    node.textContent = message;
    node.hidden = false;
    if (node._hideTimer) window.clearTimeout(node._hideTimer);
    node._hideTimer = window.setTimeout(() => { node.hidden = true; }, 4000);
  };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const renderUnits = (units) => {
    const list = document.getElementById('unitList');
    if (!list) return;
    if (!units.length) {
      list.innerHTML = '<p class="panel-copy">No units yet. Use “Add a unit” to create your first one.</p>';
    } else {
      list.innerHTML = units.map((unit, index) => {
        const n = String(index + 1).padStart(2, '0');
        return '<article class="unit-row" data-unit-id="' + escapeHtml(unit.id) + '">' +
          '<span class="unit-number ' + numberClasses[index % numberClasses.length] + '">' + n + '</span>' +
          '<span class="unit-color ' + lineClasses[index % lineClasses.length] + '"></span>' +
          '<div class="unit-info"><h3>' + escapeHtml(unit.title) + '</h3><p>TEKS ' + escapeHtml(unit.teks || 'Not set') + '</p></div>' +
          '<span class="unit-status">Saved</span>' +
          '<button class="unit-open" type="button" aria-label="View ' + escapeHtml(unit.title) + '" data-open-unit="' + escapeHtml(unit.id) + '">→</button>' +
          '</article>';
      }).join('');
    }
    const count = document.getElementById('unitCount');
    if (count) count.textContent = String(units.length);
  };
  const init = async () => {
    const client = window.SCIENCE_LAB_AUTH_CLIENT;
    if (!client) return;
    const list = document.getElementById('unitList');
    if (list) list.innerHTML = '<p class="panel-copy">Loading your saved units…</p>';
    try {
      const { data: authData, error: authError } = await client.auth.getUser();
      if (authError || !authData.user) throw new Error('Your session could not be verified. Please sign in again.');
      const teacherId = authData.user.id;
      let { data: units, error } = await client.from('units').select('id,title,teks,sort_order,created_at').eq('teacher_id', teacherId).order('sort_order', { ascending: true }).order('created_at', { ascending: true });
      if (error) throw error;
      if (!units || units.length === 0) {
        const { error: seedError } = await client.from('units').insert(starterUnits.map(unit => ({ ...unit, teacher_id: teacherId })));
        if (seedError) throw seedError;
        const result = await client.from('units').select('id,title,teks,sort_order,created_at').eq('teacher_id', teacherId).order('sort_order', { ascending: true }).order('created_at', { ascending: true });
        if (result.error) throw result.error;
        units = result.data || [];
      }
      renderUnits(units);
      if (!window._scienceLabUnitNoticeShown) {
        notice('Your unit library is connected. Your units are now saved to your teacher account.');
        window._scienceLabUnitNoticeShown = true;
      }
      const addButton = document.getElementById('addUnitButton');
      if (addButton) addButton.onclick = async () => {
        const title = window.prompt('What is the name of the science unit?');
        if (!title || !title.trim()) return;
        const teks = window.prompt('Enter the TEKS code (or leave blank):', '') || '';
        const { error: insertError } = await client.from('units').insert({
          teacher_id: teacherId,
          title: title.trim(),
          teks: teks.trim() || null,
          sort_order: (units.length ? Math.max(...units.map(item => Number(item.sort_order) || 0)) : 0) + 1
        });
        if (insertError) { notice('Could not save that unit. Please try again.'); return; }
        const refreshed = await client.from('units').select('id,title,teks,sort_order,created_at').eq('teacher_id', teacherId).order('sort_order', { ascending: true }).order('created_at', { ascending: true });
        if (refreshed.error) { notice('The unit was saved, but the list could not refresh. Reload the page.'); return; }
        units = refreshed.data || [];
        renderUnits(units);
        notice('Unit saved to your teacher account.');
      };
      if (list) list.onclick = (event) => {
        const button = event.target.closest('[data-open-unit]');
        if (!button) return;
        const unit = units.find(item => item.id === button.dataset.openUnit);
        if (unit) notice(unit.title + ' is saved. Lesson creation is the next feature to connect.');
      };
    } catch (error) {
      console.error('Science Lab unit library:', error);
      if (list) list.innerHTML = '<p class="panel-copy">We could not load your saved units. Check your connection and reload. Your existing database records have not been deleted.</p>';
      notice('Database connection needs attention. Check the Supabase configuration and access policies.');
    }
  };
  if (window.SCIENCE_LAB_AUTH_CLIENT) init();
  else window.addEventListener('science-lab-auth-ready', init, { once: true });
})();
