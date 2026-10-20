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
          '<button class="unit-delete" type="button" aria-label="Delete ' + escapeHtml(unit.title) + '" data-delete-unit="' + escapeHtml(unit.id) + '">Delete</button>' +
          '</article>';
      }).join('');
    }
    const count = document.getElementById('unitCount');
    if (count) count.textContent = String(units.length);
  };

  const initRosterAndGrades = async (client, teacherId) => {
    const rosterNode = document.getElementById('studentRoster');
    const form = document.getElementById('studentForm');
    const nameInput = document.getElementById('studentDisplayName');
    const rosterNotice = document.getElementById('rosterNotice');
    const gradesNode = document.getElementById('lightSortGradeList');
    const sayRoster = (message) => { if (rosterNotice) rosterNotice.textContent = message; };
    const renderRoster = (students) => {
      if (!rosterNode) return;
      rosterNode.innerHTML = students.length ? students.map(student =>
        '<article class="unit-row"><span class="unit-number pink-number">👤</span><span class="unit-color pink-line"></span><div class="unit-info"><h3>' + escapeHtml(student.display_name) + '</h3><p>Class roster</p></div><button class="unit-delete" type="button" data-delete-student="' + escapeHtml(student.id) + '">Remove</button></article>'
      ).join('') : '<p class="panel-copy">No students added yet. Add your class roster above.</p>';
    };
    const loadRoster = async () => {
      const result = await client.from('students').select('id,display_name,created_at').eq('teacher_id', teacherId).order('display_name', { ascending: true });
      if (result.error) { if (rosterNode) rosterNode.innerHTML = '<p class="panel-copy">Could not load the class roster.</p>'; return []; }
      renderRoster(result.data || []);
      return result.data || [];
    };
    const loadGrades = async () => {
      if (!gradesNode) return;
      gradesNode.innerHTML = '<p class="panel-copy">Loading submitted grades…</p>';
      const assignmentResult = await client.from('assignments').select('id').eq('teacher_id', teacherId).eq('title', 'Light Detective Sort-It!').order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (assignmentResult.error || !assignmentResult.data) { gradesNode.innerHTML = '<p class="panel-copy">The graded assignment is not set up yet.</p>'; return; }
      const result = await client.from('gradebook_entries').select('student_label,points_earned,points_possible,submission_state,submitted_at').eq('teacher_id', teacherId).eq('assignment_id', assignmentResult.data.id).order('submitted_at', { ascending: false });
      if (result.error) { gradesNode.innerHTML = '<p class="panel-copy">Could not load submitted grades.</p>'; return; }
      const entries = result.data || [];
      gradesNode.innerHTML = entries.length ? entries.map(entry => {
        const points = Number(entry.points_earned || 0), possible = Number(entry.points_possible || 12);
        const pct = possible ? Math.round(points / possible * 1000) / 10 : 0;
        const date = entry.submitted_at ? new Date(entry.submitted_at).toLocaleString() : 'Submitted';
        return '<article class="unit-row"><span class="unit-number green-number">✓</span><span class="unit-color green-line"></span><div class="unit-info"><h3>' + escapeHtml(entry.student_label) + '</h3><p>' + points + ' / ' + possible + ' points • ' + pct + '% • ' + escapeHtml(date) + '</p></div><span class="unit-status">Submitted</span></article>';
      }).join('') : '<p class="panel-copy">No student submissions yet. Grades will appear here after students submit.</p>';
    };
    let students = await loadRoster();
    if (form) form.onsubmit = async (event) => {
      event.preventDefault();
      const displayName = (nameInput?.value || '').trim();
      if (!displayName) return;
      const duplicate = students.some(s => s.display_name.toLocaleLowerCase() === displayName.toLocaleLowerCase());
      if (duplicate) { sayRoster('That name is already on the roster.'); return; }
      const { error } = await client.from('students').insert({ teacher_id: teacherId, display_name: displayName, class_id: null });
      if (error) { console.error('Add student:', error); sayRoster('Could not add the student. Please try again.'); return; }
      if (nameInput) nameInput.value = '';
      students = await loadRoster();
      sayRoster('Student added to the roster.');
    };
    if (rosterNode) rosterNode.onclick = async (event) => {
      const button = event.target.closest('[data-delete-student]');
      if (!button) return;
      const student = students.find(s => s.id === button.dataset.deleteStudent);
      if (!student || !window.confirm('Remove ' + student.display_name + ' from the roster? Previously submitted grades will remain in the gradebook.')) return;
      const { error } = await client.from('students').delete().eq('id', student.id).eq('teacher_id', teacherId);
      if (error) { sayRoster('Could not remove this student.'); return; }
      students = await loadRoster();
      sayRoster('Student removed. Existing grades remain saved.');
    };
    const assignmentSettings = async () => {
      const dueInput = document.getElementById('sortDueDate');
      const unlockedInput = document.getElementById('sortUnlocked');
      const saveButton = document.getElementById('saveSortSettings');
      const status = document.getElementById('sortSettingsNotice');
      if (!dueInput || !unlockedInput || !saveButton) return;
      const result = await client.from('assignments').select('id,is_unlocked,due_date').eq('teacher_id', teacherId).eq('title', 'Light Detective Sort-It!').order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (result.error || !result.data) { if (status) status.textContent = 'Could not load assignment settings.'; return; }
      dueInput.value = result.data.due_date || '';
      unlockedInput.checked = Boolean(result.data.is_unlocked);
      saveButton.onclick = async () => {
        saveButton.disabled = true;
        if (status) status.textContent = 'Saving assignment settings…';
        const { error } = await client.from('assignments').update({ due_date: dueInput.value || null, is_unlocked: unlockedInput.checked }).eq('id', result.data.id).eq('teacher_id', teacherId);
        saveButton.disabled = false;
        if (error) { if (status) status.textContent = 'Could not save. Check assignment permissions and try again.'; return; }
        if (status) status.textContent = 'Saved. Students can ' + (unlockedInput.checked ? 'see this assignment' : 'no longer access this assignment') + (dueInput.value ? '; due ' + dueInput.value + '.' : '. No due date set.');
      };
    };
    await assignmentSettings();
    const refresh = document.getElementById('refreshGrades');
    if (refresh) refresh.onclick = loadGrades;
    await loadGrades();
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
      await initRosterAndGrades(client, teacherId);
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
      if (list) list.onclick = async (event) => {
        const deleteButton = event.target.closest('[data-delete-unit]');
        if (deleteButton) {
          const unit = units.find(item => item.id === deleteButton.dataset.deleteUnit);
          if (!unit) return;
          const confirmed = window.confirm('Delete the unit “' + unit.title + '”? This cannot be undone. If it has lessons attached, deletion may be blocked until those lessons are handled.');
          if (!confirmed) return;
          deleteButton.disabled = true;
          const { error: deleteError } = await client.from('units').delete().eq('id', unit.id).eq('teacher_id', teacherId);
          if (deleteError) {
            console.error('Science Lab delete unit:', deleteError);
            deleteButton.disabled = false;
            notice('Could not delete this unit. If it has lessons attached, handle those lessons first, then try again.');
            return;
          }
          units = units.filter(item => item.id !== unit.id);
          renderUnits(units);
          notice('Unit deleted.');
          return;
        }
        const button = event.target.closest('[data-open-unit]');
        if (!button) return;
        const unit = units.find(item => item.id === button.dataset.openUnit);
        if (unit && unit.title === 'Energy') { window.location.href = './lesson-light-energy.html'; return; }
        if (unit) notice(unit.title + ' is saved. Lessons for this unit will be added as you build them.');
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
