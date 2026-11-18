(() => {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const MARK = 'rgb(1, 2, 3)';

  const ICONS = {
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    folderPlus: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    filePlus: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>',
    chevron: '<polyline points="9 18 15 12 9 6"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    edit: '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    undo: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
    redo: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/>',
    highlighter: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    list: '<line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    listOrdered: '<line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
    alignLeft: '<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>',
    alignCenter: '<line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>',
    alignRight: '<line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
    eraser: '<path d="M20 20H9l-5.3-5.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L12 20"/><line x1="7" y1="11" x2="14" y2="18"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    arrowUp: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
    arrowDown: '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>',
    chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/>',
    sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    pin: '<line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>',
    checkSquare: '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    chevronDown: '<polyline points="6 9 12 15 18 9"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    history: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/><polyline points="12 7 12 12 15 15"/>',
    maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
    keyboard: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    cloudUp: '<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>',
    cloudDown: '<polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>',
  };
  const svg = n => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;
  const paintIcons = (root = document) => root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = svg(el.dataset.icon); });

  const LANGS = [['javascript', 'JavaScript'], ['typescript', 'TypeScript'], ['python', 'Python'], ['java', 'Java'],
    ['csharp', 'C#'], ['cpp', 'C / C++'], ['go', 'Go'], ['rust', 'Rust'], ['sql', 'SQL'], ['bash', 'Bash'],
    ['json', 'JSON'], ['html', 'HTML'], ['css', 'CSS'], ['text', 'Plain text']];
  const langOptions = LANGS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');

  const TEXT_COLORS = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#38d9a9', '#4dabf7', '#748ffc', '#b197fc', '#f783ac', '#adb5bd'];
  const HL_COLORS = ['rgba(255, 212, 59, 0.45)', 'rgba(105, 219, 124, 0.40)', 'rgba(77, 171, 247, 0.40)', 'rgba(247, 131, 172, 0.40)',
    'rgba(255, 169, 77, 0.45)', 'rgba(177, 151, 252, 0.40)', 'rgba(56, 217, 169, 0.40)', 'rgba(255, 107, 107, 0.40)', 'rgba(173, 181, 189, 0.40)'];

  /* ---------- elements ---------- */
  const app = $('#app'), tree = $('#tree'), editor = $('#editor'), titleInput = $('#title');
  const paper = $('#paper'), emptyEl = $('#empty'), crumbs = $('#crumbs'), statusEl = $('#status');
  const metaEl = $('#meta'), toolbar = $('#toolbar'), blockSel = $('#blockSel'), pop = $('#pop'), dlg = $('#dlg');
  const searchEl = $('#search');

  /* ---------- state ---------- */
  const KEY = 'study-notepad-v1';
  let state = null;
  let api = null; // Python bridge when running inside the desktop app, otherwise null (browser mode)
  let lastRange = null, lastLang = 'javascript', saveTimer = null, dragId = null;
  let writing = false, dirty = false, bigWarn = '';
  let encKey = null, encMeta = null, encCheck = null, diaryKey = null;

  function parseState(raw) {
    try {
      const s = JSON.parse(raw);
      return s && Array.isArray(s.folders) && Array.isArray(s.notes) ? s : null;
    } catch { return null; }
  }
  function persist() {
    if (!state) return false;
    if (!api && !encKey && !state.notes.some(n => n.lock)) {
      try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
      catch { setStatus('Storage full - download a backup'); return false; }
    }
    dirty = true;
    pump();
    return true;
  }
  // Writes are coalesced so only the latest state is sent to disk, in order.
  async function pump() {
    if (writing) return;
    writing = true;
    try {
      while (dirty) {
        dirty = false;
        const text = await serializeState();
        if (api) {
          const r = await api.save(text);
          if (r.ok) renderSync(r); else setStatus('Could not save to disk');
        } else localStorage.setItem(KEY, text);
      }
    } catch (err) { setStatus(err?.name === 'QuotaExceededError' ? 'Storage full - download a backup' : 'Could not save'); }
    writing = false;
  }
  const drained = async () => { while (writing || dirty) await new Promise(r => setTimeout(r, 50)); };

  function findApi() {
    return new Promise(resolve => {
      if (window.pywebview?.api) return resolve(window.pywebview.api);
      window.addEventListener('pywebviewready', () => resolve(window.pywebview.api), { once: true });
      setTimeout(() => resolve(null), 1500);
    });
  }

  function renderSync(s) {
    const el = $('#syncInfo');
    if (!api || !s) { el.textContent = ''; return; }
    let text = 'Saved on this computer';
    if (!s.configured) text += ' \u00b7 Drive not set up';
    else if (!s.signed_in) text += ' \u00b7 not signed in to Drive';
    else if (!s.last_sync) text += ' \u00b7 not on Drive yet';
    else if (s.pending) text += ' \u00b7 changes not on Drive';
    else text = 'Synced to Drive ' + new Date(s.last_sync).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    el.textContent = text;
    el.classList.toggle('warn', !!s.configured && (!s.last_sync || s.pending));
  }
  const getNote = id => state.notes.find(n => n.id === id);
  const getFolder = id => state.folders.find(f => f.id === id);
  const activeNote = () => getNote(state.activeNoteId);

  const codeStub = (lang, code) => `<div class="code-block" data-lang="${lang}" data-code="${esc(code)}"></div>`;

  function seed() {
    const now = Date.now();
    const f1 = { id: uid(), name: 'Getting Started', parentId: null, open: true };
    const f2 = { id: uid(), name: 'Daily Notes', parentId: null, open: true };
    const welcome = {
      id: uid(), folderId: f1.id, title: 'Welcome to your notepad', createdAt: now, updatedAt: now, text: '',
      html: `<h2>How it works</h2>
<ul><li>Use <b>sections</b> (folders) in the sidebar to organise notes by course or topic. Drag notes between sections.</li>
<li>Press <b>Today's note</b> after each video to get a ready-made template.</li>
<li>Select text and use the toolbar to <span style="background-color: rgba(255, 212, 59, 0.45);">highlight</span>, <b>bold</b>, <i>italicise</i> or <span style="color: #ff6b6b;">colour</span> it.</li></ul>
<h2>Code blocks</h2>
<p>Click <b>Code block</b> in the toolbar, or type three backticks followed by a language and press Enter.</p>
${codeStub('javascript', `// Debounce: delay a function until the user stops typing
function debounce(fn, wait = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

const onSearch = debounce(query => console.log("Searching", query), 400);`)}
${codeStub('python', `class Note:
    """A tiny example in Python"""

    def __init__(self, title: str, tags: list[str]):
        self.title = title
        self.tags = tags

    @property
    def summary(self) -> str:
        return f"{self.title} ({len(self.tags)} tags)"`)}
<p><br></p>`,
    };
    return { folders: [f1, f2], notes: [welcome], activeNoteId: welcome.id, selectedFolderId: f1.id, theme: 'dark' };
  }

  /* ---------- dialog ---------- */
  function ask({ title, message = '', value = null, placeholder = '', ok = 'OK', danger = false }) {
    return new Promise(resolve => {
      dlg.innerHTML = `<form method="dialog"><h3>${esc(title)}</h3>${message ? `<p>${esc(message)}</p>` : ''}
        ${value !== null ? `<input name="v" value="${esc(value)}" placeholder="${esc(placeholder)}" autocomplete="off">` : ''}
        <div class="dlg-actions"><button type="submit" value="ok" class="btn ${danger ? 'danger' : 'primary'}">${esc(ok)}</button>
        <button type="button" class="btn ghost" data-cancel>Cancel</button></div></form>`;
      const input = dlg.querySelector('input');
      dlg.querySelector('[data-cancel]').onclick = () => dlg.close('cancel');
      dlg.returnValue = '';
      dlg.addEventListener('close', () => {
        resolve(dlg.returnValue === 'ok' ? (input ? input.value.trim() : true) : null);
      }, { once: true });
      dlg.showModal();
      if (input) { input.focus(); input.select(); }
    });
  }

  /* ---------- sidebar tree ---------- */
  function folderPath(id) {
    const p = [];
    for (let f = getFolder(id); f; f = getFolder(f.parentId)) p.unshift(f.name);
    return p;
  }
  function descendants(id) {
    const ids = [id];
    state.folders.filter(f => f.parentId === id).forEach(c => ids.push(...descendants(c.id)));
    return ids;
  }
  const countNotes = id => state.notes.filter(n => descendants(id).includes(n.folderId)).length;

  const isDue = n => !!n.review && n.review <= Date.now();
  const fmtDay = ms => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const isSealed = n => !!(n.lock && !n._open);
  const noteLabel = n => (isSealed(n) ? `Locked entry \u00b7 ${fmtDay(n.createdAt)}` : n.title || 'Untitled note');
  const inJournal = id => { for (let f = getFolder(id); f; f = getFolder(f.parentId)) if (f.journal) return true; return false; };

  // `sub` is trusted HTML, so callers must escape any text they put in it.
  const noteRow = (n, depth, sub = '') => `
    <div class="row note ${n.id === state.activeNoteId ? 'active' : ''} ${isDue(n) ? 'due' : ''}" data-type="note" data-id="${n.id}" draggable="${!searchEl.value}" style="--d:${depth}">
      <span class="ico">${svg(n.lock ? 'lock' : 'file')}</span>
      <span class="name">${esc(noteLabel(n))}${sub ? `<span class="sub">${sub}</span>` : ''}</span>
      <span class="acts"><button data-act="pin" class="${n.pinned ? 'on' : ''}" title="${n.pinned ? 'Unpin' : 'Pin to top'}">${svg('pin')}</button><button data-act="rename" title="Rename">${svg('edit')}</button><button data-act="delete" title="Move to Trash">${svg('trash')}</button></span>
    </div>`;

  function snippetHtml(text, q) {
    const flat = String(text || '').replace(/\s+/g, ' ');
    const i = flat.toLowerCase().indexOf(q);
    if (i < 0) return '';
    const s = Math.max(0, i - 28), e = Math.min(flat.length, i + q.length + 70);
    return `<span class="snip">${s ? '\u2026' : ''}${esc(flat.slice(s, i))}<mark>${esc(flat.slice(i, i + q.length))}</mark>${esc(flat.slice(i + q.length, e))}${e < flat.length ? '\u2026' : ''}</span>`;
  }

  function folderHtml(parentId, depth) {
    let out = '';
    state.folders.filter(f => f.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name)).forEach(f => {
        const ico = f.emoji ? `<span class="emo">${esc(f.emoji)}</span>` : svg(f.journal ? 'lock' : 'folder');
        out += `<div class="row folder" data-type="folder" data-id="${f.id}" style="--d:${depth}">
          <span class="chev ${f.open ? 'open' : ''}">${svg('chevron')}</span>
          <span class="ico" ${isHex(f.color || '') ? `style="--fc:${f.color}"` : ''}>${ico}</span><span class="name">${esc(f.name)}</span>
          <span class="count">${countNotes(f.id)}</span>
          <span class="acts"><button data-act="add-note" title="New note">${svg('filePlus')}</button>
          <button data-act="add-folder" title="New sub-section">${svg('folderPlus')}</button>
          <button data-act="style" title="Colour and icon">${svg('palette')}</button>
          <button data-act="export" title="Export section">${svg('download')}</button>
          <button data-act="rename" title="Rename">${svg('edit')}</button>
          <button data-act="delete" title="Move to Trash">${svg('trash')}</button></span></div>`;
        if (f.open) out += folderHtml(f.id, depth + 1);
      });
    state.notes.filter(n => n.folderId === parentId)
      .sort((a, b) => b.createdAt - a.createdAt).forEach(n => { out += noteRow(n, depth); });
    return out;
  }

  function renderTree() {
    renderTagCloud();
    const q = searchEl.value.trim().toLowerCase();
    if (q) {
      const byTag = q.startsWith('#'), t = q.slice(1);
      const hits = state.notes.filter(n => byTag
        ? tagsOf(n).some(x => x.includes(t))
        : ((n.title || '') + ' ' + (n.text || '') + ' ' + tagsOf(n).join(' ')).toLowerCase().includes(q));
      tree.innerHTML = hits.length
        ? hits.map(n => noteRow(n, 0, esc([folderPath(n.folderId).join(' / '), ...tagsOf(n).map(x => '#' + x)].filter(Boolean).join('  \u00b7  ')) + (byTag ? '' : snippetHtml(n.text, q)))).join('')
        : '<div class="tree-empty">No notes match your search.</div>';
      return;
    }
    const sec = (label, n) => `<div class="tree-sec">${label}${n ? ` <small>${n}</small>` : ''}</div>`;
    const due = state.notes.filter(isDue).sort((a, b) => a.review - b.review);
    const pinned = state.notes.filter(n => n.pinned).sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    const recent = state.notes.length > 8 ? [...state.notes].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4) : [];
    let top = '';
    if (due.length) top += sec('Due for review', due.length) + due.map(n => noteRow(n, 0, 'Due ' + fmtDay(n.review))).join('');
    if (pinned.length) top += sec('Pinned', pinned.length) + pinned.map(n => noteRow(n, 0)).join('');
    if (recent.length) top += sec('Recent') + recent.map(n => noteRow(n, 0)).join('');
    const body = folderHtml(null, 0);
    tree.innerHTML = (top ? top + sec('Sections') : '') + (body ||
      '<div class="tree-empty">No sections yet. Use the buttons above to add a section or a note.</div>');
  }

  async function addFolder(parentId) {
    const name = await ask({ title: parentId ? 'New sub-section' : 'New section', value: '', placeholder: 'e.g. React Course', ok: 'Create' });
    if (!name) return;
    const f = { id: uid(), name, parentId, open: true };
    state.folders.push(f);
    if (parentId) getFolder(parentId).open = true;
    state.selectedFolderId = f.id;
    persist(); renderTree();
  }

  function newNote({ folderId, title = '', html = '<p><br></p>' } = {}) {
    flushSave();
    if (folderId === undefined) folderId = getNote(state.activeNoteId)?.folderId ?? state.selectedFolderId ?? null;
    if (inJournal(folderId) && !diaryKey) { unlockDiary().then(ok => { if (ok) newNote({ folderId, title, html }); }); return null; }
    for (let f = getFolder(folderId); f; f = getFolder(f.parentId)) f.open = true;
    const n = { id: uid(), folderId, title, html, text: '', createdAt: Date.now(), updatedAt: Date.now() };
    if (inJournal(folderId)) { n.lock = { pending: true }; n._open = true; }
    state.notes.push(n);
    state.selectedFolderId = folderId;
    openNote(n.id);
    if (!title) { titleInput.focus(); }
    return n;
  }

  function dailyNote() {
    let f = state.folders.find(x => x.name === 'Daily Notes' && x.parentId === null);
    if (!f) { f = { id: uid(), name: 'Daily Notes', parentId: null, open: true }; state.folders.push(f); }
    const title = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const existing = state.notes.find(n => n.folderId === f.id && n.title === title);
    if (existing) { f.open = true; return openNote(existing.id); }
    newNote({
      folderId: f.id, title,
      html: `<h2>Video</h2><p><b>Title:</b> </p><p><b>Source / Course:</b> </p>
<h2>Key takeaways</h2><ul><li><br></li></ul>
<h2>Code snippets</h2><p><br></p>
<h2>Questions / To revisit</h2><ul><li><br></li></ul>`,
    });
    editor.focus();
  }

  async function renameItem(type, id) {
    const item = type === 'folder' ? getFolder(id) : getNote(id);
    if (type === 'note' && isSealed(item)) return setStatus('Unlock the diary to rename this entry');
    const val = await ask({ title: type === 'folder' ? 'Rename section' : 'Rename note', value: type === 'folder' ? item.name : item.title, ok: 'Rename' });
    if (val === null || (type === 'folder' && !val)) return;
    if (type === 'folder') item.name = val; else { item.title = val; if (id === state.activeNoteId) titleInput.value = val; }
    persist(); renderTree(); renderCrumbs();
  }

  async function deleteItem(type, id) {
    state.trash = state.trash || [];
    if (type === 'folder') {
      const ids = descendants(id), notes = state.notes.filter(x => ids.includes(x.folderId));
      const folder = getFolder(id);
      const ok = await ask({ title: 'Move section to Trash?', message: `"${folder.name}" and ${notes.length} note(s) inside it will be moved to the Trash. You can restore them for 30 days.`, ok: 'Move to Trash', danger: true });
      if (!ok) return;
      state.trash.push({ id: uid(), type: 'folder', at: Date.now(), name: folder.name, rootId: id, folders: state.folders.filter(f => ids.includes(f.id)), notes: await Promise.all(notes.map(sealedCopy)) });
      state.notes = state.notes.filter(x => !ids.includes(x.folderId));
      state.folders = state.folders.filter(f => !ids.includes(f.id));
      if (ids.includes(state.selectedFolderId)) state.selectedFolderId = null;
    } else {
      const note = getNote(id);
      const ok = await ask({ title: 'Move note to Trash?', message: `"${noteLabel(note)}" will be moved to the Trash. You can restore it for 30 days.`, ok: 'Move to Trash', danger: true });
      if (!ok) return;
      state.trash.push({ id: uid(), type: 'note', at: Date.now(), name: note.lock ? 'Locked entry' : note.title || 'Untitled note', note: await sealedCopy(note) });
      state.notes = state.notes.filter(n => n.id !== id);
    }
    if (!getNote(state.activeNoteId)) { state.activeNoteId = null; }
    persist(); renderTree(); loadActive();
  }

  tree.addEventListener('click', e => {
    const row = e.target.closest('.row');
    if (!row) return;
    const { id, type } = row.dataset;
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (type === 'folder') {
      const f = getFolder(id);
      if (act === 'add-note') { f.open = true; newNote({ folderId: id }); }
      else if (act === 'add-folder') addFolder(id);
      else if (act === 'style') styleFolderDialog(id);
      else if (act === 'export') exportSectionDialog(id);
      else if (act) (act === 'rename' ? renameItem : deleteItem)('folder', id);
      else { f.open = !f.open; state.selectedFolderId = id; persist(); renderTree(); }
    } else if (act === 'pin') { const n = getNote(id); n.pinned = !n.pinned; persist(); renderTree(); }
    else if (act) (act === 'rename' ? renameItem : deleteItem)('note', id);
    else openNote(id);
  });

  tree.addEventListener('dragstart', e => {
    const row = e.target.closest('.row.note');
    if (!row) return;
    dragId = row.dataset.id;
    e.dataTransfer.setData('text/plain', dragId);
    e.dataTransfer.effectAllowed = 'move';
  });
  const clearDrop = () => { tree.classList.remove('drop'); tree.querySelectorAll('.drop').forEach(el => el.classList.remove('drop')); };
  tree.addEventListener('dragover', e => {
    if (!dragId) return;
    e.preventDefault(); clearDrop();
    (e.target.closest('.row.folder') || tree).classList.add('drop');
  });
  tree.addEventListener('dragend', () => { dragId = null; clearDrop(); });
  tree.addEventListener('drop', e => {
    if (!dragId) return;
    e.preventDefault();
    const row = e.target.closest('.row.folder'), n = getNote(dragId);
    if (n) {
      n.folderId = row ? row.dataset.id : null;
      if (row) getFolder(n.folderId).open = true;
      if (inJournal(n.folderId) && !n.lock) lockNote(n);
      persist(); renderCrumbs();
    }
    dragId = null; clearDrop(); renderTree();
  });

  /* ---------- editor: load / save ---------- */
  const emptyP = () => { const p = document.createElement('p'); p.innerHTML = '<br>'; return p; };

  function openNote(id) {
    flushSave();
    state.activeNoteId = id;
    persist(); renderTree(); loadActive();
  }

  function loadActive() {
    const n = activeNote();
    lastRange = null;
    const sealed = !!n && isSealed(n);
    paper.hidden = !n || sealed; emptyEl.hidden = !!n; lockedView.hidden = !sealed;
    if (sealed) { editor.innerHTML = ''; titleInput.value = ''; lockedPw.value = ''; lockedErr.textContent = ''; lockedForgot.hidden = !state.diary?.rec; }
    if (n && !sealed) {
      titleInput.value = n.title || '';
      editor.innerHTML = n.html || '<p><br></p>';
      editor.querySelectorAll('.code-block').forEach(b => b.replaceWith(buildCodeBlock(b.dataset.lang, b.dataset.code || '', { nums: 'nums' in b.dataset, wrap: 'wrap' in b.dataset })));
      refreshNoteLinks();
      if (!editor.children.length) editor.appendChild(emptyP());
      if (editor.lastElementChild.classList.contains('code-block')) editor.appendChild(emptyP());
      requestAnimationFrame(fitAll);
    }
    hideImgTools();
    renderTagChips();
    renderBacklinks();
    renderCrumbs(); renderMeta(); updatePlaceholder(); setStatus('');
    if (!fb.hidden) refind();
  }

  function serialize() {
    const clone = editor.cloneNode(true);
    clone.querySelectorAll('.code-block').forEach(b => {
      const stub = document.createElement('div');
      stub.className = 'code-block'; stub.dataset.lang = b.dataset.lang; stub.dataset.code = b.dataset.code || '';
      if ('nums' in b.dataset) stub.dataset.nums = '';
      if ('wrap' in b.dataset) stub.dataset.wrap = '';
      b.replaceWith(stub);
    });
    return clone.innerHTML;
  }

  function plainText() {
    const clean = t => t.replace(/\u200b/g, '');
    if (!editor.querySelector('.code-block')) return clean(editor.innerText);
    const tmp = editor.cloneNode(true);
    tmp.removeAttribute('id'); tmp.removeAttribute('contenteditable');
    tmp.querySelectorAll('img').forEach(i => i.remove());
    tmp.querySelectorAll('.code-block').forEach(b => {
      const p = document.createElement('p');
      p.textContent = b.dataset.code || '';
      b.replaceWith(p);
    });
    tmp.style.cssText = 'position:fixed;left:-99999px;top:0;width:800px';
    document.body.appendChild(tmp);
    const t = tmp.innerText;
    tmp.remove();
    return clean(t);
  }

  function scheduleSave() { setStatus('Saving...'); clearTimeout(saveTimer); saveTimer = setTimeout(flushSave, 500); }
  function flushSave() {
    clearTimeout(saveTimer); saveTimer = null;
    const n = activeNote();
    if (!n || paper.hidden) return;
    n.title = titleInput.value;
    const html = serialize();
    if (n.html && n.html !== html) autoVersion(n);
    n.html = html;
    n.text = plainText();
    n.updatedAt = Date.now();
    if (persist()) {
      setStatus('\u2713 ' + (api ? 'Saved on this computer' : 'Saved') + (bigWarn ? ' \u00b7 ' + bigWarn : ''));
      bigWarn = '';
    }
    renderMeta(); renderCrumbs();
    const q = searchEl.value;
    if (!q) renderTree();
  }

  function setStatus(t) {
    statusEl.textContent = t;
    statusEl.classList.toggle('ok', t.startsWith('\u2713'));
    statusEl.classList.toggle('saving', t === 'Saving...');
  }
  function renderCrumbs() {
    const n = activeNote();
    crumbs.innerHTML = n ? [...folderPath(n.folderId).map(esc), `<b>${n.lock ? svg('lock') + ' ' : ''}${esc(noteLabel(n))}</b>`].join(' &nbsp;/&nbsp; ') : '';
    updateLockBtn();
  }
  function renderMeta() {
    const n = activeNote();
    if (!n) return;
    const words = (n.text || '').trim().split(/\s+/).filter(Boolean).length;
    const when = new Date(n.updatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const goal = n.goal || 0;
    metaEl.innerHTML = `Last edited ${esc(when)} &nbsp;\u00b7&nbsp; <button type="button" class="meta-btn" id="goalBtn" title="Set a word-count goal">${words}${goal ? ' / ' + goal : ''} words</button>`
      + (goal ? `<span class="goal-bar"><i class="${words >= goal ? 'done' : ''}" style="width:${Math.min(100, Math.round(words / goal * 100))}%"></i></span>` : '');
  }
  function updatePlaceholder() {
    const empty = editor.textContent.trim() === '' && !editor.querySelector('.code-block, hr, li, img');
    editor.classList.toggle('is-empty', empty);
  }

  titleInput.addEventListener('input', () => {
    const n = activeNote();
    if (n) { n.title = titleInput.value; renderTree(); renderCrumbs(); scheduleSave(); }
  });
  titleInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); editor.focus(); } });

  /* ---------- code blocks ---------- */
  function buildCodeBlock(lang, code, opts = {}) {
    lang = Highlighter.normalize(lang) || 'text';
    const b = document.createElement('div');
    b.className = 'code-block'; b.contentEditable = 'false'; b.dataset.lang = lang; b.dataset.code = code;
    if (opts.nums) b.dataset.nums = '';
    if (opts.wrap) b.dataset.wrap = '';
    b.innerHTML = `<div class="cb-head"><span class="dots"><i></i><i></i><i></i></span>
      <select class="cb-lang" title="Language">${langOptions}</select><span class="cb-spacer"></span>
      <button type="button" class="cb-btn ${opts.nums ? 'on' : ''}" data-cb="nums" title="Line numbers"><span>Lines</span></button>
      <button type="button" class="cb-btn ${opts.wrap ? 'on' : ''}" data-cb="wrap" title="Wrap long lines"><span>Wrap</span></button>
      <button type="button" class="cb-btn" data-cb="copy">${svg('copy')}<span>Copy</span></button>
      <button type="button" class="cb-btn" data-cb="del" title="Remove code block">${svg('x')}</button></div>
      <div class="cb-body"><div class="cb-gut"></div><div class="cb-wrap"><pre class="cb-pre"><code></code></pre>
      <textarea class="cb-ta" spellcheck="false" wrap="off" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea></div></div>`;
    b.querySelector('.cb-lang').value = lang;
    b.querySelector('.cb-ta').value = code;
    renderBlock(b);
    return b;
  }
  function renderBlock(b) {
    const code = b.querySelector('.cb-ta').value;
    b.querySelector('.cb-pre code').innerHTML =
      Highlighter.highlight(code, b.dataset.lang) + (code === '' || code.endsWith('\n') ? ' ' : '');
    b.querySelector('.cb-gut').dataset.n = Array.from({ length: code.split('\n').length }, (_, i) => i + 1).join('\n');
    fitBlock(b);
  }
  function fitBlock(b) {
    const pre = b.querySelector('.cb-pre'), ta = b.querySelector('.cb-ta'), wrap = b.querySelector('.cb-wrap');
    ta.style.height = pre.offsetHeight + 'px';
    ta.style.width = Math.max(wrap.clientWidth, pre.offsetWidth) + 'px';
  }
  const fitAll = () => { editor.querySelectorAll('.code-block').forEach(fitBlock); positionImgTools(); };
  window.addEventListener('resize', fitAll);
  if (document.fonts?.ready) document.fonts.ready.then(fitAll);

  function insertCodeBlock(lang = lastLang, code = '') {
    restore();
    const sel = getSelection();
    let range;
    if (sel.rangeCount && editor.contains(sel.anchorNode)) range = sel.getRangeAt(0);
    else { range = document.createRange(); range.selectNodeContents(editor); range.collapse(false); }
    const selected = range.toString();
    let top = range.startContainer;
    if (top === editor) top = editor.childNodes[range.startOffset] || editor.lastChild;
    while (top && top.parentNode !== editor) top = top.parentNode;
    if (selected) range.deleteContents();
    const block = buildCodeBlock(lang, selected || code);
    if (!top) editor.appendChild(block);
    else if (top.nodeType === 1 && top.textContent.trim() === '' && !top.querySelector('.code-block')) top.before(block);
    else top.after(block);
    ensureTrailing(block);
    block.querySelector('.cb-ta').focus();
    fitBlock(block); afterEdit();
  }
  const ensureTrailing = b => { if (!b.nextElementSibling) b.after(emptyP()); };

  function moveOut(b, dir) {
    let sib = dir > 0 ? b.nextElementSibling : b.previousElementSibling;
    if (!sib || sib.classList.contains('code-block')) { sib = emptyP(); dir > 0 ? b.after(sib) : b.before(sib); }
    const r = document.createRange();
    r.selectNodeContents(sib); r.collapse(dir > 0);
    editor.focus();
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  function insertTextInTa(ta, t) {
    ta.focus();
    if (!document.execCommand('insertText', false, t)) {
      ta.setRangeText(t, ta.selectionStart, ta.selectionEnd, 'end');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function codeKeys(e, ta) {
    const b = ta.closest('.code-block');
    if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); insertTextInTa(ta, '  '); }
    else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      const line = ta.value.slice(0, ta.selectionStart).split('\n').pop();
      insertTextInTa(ta, '\n' + line.match(/^\s*/)[0] + (/[{(\[:]\s*$/.test(line) ? '  ' : ''));
    }
    else if (e.key === 'Escape') moveOut(b, 1);
    else if (e.key === 'ArrowDown' && !e.shiftKey && ta.selectionStart === ta.selectionEnd && !ta.value.slice(ta.selectionEnd).includes('\n')) { e.preventDefault(); moveOut(b, 1); }
    else if (e.key === 'ArrowUp' && !e.shiftKey && ta.selectionStart === ta.selectionEnd && !ta.value.slice(0, ta.selectionStart).includes('\n')) { e.preventDefault(); moveOut(b, -1); }
  }

  function fenceToBlock(e) {
    const s = getSelection();
    if (!s.rangeCount || !s.isCollapsed) return;
    let n = s.anchorNode;
    while (n && n.parentNode !== editor) n = n.parentNode;
    if (!n || n.nodeType !== 1) return;
    const m = n.textContent.trim().match(/^```(\w*)$/);
    if (!m) return;
    e.preventDefault();
    const block = buildCodeBlock(Highlighter.normalize(m[1]) || lastLang, '');
    n.replaceWith(block);
    ensureTrailing(block);
    block.querySelector('.cb-ta').focus();
    fitBlock(block); afterEdit();
  }

  editor.addEventListener('keydown', e => {
    const ta = e.target.closest?.('.cb-ta');
    if (ta) return codeKeys(e, ta);
    if (!slash.hidden && slashKeys(e)) return;
    if (selImg && !['Shift', 'Control', 'Meta', 'Alt'].includes(e.key)) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        selImg.remove(); hideImgTools();
        if (!editor.children.length) editor.appendChild(emptyP());
        afterEdit();
        return;
      }
      hideImgTools();
    }
    if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && cellTab(e)) return;
    if (e.key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey && mdShortcut(e)) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      fenceToBlock(e);
      if (!e.defaultPrevented) mdDivider(e);
      if (!e.defaultPrevented) todoEnterFix();
    }
  });

  editor.addEventListener('input', e => {
    const ta = e.target.closest?.('.cb-ta');
    if (ta) { const b = ta.closest('.code-block'); b.dataset.code = ta.value; renderBlock(b); }
    else {
      bubble.hidden = true;
      if (e.inputType === 'insertText' || e.inputType === 'deleteContentBackward') slashCheck(); else closeSlash();
      if (e.inputType === 'insertText' && (e.data === '*' || e.data === '`')) mdInline();
    }
    afterEdit();
    if (!fb.hidden) { clearTimeout(findTimer); findTimer = setTimeout(() => refind(true), 200); }
  });

  editor.addEventListener('change', e => {
    const sel = e.target.closest?.('.cb-lang');
    if (!sel) return;
    const b = sel.closest('.code-block');
    b.dataset.lang = lastLang = sel.value;
    renderBlock(b); afterEdit();
  });

  editor.addEventListener('click', e => {
    const nl = e.target.closest('a.note-link');
    if (nl) {
      e.preventDefault();
      const target = getNote(nl.dataset.note);
      if (target) revealNote(target); else setStatus('That note no longer exists');
      return;
    }
    const todo = e.target.closest('ul.todo > li');
    if (todo && e.target === todo && e.clientX < todo.getBoundingClientRect().left) {
      e.preventDefault();
      todo.toggleAttribute('data-done');
      afterEdit();
      return;
    }
    if (e.target.tagName === 'IMG') {
      selectImage(e.target);
      if (e.detail === 2) editImage();
      return;
    }
    const btn = e.target.closest('[data-cb]');
    if (btn) {
      const b = btn.closest('.code-block');
      if (btn.dataset.cb === 'copy') {
        navigator.clipboard?.writeText(b.dataset.code || '').then(() => {
          const label = btn.querySelector('span'); label.textContent = 'Copied!';
          setTimeout(() => { label.textContent = 'Copy'; }, 1200);
        });
      } else if (btn.dataset.cb === 'nums' || btn.dataset.cb === 'wrap') {
        btn.classList.toggle('on', b.toggleAttribute('data-' + btn.dataset.cb));
        fitBlock(b); afterEdit();
      } else { b.remove(); if (!editor.children.length) editor.appendChild(emptyP()); afterEdit(); }
      return;
    }
    const a = e.target.closest('a');
    if (a && (e.ctrlKey || e.metaKey)) window.open(a.href, '_blank', 'noopener');
  });

  editor.addEventListener('paste', e => {
    if (e.target.closest?.('.cb-ta')) return;
    e.preventDefault();
    const imgs = [...(e.clipboardData.files || [])].filter(f => f.type.startsWith('image/'));
    if (imgs.length) return insertImages(imgs);
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  });

  editor.addEventListener('dragover', e => { if (e.dataTransfer?.types.includes('Files')) e.preventDefault(); });
  editor.addEventListener('drop', e => {
    const imgs = [...(e.dataTransfer?.files || [])].filter(f => f.type.startsWith('image/'));
    if (!imgs.length) return;
    e.preventDefault();
    const pos = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    const host = pos && (pos.startContainer.nodeType === 1 ? pos.startContainer : pos.startContainer.parentElement);
    if (host && editor.contains(host) && !host.closest('.code-block')) lastRange = pos;
    insertImages(imgs);
  });

  /* ---------- formatting toolbar ---------- */
  function restore() {
    editor.focus();
    if (lastRange) { const s = getSelection(); s.removeAllRanges(); s.addRange(lastRange); }
  }
  function afterEdit() { scheduleSave(); updateToolbarState(); updatePlaceholder(); }
  function exec(cmd, val = null) { restore(); document.execCommand(cmd, false, val); afterEdit(); }

  document.addEventListener('selectionchange', () => {
    const s = getSelection();
    if (s.rangeCount && editor.contains(s.anchorNode) && !s.anchorNode.parentElement?.closest('.code-block')) {
      lastRange = s.getRangeAt(0).cloneRange();
      updateToolbarState();
    }
  });

  function updateToolbarState() {
    ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter', 'justifyRight'].forEach(c => {
      const btn = toolbar.querySelector(`[data-cmd="${c}"]`);
      let on = false;
      try { on = document.queryCommandState(c); } catch { /* ignore */ }
      btn?.classList.toggle('active', on);
    });
    let fb = '';
    try { fb = document.queryCommandValue('formatBlock').toLowerCase(); } catch { /* ignore */ }
    blockSel.value = ['h1', 'h2', 'h3', 'blockquote'].includes(fb) ? fb : 'p';
  }

  // Toolbar buttons must not steal focus from the editor.
  toolbar.addEventListener('mousedown', e => { if (!e.target.closest('select')) e.preventDefault(); });
  blockSel.addEventListener('change', () => exec('formatBlock', `<${blockSel.value}>`));

  toolbar.addEventListener('click', e => {
    const btn = e.target.closest('.tb');
    if (!btn) return;
    if (btn.dataset.cmd) return exec(btn.dataset.cmd);
    switch (btn.dataset.tool) {
      case 'insert': toggleInsert(btn); break;
      case 'checklist': toggleChecklist(); break;
      case 'code-block': insertCodeBlock(); break;
      case 'inline-code': inlineCode(); break;
      case 'link': addLink(); break;
      case 'image': fileImg.click(); break;
      case 'chart': chartDialog(); break;
      case 'draw': drawDialog(); break;
      case 'find': openFind(false); break;
      case 'export': toggleExport(btn); break;
      case 'color': togglePalette(btn, 'Text colour', TEXT_COLORS, 'foreColor', $('#barColor')); break;
      case 'highlight': togglePalette(btn, 'Highlight', HL_COLORS, 'hiliteColor', $('#barHl')); break;
    }
  });

  function inlineCode() {
    restore();
    const s = getSelection();
    if (!s.rangeCount) return;
    const el = s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement;
    const existing = el.closest('code');
    if (existing && editor.contains(existing)) existing.replaceWith(document.createTextNode(existing.textContent));
    else if (!s.isCollapsed) document.execCommand('insertHTML', false, `<code>${Highlighter.escape(s.toString())}</code>`);
    afterEdit();
  }

  async function addLink() {
    const saved = lastRange;
    const url = await ask({ title: 'Insert link', value: 'https://', placeholder: 'https://example.com', ok: 'Insert' });
    lastRange = saved;
    if (!url || url === 'https://') return;
    const safe = /^(https?:|mailto:)/i.test(url) ? url : 'https://' + url.replace(/^[a-z][a-z0-9+.-]*:/i, '');
    restore();
    const s = getSelection();
    if (s.isCollapsed) document.execCommand('insertHTML', false, `<a href="${esc(safe)}">${esc(safe)}</a>`);
    else document.execCommand('createLink', false, safe);
    afterEdit();
  }

  function clearMarker(prop) {
    editor.querySelectorAll('span, font').forEach(s => {
      if (s.style[prop] === MARK) {
        s.style.removeProperty(prop === 'backgroundColor' ? 'background-color' : prop);
        if (!s.getAttribute('style')) s.replaceWith(...s.childNodes);
      }
    });
  }

  function togglePalette(btn, title, colors, cmd, bar) {
    if (!pop.hidden && pop.dataset.cmd === cmd) { pop.hidden = true; return; }
    pop.dataset.cmd = cmd;
    pop.innerHTML = `<h4>${title}</h4><div class="swatches">${colors.map(c =>
      `<button class="sw" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('')}
      <button class="sw reset" data-c="" title="Remove">${svg('x')}</button></div>`;
    const r = btn.getBoundingClientRect();
    pop.hidden = false;
    pop.style.left = Math.min(r.left, innerWidth - 230) + 'px';
    pop.style.top = r.bottom + 6 + 'px';
    pop.onmousedown = ev => ev.preventDefault();
    pop.onclick = ev => {
      const sw = ev.target.closest('.sw');
      if (!sw) return;
      const c = sw.dataset.c;
      if (c) { exec(cmd, c); bar.style.background = c; }
      else { exec(cmd, MARK); clearMarker(cmd === 'foreColor' ? 'color' : 'backgroundColor'); afterEdit(); }
      pop.hidden = true;
    };
  }
  document.addEventListener('mousedown', e => {
    if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('[data-tool="color"], [data-tool="highlight"], [data-tool="export"], [data-tool="insert"], #btnLock')) pop.hidden = true;
  });

  /* ---------- images ---------- */
  const imgTools = $('#imgTools'), fileImg = $('#fileImg');
  const MAX_IMG = 1600;
  let selImg = null;

  function readImage(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = reject;
      fr.onload = () => {
        const im = new Image();
        im.onerror = reject;
        im.onload = () => {
          let src = fr.result, w = im.naturalWidth;
          if (w > MAX_IMG && !/svg|gif/.test(file.type)) {
            const c = document.createElement('canvas');
            c.width = MAX_IMG; c.height = Math.round(im.naturalHeight * MAX_IMG / w);
            c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
            src = c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.9);
            w = MAX_IMG;
          }
          resolve({ src, w });
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  async function insertImages(files) {
    if (paper.hidden) return;
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      try {
        const { src, w } = await readImage(f);
        placeImage(src, w);
      } catch { setStatus('Could not add that image'); }
    }
  }

  // With a target, the existing image is updated in place and keeps its size.
  function placeImage(src, w, attrs = {}, target = null) {
    let img = target?.isConnected ? target : null;
    if (img) img.src = src;
    else {
      restore();
      const width = Math.min(w || 400, 520, editor.clientWidth);
      document.execCommand('insertHTML', false, `<img id="newImg" src="${src}" style="width: ${width}px;">`);
      img = editor.querySelector('#newImg');
      if (!img) return;
      img.removeAttribute('id');
    }
    Object.entries(attrs).forEach(([k, v]) => img.setAttribute(k, v));
    if (src.length > 1.2e6) bigWarn = `large image (~${(src.length / 1048576).toFixed(1)} MB) may slow saving and Drive sync`;
    selectImage(img);
    afterEdit();
  }

  function selectImage(img) {
    selImg = img; imgTools.hidden = false;
    $('#imgEdit').hidden = !(img.dataset.chart || img.dataset.draw);
    positionImgTools();
  }
  function hideImgTools() { selImg = null; imgTools.hidden = true; }
  function positionImgTools() {
    if (!selImg) return;
    if (!selImg.isConnected) return hideImgTools();
    const pr = paper.getBoundingClientRect(), r = selImg.getBoundingClientRect();
    Object.assign(imgTools.style, {
      left: r.left - pr.left - paper.clientLeft + 'px', top: r.top - pr.top - paper.clientTop + 'px',
      width: r.width + 'px', height: r.height + 'px',
    });
    $('#imgDim').textContent = Math.round(r.width) + ' px';
  }

  imgTools.addEventListener('mousedown', e => e.preventDefault());
  imgTools.addEventListener('click', e => {
    const b = e.target.closest('[data-size], [data-img]');
    if (!b || !selImg) return;
    if (b.dataset.img === 'edit') return editImage();
    if (b.dataset.size) {
      selImg.style.width = Math.round(editor.clientWidth * b.dataset.size / 100) + 'px';
      positionImgTools();
    } else {
      selImg.remove(); hideImgTools();
      if (!editor.children.length) editor.appendChild(emptyP());
    }
    afterEdit();
  });
  imgTools.addEventListener('pointerdown', e => {
    const h = e.target.closest('.img-h');
    if (!h || !selImg) return;
    e.preventDefault();
    h.setPointerCapture(e.pointerId);
    const startX = e.clientX, startW = selImg.getBoundingClientRect().width, dir = h.dataset.h.includes('w') ? -1 : 1;
    const move = ev => {
      selImg.style.width = Math.round(clamp(startW + dir * (ev.clientX - startX), 40, editor.clientWidth)) + 'px';
      positionImgTools();
    };
    const up = () => {
      h.removeEventListener('pointermove', move);
      h.removeEventListener('pointerup', up);
      h.removeEventListener('pointercancel', up);
      afterEdit();
    };
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerup', up);
    h.addEventListener('pointercancel', up);
  });
  document.addEventListener('mousedown', e => {
    if (selImg && e.target.tagName !== 'IMG' && !e.target.closest('#imgTools')) hideImgTools();
  });
  fileImg.onchange = e => {
    const files = [...e.target.files];
    e.target.value = '';
    insertImages(files);
  };

  /* ---------- drag images / charts to a new position ---------- */
  let dropMark = null;
  function dropPoint(x, y) {
    let r = document.caretRangeFromPoint?.(x, y);
    if (!r && document.caretPositionFromPoint) {
      const p = document.caretPositionFromPoint(x, y);
      if (p) { r = document.createRange(); r.setStart(p.offsetNode, p.offset); }
    }
    if (!r || !editor.contains(r.startContainer)) return null;
    const host = r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement;
    const block = host?.closest('.code-block');
    if (block) r.setStartAfter(block);
    r.collapse(true);
    return r;
  }
  function showDropMark(r) {
    if (!dropMark) { dropMark = document.createElement('div'); dropMark.className = 'drop-mark'; document.body.appendChild(dropMark); }
    if (!r) { dropMark.hidden = true; return; }
    let rect = r.getClientRects()[0] || r.getBoundingClientRect();
    if (!rect.height) {
      const el = r.startContainer.nodeType === 1 ? r.startContainer.childNodes[r.startOffset] || r.startContainer : r.startContainer.parentElement;
      rect = el.getBoundingClientRect();
    }
    dropMark.hidden = false;
    Object.assign(dropMark.style, { left: rect.left + 'px', top: rect.top + 'px', height: Math.max(rect.height, 18) + 'px' });
  }

  function moveImage(img, target) {
    if (img.contains(target.startContainer)) return;
    const html = img.outerHTML.replace(/^<img/i, '<img id="newImg"');
    const s = getSelection();
    editor.focus();
    const del = document.createRange();
    del.selectNode(img);
    s.removeAllRanges(); s.addRange(del);
    document.execCommand('delete');
    s.removeAllRanges(); s.addRange(target);
    document.execCommand('insertHTML', false, html);
    const moved = editor.querySelector('#newImg');
    if (!moved) { document.execCommand('undo'); return; }
    moved.removeAttribute('id');
    selectImage(moved);
    afterEdit();
  }

  editor.addEventListener('dragstart', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });
  editor.addEventListener('pointerdown', e => {
    const img = e.target;
    if (img.tagName !== 'IMG' || e.button !== 0) return;
    const sx = e.clientX, sy = e.clientY, scroller = $('#scroll');
    let ghost = null;
    const move = ev => {
      if (!ghost) {
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
        hideImgTools();
        ghost = img.cloneNode();
        ghost.className = 'drag-ghost';
        ghost.style.width = Math.min(img.getBoundingClientRect().width, 260) + 'px';
        document.body.append(ghost);
        document.body.classList.add('img-dragging');
        img.classList.add('dragging');
      }
      ghost.style.left = ev.clientX + 14 + 'px';
      ghost.style.top = ev.clientY + 14 + 'px';
      const sr = scroller.getBoundingClientRect();
      if (ev.clientY < sr.top + 40) scroller.scrollTop -= 14;
      else if (ev.clientY > sr.bottom - 40) scroller.scrollTop += 14;
      showDropMark(dropPoint(ev.clientX, ev.clientY));
    };
    const end = ev => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
      document.removeEventListener('pointercancel', end);
      if (!ghost) return;
      const pos = ev.type === 'pointerup' ? dropPoint(ev.clientX, ev.clientY) : null;
      ghost.remove(); ghost = null;
      if (dropMark) dropMark.hidden = true;
      document.body.classList.remove('img-dragging');
      img.classList.remove('dragging');
      if (pos) moveImage(img, pos); else selectImage(img);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', end);
  });

  /* ---------- drawing & charts (inserted as editable images) ---------- */
  function openPanel(html, cls = 'wide') {
    dlg.className = 'dlg ' + cls;
    dlg.innerHTML = `<form>${html}</form>`;
    dlg.querySelector('form').addEventListener('submit', e => e.preventDefault());
    dlg.addEventListener('close', () => { dlg.className = 'dlg'; dlg.onclick = null; dlg.oninput = null; dlg.onchange = null; }, { once: true });
    dlg.returnValue = '';
    dlg.showModal();
  }

  function editImage() {
    const img = selImg;
    if (!img) return;
    if (img.dataset.chart) {
      let cfg = null;
      try { cfg = JSON.parse(img.dataset.chart); } catch { /* fall back to a blank chart */ }
      chartDialog(cfg, img);
    } else if (img.dataset.draw) drawDialog(img.src, img);
  }

  const DRAW_COLORS = ['#111111', '#e03131', '#f08c00', '#2f9e44', '#1971c2', '#7048e8', '#e64980', '#868e96'];

  function drawDialog(existingSrc = null, target = null) {
    if (paper.hidden) return;
    const W = 900, H = 480;
    openPanel(`<h3>${target ? 'Edit drawing' : 'Freehand drawing'}</h3>
      <div class="draw-tools">
        <button type="button" class="btn small on" data-mode="pen">Pen</button>
        <button type="button" class="btn small" data-mode="eraser">Eraser</button>
        <span class="dt-colors">${DRAW_COLORS.map((c, i) => `<button type="button" class="sw ${i ? '' : 'on'}" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('')}</span>
        <label class="dt-size">Size <input type="range" min="1" max="30" value="4"></label>
        <button type="button" class="btn small" data-act="undo">Undo</button>
        <button type="button" class="btn small" data-act="clear">Clear</button>
      </div>
      <canvas class="draw-canvas" width="${W}" height="${H}"></canvas>
      <div class="dlg-row end"><button type="button" class="btn ghost" data-act="cancel">Cancel</button>
      <button type="button" class="btn primary" data-act="ok">${target ? 'Update' : 'Insert'} drawing</button></div>`);

    const cv = dlg.querySelector('.draw-canvas'), ctx = cv.getContext('2d');
    const blank = () => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); };
    blank();
    if (existingSrc) {
      const im = new Image();
      im.onload = () => ctx.drawImage(im, 0, 0, W, H);
      im.src = existingSrc;
    }
    ctx.lineCap = ctx.lineJoin = 'round';
    let mode = 'pen', color = DRAW_COLORS[0], size = 4, drawing = false, last = null, result = '';
    const undo = [];
    const snapshot = () => { undo.push(ctx.getImageData(0, 0, W, H)); if (undo.length > 30) undo.shift(); };
    const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
    const stroke = (a, b) => {
      ctx.strokeStyle = mode === 'eraser' ? '#fff' : color;
      ctx.lineWidth = mode === 'eraser' ? size * 3 : size;
      ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
    };
    cv.addEventListener('pointerdown', e => {
      e.preventDefault(); cv.setPointerCapture(e.pointerId);
      snapshot(); drawing = true; last = pt(e); stroke(last, last);
    });
    cv.addEventListener('pointermove', e => { if (drawing) { const p = pt(e); stroke(last, p); last = p; } });
    const end = () => { drawing = false; };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    dlg.querySelector('input[type="range"]').oninput = e => { size = +e.target.value; };

    dlg.onclick = e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.mode) {
        mode = b.dataset.mode;
        dlg.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('on', x === b));
      } else if (b.dataset.c) {
        color = b.dataset.c; mode = 'pen';
        dlg.querySelectorAll('[data-c]').forEach(x => x.classList.toggle('on', x === b));
        dlg.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('on', x.dataset.mode === 'pen'));
      } else if (b.dataset.act === 'undo') { const s = undo.pop(); if (s) ctx.putImageData(s, 0, 0); }
      else if (b.dataset.act === 'clear') { snapshot(); blank(); }
      else if (b.dataset.act === 'cancel') dlg.close('');
      else if (b.dataset.act === 'ok') { result = cv.toDataURL('image/png'); dlg.close('ok'); }
    };
    dlg.addEventListener('close', () => {
      if (dlg.returnValue === 'ok') placeImage(result, W, { 'data-draw': '1' }, target);
    }, { once: true });
  }

  const CHART_COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac'];
  const CHART_FONT = '"Segoe UI", Arial, sans-serif';
  const CHART_SAMPLE = 'Month, 2023, 2024\nJan, 12, 18\nFeb, 19, 22\nMar, 7, 15\nApr, 14, 20';

  function parseChart(text) {
    const isNum = s => s !== undefined && s !== '' && isFinite(Number(s));
    const rows = text.split(/\r?\n/).map(l => l.split(/[,\t;]/).map(s => s.trim())).filter(r => r.some(Boolean));
    const header = rows.length && rows[0].length > 1 && rows[0].slice(1).some(c => !isNum(c)) ? rows.shift() : null;
    const body = rows.filter(r => r.length > 1);
    if (!body.length) return null;
    const n = Math.max(...body.map(r => r.length - 1));
    return {
      cats: body.map(r => r[0]),
      series: Array.from({ length: n }, (_, s) => ({
        name: header?.[s + 1] || (n > 1 ? `Series ${s + 1}` : ''),
        vals: body.map(r => (isNum(r[s + 1]) ? Number(r[s + 1]) : 0)),
      })),
    };
  }

  const niceStep = raw => {
    const p = 10 ** Math.floor(Math.log10(raw)), f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
  };
  const fmtNum = v => String(Number(v.toPrecision(6)));
  const fitText = (ctx, s, maxW) => {
    if (ctx.measureText(s).width <= maxW) return s;
    while (s.length > 1 && ctx.measureText(s + '\u2026').width > maxW) s = s.slice(0, -1);
    return s + '\u2026';
  };

  function drawChart(cv, { type, title, text }) {
    const ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    let top = 20;
    if (title) { ctx.fillStyle = '#222'; ctx.font = `bold 22px ${CHART_FONT}`; ctx.fillText(title, W / 2, 36); top = 56; }
    const d = parseChart(text);
    if (!d) {
      ctx.fillStyle = '#888'; ctx.font = `16px ${CHART_FONT}`;
      ctx.fillText('Enter rows as "label, value"', W / 2, H / 2);
      return;
    }
    if (type === 'pie') drawPie(ctx, d, W, H, top); else drawAxesChart(ctx, d, type, W, H, top);
  }

  function drawPie(ctx, d, W, H, top) {
    const vals = d.series[0].vals.map(v => Math.max(0, v)), total = vals.reduce((a, b) => a + b, 0);
    if (!total) { ctx.fillStyle = '#888'; ctx.font = `16px ${CHART_FONT}`; ctx.fillText('Values must be positive', W / 2, H / 2); return; }
    const cx = W * 0.34, cy = top + (H - top) / 2, r = Math.min(W * 0.3, (H - top) / 2 - 16);
    let a = -Math.PI / 2;
    vals.forEach((v, i) => {
      const sweep = v / total * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a, a + sweep); ctx.closePath();
      ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length]; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      if (v / total > 0.05) {
        const m = a + sweep / 2;
        ctx.fillStyle = '#fff'; ctx.font = `bold 14px ${CHART_FONT}`; ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(v / total * 100) + '%', cx + Math.cos(m) * r * 0.65, cy + Math.sin(m) * r * 0.65);
        ctx.textBaseline = 'alphabetic';
      }
      a += sweep;
    });
    ctx.textAlign = 'left'; ctx.font = `14px ${CHART_FONT}`;
    const lx = W * 0.34 + r + 50, rowH = 24, ly = Math.max(top + 10, cy - d.cats.length * rowH / 2);
    d.cats.forEach((c, i) => {
      const y = ly + i * rowH;
      if (y > H - 10) return;
      ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length]; ctx.fillRect(lx, y - 11, 14, 14);
      ctx.fillStyle = '#333'; ctx.fillText(fitText(ctx, `${c} (${fmtNum(d.series[0].vals[i])})`, W - lx - 30), lx + 22, y);
    });
  }

  function drawAxesChart(ctx, d, type, W, H, top) {
    const multi = d.series.length > 1;
    const x0 = 64, x1 = W - 24, yTop = top + (multi ? 34 : 10), yBot = H - 48;
    const all = d.series.flatMap(s => s.vals);
    let lo = Math.min(0, ...all), hi = Math.max(0, ...all);
    if (hi === lo) hi = lo + 1;
    const step = niceStep((hi - lo) / 5);
    lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step;
    const y = v => yBot - (v - lo) / (hi - lo) * (yBot - yTop);

    ctx.font = `13px ${CHART_FONT}`; ctx.textAlign = 'right';
    for (let v = lo; v <= hi + step / 2; v += step) {
      ctx.strokeStyle = '#e3e5ea'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y(v)); ctx.lineTo(x1, y(v)); ctx.stroke();
      ctx.fillStyle = '#666'; ctx.fillText(fmtNum(v), x0 - 8, y(v) + 4);
    }
    ctx.strokeStyle = '#888'; ctx.beginPath(); ctx.moveTo(x0, y(0)); ctx.lineTo(x1, y(0)); ctx.stroke();

    const n = d.cats.length, slot = (x1 - x0) / n, ns = d.series.length;
    ctx.textAlign = 'center';
    d.cats.forEach((c, i) => { ctx.fillStyle = '#333'; ctx.fillText(fitText(ctx, c, slot - 6), x0 + slot * (i + 0.5), yBot + 22); });

    const showVals = n * ns <= 12;
    d.series.forEach((s, si) => {
      const color = CHART_COLORS[si % CHART_COLORS.length];
      ctx.fillStyle = color; ctx.strokeStyle = color;
      if (type === 'line') {
        ctx.lineWidth = 3; ctx.beginPath();
        s.vals.forEach((v, i) => { const px = x0 + slot * (i + 0.5); i ? ctx.lineTo(px, y(v)) : ctx.moveTo(px, y(v)); });
        ctx.stroke();
      }
      s.vals.forEach((v, i) => {
        if (type === 'line') {
          const px = x0 + slot * (i + 0.5);
          ctx.beginPath(); ctx.arc(px, y(v), 4.5, 0, Math.PI * 2); ctx.fill();
          if (showVals) { ctx.fillStyle = '#333'; ctx.fillText(fmtNum(v), px, y(v) - 10); ctx.fillStyle = color; }
        } else {
          const gw = slot * 0.72, bw = gw / ns, bx = x0 + slot * i + (slot - gw) / 2 + si * bw;
          ctx.fillRect(bx, y(v), bw - 2, y(0) - y(v));
          if (showVals) { ctx.fillStyle = '#333'; ctx.fillText(fmtNum(v), bx + bw / 2, v >= 0 ? y(v) - 5 : y(v) + 15); ctx.fillStyle = color; }
        }
      });
    });

    if (multi) {
      ctx.font = `14px ${CHART_FONT}`; ctx.textAlign = 'left';
      const widths = d.series.map(s => ctx.measureText(s.name).width + 36);
      let lx = (W - widths.reduce((a, b) => a + b, 0)) / 2;
      d.series.forEach((s, i) => {
        ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length]; ctx.fillRect(lx, top + 6, 14, 14);
        ctx.fillStyle = '#333'; ctx.fillText(s.name, lx + 20, top + 18);
        lx += widths[i];
      });
    }
  }

  function chartDialog(cfg = null, target = null) {
    if (paper.hidden) return;
    cfg = { type: 'bar', title: '', text: CHART_SAMPLE, ...cfg };
    openPanel(`<h3>${target ? 'Edit chart' : 'Insert chart'}</h3>
      <div class="chart-grid">
        <div class="chart-form">
          <select id="chType" class="tb-select"><option value="bar">Bar chart</option><option value="line">Line chart</option><option value="pie">Pie chart</option></select>
          <input id="chTitle" placeholder="Chart title (optional)" autocomplete="off">
          <textarea id="chData" rows="10" spellcheck="false"></textarea>
          <p>One row per line: label, value. Add more value columns for extra series, and start with a row of names to label them. Pie charts use the first series.</p>
        </div>
        <canvas class="chart-prev" width="800" height="450"></canvas>
      </div>
      <div class="dlg-row end"><button type="button" class="btn ghost" data-act="cancel">Cancel</button>
      <button type="button" class="btn primary" data-act="ok">${target ? 'Update' : 'Insert'} chart</button></div>`);

    const type = dlg.querySelector('#chType'), title = dlg.querySelector('#chTitle'), data = dlg.querySelector('#chData');
    const cv = dlg.querySelector('.chart-prev');
    type.value = cfg.type; title.value = cfg.title; data.value = cfg.text;
    const read = () => ({ type: type.value, title: title.value.trim(), text: data.value });
    const redraw = () => drawChart(cv, read());
    [type, title, data].forEach(el => el.addEventListener('input', redraw));
    redraw();

    let result = null;
    dlg.onclick = e => {
      const act = e.target.closest('button')?.dataset.act;
      if (act === 'cancel') dlg.close('');
      else if (act === 'ok') {
        if (!parseChart(data.value)) { data.focus(); return; }
        result = { cfg: read(), src: cv.toDataURL('image/png') };
        dlg.close('ok');
      }
    };
    dlg.addEventListener('close', () => {
      if (dlg.returnValue === 'ok') placeImage(result.src, cv.width, { 'data-chart': JSON.stringify(result.cfg) }, target);
    }, { once: true });
  }

  /* ---------- find & replace ---------- */
  const fb = $('#findbar'), findQ = $('#findQ'), findR = $('#findR'), findCount = $('#findCount');
  const hasHl = !!(window.CSS && CSS.highlights && window.Highlight);
  const findOpts = { cs: false, ww: false };
  let matches = [], cur = -1, findTimer = null;

  function buildRegex() {
    const q = findQ.value;
    if (!q) return null;
    let src = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (findOpts.ww) src = `(?<![\\p{L}\\p{N}_])${src}(?![\\p{L}\\p{N}_])`;
    return new RegExp(src, findOpts.cs ? 'gu' : 'giu');
  }

  // Text is joined with a newline between blocks so a match can never span two paragraphs.
  function collectMatches() {
    const re = buildRegex();
    if (!re) return [];
    const segs = [];
    let full = '', prev = null;
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.data && !n.parentElement.closest('.cb-head') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
    });
    for (let n; (n = walker.nextNode());) {
      const block = n.parentElement.closest('p, div, li, h1, h2, h3, blockquote, .cb-pre');
      if (prev && block !== prev) full += '\n';
      prev = block;
      segs.push({ node: n, start: full.length });
      full += n.data;
    }
    const locate = (off, isEnd) => {
      for (const s of segs) {
        const l = s.node.data.length;
        if (isEnd ? off > s.start && off <= s.start + l : off >= s.start && off < s.start + l) return [s.node, off - s.start];
      }
      return null;
    };
    const out = [];
    for (const m of full.matchAll(re)) {
      const a = locate(m.index, false), b = locate(m.index + m[0].length, true);
      if (!a || !b) continue;
      const range = document.createRange();
      range.setStart(...a); range.setEnd(...b);
      const item = { range, text: m[0], block: null, start: 0 };
      const block = a[0].parentElement.closest('.code-block');
      if (block) {
        const r = document.createRange();
        r.selectNodeContents(block.querySelector('.cb-pre'));
        r.setEnd(range.startContainer, range.startOffset);
        item.block = block; item.start = r.toString().length;
      }
      out.push(item);
    }
    return out;
  }

  function paintFind() {
    if (hasHl) {
      CSS.highlights.delete('find-all'); CSS.highlights.delete('find-cur');
      if (matches.length) {
        CSS.highlights.set('find-all', new Highlight(...matches.map(m => m.range)));
        if (cur >= 0) {
          const h = new Highlight(matches[cur].range);
          h.priority = 1;
          CSS.highlights.set('find-cur', h);
        }
      }
    }
    findCount.textContent = !findQ.value ? '' : matches.length ? `${cur + 1} of ${matches.length}` : 'No results';
  }

  function showMatch() {
    paintFind();
    const m = matches[cur];
    const el = m && (m.range.startContainer.nodeType === 1 ? m.range.startContainer : m.range.startContainer.parentElement);
    el?.scrollIntoView({ block: 'center' });
  }

  function refind(keepIndex = false) {
    const prevIdx = cur;
    matches = collectMatches();
    if (!matches.length) cur = -1;
    else if (keepIndex) cur = clamp(prevIdx, 0, matches.length - 1);
    else {
      const i = lastRange ? matches.findIndex(m => lastRange.compareBoundaryPoints(Range.START_TO_START, m.range) <= 0) : 0;
      cur = i < 0 ? 0 : i;
    }
    paintFind();
    if (!keepIndex) showMatch();
  }

  function stepMatch(dir) {
    if (!matches.length) return;
    cur = (cur + dir + matches.length) % matches.length;
    showMatch();
  }

  function openFind(withReplace) {
    if (paper.hidden) return;
    const ta = document.activeElement?.closest?.('.cb-ta');
    const s = getSelection();
    let sel = '';
    if (ta) sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    else if (s.rangeCount && !s.isCollapsed && editor.contains(s.anchorNode)) sel = s.toString();
    if (sel && sel.length < 200 && !/[\r\n]/.test(sel)) findQ.value = sel;
    fb.style.top = toolbar.getBoundingClientRect().bottom + 8 + 'px';
    fb.hidden = false;
    (withReplace ? findR : findQ).focus();
    findQ.select();
    refind();
  }
  function closeFind() {
    fb.hidden = true;
    matches = []; cur = -1;
    if (hasHl) { CSS.highlights.delete('find-all'); CSS.highlights.delete('find-cur'); }
    restore();
  }

  function replaceText(range, rep) {
    editor.focus();
    const s = getSelection();
    s.removeAllRanges(); s.addRange(range.cloneRange());
    if (rep) document.execCommand('insertText', false, rep); else document.execCommand('delete');
  }
  function editCode(m, rep) {
    const ta = m.block.querySelector('.cb-ta');
    if (ta.value.slice(m.start, m.start + m.text.length) !== m.text) return false;
    ta.value = ta.value.slice(0, m.start) + rep + ta.value.slice(m.start + m.text.length);
    return true;
  }
  function commitCode(block) {
    block.dataset.code = block.querySelector('.cb-ta').value;
    renderBlock(block);
  }
  const afterPoint = (a, x) => {
    if (a.block) {
      if (x.block === a.block) return x.start >= a.pos;
      return !!(a.block.compareDocumentPosition(x.block || x.range.startContainer) & Node.DOCUMENT_POSITION_FOLLOWING);
    }
    return a.caret ? a.caret.compareBoundaryPoints(Range.START_TO_START, x.range) <= 0 : true;
  };

  function replaceOne() {
    if (cur < 0) return;
    const m = matches[cur], rep = findR.value;
    let after;
    if (m.block) {
      if (!editCode(m, rep)) return refind(true);
      commitCode(m.block);
      after = { block: m.block, pos: m.start + rep.length };
    } else {
      replaceText(m.range, rep);
      const s = getSelection();
      after = { caret: s.rangeCount ? s.getRangeAt(0).cloneRange() : null };
    }
    afterEdit();
    matches = collectMatches();
    const i = matches.findIndex(x => afterPoint(after, x));
    cur = matches.length ? (i < 0 ? 0 : i) : -1;
    showMatch();
    findR.focus();
  }

  function replaceAll() {
    if (!matches.length) return;
    const note0 = activeNote();
    if (note0) saveVersion(note0, serialize(), titleInput.value, 'Before replace all');
    const rep = findR.value, n = matches.length, blocks = new Set();
    for (let i = n - 1; i >= 0; i--) {
      const m = matches[i];
      if (m.block) { if (editCode(m, rep)) blocks.add(m.block); }
      else replaceText(m.range, rep);
    }
    blocks.forEach(commitCode);
    afterEdit();
    refind();
    setStatus(`Replaced ${n} occurrence${n === 1 ? '' : 's'}`);
    findR.focus();
  }

  findQ.addEventListener('input', () => refind());
  findQ.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); stepMatch(e.shiftKey ? -1 : 1); }
  });
  findR.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); replaceOne(); }
  });
  fb.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); closeFind(); } });
  $('#findNext').onclick = () => stepMatch(1);
  $('#findPrev').onclick = () => stepMatch(-1);
  $('#findClose').onclick = closeFind;
  $('#findRep').onclick = replaceOne;
  $('#findRepAll').onclick = replaceAll;
  [['#findCase', 'cs'], ['#findWord', 'ww']].forEach(([sel, key]) => {
    const b = $(sel);
    b.onclick = () => { findOpts[key] = !findOpts[key]; b.classList.toggle('on', findOpts[key]); refind(); };
  });
  window.addEventListener('resize', () => { if (!fb.hidden) fb.style.top = toolbar.getBoundingClientRect().bottom + 8 + 'px'; });

  /* ---------- export (PDF / Word / text) ---------- */
  const EXPORT_CSS = `body{font-family:Calibri,'Segoe UI',Arial,sans-serif;font-size:11pt;line-height:1.5;color:#111}
h1{font-size:22pt}h2{font-size:17pt}h3{font-size:13pt}
blockquote{border-left:4px solid #7c8cff;margin:8px 0;padding:4px 14px;background:#f2f3fb}
pre{font-family:Consolas,'Courier New',monospace;font-size:10pt;background:#f5f5f5;border:1px solid #ddd;padding:10px;white-space:pre-wrap;word-wrap:break-word}
code{font-family:Consolas,'Courier New',monospace;background:#f0f0f0;padding:0 3px}
pre code{background:none;padding:0}
img{max-width:100%;height:auto}
a{color:#2a4bd7}`;

  // Uses the current selection (editor text, or code typed in a code block); the whole note when nothing is selected.
  function exportSource() {
    const wrap = document.createElement('div');
    const ta = document.activeElement?.closest?.('.cb-ta');
    const s = getSelection();
    const range = s.rangeCount && !s.isCollapsed && editor.contains(s.anchorNode) ? s.getRangeAt(0)
      : lastRange && !lastRange.collapsed && editor.contains(lastRange.commonAncestorContainer) ? lastRange : null;
    let isSelection = true;
    if (ta && ta.selectionStart !== ta.selectionEnd) {
      const pre = document.createElement('pre');
      pre.textContent = ta.value.slice(ta.selectionStart, ta.selectionEnd);
      wrap.append(pre);
    } else if (range) wrap.append(range.cloneContents());
    else { wrap.innerHTML = serialize(); isSelection = false; }
    stubsToPre(wrap);
    return { wrap, isSelection, title: activeNote()?.title || 'Untitled note' };
  }

  function wrapToText(wrap) {
    const tmp = document.createElement('div');
    tmp.style.cssText = 'position:fixed;left:-99999px;top:0;width:800px;white-space:pre-wrap';
    tmp.innerHTML = withTodoMarks(wrap).innerHTML;
    document.body.appendChild(tmp);
    const t = tmp.innerText.replace(/\n{3,}/g, '\n\n').trim();
    tmp.remove();
    return t;
  }

  function wrapToDoc(wrap, title, isSelection) {
    const body = withTodoMarks(wrap);
    body.querySelectorAll('img').forEach(img => {
      if (!/px$/.test(img.style.width)) return;
      img.setAttribute('width', Math.min(parseInt(img.style.width, 10), 600));
      img.style.width = ''; img.style.height = '';
    });
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${EXPORT_CSS}</style></head><body>${isSelection ? '' : `<h1>${esc(title)}</h1>`}${body.innerHTML}</body></html>`;
  }

  function printPdf(wrap, title, isSelection, name) {
    const area = $('#printArea'), prevTitle = document.title;
    area.innerHTML = (isSelection ? '' : `<h1>${esc(title)}</h1>`) + withTodoMarks(wrap).innerHTML;
    document.title = name;
    document.body.classList.add('printing');
    const done = () => {
      window.removeEventListener('afterprint', done);
      document.body.classList.remove('printing');
      area.innerHTML = ''; document.title = prevTitle;
    };
    window.addEventListener('afterprint', done);
    window.print();
  }

  async function saveExport(name, content, mime) {
    if (api) {
      const r = await api.save_export(name, content);
      setStatus(r.message || (r.ok ? '' : 'Export failed'));
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: mime }));
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
    setStatus('Exported ' + name);
  }

  function runExport(fmt) {
    const { wrap, isSelection, title } = exportSource();
    if (!wrap.textContent.trim() && !wrap.querySelector('img')) return setStatus('Nothing to export');
    const base = safeName(title) + (isSelection ? '-selection' : '');
    if (fmt === 'pdf') printPdf(wrap, title, isSelection, base);
    else if (fmt === 'doc') saveExport(base + '.doc', wrapToDoc(wrap, title, isSelection), 'application/msword');
    else if (fmt === 'md') saveExport(base + '.md', (isSelection ? '' : '# ' + title + '\n\n') + htmlToMd(wrap), 'text/markdown;charset=utf-8');
    else saveExport(base + '.txt', (isSelection ? '' : title + '\n\n') + wrapToText(wrap), 'text/plain;charset=utf-8');
  }

  function toggleExport(btn) {
    if (!pop.hidden && pop.dataset.cmd === 'export') { pop.hidden = true; return; }
    pop.dataset.cmd = 'export';
    const { isSelection } = exportSource();
    pop.innerHTML = `<h4>Export ${isSelection ? 'selected text' : 'whole note'}</h4><div class="menu">
      <button type="button" data-fmt="pdf">PDF (choose "Save as PDF")</button>
      <button type="button" data-fmt="doc">Word document (.doc)</button>
      <button type="button" data-fmt="md">Markdown (.md)</button>
      <button type="button" data-fmt="txt">Plain text (.txt)</button></div>`;
    const r = btn.getBoundingClientRect();
    pop.hidden = false;
    pop.style.left = Math.min(r.left, innerWidth - 230) + 'px';
    pop.style.top = r.bottom + 6 + 'px';
    pop.onmousedown = ev => ev.preventDefault();
    pop.onclick = ev => {
      const f = ev.target.closest('[data-fmt]')?.dataset.fmt;
      if (!f) return;
      pop.hidden = true;
      runExport(f);
    };
  }

  /* ---------- customize: fonts & colour scheme ---------- */
  const PRESETS = [
    { name: 'Dark', dark: true, bg: '#0e1015', side: '#13151b', paper: '#171a21', text: '#e9ebf1', accent: '#6f7dff' },
    { name: 'Light', dark: false, bg: '#f3f4f8', side: '#fafbfd', paper: '#ffffff', text: '#1a1e2b', accent: '#4f5bd5' },
    { name: 'Midnight', dark: true, bg: '#0b1020', side: '#0f1730', paper: '#131d3b', text: '#dbe4ff', accent: '#4dabf7' },
    { name: 'Forest', dark: true, bg: '#101a14', side: '#14231a', paper: '#182b1f', text: '#e3f1e6', accent: '#51cf66' },
    { name: 'Sunset', dark: true, bg: '#1f1416', side: '#2a1a1d', paper: '#311f22', text: '#fbe9e4', accent: '#ff8a5c' },
    { name: 'Solarized', dark: false, bg: '#fdf6e3', side: '#eee8d5', paper: '#fdf6e3', text: '#073642', accent: '#268bd2' },
    { name: 'Sepia', dark: false, bg: '#f4ecd8', side: '#ebe1c8', paper: '#f9f3e3', text: '#3b3226', accent: '#b5651d' },
    { name: 'High contrast', dark: true, bg: '#000000', side: '#0a0a0a', paper: '#000000', text: '#ffffff', accent: '#ffd400' },
  ];
  const COLOR_FIELDS = [['bg', 'Background'], ['side', 'Sidebar'], ['paper', 'Note page'], ['text', 'Text'], ['accent', 'Accent']];
  const COLOR_VARS = ['--bg', '--side', '--bar', '--paper', '--text', '--accent', '--accent-2', '--muted', '--line', '--hover', '--active', '--inline-code'];
  const FONT_SUGGEST = {
    ui: ['Segoe UI', 'Calibri', 'Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Candara', 'Georgia', 'Cambria'],
    note: ['Segoe UI', 'Calibri', 'Cambria', 'Georgia', 'Garamond', 'Palatino Linotype', 'Times New Roman', 'Arial', 'Verdana', 'Trebuchet MS', 'Comic Sans MS'],
    code: ['Cascadia Code', 'Consolas', 'Courier New', 'Fira Code', 'JetBrains Mono', 'Lucida Console'],
  };
  const FONT_LABELS = { ui: 'Interface font', note: 'Note font', code: 'Code font' };

  const isHex = s => /^#[0-9a-f]{6}$/i.test(s);
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => '#' + rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const alpha = (h, a) => `rgba(${rgb(h).join(', ')}, ${a})`;

  // Values come from synced data, so fonts and colours are sanitised before reaching CSS.
  function applyCustom() {
    const c = state.custom || {}, f = c.fonts || {}, st = document.documentElement.style;
    const put = (k, v) => (v ? st.setProperty(k, v) : st.removeProperty(k));
    const fam = (name, fallback) => {
      const n = String(name || '').replace(/[^\p{L}\p{N}\s.&-]/gu, '').trim();
      return n ? `"${n}", ${fallback}` : '';
    };
    put('--font', fam(f.ui, '"Segoe UI", system-ui, sans-serif'));
    put('--note-font', fam(f.note, '"Segoe UI", system-ui, sans-serif'));
    put('--mono', fam(f.code, 'Consolas, "Courier New", monospace'));
    put('--note-size', Number.isFinite(+c.size) && c.size ? clamp(+c.size, 10, 40) + 'px' : '');
    put('--note-lh', Number.isFinite(+c.lh) && c.lh ? String(clamp(+c.lh, 1, 3)) : '');
    paper.dataset.paper = ['lined', 'dotted'].includes(c.paper) ? c.paper : 'plain';
    applyBrand(c);
    document.documentElement.dataset.cbtheme = ['light', 'monokai'].includes(c.codeTheme) ? c.codeTheme : 'dark';
    const k = c.colors;
    if (k && COLOR_FIELDS.every(([key]) => isHex(k[key]))) {
      Object.entries({
        '--bg': k.bg, '--side': k.side, '--bar': k.side, '--paper': k.paper, '--text': k.text, '--accent': k.accent,
        '--accent-2': mix(k.accent, '#b07cff', 0.6), '--muted': mix(k.text, k.bg, 0.45), '--line': mix(k.bg, k.text, 0.14),
        '--hover': alpha(k.text, 0.07), '--active': alpha(k.accent, 0.18), '--inline-code': alpha(k.text, 0.09),
      }).forEach(([n, v]) => st.setProperty(n, v));
    } else COLOR_VARS.forEach(n => st.removeProperty(n));
    requestAnimationFrame(fitAll);
    document.fonts?.ready.then(fitAll);
  }

  function greeting(owner) {
    const h = new Date().getHours();
    const g = h < 5 ? 'Working late' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    return owner ? `${g}, ${owner}` : g;
  }
  function applyBrand(c) {
    const brand = String(c.brand || '').trim().slice(0, 28) || 'Study Notepad';
    const owner = String(c.owner || '').trim().slice(0, 24);
    $('#brandName').textContent = brand;
    $('#brandSub').textContent = owner ? greeting(owner) : 'Your study notebook';
    $('#brandLogo').innerHTML = owner ? `<b>${esc(Array.from(owner)[0].toUpperCase())}</b>` : svg('book');
    $('#emptyTitle').textContent = owner ? greeting(owner) : 'No note open';
    document.title = brand;
  }

  function customizeDialog() {
    const cur = () => state.custom || (state.custom = {});
    const colors = () => cur().colors || PRESETS[state.theme === 'light' ? 1 : 0];
    openPanel(`<h3>Customize</h3>
      <h4 class="cz-h">Personal</h4>
      <div class="cz-fonts">
        <label>Notebook name<input data-t="brand" placeholder="Study Notepad" maxlength="28" autocomplete="off"></label>
        <label>Your name<input data-t="owner" placeholder="Shown in greetings" maxlength="24" autocomplete="off"></label>
      </div>
      <h4 class="cz-h">Colour scheme</h4>
      <div class="cz-presets">${PRESETS.map((p, i) => `<button type="button" class="cz-preset" data-p="${i}">
        <span class="cz-chips">${[p.bg, p.paper, p.text, p.accent].map(c => `<i style="background:${c}"></i>`).join('')}</span>${p.name}</button>`).join('')}</div>
      <div class="cz-colors">${COLOR_FIELDS.map(([k, l]) => `<label>${l}<input type="color" data-k="${k}"></label>`).join('')}</div>
      <h4 class="cz-h">Fonts</h4>
      <div class="cz-fonts">${Object.keys(FONT_LABELS).map(k => `<label>${FONT_LABELS[k]}
        <input data-f="${k}" list="fl-${k}" placeholder="Default" autocomplete="off" spellcheck="false"></label>
        <datalist id="fl-${k}">${FONT_SUGGEST[k].map(n => `<option value="${n}">`).join('')}</datalist>`).join('')}</div>
      <p>Type any font installed on this computer, or pick one from the list. Leave empty for the default.</p>
      <div class="cz-sliders">
        <label>Note text size <span data-v="size"></span><input type="range" data-r="size" min="12" max="28" step="0.5"></label>
        <label>Line spacing <span data-v="lh"></span><input type="range" data-r="lh" min="1.2" max="2.4" step="0.05"></label>
      </div>
      <h4 class="cz-h">Page and code</h4>
      <div class="cz-fonts">
        <label>Paper style<select data-s="paper" class="tb-select"><option value="plain">Plain</option><option value="lined">Lined</option><option value="dotted">Dotted</option></select></label>
        <label>Code theme<select data-s="codeTheme" class="tb-select"><option value="dark">Dark+</option><option value="light">Light</option><option value="monokai">Monokai</option></select></label>
        <label>Page width<span class="cz-w"><button type="button" class="btn small" data-w="680">Narrow</button><button type="button" class="btn small" data-w="860">Medium</button><button type="button" class="btn small" data-w="1100">Wide</button></span></label>
      </div>
      <div class="cz-preview"><h2>Preview heading</h2>
        <p>The quick brown fox jumps over the lazy dog, with <code>inline code</code> and <a href="#">a link</a>.</p></div>
      <div class="dlg-row end"><button type="button" class="btn ghost" data-act="reset">Reset to default</button>
        <button type="button" class="btn primary" data-act="done">Done</button></div>`, 'mid');

    const sameColors = (p, k) => COLOR_FIELDS.every(([key]) => p[key].toLowerCase() === k[key].toLowerCase());
    const syncPresets = () => {
      const k = colors();
      dlg.querySelectorAll('[data-p]').forEach(b => b.classList.toggle('on', sameColors(PRESETS[b.dataset.p], k)));
    };
    const syncSliders = () => {
      const c = cur();
      dlg.querySelector('[data-r="size"]').value = c.size || 16.5;
      dlg.querySelector('[data-r="lh"]').value = c.lh || 1.75;
      dlg.querySelector('[data-v="size"]').textContent = (c.size || 16.5) + ' px';
      dlg.querySelector('[data-v="lh"]').textContent = String(c.lh || 1.75);
    };
    const syncAll = () => {
      const k = colors();
      dlg.querySelectorAll('[data-k]').forEach(i => { i.value = k[i.dataset.k]; });
      dlg.querySelectorAll('[data-f]').forEach(i => { i.value = cur().fonts?.[i.dataset.f] || ''; });
      dlg.querySelectorAll('[data-t]').forEach(i => { i.value = cur()[i.dataset.t] || ''; });
      dlg.querySelectorAll('[data-s]').forEach(i => { i.value = cur()[i.dataset.s] || (i.dataset.s === 'paper' ? 'plain' : 'dark'); });
      syncPresets(); syncSliders();
    };
    let timer = null;
    const apply = () => { applyTheme(); clearTimeout(timer); timer = setTimeout(persist, 300); };
    syncAll();

    dlg.onclick = e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.p) {
        const i = +b.dataset.p, p = PRESETS[i];
        state.theme = p.dark ? 'dark' : 'light';
        cur().colors = i < 2 ? null : Object.fromEntries(COLOR_FIELDS.map(([k]) => [k, p[k]]));
        apply(); syncAll();
      } else if (b.dataset.act === 'reset') { state.custom = {}; apply(); syncAll(); }
      else if (b.dataset.w) { setUi('paper', +b.dataset.w); apply(); }
      else if (b.dataset.act === 'done') dlg.close();
    };
    dlg.oninput = e => {
      const t = e.target;
      if (t.dataset.k) { cur().colors = { ...colors(), [t.dataset.k]: t.value }; apply(); syncPresets(); }
      else if (t.dataset.t) { cur()[t.dataset.t] = t.value; apply(); }
      else if (t.dataset.f) { cur().fonts = { ...cur().fonts, [t.dataset.f]: t.value.trim() }; apply(); }
      else if (t.dataset.r) { cur()[t.dataset.r] = +t.value; apply(); syncSliders(); }
      else if (t.dataset.s) { cur()[t.dataset.s] = t.value; apply(); }
    };
  }
  $('#btnCustom').onclick = customizeDialog;

  /* ---------- tags ---------- */
  const tagInput = $('#tagInput'), tagChips = $('#tagChips'), tagCloud = $('#tagCloud');
  const normTag = s => String(s).toLowerCase().replace(/^#+/, '').trim().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}_-]/gu, '').slice(0, 30);
  const tagsOf = n => (Array.isArray(n.tags) ? n.tags : []);

  function renderTagChips() {
    const n = activeNote();
    renderReviewBtn(n);
    tagChips.innerHTML = n ? tagsOf(n).map(t => `<span class="tag"><button type="button" class="tag-name" data-t="${esc(t)}">#${esc(t)}</button>
      <button type="button" class="tag-x" data-rm="${esc(t)}" title="Remove tag">\u00d7</button></span>`).join('') : '';
  }
  function renderTagCloud() {
    const counts = new Map();
    state.notes.forEach(n => tagsOf(n).forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
    const q = searchEl.value.trim().toLowerCase();
    tagCloud.hidden = !counts.size;
    const sorted = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    tagCloud.innerHTML = sorted.map(([t, c]) => `<button type="button" class="tag ${q === '#' + t ? 'on' : ''}" data-t="${esc(t)}">#${esc(t)}<small>${c}</small></button>`).join('');
    $('#tagList').innerHTML = sorted.map(([t]) => `<option value="${esc(t)}">`).join('');
  }
  function addTags(raw) {
    const n = activeNote();
    if (!n) return;
    const have = tagsOf(n);
    const add = [...new Set(String(raw).split(/[,\n]/).map(normTag).filter(t => t && !have.includes(t)))];
    if (!add.length) return;
    n.tags = [...have, ...add];
    persist(); renderTagChips(); renderTree();
  }
  function removeTag(t) {
    const n = activeNote();
    if (!n) return;
    n.tags = tagsOf(n).filter(x => x !== t);
    persist(); renderTagChips(); renderTree();
  }
  function filterByTag(t, toggle) {
    app.classList.remove('side-closed');
    searchEl.value = toggle && searchEl.value.trim().toLowerCase() === '#' + t ? '' : '#' + t;
    renderTree();
  }
  tagInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTags(tagInput.value); tagInput.value = ''; }
    else if (e.key === 'Backspace' && !tagInput.value) {
      const last = tagsOf(activeNote() || {}).at(-1);
      if (last) removeTag(last);
    }
  });
  tagInput.addEventListener('blur', () => { addTags(tagInput.value); tagInput.value = ''; });
  tagChips.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.rm) removeTag(b.dataset.rm); else filterByTag(b.dataset.t, false);
  });
  tagCloud.addEventListener('click', e => {
    const b = e.target.closest('[data-t]');
    if (b) filterByTag(b.dataset.t, true);
  });

  /* ---------- command palette (Ctrl+K) ---------- */
  const palette = $('#palette'), palQ = $('#palQ'), palList = $('#palList');
  let palItems = [], palActive = 0, palPrev = null, palOpts = null;
  const PAL_PLACEHOLDER = palQ.placeholder;

  function revealNote(n) {
    for (let f = getFolder(n.folderId); f; f = getFolder(f.parentId)) f.open = true;
    app.classList.remove('side-closed');
    openNote(n.id);
  }

  function paletteSource() {
    const hasNote = !!activeNote();
    const items = [];
    state.notes.forEach(n => {
      const tags = tagsOf(n).map(t => '#' + t);
      const path = folderPath(n.folderId).join(' / ');
      items.push({ kind: 'Note', note: n, icon: n.lock ? 'lock' : 'file', label: noteLabel(n), hint: [path, ...tags].filter(Boolean).join('  \u00b7  '), rank: n.updatedAt || 0, run: () => revealNote(n) });
    });
    state.folders.forEach(f => {
      items.push({ kind: 'Section', icon: 'folder', label: f.name, hint: folderPath(f.parentId).join(' / '), rank: 0, run: () => {
        for (let x = f; x; x = getFolder(x.parentId)) x.open = true;
        state.selectedFolderId = f.id; app.classList.remove('side-closed'); persist(); renderTree();
      } });
    });
    const counts = new Map();
    state.notes.forEach(n => tagsOf(n).forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
    counts.forEach((c, t) => items.push({ kind: 'Tag', icon: 'file', label: '#' + t, hint: `${c} note${c === 1 ? '' : 's'}`, rank: 0, run: () => filterByTag(t, false) }));
    const act = (label, run, needsNote = false) => { if (!needsNote || hasNote) items.push({ kind: 'Action', icon: 'sliders', label, hint: '', rank: 0, run }); };
    act('New note', () => newNote());
    act('New section', () => addFolder(null));
    act("Today's note", dailyNote);
    act('Toggle sidebar', () => app.classList.toggle('side-closed'));
    act('Toggle light / dark', () => $('#btnTheme').click());
    act('Customize fonts and colours', customizeDialog);
    act('Add tag to this note', () => tagInput.focus(), true);
    act('Find and replace', () => openFind(false), true);
    act('Insert image', () => fileImg.click(), true);
    act('Insert chart', () => chartDialog(), true);
    act('Freehand drawing', () => drawDialog(), true);
    act('Insert code block', () => insertCodeBlock(), true);
    act('Export as PDF', () => runExport('pdf'), true);
    act('Export as Word (.doc)', () => runExport('doc'), true);
    act('Export as text (.txt)', () => runExport('txt'), true);
    act('Save backup file', () => $('#btnBackup').click());
    act('Sync to Google Drive', syncDrive);
    act('Pin / unpin this note', () => { const n = activeNote(); n.pinned = !n.pinned; persist(); renderTree(); }, true);
    act('Version history of this note', historyDialog, true);
    act('New journal entry', journalEntry);
    act('Lock this note', () => lockNote(activeNote()), true);
    act('Lock diary now', () => lockDiary());
    act('Privacy and security settings', securityDialog);
    act('Set word-count goal', goalDialog, true);
    act('Start / pause study timer', togglePomo);
    act('Focus mode', () => toggleFocus());
    act('Keyboard shortcuts', shortcutsDialog);
    act('Set review reminder', reviewDialog, true);
    act('Open Trash', trashDialog);
    act('Import Markdown / text files', () => fileImport.click());
    if (getFolder(state.selectedFolderId)) act('Export current section', () => exportSectionDialog(state.selectedFolderId));
    return items;
  }

  function paletteResults(raw) {
    let q = raw.trim().toLowerCase(), pool = paletteSource();
    if (palOpts) pool = pool.filter(i => i.kind === 'Note' && i.note.id !== state.activeNoteId && !i.note.lock);
    if (q.startsWith('>')) { q = q.slice(1).trim(); pool = pool.filter(i => i.kind === 'Action'); }
    if (!q) {
      const recent = pool.filter(i => i.kind === 'Note').sort((a, b) => b.rank - a.rank).slice(0, palOpts ? 12 : 6);
      return [...recent, ...pool.filter(i => i.kind === 'Action')];
    }
    const words = q.split(/\s+/);
    return pool.map(i => {
      const label = i.label.toLowerCase(), hay = `${label} ${i.hint.toLowerCase()} ${i.kind.toLowerCase()}`;
      if (!words.every(w => hay.includes(w))) return null;
      const score = (label.startsWith(words[0]) ? 3 : 0) + (label.includes(words[0]) ? 2 : 0) + (i.kind === 'Note' ? 1 : 0);
      return { i, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score || b.i.rank - a.i.rank).slice(0, 14).map(x => x.i);
  }

  function paintPalette() {
    palList.innerHTML = palItems.length ? palItems.map((it, n) => `<div class="pal-item ${n === palActive ? 'active' : ''}" data-n="${n}">
      <span class="ico">${svg(it.icon)}</span><span class="pal-main"><b>${esc(it.label)}</b>${it.hint ? `<small>${esc(it.hint)}</small>` : ''}</span>
      <span class="pal-kind">${it.kind}</span></div>`).join('') : '<div class="pal-empty">Nothing found</div>';
    palList.querySelector('.active')?.scrollIntoView({ block: 'nearest' });
  }
  function openPalette(opts = null) {
    palPrev = document.activeElement;
    palOpts = opts;
    palQ.placeholder = opts?.placeholder || PAL_PLACEHOLDER;
    palette.hidden = false;
    palQ.value = '';
    palItems = paletteResults(''); palActive = 0; paintPalette();
    palQ.focus();
  }
  function closePalette(restoreFocus) {
    palette.hidden = true;
    if (!restoreFocus) return;
    if (palPrev && editor.contains(palPrev)) restore(); else palPrev?.focus?.();
  }
  function runPalette(n) {
    const it = palItems[n];
    if (!it) return;
    const pick = palOpts?.onPick;
    closePalette(false);
    setTimeout(() => (pick ? pick(it.note) : it.run()), 0);
  }
  palQ.addEventListener('input', () => { palItems = paletteResults(palQ.value); palActive = 0; paintPalette(); });
  palQ.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (palItems.length) { palActive = (palActive + (e.key === 'ArrowDown' ? 1 : -1) + palItems.length) % palItems.length; paintPalette(); }
    } else if (e.key === 'Enter') { e.preventDefault(); runPalette(palActive); }
    else if (e.key === 'Escape') { e.preventDefault(); closePalette(true); }
  });
  palList.addEventListener('click', e => {
    const row = e.target.closest('.pal-item');
    if (row) runPalette(+row.dataset.n);
  });
  palette.addEventListener('mousedown', e => { if (e.target === palette) closePalette(true); });

  /* ---------- trash, section style, review reminders, import, bulk export ---------- */
  const fileImport = $('#fileImport');
  const safeName = t => String(t).replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 60) || 'note';

  async function restoreTrash(id) {
    const t = (state.trash || []).find(x => x.id === id);
    if (!t) return;
    if (t.type === 'note') {
      if (t.note.folderId && !getFolder(t.note.folderId)) t.note.folderId = null;
      state.notes.push(t.note);
    } else {
      const have = new Set(state.folders.map(f => f.id));
      t.folders.forEach(f => {
        if (have.has(f.id)) return;
        if (f.id === t.rootId && f.parentId && !getFolder(f.parentId)) f.parentId = null;
        state.folders.push(f);
      });
      state.notes.push(...t.notes);
    }
    state.trash = state.trash.filter(x => x !== t);
    if (diaryKey) await openAllSealed();
  }

  function trashDialog() {
    let armed = false;
    openPanel('', 'mid');
    const draw = () => {
      const items = [...(state.trash || [])].sort((a, b) => b.at - a.at);
      dlg.querySelector('form').innerHTML = `<h3>Trash</h3><p>Deleted items are kept for 30 days.</p>
        <div class="trash-list">${items.length ? items.map(t => `<div class="trash-item">
          <span class="trash-name"><b>${esc(t.name)}</b><small>${t.type === 'folder' ? `Section \u00b7 ${t.notes.length} note(s)` : 'Note'} \u00b7 deleted ${fmtDay(t.at)}</small></span>
          <button type="button" class="btn small" data-restore="${t.id}">Restore</button>
          <button type="button" class="btn small" data-purge="${t.id}">Delete</button></div>`).join('') : '<div class="tree-empty">Trash is empty.</div>'}</div>
        <div class="dlg-row end">${items.length ? `<button type="button" class="btn ghost" data-act="empty">${armed ? 'Click again to confirm' : 'Empty Trash'}</button>` : ''}
        <button type="button" class="btn primary" data-act="close">Close</button></div>`;
    };
    draw();
    dlg.onclick = async e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.act === 'close') return dlg.close();
      if (b.dataset.act === 'empty') {
        if (!armed) { armed = true; return draw(); }
        state.trash = [];
      } else if (b.dataset.restore) await restoreTrash(b.dataset.restore);
      else if (b.dataset.purge) state.trash = state.trash.filter(t => t.id !== b.dataset.purge);
      else return;
      armed = false;
      persist(); renderTree(); draw();
    };
  }

  function styleFolderDialog(id) {
    const f = getFolder(id);
    if (!f) return;
    openPanel(`<h3>Section style</h3><p>Pick a colour and an optional emoji for "${esc(f.name)}".</p>
      <div class="swatches">${TEXT_COLORS.map(c => `<button type="button" class="sw ${f.color === c ? 'on' : ''}" data-c="${c}" style="background:${c}"></button>`).join('')}
      <button type="button" class="sw reset" data-c="" title="Default">${svg('x')}</button></div>
      <input id="fEmo" placeholder="Emoji icon (paste one, optional)" value="${esc(f.emoji || '')}" autocomplete="off">
      <div class="dlg-row end"><button type="button" class="btn primary" data-act="close">Done</button></div>`, '');
    dlg.onclick = e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.act === 'close') return dlg.close();
      if (b.dataset.c === undefined) return;
      if (b.dataset.c) f.color = b.dataset.c; else delete f.color;
      dlg.querySelectorAll('.sw').forEach(x => x.classList.toggle('on', x === b));
      persist(); renderTree();
    };
    dlg.oninput = e => {
      if (e.target.id !== 'fEmo') return;
      const v = [...e.target.value.trim()].slice(0, 2).join('');
      if (v) f.emoji = v; else delete f.emoji;
      persist(); renderTree();
    };
  }

  const REVIEW_STEPS = [1, 3, 7, 14, 30];
  const dayStart = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
  function renderReviewBtn(n) {
    const b = $('#reviewBtn');
    b.hidden = !n;
    if (!n) return;
    b.classList.toggle('due', isDue(n));
    b.textContent = n.review ? (isDue(n) ? 'Review due' : 'Review ' + fmtDay(n.review)) : '+ Review reminder';
  }
  function reviewDialog() {
    const n = activeNote();
    if (!n) return;
    const nextStep = Math.min((n.reviewStep ?? -1) + 1, REVIEW_STEPS.length - 1);
    const presets = [[1, 'Tomorrow'], [3, 'In 3 days'], [7, 'In 1 week'], [14, 'In 2 weeks'], [30, 'In 1 month']];
    openPanel(`<h3>Review reminder</h3>
      <p>${n.review ? (isDue(n) ? 'This note is due for review.' : 'Next review: ' + fmtDay(n.review) + '.') : 'Get reminded to revisit this note. Due notes appear at the top of the sidebar.'}</p>
      ${n.review ? `<button type="button" class="btn primary" data-act="done">Mark reviewed (next in ${REVIEW_STEPS[nextStep]} day${REVIEW_STEPS[nextStep] === 1 ? '' : 's'})</button>` : ''}
      <div class="dlg-row">${presets.map(([d, l]) => `<button type="button" class="btn small" data-d="${d}">${l}</button>`).join('')}</div>
      <label class="cz-field">Or pick a date<input type="date" id="revDate"></label>
      <div class="dlg-row end">${n.review ? '<button type="button" class="btn ghost" data-act="clear">Remove reminder</button>' : ''}
      <button type="button" class="btn ghost" data-act="close">Close</button></div>`, '');
    const set = (ms, step) => {
      if (ms === null) { delete n.review; delete n.reviewStep; } else { n.review = ms; n.reviewStep = step; }
      persist(); renderTree(); renderTagChips(); dlg.close();
    };
    dlg.onclick = e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.act === 'close') dlg.close();
      else if (b.dataset.act === 'clear') set(null);
      else if (b.dataset.act === 'done') set(dayStart() + REVIEW_STEPS[nextStep] * 864e5, nextStep);
      else if (b.dataset.d) set(dayStart() + +b.dataset.d * 864e5, REVIEW_STEPS.indexOf(+b.dataset.d));
    };
    dlg.onchange = e => {
      if (e.target.id !== 'revDate' || !e.target.value) return;
      const ms = new Date(e.target.value + 'T00:00:00').getTime();
      if (Number.isFinite(ms)) set(ms, -1);
    };
  }
  $('#reviewBtn').onclick = reviewDialog;

  function stubsToPre(wrap) {
    wrap.querySelectorAll('.code-block').forEach(b => {
      const pre = document.createElement('pre');
      pre.textContent = b.dataset.code || '';
      pre.dataset.lang = b.dataset.lang || '';
      b.replaceWith(pre);
    });
  }

  function textFromHtml(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    d.querySelectorAll('.code-block').forEach(b => b.replaceWith(document.createTextNode('\n' + (b.dataset.code || ''))));
    return d.textContent;
  }

  function mdToHtml(md) {
    const inline = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
      .replace(/\[([^\]]+)\]\(((?:https?:|mailto:)[^)\s]+)\)/g, '<a href="$2">$1</a>');
    const lines = md.replace(/\r\n?/g, '\n').split('\n');
    const isBlockStart = l => /^(```|#{1,6}\s|>|\s*[-*+]\s|\s*\d+[.)]\s|(-{3,}|\*{3,})\s*$)/.test(l);
    const ul = /^\s*[-*+]\s+/, ol = /^\s*\d+[.)]\s+/;
    let out = '', i = 0;
    while (i < lines.length) {
      const l = lines[i];
      const fence = l.match(/^```\s*([\w+#-]*)/);
      if (fence) {
        const code = [];
        for (i++; i < lines.length && !/^```/.test(lines[i]); i++) code.push(lines[i]);
        i++;
        out += codeStub(Highlighter.normalize(fence[1]) || 'text', code.join('\n'));
        continue;
      }
      if (!l.trim()) { i++; continue; }
      const h = l.match(/^(#{1,6})\s+(.*)$/);
      if (h) { const lv = Math.min(3, h[1].length); out += `<h${lv}>${inline(h[2].trim())}</h${lv}>`; i++; continue; }
      if (/^(-{3,}|\*{3,})\s*$/.test(l)) { out += '<hr>'; i++; continue; }
      if (l.startsWith('>')) {
        const q = [];
        while (i < lines.length && lines[i].startsWith('>')) q.push(lines[i++].replace(/^>\s?/, ''));
        out += `<blockquote>${q.map(inline).join('<br>')}</blockquote>`;
        continue;
      }
      if (ul.test(l) || ol.test(l)) {
        const re = ul.test(l) ? ul : ol, items = [], tag = re === ul ? 'ul' : 'ol';
        while (i < lines.length && re.test(lines[i])) items.push(lines[i++].replace(re, ''));
        const task = items.every(x => /^\[[ xX]\]\s/.test(x));
        out += `<${tag}${task ? ' class="todo"' : ''}>${items.map(x => task
          ? `<li${/^\[[xX]\]/.test(x) ? ' data-done="1"' : ''}>${inline(x.slice(4))}</li>` : `<li>${inline(x)}</li>`).join('')}</${tag}>`;
        continue;
      }
      const para = [];
      while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) para.push(lines[i++]);
      if (!para.length) para.push(lines[i++]);
      out += `<p>${para.map(inline).join(' ')}</p>`;
    }
    return out;
  }

  function htmlToMd(root) {
    const inl = n => [...n.childNodes].map(inlineMd).join('');
    function inlineMd(n) {
      if (n.nodeType === 3) return n.data.replace(/\s+/g, ' ');
      if (n.nodeType !== 1) return '';
      switch (n.tagName.toLowerCase()) {
        case 'b': case 'strong': return `**${inl(n)}**`;
        case 'i': case 'em': return `*${inl(n)}*`;
        case 's': case 'strike': return `~~${inl(n)}~~`;
        case 'code': return '`' + n.textContent + '`';
        case 'a': return n.classList.contains('note-link') || !n.getAttribute('href') ? inl(n) : `[${inl(n)}](${n.getAttribute('href')})`;
        case 'br': return '\n';
        case 'img': return '*[image]*';
        default: return inl(n);
      }
    }
    function listMd(list) {
      const ordered = list.tagName === 'OL', todo = list.classList.contains('todo');
      return [...list.children].filter(li => li.tagName === 'LI').map((li, i) => {
        const text = [...li.childNodes].filter(x => !/^(UL|OL)$/.test(x.tagName || '')).map(inlineMd).join('').trim();
        const nested = [...li.children].filter(x => /^(UL|OL)$/.test(x.tagName)).map(x => listMd(x).split('\n').map(s => '  ' + s).join('\n'));
        return [`${ordered ? i + 1 + '. ' : '- '}${todo ? (li.dataset.done ? '[x] ' : '[ ] ') : ''}${text}`, ...nested].join('\n');
      }).join('\n');
    }
    function blocks(parent) {
      const out = [];
      let buf = '';
      const flush = () => { if (buf.trim()) out.push(buf.trim()); buf = ''; };
      for (const c of parent.childNodes) {
        const t = c.nodeType === 1 ? c.tagName.toLowerCase() : '';
        if (/^h[1-6]$/.test(t)) { flush(); out.push('#'.repeat(+t[1]) + ' ' + inl(c).trim()); }
        else if (t === 'p' || t === 'div') { flush(); const s = blocks(c); if (s) out.push(s); }
        else if (t === 'ul' || t === 'ol') { flush(); out.push(listMd(c)); }
        else if (t === 'blockquote') { flush(); out.push(blocks(c).split('\n').map(s => '> ' + s).join('\n')); }
        else if (t === 'pre') { flush(); out.push('```' + (c.dataset.lang || '') + '\n' + c.textContent.replace(/\n$/, '') + '\n```'); }
        else if (t === 'hr') { flush(); out.push('---'); }
        else if (t === 'table') {
          flush();
          const rows = [...c.querySelectorAll('tr')].map(r => '| ' + [...r.children].map(x => inl(x).trim().replace(/\|/g, '\\|')).join(' | ') + ' |');
          if (rows.length) rows.splice(1, 0, '|' + ' --- |'.repeat((c.querySelector('tr')?.children.length) || 1));
          out.push(rows.join('\n'));
        } else buf += inlineMd(c);
      }
      flush();
      return out.join('\n\n');
    }
    return blocks(root);
  }

  async function importFiles(files) {
    flushSave();
    const folderId = getFolder(state.selectedFolderId) ? state.selectedFolderId : null;
    if (inJournal(folderId) && !(await unlockDiary())) return;
    let first = null, count = 0;
    for (const f of files) {
      if (!/\.(md|markdown|txt)$/i.test(f.name)) continue;
      const text = await f.text();
      const html = /\.txt$/i.test(f.name)
        ? text.split(/\n{2,}/).filter(p => p.trim()).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('')
        : mdToHtml(text);
      const now = Date.now();
      const n = { id: uid(), folderId, title: f.name.replace(/\.[^.]+$/, ''), html: html || '<p><br></p>', text: '', createdAt: now, updatedAt: now };
      n.text = textFromHtml(n.html);
      if (inJournal(folderId)) { n.lock = { pending: true }; n._open = true; }
      state.notes.push(n);
      first = first || n; count++;
    }
    if (!first) return setStatus('Choose .md or .txt files to import');
    if (folderId) getFolder(folderId).open = true;
    persist(); openNote(first.id);
    setStatus(`Imported ${count} note${count === 1 ? '' : 's'}`);
  }
  fileImport.onchange = e => {
    const files = [...e.target.files];
    e.target.value = '';
    importFiles(files);
  };
  $('#btnImport').onclick = () => fileImport.click();
  $('#btnTrash').onclick = trashDialog;

  function exportSection(id, fmt) {
    const folder = getFolder(id);
    const ids = descendants(id);
    const notes = state.notes.filter(n => ids.includes(n.folderId) && !isSealed(n)).sort((a, b) => a.createdAt - b.createdAt);
    if (!folder || !notes.length) return setStatus('That section has no notes');
    flushSave();
    const wrap = document.createElement('div');
    notes.forEach((n, i) => {
      const h = document.createElement('h1');
      h.textContent = n.title || 'Untitled note';
      const body = document.createElement('div');
      body.innerHTML = n.html;
      stubsToPre(body);
      wrap.append(h, body);
      if (i < notes.length - 1) wrap.append(document.createElement('hr'));
    });
    const base = safeName(folder.name);
    if (fmt === 'pdf') printPdf(wrap, folder.name, true, base);
    else if (fmt === 'doc') saveExport(base + '.doc', wrapToDoc(wrap, folder.name, true), 'application/msword');
    else saveExport(base + '.md', htmlToMd(wrap), 'text/markdown;charset=utf-8');
  }
  function exportSectionDialog(id) {
    const f = getFolder(id);
    if (!f) return;
    openPanel(`<h3>Export section</h3><p>Every note in "${esc(f.name)}" (including sub-sections) goes into one file.</p>
      <div class="menu"><button type="button" data-fmt="pdf">PDF (choose "Save as PDF")</button>
      <button type="button" data-fmt="doc">Word document (.doc)</button>
      <button type="button" data-fmt="md">Markdown (.md)</button></div>
      <div class="dlg-row end"><button type="button" class="btn ghost" data-act="close">Cancel</button></div>`, '');
    dlg.onclick = e => {
      const b = e.target.closest('button');
      if (!b) return;
      dlg.close();
      if (b.dataset.fmt) setTimeout(() => exportSection(id, b.dataset.fmt), 50);
    };
  }

  /* ---------- insert menu, slash commands, tables, checklists, note links, selection bubble ---------- */
  const slash = $('#slash'), bubble = $('#bubble'), tblBar = $('#tblBar'), backlinksEl = $('#backlinks');

  function withTodoMarks(wrap) {
    const c = wrap.cloneNode(true);
    c.querySelectorAll('ul.todo > li').forEach(li => li.prepend(li.dataset.done ? '\u2611 ' : '\u2610 '));
    c.querySelectorAll('ul.todo').forEach(u => { u.style.listStyle = 'none'; u.style.paddingLeft = '0'; });
    return c;
  }

  function insertDate() {
    restore();
    document.execCommand('insertText', false, new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    afterEdit();
  }

  const COMMANDS = [
    { label: 'Heading 1', badge: 'H1', keys: 'h1 heading title', slash: true, run: () => exec('formatBlock', '<h1>') },
    { label: 'Heading 2', badge: 'H2', keys: 'h2 heading subtitle', slash: true, run: () => exec('formatBlock', '<h2>') },
    { label: 'Heading 3', badge: 'H3', keys: 'h3 heading', slash: true, run: () => exec('formatBlock', '<h3>') },
    { label: 'Bullet list', icon: 'list', keys: 'ul bullets unordered', slash: true, run: () => exec('insertUnorderedList') },
    { label: 'Numbered list', icon: 'listOrdered', keys: 'ol ordered', slash: true, run: () => exec('insertOrderedList') },
    { label: 'Checklist', icon: 'checkSquare', keys: 'todo task checkbox', slash: true, run: () => toggleChecklist() },
    { label: 'Quote', badge: '\u201c', keys: 'blockquote', slash: true, run: () => exec('formatBlock', '<blockquote>') },
    { label: 'Code block', icon: 'terminal', hint: 'Ctrl+Alt+C', keys: 'code snippet', slash: true, menu: true, run: () => insertCodeBlock() },
    { label: 'Inline code', icon: 'code', keys: 'mono', menu: true, run: () => inlineCode() },
    { label: 'Link', icon: 'link', keys: 'url', menu: true, run: () => addLink() },
    { label: 'Link to note', icon: 'file', hint: '[[', keys: 'note backlink', slash: true, menu: true, run: () => pickNoteLink() },
    { label: 'Table', icon: 'table', keys: 'grid rows columns', slash: true, menu: true, run: () => insertTable() },
    { label: 'Image', icon: 'image', keys: 'picture photo', slash: true, menu: true, run: () => fileImg.click() },
    { label: 'Chart', icon: 'chart', keys: 'graph bar line pie', slash: true, menu: true, run: () => chartDialog() },
    { label: 'Drawing', icon: 'edit', keys: 'sketch freehand', slash: true, menu: true, run: () => drawDialog() },
    { label: 'Divider', icon: 'minus', keys: 'line hr rule', slash: true, menu: true, run: () => exec('insertHorizontalRule') },
    { label: "Today's date", icon: 'calendar', keys: 'time', slash: true, menu: true, run: () => insertDate() },
  ];
  const cmdIcon = c => (c.icon ? svg(c.icon) : `<b class="badge">${c.badge}</b>`);

  function toggleInsert(btn) {
    if (!pop.hidden && pop.dataset.cmd === 'insert') { pop.hidden = true; return; }
    pop.dataset.cmd = 'insert';
    const items = COMMANDS.filter(c => c.menu);
    pop.innerHTML = `<h4>Insert</h4><div class="menu">${items.map((c, i) =>
      `<button type="button" data-i="${i}">${cmdIcon(c)}<span>${c.label}</span>${c.hint ? `<kbd>${c.hint}</kbd>` : ''}</button>`).join('')}</div>`;
    const r = btn.getBoundingClientRect();
    pop.hidden = false;
    pop.style.left = Math.min(r.left, innerWidth - pop.offsetWidth - 8) + 'px';
    pop.style.top = r.bottom + 6 + 'px';
    pop.onmousedown = ev => ev.preventDefault();
    pop.onclick = ev => {
      const b = ev.target.closest('[data-i]');
      if (!b) return;
      pop.hidden = true;
      items[+b.dataset.i].run();
    };
  }

  /* slash menu */
  let slashList = [], slashSel = 0, slashCtx = null;
  function closeSlash() { slash.hidden = true; slashCtx = null; }
  function paintSlash() {
    slash.innerHTML = slashList.map((c, i) => `<div class="slash-item ${i === slashSel ? 'active' : ''}" data-i="${i}">${cmdIcon(c)}<span>${c.label}</span></div>`).join('');
    slash.querySelector('.active')?.scrollIntoView({ block: 'nearest' });
  }
  function removeBefore(node, end, len) {
    const r = document.createRange();
    r.setStart(node, end - len); r.setEnd(node, end);
    const s = getSelection();
    s.removeAllRanges(); s.addRange(r);
    document.execCommand('delete');
    if (s.rangeCount) lastRange = s.getRangeAt(0).cloneRange();
  }
  function slashCheck() {
    const s = getSelection();
    if (!s.rangeCount || !s.isCollapsed || s.anchorNode.nodeType !== 3 || s.anchorNode.parentElement.closest('.code-block, pre')) return closeSlash();
    const node = s.anchorNode, off = s.anchorOffset, before = node.data.slice(0, off);
    if (before.endsWith('[[')) { closeSlash(); removeBefore(node, off, 2); pickNoteLink(); return; }
    const m = before.match(/(?:^|\s)\/([a-z0-9]*)$/i);
    if (!m) return closeSlash();
    const q = m[1].toLowerCase();
    slashList = COMMANDS.filter(c => c.slash && (!q || `${c.label} ${c.keys}`.toLowerCase().includes(q)));
    if (!slashList.length) return closeSlash();
    slashCtx = { node, end: off, len: m[1].length + 1 };
    slashSel = 0;
    paintSlash();
    slash.hidden = false;
    const rect = s.getRangeAt(0).getClientRects()[0] || node.parentElement.getBoundingClientRect();
    const h = slash.offsetHeight;
    slash.style.left = clamp(rect.left, 8, innerWidth - slash.offsetWidth - 8) + 'px';
    slash.style.top = (rect.bottom + 6 + h > innerHeight ? Math.max(8, rect.top - h - 6) : rect.bottom + 6) + 'px';
  }
  function runSlash(i) {
    const c = slashList[i], ctx = slashCtx;
    closeSlash();
    if (!c || !ctx) return;
    removeBefore(ctx.node, ctx.end, ctx.len);
    c.run();
  }
  function slashKeys(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      slashSel = (slashSel + (e.key === 'ArrowDown' ? 1 : -1) + slashList.length) % slashList.length;
      paintSlash();
      return true;
    }
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); runSlash(slashSel); return true; }
    if (e.key === 'Escape') { e.preventDefault(); closeSlash(); return true; }
    return false;
  }
  slash.addEventListener('mousedown', e => e.preventDefault());
  slash.addEventListener('click', e => { const r = e.target.closest('[data-i]'); if (r) runSlash(+r.dataset.i); });
  document.addEventListener('mousedown', e => { if (!slash.hidden && !slash.contains(e.target)) closeSlash(); });

  /* markdown-style shortcuts */
  function blockAtCaret() {
    const s = getSelection();
    if (!s.rangeCount || !s.isCollapsed) return null;
    let b = s.anchorNode;
    while (b && b.parentNode !== editor) b = b.parentNode;
    return b && b.nodeType === 1 && ['P', 'DIV'].includes(b.tagName) && !b.classList.contains('code-block') ? b : null;
  }
  const caretEl = () => { const n = getSelection().anchorNode; return n && (n.nodeType === 1 ? n : n.parentElement); };
  function mdShortcut(e) {
    const b = blockAtCaret();
    if (!b) return false;
    const s = getSelection(), t = b.textContent;
    const before = document.createRange();
    before.selectNodeContents(b); before.setEnd(s.anchorNode, s.anchorOffset);
    if (before.toString() !== t) return false;
    let action = null;
    if (/^#{1,3}$/.test(t)) action = () => document.execCommand('formatBlock', false, `<h${t.length}>`);
    else if (/^[-*]$/.test(t)) action = () => document.execCommand('insertUnorderedList');
    else if (/^1[.)]$/.test(t)) action = () => document.execCommand('insertOrderedList');
    else if (t === '>') action = () => document.execCommand('formatBlock', false, '<blockquote>');
    else if (/^\[\s?\]$/.test(t)) action = () => { document.execCommand('insertUnorderedList'); caretEl()?.closest('ul')?.classList.add('todo'); };
    if (!action) return false;
    e.preventDefault();
    b.innerHTML = '<br>';
    const r = document.createRange();
    r.setStart(b, 0); r.collapse(true);
    s.removeAllRanges(); s.addRange(r);
    action();
    afterEdit();
    return true;
  }
  function mdDivider(e) {
    const b = blockAtCaret();
    if (!b || b.textContent.trim() !== '---') return;
    e.preventDefault();
    const hr = document.createElement('hr'), p = emptyP();
    b.replaceWith(hr); hr.after(p);
    focusCell(p);
    afterEdit();
  }
  // Typing the closing ** or ` turns the text into bold / inline code.
  function mdInline() {
    const s = getSelection();
    if (!s.rangeCount || !s.isCollapsed || s.anchorNode.nodeType !== 3) return;
    const node = s.anchorNode, off = s.anchorOffset;
    if (node.parentElement.closest('code, pre, .code-block')) return;
    const m = node.data.slice(0, off).match(/\*\*([^*]+)\*\*$|`([^`]+)`$/);
    if (!m) return;
    const r = document.createRange();
    r.setStart(node, off - m[0].length); r.setEnd(node, off);
    s.removeAllRanges(); s.addRange(r);
    document.execCommand('insertHTML', false, m[1] !== undefined ? `<b>${esc(m[1])}</b>\u200b` : `<code>${esc(m[2])}</code>\u200b`);
  }

  /* checklists */
  function toggleChecklist() {
    restore();
    const ulNow = () => { const ul = caretEl()?.closest('ul'); return ul && editor.contains(ul) ? ul : null; };
    let ul = ulNow();
    if (ul?.classList.contains('todo')) {
      ul.classList.remove('todo');
      ul.querySelectorAll('li').forEach(li => li.removeAttribute('data-done'));
    } else {
      if (!ul) { document.execCommand('insertUnorderedList'); ul = ulNow(); }
      ul?.classList.add('todo');
    }
    afterEdit();
  }
  function todoEnterFix() {
    const li = caretEl()?.closest('ul.todo > li');
    if (!li || !li.dataset.done) return;
    setTimeout(() => {
      const next = caretEl()?.closest('ul.todo > li');
      if (next && next !== li) next.removeAttribute('data-done');
    }, 0);
  }

  /* tables */
  function focusCell(el) {
    const r = document.createRange();
    r.selectNodeContents(el); r.collapse(true);
    const s = getSelection();
    s.removeAllRanges(); s.addRange(r);
  }
  function insertTable(rows = 3, cols = 3) {
    restore();
    const row = tag => `<tr>${`<${tag}><br></${tag}>`.repeat(cols)}</tr>`;
    document.execCommand('insertHTML', false, `<table class="nt" id="newTbl"><tbody>${row('th')}${row('td').repeat(rows - 1)}</tbody></table><p><br></p>`);
    const t = editor.querySelector('#newTbl');
    if (t) { t.removeAttribute('id'); focusCell(t.querySelector('th, td')); }
    afterEdit();
  }
  const cellOf = () => {
    const c = caretEl()?.closest('td, th');
    return c && editor.contains(c) ? c : null;
  };
  function tableOp(op) {
    const cell = cellOf();
    if (!cell) return;
    const row = cell.parentElement, table = cell.closest('table'), idx = cell.cellIndex;
    const mk = tag => { const c = document.createElement(tag); c.innerHTML = '<br>'; return c; };
    if (op === 'row+') {
      const nr = document.createElement('tr');
      [...row.children].forEach(() => nr.append(mk('td')));
      row.after(nr);
      focusCell(nr.children[idx] || nr.children[0]);
    } else if (op === 'col+') {
      table.querySelectorAll('tr').forEach(r => {
        const ref = r.children[idx], c = mk(ref?.tagName === 'TH' ? 'th' : 'td');
        if (ref) ref.after(c); else r.append(c);
      });
      focusCell(row.children[idx + 1]);
    } else if (op === 'row-') {
      if (table.rows.length <= 1) return tableOp('del');
      const next = row.nextElementSibling || row.previousElementSibling;
      row.remove();
      focusCell(next.children[Math.min(idx, next.children.length - 1)]);
    } else if (op === 'col-') {
      if (row.children.length <= 1) return tableOp('del');
      table.querySelectorAll('tr').forEach(r => r.children[idx]?.remove());
      focusCell(row.children[Math.min(idx, row.children.length - 1)]);
    } else if (op === 'del') {
      const p = emptyP();
      table.replaceWith(p);
      focusCell(p);
    }
    afterEdit(); updateTblBar();
  }
  function cellTab(e) {
    const cell = cellOf();
    if (!cell) return false;
    e.preventDefault();
    const cells = () => [...cell.closest('table').querySelectorAll('th, td')];
    const i = cells().indexOf(cell) + (e.shiftKey ? -1 : 1);
    if (i < 0) return true;
    if (i >= cells().length) tableOp('row+');
    else focusCell(cells()[i]);
    return true;
  }
  function updateTblBar() {
    const cell = cellOf();
    if (!cell || document.activeElement?.closest?.('.cb-ta')) { tblBar.hidden = true; return; }
    const t = cell.closest('table').getBoundingClientRect(), sr = $('#scroll').getBoundingClientRect();
    if (t.bottom < sr.top || t.top > sr.bottom) { tblBar.hidden = true; return; }
    tblBar.hidden = false;
    tblBar.style.left = clamp(t.left, 8, innerWidth - tblBar.offsetWidth - 8) + 'px';
    tblBar.style.top = Math.max(t.top - tblBar.offsetHeight - 6, sr.top + 4) + 'px';
  }
  tblBar.addEventListener('mousedown', e => e.preventDefault());
  tblBar.addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (b) tableOp(b.dataset.t); });

  /* selection bubble */
  let selecting = false, bubbleTimer = null;
  function updateBubble() {
    const s = getSelection();
    const ok = s.rangeCount && !s.isCollapsed && editor.contains(s.anchorNode) && !caretEl()?.closest('.code-block')
      && !document.activeElement?.closest?.('.cb-ta');
    const rect = ok ? s.getRangeAt(0).getBoundingClientRect() : null;
    if (!rect || (!rect.width && !rect.height)) { bubble.hidden = true; return; }
    bubble.hidden = false;
    bubble.style.left = clamp(rect.left + rect.width / 2 - bubble.offsetWidth / 2, 8, innerWidth - bubble.offsetWidth - 8) + 'px';
    bubble.style.top = Math.max(rect.top - bubble.offsetHeight - 8, 8) + 'px';
  }
  editor.addEventListener('pointerdown', () => { selecting = true; });
  document.addEventListener('pointerup', () => { if (selecting) { selecting = false; setTimeout(updateBubble, 10); } });
  document.addEventListener('selectionchange', () => {
    updateTblBar();
    if (selecting) return;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(updateBubble, 150);
  });
  $('#scroll').addEventListener('scroll', () => { bubble.hidden = true; closeSlash(); updateTblBar(); });
  bubble.addEventListener('mousedown', e => e.preventDefault());
  bubble.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.cmd) exec(b.dataset.cmd);
    else if (b.dataset.tool === 'inline-code') inlineCode();
    else if (b.dataset.tool === 'hl') exec('hiliteColor', HL_COLORS[0]);
    else if (b.dataset.tool === 'link') { bubble.hidden = true; addLink(); return; }
    updateBubble();
  });

  /* links between notes */
  function pickNoteLink() {
    if (paper.hidden) return;
    openPalette({
      placeholder: 'Link to which note?',
      onPick: n => {
        restore();
        document.execCommand('insertHTML', false, `<a class="note-link" data-note="${n.id}" href="#">${esc(n.title || 'Untitled note')}</a>&nbsp;`);
        afterEdit();
      },
    });
  }
  function refreshNoteLinks() {
    editor.querySelectorAll('a.note-link').forEach(a => {
      const t = getNote(a.dataset.note);
      if (t) a.textContent = t.title || 'Untitled note';
      a.classList.toggle('broken', !t);
    });
  }
  function renderBacklinks() {
    const n = activeNote();
    const from = n ? state.notes.filter(x => x.id !== n.id && (x.html || '').includes(`data-note="${n.id}"`)) : [];
    backlinksEl.hidden = !from.length;
    backlinksEl.innerHTML = from.length ? '<h4>Linked from</h4>' + from.map(x => `<button type="button" class="tag" data-id="${x.id}">${esc(x.title || 'Untitled note')}</button>`).join('') : '';
  }
  backlinksEl.addEventListener('click', e => {
    const b = e.target.closest('[data-id]');
    const t = b && getNote(b.dataset.id);
    if (t) revealNote(t);
  });

  /* ---------- version history, word goal, study timer, focus mode, shortcuts ---------- */
  function saveVersion(n, html, title, label = '') {
    if (n.lock) return;
    n.versions = n.versions || [];
    n.versions.push({ t: label ? Date.now() : n.updatedAt || Date.now(), at: Date.now(), title, html, label });
    while (n.versions.length > 10) n.versions.shift();
    let size = n.versions.reduce((a, v) => a + v.html.length, 0);
    while (size > 1.5e6 && n.versions.length > 1) size -= n.versions.shift().html.length;
  }
  function autoVersion(n) {
    const last = n.versions?.at(-1);
    if (!last || Date.now() - last.at > 10 * 60 * 1000) saveVersion(n, n.html, n.title);
  }

  function historyDialog() {
    const n = activeNote();
    if (!n) return;
    flushSave();
    const vs = [...(n.versions || [])].reverse();
    const when = ms => new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const words = html => textFromHtml(html).trim().split(/\s+/).filter(Boolean).length;
    openPanel(`<h3>Version history</h3>
      <p>${vs.length ? 'Earlier versions are saved automatically while you edit. Pick one to preview it.' : 'No earlier versions yet. They appear after you have edited this note for a while.'}</p>
      <div class="hist-grid">
        <div class="hist-list">${vs.map((v, i) => `<button type="button" class="hist-item" data-v="${i}"><b>${esc(when(v.t))}</b><small>${esc(v.label || words(v.html) + ' words')}</small></button>`).join('')}</div>
        <div class="editor hist-prev cz-preview"><p>Select a version on the left.</p></div>
      </div>
      <div class="dlg-row end"><button type="button" class="btn primary" data-act="restore" disabled>Restore this version</button>
      <button type="button" class="btn ghost" data-act="close">Close</button></div>`);
    const preview = dlg.querySelector('.hist-prev'), restoreBtn = dlg.querySelector('[data-act="restore"]');
    let sel = -1;
    dlg.onclick = e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.v !== undefined) {
        sel = +b.dataset.v;
        dlg.querySelectorAll('.hist-item').forEach(x => x.classList.toggle('on', x === b));
        const d = document.createElement('div');
        d.innerHTML = vs[sel].html;
        stubsToPre(d);
        preview.innerHTML = d.innerHTML;
        restoreBtn.disabled = false;
      } else if (b.dataset.act === 'restore' && sel >= 0) {
        const v = vs[sel];
        saveVersion(n, serialize(), titleInput.value, 'Before restore');
        n.html = v.html; n.title = v.title ?? n.title; n.text = textFromHtml(v.html); n.updatedAt = Date.now();
        persist(); renderTree(); loadActive();
        dlg.close();
        setStatus('\u2713 Version restored');
      } else if (b.dataset.act === 'close') dlg.close();
    };
  }
  $('#btnHistory').onclick = historyDialog;

  async function goalDialog() {
    const n = activeNote();
    if (!n) return;
    const val = await ask({ title: 'Word-count goal', message: 'How many words do you want this note to reach? Leave empty to remove the goal.', value: n.goal ? String(n.goal) : '', placeholder: 'e.g. 500', ok: 'Save' });
    if (val === null) return;
    const g = parseInt(val, 10);
    if (g > 0) n.goal = g; else delete n.goal;
    persist(); renderMeta();
  }
  metaEl.addEventListener('click', e => { if (e.target.closest('#goalBtn')) goalDialog(); });

  const POMO = { focus: 25 * 60, break: 5 * 60 };
  const pomo = { mode: 'focus', left: POMO.focus, end: 0, timer: null, done: 0 };
  function beep() {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.25, 0.5].forEach(d => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.frequency.value = 880; g.gain.value = 0.08;
        o.connect(g); g.connect(ac.destination);
        o.start(ac.currentTime + d); o.stop(ac.currentTime + d + 0.15);
      });
      setTimeout(() => ac.close(), 1200);
    } catch { /* audio unavailable */ }
  }
  function paintPomo() {
    const btn = $('#pomoBtn');
    $('#pomoTime').textContent = `${String(Math.floor(pomo.left / 60)).padStart(2, '0')}:${String(pomo.left % 60).padStart(2, '0')}`;
    btn.classList.toggle('running', pomo.timer !== null);
    btn.classList.toggle('break', pomo.mode === 'break');
    btn.title = `${pomo.mode === 'focus' ? 'Focus' : 'Break'} timer - click to ${pomo.timer !== null ? 'pause' : 'start'} (${pomo.done} focus session${pomo.done === 1 ? '' : 's'} done)`;
  }
  async function tickPomo() {
    pomo.left = Math.max(0, Math.round((pomo.end - Date.now()) / 1000));
    paintPomo();
    if (pomo.left > 0) return;
    clearInterval(pomo.timer); pomo.timer = null;
    beep();
    const wasFocus = pomo.mode === 'focus';
    if (wasFocus) pomo.done++;
    pomo.mode = wasFocus ? 'break' : 'focus';
    pomo.left = POMO[pomo.mode];
    paintPomo();
    const msg = wasFocus ? `Focus session ${pomo.done} complete. Time for a 5 minute break.` : 'Break over. Ready for another focus session?';
    if (dlg.open) { setStatus(msg); return; }
    if (await ask({ title: wasFocus ? 'Nice work!' : 'Break over', message: msg, ok: wasFocus ? 'Start break' : 'Start focus' })) togglePomo();
  }
  function togglePomo() {
    if (pomo.timer !== null) { clearInterval(pomo.timer); pomo.timer = null; }
    else { pomo.end = Date.now() + pomo.left * 1000; pomo.timer = setInterval(tickPomo, 500); }
    paintPomo();
  }
  $('#pomoBtn').onclick = togglePomo;
  $('#pomoReset').onclick = () => { clearInterval(pomo.timer); pomo.timer = null; pomo.mode = 'focus'; pomo.left = POMO.focus; paintPomo(); };
  paintPomo();

  function toggleFocus(on = !app.classList.contains('focus')) {
    app.classList.toggle('focus', on);
    $('#focusExit').hidden = !on;
    if (on) editor.focus();
    requestAnimationFrame(fitAll);
  }
  $('#btnFocus').onclick = () => toggleFocus();
  $('#focusExit').onclick = () => toggleFocus(false);

  function shortcutsDialog() {
    const groups = [
      ['General', [['Ctrl+K', 'Command palette'], ['Ctrl+F', 'Find'], ['Ctrl+H', 'Find and replace'], ['Ctrl+S', 'Save now'], ['Ctrl+Shift+F', 'Focus mode'], ['?', 'This list']]],
      ['Writing', [['Ctrl+B / I / U', 'Bold, italic, underline'], ['Ctrl+Alt+C', 'Code block'], ['/', 'Command menu (headings, table, chart...)'], ['[[', 'Link to another note'], ['Tab', 'Next table cell'], ['Esc', 'Close menus, leave focus mode']]],
      ['Type, then press Space', [['# ## ###', 'Heading 1-3'], ['- or *', 'Bullet list'], ['1.', 'Numbered list'], ['[]', 'Checklist'], ['>', 'Quote']]],
      ['Type, then press Enter or finish', [['---', 'Divider'], ['``` lang', 'Code block'], ['**text**', 'Bold'], ['`text`', 'Inline code']]],
    ];
    openPanel(`<h3>Keyboard shortcuts</h3><div class="keys-grid">${groups.map(([title, rows]) => `<div><h4 class="cz-h">${title}</h4>
      ${rows.map(([k, d]) => `<div class="key-row"><kbd>${esc(k)}</kbd><span>${esc(d)}</span></div>`).join('')}</div>`).join('')}</div>
      <div class="dlg-row end"><button type="button" class="btn primary" data-act="close">Close</button></div>`, 'mid');
    dlg.onclick = e => { if (e.target.closest('[data-act="close"]')) dlg.close(); };
  }
  $('#btnKeys').onclick = shortcutsDialog;

  /* ---------- encryption, diary lock, journal ---------- */
  const lockedView = $('#lockedView'), lockedPw = $('#lockedPw'), lockedErr = $('#lockedErr'), lockedForgot = $('#lockedForgot');
  const textEnc = new TextEncoder(), textDec = new TextDecoder();
  const PBKDF2_ITER = 600000;
  // Only these fields are sealed inside a locked note; everything else stays visible so the note can be listed.
  const LOCK_FIELDS = ['title', 'html', 'text', 'tags', 'goal', 'review', 'reviewStep'];
  const cryptoOk = !!(window.crypto && crypto.subtle);
  let lockTimer = null;

  function b64(buf) {
    const a = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode(...a.subarray(i, i + 0x8000));
    return btoa(s);
  }
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function deriveKey(password, salt, iter = PBKDF2_ITER) {
    const base = await crypto.subtle.importKey('raw', textEnc.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: Math.min(iter | 0, 5e6), hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  async function encryptText(key, text) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, textEnc.encode(text));
    return { iv: b64(iv), data: b64(ct) };
  }
  async function decryptText(key, blob) {
    return textDec.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(blob.iv) }, key, unb64(blob.data)));
  }
  const pickLocked = n => Object.fromEntries(LOCK_FIELDS.filter(k => n[k] !== undefined).map(k => [k, n[k]]));

  // Locked notes are written as a whitelisted copy, so no plain field can leak into the saved data.
  async function sealedView(n) {
    if (n._open && diaryKey) {
      const plain = JSON.stringify(pickLocked(n));
      if (plain !== n._plainSig) { n.lock = await encryptText(diaryKey, plain); n._plainSig = plain; }
    }
    return { id: n.id, folderId: n.folderId, createdAt: n.createdAt, updatedAt: n.updatedAt, pinned: n.pinned, lock: n.lock };
  }
  const sealedCopy = n => (n.lock ? sealedView(n) : n);

  async function serializeState() {
    const notes = [];
    for (const n of state.notes) notes.push(n.lock ? await sealedView(n) : n);
    const json = JSON.stringify({ ...state, notes });
    if (!encKey) return json;
    const { iv, data } = await encryptText(encKey, json);
    return JSON.stringify({ enc: 1, v: 1, kdf: 'PBKDF2-SHA256', iter: encMeta.iter, salt: encMeta.salt, ...(encMeta.rec ? { rec: encMeta.rec } : {}), iv, data });
  }

  // Recovery: the password is encrypted under a key derived from the user's own answer.
  const normAnswer = a => String(a).trim().toLowerCase().replace(/\s+/g, ' ');
  async function makeRecovery(pw, rec) {
    if (!rec || rec.remove) return null;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveKey(normAnswer(rec.answer), salt);
    return { q: rec.question, salt: b64(salt), iter: PBKDF2_ITER, blob: await encryptText(key, pw) };
  }
  async function openRecovery(rec, answer) {
    try { return await decryptText(await deriveKey(normAnswer(answer), unb64(rec.salt), rec.iter), rec.blob); } catch { return null; }
  }

  async function setMaster(key, meta) {
    encKey = key; encMeta = meta;
    encCheck = key ? await encryptText(key, 'ok') : null;
  }
  async function verifyMaster(pw) {
    try {
      const k = await deriveKey(pw, unb64(encMeta.salt), encMeta.iter);
      return (await decryptText(k, encCheck)) === 'ok' ? null : 'Wrong password.';
    } catch { return 'Wrong password.'; }
  }
  function updateSecurityUi() { $('#btnSecurity').classList.toggle('on', !!encKey); }

  function closeDlg() {
    return new Promise(res => {
      if (!dlg.open) return res();
      dlg.addEventListener('close', () => setTimeout(res), { once: true });
      dlg.close();
    });
  }

  function promptRecovery({ allowRemove = false, note = '' } = {}) {
    return new Promise(resolve => {
      openPanel(`<h3>Recovery question</h3>
        <p>Optional. If you forget your password, answering this question gets you back in. Write both yourself. ${esc(note)}</p>
        <p>The question is stored unencrypted, so keep it non-private. Anyone who can guess the answer can open your notes, so choose an answer only you know.</p>
        <input id="rqQ" placeholder="Your question, e.g. Which book changed how I study?" autocomplete="off" maxlength="120">
        <input id="rqA" type="password" placeholder="Your answer" autocomplete="off" maxlength="120">
        <input id="rqB" type="password" placeholder="Repeat the answer" autocomplete="off" maxlength="120">
        <p class="lock-err" id="rqErr"></p>
        <div class="dlg-row end">${allowRemove ? '<button type="button" class="btn ghost" data-act="remove">Remove recovery question</button>' : ''}
        <button type="button" class="btn ghost" data-act="skip">${allowRemove ? 'Cancel' : 'Skip'}</button>
        <button type="button" class="btn primary" data-act="ok">Save question</button></div>`, '');
      const q = dlg.querySelector('#rqQ'), a = dlg.querySelector('#rqA'), b = dlg.querySelector('#rqB'), err = dlg.querySelector('#rqErr');
      let done = false;
      const finish = v => {
        if (done) return;
        done = true;
        if (dlg.open) { dlg.addEventListener('close', () => setTimeout(() => resolve(v)), { once: true }); dlg.close(); }
        else setTimeout(() => resolve(v));
      };
      const submit = () => {
        const question = q.value.trim();
        if (question.length < 5) { err.textContent = 'Write a question of at least 5 characters.'; return; }
        if (normAnswer(a.value).length < 4) { err.textContent = 'The answer needs at least 4 characters.'; return; }
        if (normAnswer(a.value) !== normAnswer(b.value)) { err.textContent = 'The two answers do not match.'; return; }
        finish({ question, answer: a.value });
      };
      dlg.onclick = e => {
        const act = e.target.closest('button')?.dataset.act;
        if (act === 'ok') submit();
        else if (act === 'skip') finish(null);
        else if (act === 'remove') finish({ remove: true });
      };
      dlg.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }));
      dlg.addEventListener('close', () => finish(null), { once: true });
      q.focus();
    });
  }

  function promptPassword({ title, message, ok = 'OK', confirm = false, cancellable = true, validate = null, recover = null }) {
    return new Promise(resolve => {
      openPanel(`<h3>${esc(title)}</h3><p>${esc(message)}</p>
        <input id="pwA" type="password" placeholder="Password" autocomplete="off">
        ${confirm ? '<input id="pwB" type="password" placeholder="Repeat password" autocomplete="off">' : ''}
        ${recover ? '<p id="pwQ" hidden></p><input id="pwAns" type="password" placeholder="Your answer" autocomplete="off" hidden>' : ''}
        <p class="lock-err" id="pwErr"></p>
        <div class="dlg-row end">${recover ? '<button type="button" class="btn ghost" data-act="forgot">Forgot password?</button>' : ''}
        ${cancellable ? '<button type="button" class="btn ghost" data-act="cancel">Cancel</button>' : ''}
        <button type="button" class="btn primary" data-act="ok">${esc(ok)}</button></div>`, '');
      const a = dlg.querySelector('#pwA'), b = dlg.querySelector('#pwB'), err = dlg.querySelector('#pwErr');
      const ans = dlg.querySelector('#pwAns'), qEl = dlg.querySelector('#pwQ'), forgotBtn = dlg.querySelector('[data-act="forgot"]');
      const okBtn = dlg.querySelector('[data-act="ok"]');
      const block = e => e.preventDefault();
      if (!cancellable) dlg.addEventListener('cancel', block);
      let done = false, recovering = false;
      const finish = v => {
        if (done) return;
        done = true;
        dlg.removeEventListener('cancel', block);
        if (dlg.open) { dlg.addEventListener('close', () => setTimeout(() => resolve(v)), { once: true }); dlg.close(); }
        else setTimeout(() => resolve(v));
      };
      const setMode = on => {
        recovering = on;
        a.hidden = on; ans.hidden = !on; qEl.hidden = !on;
        qEl.textContent = on ? 'Your question: ' + recover.question : '';
        okBtn.textContent = on ? 'Recover access' : ok;
        forgotBtn.textContent = on ? 'Use password instead' : 'Forgot password?';
        err.textContent = '';
        (on ? ans : a).focus();
      };
      const submit = async () => {
        let pw = recovering ? ans.value : a.value;
        err.textContent = '';
        if (!pw) { err.textContent = recovering ? 'Enter your answer.' : 'Enter a password.'; return; }
        if (confirm && !recovering) {
          if (pw.length < 8) { err.textContent = 'Use at least 8 characters.'; return; }
          if (pw !== b.value) { err.textContent = 'The two passwords do not match.'; return; }
        }
        okBtn.disabled = true; err.textContent = 'Working...';
        if (recovering) {
          pw = await recover.tryAnswer(pw);
          if (!pw) { okBtn.disabled = false; err.textContent = 'That answer does not match.'; ans.select(); return; }
        }
        const bad = validate ? await validate(pw) : null;
        if (bad) { okBtn.disabled = false; err.textContent = bad; (recovering ? ans : a).select(); return; }
        finish(pw);
      };
      dlg.onclick = e => {
        const act = e.target.closest('button')?.dataset.act;
        if (act === 'ok') submit();
        else if (act === 'cancel') finish(null);
        else if (act === 'forgot') setMode(!recovering);
      };
      dlg.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }));
      dlg.addEventListener('close', () => finish(null), { once: true });
      a.focus();
    });
  }

  // Resolves to { state, key?, meta? }, or null when the data is unreadable or the password prompt is cancelled.
  async function stateFromRaw(raw, { cancellable }) {
    if (!raw) return null;
    let obj;
    try { obj = JSON.parse(raw); } catch { return null; }
    if (!obj || obj.enc !== 1) { const s = parseState(raw); return s ? { state: s } : null; }
    if (!cryptoOk) {
      await ask({ title: 'Encrypted data', message: 'These notes are encrypted, but encryption is not available in this window.', ok: 'OK' });
      return null;
    }
    if (encKey && encMeta?.salt === obj.salt) {
      try { const s = parseState(await decryptText(encKey, obj)); if (s) return { state: s }; } catch { /* ask for the password instead */ }
    }
    let result = null;
    await promptPassword({
      title: 'Unlock Study Notepad',
      message: cancellable ? 'This file is encrypted. Enter the password it was saved with.' : 'Your notes are encrypted. Enter your password to open them.',
      ok: 'Unlock', cancellable,
      recover: obj.rec ? { question: obj.rec.q, tryAnswer: a => openRecovery(obj.rec, a) } : null,
      validate: async pw => {
        try {
          const k = await deriveKey(pw, unb64(obj.salt), obj.iter);
          const s = parseState(await decryptText(k, obj));
          if (!s) return 'This file is not a Study Notepad backup.';
          result = { state: s, key: k, meta: { salt: obj.salt, iter: obj.iter, rec: obj.rec || null } };
          return null;
        } catch { return 'Wrong password.'; }
      },
    });
    return result;
  }

  /* diary lock */
  async function openAllSealed() {
    for (const n of state.notes) {
      if (!n.lock || n._open || !n.lock.data) continue;
      try {
        const p = JSON.parse(await decryptText(diaryKey, n.lock));
        LOCK_FIELDS.forEach(k => { if (p[k] !== undefined) n[k] = p[k]; });
        n._open = true;
        n._plainSig = JSON.stringify(pickLocked(n));
      } catch { /* wrong key for this note: it stays locked */ }
    }
  }
  const checkDiary = async pw => {
    try {
      const k = await deriveKey(pw, unb64(state.diary.salt), state.diary.iter);
      return (await decryptText(k, state.diary.check)) === 'diary-ok' ? k : null;
    } catch { return null; }
  };
  async function tryDiaryPassword(pw) {
    const k = await checkDiary(pw);
    if (!k) return false;
    diaryKey = k;
    await openAllSealed();
    resetLockTimer();
    renderTree(); loadActive();
    return true;
  }
  async function setupDiary() {
    const rec = await promptRecovery();
    const pw = await promptPassword({
      title: 'Create a diary password',
      message: 'Locked notes and journal entries are encrypted with this password. It is separate from any app password. If you forget it and have no recovery question, they cannot be recovered.',
      confirm: true, ok: 'Create',
    });
    if (!pw) return false;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    diaryKey = await deriveKey(pw, salt);
    state.diary = { salt: b64(salt), iter: PBKDF2_ITER, check: await encryptText(diaryKey, 'diary-ok'), rec: await makeRecovery(pw, rec) };
    persist(); resetLockTimer();
    return true;
  }
  async function unlockDiary() {
    if (diaryKey) return true;
    if (!cryptoOk) { await ask({ title: 'Not available', message: 'Encryption is not available in this window.', ok: 'OK' }); return false; }
    if (!state.diary) return setupDiary();
    const pw = await promptPassword({
      title: 'Unlock diary', message: 'Enter your diary password to open locked notes.', ok: 'Unlock',
      recover: state.diary.rec ? { question: state.diary.rec.q, tryAnswer: a => openRecovery(state.diary.rec, a) } : null,
      validate: async p => ((await tryDiaryPassword(p)) ? null : 'Wrong password.'),
    });
    return !!pw && !!diaryKey;
  }
  function resetDiarySession() { diaryKey = null; clearTimeout(lockTimer); }
  async function lockDiary(silent = false) {
    if (!diaryKey) return;
    flushSave(); persist();
    await drained();
    resetDiarySession();
    state.notes.forEach(n => {
      if (!n.lock) return;
      LOCK_FIELDS.forEach(k => delete n[k]);
      delete n._open; delete n._plainSig;
    });
    if (!fb.hidden) closeFind();
    renderTree(); loadActive();
    if (!silent) setStatus('Diary locked');
  }
  function resetLockTimer() {
    clearTimeout(lockTimer);
    const mins = state.security?.autoLock ?? 5;
    if (diaryKey && mins > 0) lockTimer = setTimeout(() => lockDiary(), mins * 60000);
  }
  ['keydown', 'pointerdown', 'wheel'].forEach(ev => document.addEventListener(ev, () => { if (diaryKey) resetLockTimer(); }, { passive: true }));

  async function lockNote(n) {
    if (!n || n.lock) return;
    if (!(await unlockDiary())) return;
    flushSave();
    n.lock = { pending: true }; n._open = true;
    delete n._plainSig; delete n.versions;
    persist(); renderTree(); renderCrumbs();
    setStatus('Note locked. Older copies in backups or Drive history are not changed.');
  }
  async function removeNoteLock(n) {
    if (!n?.lock || !n._open) return;
    const ok = await ask({ title: 'Remove the lock?', message: 'This note will be stored without the diary lock.', ok: 'Remove lock', danger: true });
    if (!ok) return;
    delete n.lock; delete n._open; delete n._plainSig;
    persist(); renderTree(); renderCrumbs();
  }

  async function journalEntry() {
    if (!(await unlockDiary())) return;
    let f = state.folders.find(x => x.journal);
    if (!f) { f = { id: uid(), name: 'Journal', parentId: null, open: true, journal: true }; state.folders.push(f); }
    f.open = true;
    const title = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const existing = state.notes.find(n => n.folderId === f.id && n.title === title);
    if (existing) return openNote(existing.id);
    newNote({
      folderId: f.id, title,
      html: '<h2>How was today?</h2><p><br></p><h2>Highlights</h2><ul><li><br></li></ul><h2>Grateful for</h2><ul><li><br></li></ul>',
    });
    editor.focus();
  }

  function updateLockBtn() {
    const n = activeNote(), b = $('#btnLock');
    b.hidden = !n;
    b.classList.toggle('on', !!(n && n.lock));
    b.innerHTML = svg(n && n.lock ? 'lock' : 'unlock');
    b.title = n && n.lock ? 'Locked note: options' : 'Lock this note with your diary password';
  }
  function toggleLockMenu(btn) {
    if (!pop.hidden && pop.dataset.cmd === 'lock') { pop.hidden = true; return; }
    const n = activeNote();
    if (!n) return;
    pop.dataset.cmd = 'lock';
    const items = [];
    if (!n.lock) items.push(['Lock this note', () => lockNote(n)]);
    else if (n._open) items.push(['Remove lock from this note', () => removeNoteLock(n)]);
    items.push(diaryKey ? ['Lock diary now', () => lockDiary()] : ['Unlock diary', () => unlockDiary()]);
    items.push(['Privacy and security...', () => securityDialog()]);
    pop.innerHTML = `<h4>Privacy</h4><div class="menu">${items.map(([l], i) => `<button type="button" data-i="${i}"><span>${l}</span></button>`).join('')}</div>`;
    const r = btn.getBoundingClientRect();
    pop.hidden = false;
    pop.style.left = Math.min(r.left, innerWidth - pop.offsetWidth - 8) + 'px';
    pop.style.top = r.bottom + 6 + 'px';
    pop.onmousedown = e => e.preventDefault();
    pop.onclick = e => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      pop.hidden = true;
      items[+b.dataset.i][1]();
    };
  }
  $('#btnLock').onclick = e => toggleLockMenu(e.currentTarget);
  $('#btnJournal').onclick = journalEntry;
  lockedForgot.onclick = () => unlockDiary();
  $('#lockedForm').addEventListener('submit', async e => {
    e.preventDefault();
    lockedErr.textContent = 'Checking...';
    const ok = state.diary ? await tryDiaryPassword(lockedPw.value) : false;
    if (!ok) { lockedErr.textContent = 'Wrong password.'; lockedPw.select(); }
  });

  /* whole-data encryption */
  async function enableEncryption() {
    const rec = await promptRecovery();
    const pw = await promptPassword({
      title: 'Encrypt all data',
      message: 'Choose a password. You will need it each time the app opens. If you forget it and have no recovery question, your notes cannot be recovered.',
      confirm: true, ok: 'Encrypt',
    });
    if (!pw) return;
    setStatus('Encrypting...');
    const salt = crypto.getRandomValues(new Uint8Array(16));
    await setMaster(await deriveKey(pw, salt), { salt: b64(salt), iter: PBKDF2_ITER, rec: await makeRecovery(pw, rec) });
    flushSave(); persist();
    await drained();
    let removed = 0;
    if (api?.purge_plain_backups) { try { removed = (await api.purge_plain_backups()).removed || 0; } catch { /* keep going */ } }
    updateSecurityUi();
    setStatus('\u2713 Encryption is on');
    await ask({
      title: 'Encryption is on',
      message: 'Your notes are now saved as encrypted data.' + (removed ? ` ${removed} old unencrypted backup file(s) were deleted.` : '')
        + (api ? ' Sync to Google Drive once to replace the online copy; older versions may remain in Drive\'s version history.' : ''),
      ok: 'OK',
    });
  }
  async function disableEncryption() {
    const pw = await promptPassword({ title: 'Turn off encryption', message: 'Enter your password. Your notes will be saved unencrypted again.', ok: 'Turn off', validate: verifyMaster });
    if (!pw) return;
    await setMaster(null, null);
    persist(); await drained();
    updateSecurityUi();
    setStatus('Encryption is off');
  }
  async function changeMasterPassword() {
    const old = await promptPassword({ title: 'Change password', message: 'Enter your current password.', ok: 'Next', validate: verifyMaster });
    if (!old) return;
    const rec = await promptRecovery({ note: 'Skipping this removes your old recovery question.' });
    const pw = await promptPassword({ title: 'New password', message: 'Choose a new password for your notes.', confirm: true, ok: 'Change' });
    if (!pw) return;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    await setMaster(await deriveKey(pw, salt), { salt: b64(salt), iter: PBKDF2_ITER, rec: await makeRecovery(pw, rec) });
    persist(); await drained();
    setStatus('\u2713 Password changed');
  }
  async function changeDiaryPassword() {
    if (!diaryKey && !(await unlockDiary())) return;
    const old = await promptPassword({ title: 'Change diary password', message: 'Enter your current diary password.', ok: 'Next', validate: async p => ((await checkDiary(p)) ? null : 'Wrong password.') });
    if (!old) return;
    const rec = await promptRecovery({ note: 'Skipping this removes your old recovery question.' });
    const pw = await promptPassword({ title: 'New diary password', message: 'Choose a new diary password.', confirm: true, ok: 'Change' });
    if (!pw) return;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    diaryKey = await deriveKey(pw, salt);
    state.diary = { salt: b64(salt), iter: PBKDF2_ITER, check: await encryptText(diaryKey, 'diary-ok'), rec: await makeRecovery(pw, rec) };
    state.notes.forEach(n => { if (n.lock && n._open) delete n._plainSig; });
    persist(); await drained();
    setStatus('\u2713 Diary password changed');
  }

  async function editMasterRecovery() {
    const pw = await promptPassword({ title: 'Recovery question', message: 'Enter your current password to continue.', ok: 'Next', validate: verifyMaster });
    if (!pw) return;
    const rec = await promptRecovery({ allowRemove: !!encMeta.rec });
    if (!rec) return;
    encMeta = { ...encMeta, rec: await makeRecovery(pw, rec) };
    persist(); await drained();
    setStatus(encMeta.rec ? '\u2713 Recovery question saved' : 'Recovery question removed');
  }
  async function editDiaryRecovery() {
    const pw = await promptPassword({ title: 'Recovery question', message: 'Enter your current diary password to continue.', ok: 'Next', validate: async p => ((await checkDiary(p)) ? null : 'Wrong password.') });
    if (!pw) return;
    const rec = await promptRecovery({ allowRemove: !!state.diary.rec });
    if (!rec) return;
    state.diary = { ...state.diary, rec: await makeRecovery(pw, rec) };
    persist(); await drained();
    setStatus(state.diary.rec ? '\u2713 Recovery question saved' : 'Recovery question removed');
  }

  function securityDialog() {
    const on = !!encKey, hasDiary = !!state.diary, mins = state.security?.autoLock ?? 5;
    openPanel(`<h3>Privacy and security</h3>
      <h4 class="cz-h">Encrypt all my data</h4>
      <p>${on ? 'On. Your notes file, backups and Drive copy are stored as encrypted data.' : 'Off. Turn it on to store everything (notes file, backups and the Drive copy) as encrypted data that needs your password to open.'}</p>
      <div class="dlg-row">${on ? `<button type="button" class="btn" data-act="chgpw">Change password</button><button type="button" class="btn" data-act="mrec">${encMeta?.rec ? 'Change' : 'Add'} recovery question</button><button type="button" class="btn ghost" data-act="encoff">Turn off</button>`
        : '<button type="button" class="btn primary" data-act="encon">Turn on encryption</button>'}</div>
      <h4 class="cz-h">Diary lock</h4>
      <p>${hasDiary ? (diaryKey ? 'Unlocked: locked notes are readable until you lock it.' : 'Locked.') : 'Not set up yet. You create a diary password when you lock your first note or start a journal entry.'}</p>
      <div class="dlg-row">${hasDiary
        ? (diaryKey ? '<button type="button" class="btn" data-act="dlock">Lock now</button><button type="button" class="btn ghost" data-act="dchg">Change diary password</button>'
          : '<button type="button" class="btn primary" data-act="dunlock">Unlock</button>')
          + `<button type="button" class="btn ghost" data-act="drec">${state.diary.rec ? 'Change' : 'Add'} recovery question</button>`
        : '<button type="button" class="btn primary" data-act="dsetup">Set up diary password</button>'}</div>
      <label class="cz-field">Lock the diary automatically after
        <select data-al class="tb-select">${[[1, '1 minute'], [5, '5 minutes'], [15, '15 minutes'], [30, '30 minutes'], [0, 'Never']].map(([v, l]) => `<option value="${v}" ${v === mins ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <p>Passwords are never stored. A recovery question is the only way back in if you forget a password; without one the data cannot be recovered. Encryption protects files at rest: it does not help while the app is unlocked, or against malware on this computer. Locked notes are not included in search while locked.</p>
      <div class="dlg-row end"><button type="button" class="btn primary" data-act="close">Done</button></div>`, 'mid');
    dlg.onchange = e => {
      if (!e.target.matches('[data-al]')) return;
      state.security = { ...state.security, autoLock: +e.target.value };
      persist(); resetLockTimer();
    };
    dlg.onclick = async e => {
      const act = e.target.closest('button')?.dataset.act;
      if (!act) return;
      await closeDlg();
      if (act === 'encon') await enableEncryption();
      else if (act === 'encoff') await disableEncryption();
      else if (act === 'chgpw') await changeMasterPassword();
      else if (act === 'mrec') await editMasterRecovery();
      else if (act === 'drec') await editDiaryRecovery();
      else if (act === 'dsetup' || act === 'dunlock') await unlockDiary();
      else if (act === 'dlock') await lockDiary();
      else if (act === 'dchg') await changeDiaryPassword();
      if (act !== 'close') securityDialog();
    };
  }
  $('#btnSecurity').onclick = securityDialog;

  /* ---------- global actions ---------- */
  $('#btnDaily').onclick = dailyNote;
  $('#btnEmptyDaily').onclick = dailyNote;
  $('#btnNewNote').onclick = () => newNote();
  $('#btnNewFolder').onclick = () => addFolder(null);
  $('#btnSidebar').onclick = () => app.classList.toggle('side-closed');
  searchEl.addEventListener('input', renderTree);

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    applyCustom();
    applyLayout();
    $('#btnTheme').innerHTML = svg(state.theme === 'dark' ? 'sun' : 'moon');
  }
  $('#btnTheme').onclick = () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    state.custom = { ...state.custom, colors: null };
    persist(); applyTheme();
  };

  $('#btnBackup').onclick = async () => {
    flushSave();
    if (api) {
      await drained();
      const r = await api.export_backup();
      setStatus(r.ok ? r.message : r.message || 'Backup failed');
      return;
    }
    const blob = new Blob([await serializeState()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `study-notepad-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  async function restoreFromText(text) {
    const loaded = await stateFromRaw(text, { cancellable: true });
    if (!loaded) return ask({ title: 'Could not open backup', message: 'That file is not a Study Notepad backup, or the password prompt was cancelled.', ok: 'OK' });
    const ok = await ask({ title: 'Restore backup?', message: 'This replaces all current notes with the backup contents.', ok: 'Restore', danger: true });
    if (!ok) return;
    if (!encKey && loaded.key) await setMaster(loaded.key, loaded.meta);
    resetDiarySession();
    state = { theme: 'dark', activeNoteId: null, selectedFolderId: null, ...loaded.state };
    persist(); applyTheme(); renderTree(); loadActive(); updateSecurityUi();
  }
  $('#btnRestore').onclick = async () => {
    if (!api) return $('#fileRestore').click();
    const r = await api.pick_backup();
    if (r.ok) restoreFromText(r.data);
    else if (r.message) ask({ title: 'Could not open file', message: r.message, ok: 'OK' });
  };
  $('#fileRestore').onchange = async e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) restoreFromText(await file.text());
  };

  async function driveDialog(message = '') {
    if (!api) return ask({ title: 'Desktop app only', message: 'Start the app with main.py to use Google Drive sync.', ok: 'OK' });
    let email = null, draft = { cid: '', sec: '' };

    const draw = async (msg = '', busy = '') => {
      const st = await api.status();
      renderSync(st);
      if (!st.signed_in) email = null;
      else if (email === null && !busy) email = (await api.drive_account()).email || '';
      const off = busy ? 'disabled' : '';
      let body;
      if (!st.configured) {
        body = `<p>Connect Google Drive to keep a copy of your notes online. You sign in on Google's own page, so your Google password is never typed here.</p>
          <p>First create an OAuth client of type "Desktop app" in Google Cloud (with the Drive API enabled), then paste its details or import the downloaded JSON file.</p>
          <input name="cid" placeholder="Client ID" value="${esc(draft.cid)}" autocomplete="off" ${off}>
          <input name="sec" type="password" placeholder="Client secret" value="${esc(draft.sec)}" autocomplete="off" ${off}>
          <div class="dlg-row"><button type="button" class="btn primary" data-drive="save" ${off}>Save</button>
          <button type="button" class="btn" data-drive="import" ${off}>Import JSON file</button>
          <button type="button" class="btn ghost" data-drive="console">Open Google Cloud</button></div>`;
      } else if (!st.signed_in) {
        body = `<p>Credentials saved. Sign in to let Study Notepad store your notes in your Drive.</p>
          <div class="dlg-row"><button type="button" class="btn primary" data-drive="signin" ${off}>Sign in with Google</button>
          <button type="button" class="btn ghost" data-drive="remove" ${off}>Change credentials</button></div>`;
      } else {
        body = `<p>Connected${email ? ' as <b>' + esc(email) + '</b>' : ''}.</p>
          <div class="dlg-row"><button type="button" class="btn primary" data-drive="sync" ${off}>Sync now</button>
          <button type="button" class="btn" data-drive="signout" ${off}>Sign out</button>
          <button type="button" class="btn ghost" data-drive="remove" ${off}>Change credentials</button></div>`;
      }
      dlg.innerHTML = `<form><h3>Google Drive</h3>${body}
        ${busy ? `<p class="dlg-msg">${esc(busy)}</p>` : ''}${msg ? `<p class="dlg-msg err">${esc(msg)}</p>` : ''}
        <div class="dlg-row end"><button type="button" class="btn ghost" data-drive="close">Close</button></div></form>`;
      dlg.querySelector('form').onsubmit = e => { e.preventDefault(); dlg.querySelector('[data-drive="save"]')?.click(); };
    };

    const run = async (fn, busy) => {
      await draw('', busy);
      let r;
      try { r = await fn(); } catch { r = { ok: false, message: 'Something went wrong.' }; }
      if (r.ok) email = null;
      await draw(r.ok ? '' : r.message || '');
      return r;
    };

    dlg.onclick = async e => {
      const act = e.target.closest('[data-drive]')?.dataset.drive;
      if (!act) return;
      if (act === 'close') return dlg.close();
      if (act === 'console') return api.drive_open_console();
      if (act === 'sync') { dlg.close(); return syncDrive(); }
      if (act === 'save') {
        draft = { cid: dlg.querySelector('[name="cid"]').value, sec: dlg.querySelector('[name="sec"]').value };
        const r = await run(() => api.drive_save_client(draft.cid, draft.sec), 'Saving...');
        if (r.ok) draft = { cid: '', sec: '' };
      }
      else if (act === 'import') await run(() => api.drive_import_client(), '');
      else if (act === 'signin') await run(() => api.drive_sign_in(), 'Approve access in the browser window that just opened...');
      else if (act === 'signout') await run(() => api.drive_sign_out(), '');
      else if (act === 'remove') await run(() => api.drive_remove_client(), '');
    };

    await draw(message);
    dlg.addEventListener('close', () => { dlg.onclick = null; }, { once: true });
    dlg.showModal();
  }

  async function syncDrive() {
    if (!api) return ask({ title: 'Desktop app only', message: 'Start the app with main.py to use Google Drive sync.', ok: 'OK' });
    flushSave();
    await drained();
    const st = await api.status();
    if (!st.configured || !st.signed_in) return driveDialog();
    setStatus('Syncing to Google Drive...');
    const r = await api.sync();
    if (r.ok) { renderSync(r); setStatus('Synced to Google Drive'); }
    else { setStatus(''); ask({ title: 'Sync failed', message: r.message, ok: 'OK' }); }
  }
  async function pullDrive() {
    if (!api) return ask({ title: 'Desktop app only', message: 'Start the app with main.py to use Google Drive sync.', ok: 'OK' });
    const st = await api.status();
    if (!st.configured || !st.signed_in) return driveDialog();
    const ok = await ask({ title: 'Restore from Google Drive?', message: 'This replaces the notes on this computer with the copy on Drive. A backup of the current notes is kept in the backups folder.', ok: 'Restore', danger: true });
    if (!ok) return;
    flushSave();
    await drained();
    setStatus('Downloading from Google Drive...');
    const r = await api.pull();
    if (!r.ok) { setStatus(''); return ask({ title: 'Restore failed', message: r.message, ok: 'OK' }); }
    const loaded = await stateFromRaw(await api.load(), { cancellable: true });
    if (!loaded) { setStatus(''); return ask({ title: 'Could not open the Drive copy', message: 'It could not be decrypted or is not a Study Notepad file. The local file was replaced by it, so sync again to overwrite it with the notes currently open.', ok: 'OK' }); }
    if (!encKey && loaded.key) await setMaster(loaded.key, loaded.meta);
    resetDiarySession();
    state = loaded.state;
    applyTheme(); renderTree(); loadActive(); renderSync(r); updateSecurityUi();
    setStatus('Restored from Google Drive');
  }
  $('#btnSync').onclick = syncDrive;
  $('#btnPull').onclick = pullDrive;
  $('#btnDrive').onclick = () => driveDialog();
  $('#syncInfo').onclick = () => driveDialog();

  document.addEventListener('keydown', e => {
    const mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (mod && k === 's') { e.preventDefault(); flushSave(); }
    if (mod && !e.altKey && !e.shiftKey && k === 'k') { e.preventDefault(); palette.hidden ? openPalette() : closePalette(true); }
    if (mod && e.altKey && k === 'c') { e.preventDefault(); insertCodeBlock(); }
    if (mod && !e.altKey && !e.shiftKey && (k === 'f' || k === 'h')) { e.preventDefault(); openFind(k === 'h'); }
    if (mod && e.shiftKey && k === 'f') { e.preventDefault(); toggleFocus(); }
    if (e.key === 'Escape' && app.classList.contains('focus') && palette.hidden && fb.hidden && slash.hidden && !dlg.open) toggleFocus(false);
    if (e.key === '?' && !mod && !e.target.closest?.('input, textarea, select, [contenteditable="true"]')) { e.preventDefault(); shortcutsDialog(); }
    if (e.key === 'F3' && !fb.hidden) { e.preventDefault(); stepMatch(e.shiftKey ? -1 : 1); }
  });
  window.addEventListener('beforeunload', flushSave);

  /* ---------- resizable layout ---------- */
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function applyLayout() {
    const ui = state.ui || {};
    app.style.setProperty('--side-w', (ui.sidebar || 290) + 'px');
    app.style.setProperty('--paper-w', (ui.paper || 860) + 'px');
  }
  function setUi(key, value) {
    state.ui = { ...state.ui, [key]: Math.round(value) };
    applyLayout(); fitAll();
  }
  // begin() runs on pointer-down and returns a function that applies the horizontal drag distance.
  function makeDraggable(handle, begin, reset) {
    handle.addEventListener('pointerdown', e => {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      const startX = e.clientX, apply = begin();
      document.body.classList.add('resizing');
      const move = ev => apply(ev.clientX - startX);
      const up = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        handle.removeEventListener('pointercancel', up);
        document.body.classList.remove('resizing');
        persist();
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
      handle.addEventListener('pointercancel', up);
    });
    handle.addEventListener('dblclick', () => { reset(); applyLayout(); fitAll(); persist(); });
  }
  makeDraggable($('#sideResizer'), () => {
    const start = $('.sidebar').offsetWidth;
    return dx => setUi('sidebar', clamp(start + dx, 200, 520));
  }, () => { delete state.ui?.sidebar; });
  paper.querySelectorAll('.paper-handle').forEach(h => {
    const dir = h.dataset.side === 'left' ? -1 : 1;
    makeDraggable(h, () => {
      const start = paper.offsetWidth, max = Math.min(1600, $('#scroll').clientWidth - 48);
      return dx => setUi('paper', clamp(start + dir * dx * 2, 480, Math.max(480, max)));
    }, () => { delete state.ui?.paper; });
  });

  /* ---------- init ---------- */
  paintIcons();
  document.execCommand('styleWithCSS', false, true);
  document.execCommand('defaultParagraphSeparator', false, 'p');
  (async () => {
    api = await findApi();
    const raw = api ? await api.load() : localStorage.getItem(KEY);
    if (/^\s*\{\s*"enc"\s*:/.test(raw || '')) app.classList.add('vault-locked');
    const loaded = await stateFromRaw(raw, { cancellable: false });
    app.classList.remove('vault-locked');
    if (loaded?.key) await setMaster(loaded.key, loaded.meta);
    state = loaded?.state || seed();
    updateSecurityUi();
    state.trash = (state.trash || []).filter(t => Date.now() - t.at < 30 * 864e5);
    applyTheme();
    applyLayout();
    if (!getNote(state.activeNoteId)) state.activeNoteId = state.notes[0]?.id ?? null;
    persist(); renderTree(); loadActive();
    if (api) renderSync(await api.status());
  })();
})();
