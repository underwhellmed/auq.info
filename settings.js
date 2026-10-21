(() => {
  const defaults = { theme: 'light', color: '#8bb8ff', cloak: 'khan', title: '', protect: true, engine: 'google', backdrop: 'plain', compact: false, motion: false };
  const themes = {
    light: ['Light', '#f4f5f7', '#ffffff', '#191b20', '#737d8e', '#e1e4e9', '#e8ebef', '#4168bf'],
    default: ['Default', '#090909', '#111111', '#eeeeee', '#aaaaaa', '#292929', '#202020', '#cccccc'],
    midnight: ['Midnight', '#0c1423', '#121e32', '#e5edff', '#a0b2cf', '#293952', '#1d2d46', '#8bb8ff'],
    halloween: ['Halloween', '#19110c', '#241a12', '#ffeddf', '#c6a48b', '#473121', '#342419', '#ff9a43'],
    ruby: ['Ruby', '#1b0d13', '#29131d', '#ffe8ee', '#c69da9', '#482534', '#3a1c29', '#ff7897'],
    emerald: ['Emerald', '#0c1914', '#11251d', '#e4fff1', '#9ebdad', '#254536', '#1b3529', '#70dda6'],
    sakura: ['Sakura', '#20131d', '#2c1b28', '#ffedf8', '#c9a6bf', '#4d3045', '#3e2638', '#eda3d0'],
    custom: ['Custom', '#10141b', '#191e28', '#edf2fa', '#adb6c7', '#343e50', '#242d3b', '#8bb8ff']
  };
  const cloaks = { none: ['AUQ', 'A', '#4168bf'], khan: ['Khan Academy | Free Online Courses, Lessons & Practice', 'K', '#14bf96'], docs: ['Untitled document - Google Docs', 'D', '#4285f4'], classroom: ['Home - Classroom', 'C', '#188038'], custom: ['My workspace', 'W', '#758299'] };
  const engines = { google: 'https://www.google.com/search?q=', duckduckgo: 'https://duckduckgo.com/?q=', bing: 'https://www.bing.com/search?q=', brave: 'https://search.brave.com/search?q=' };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('auq_preferences')) || {}; } catch {}
  let prefs = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, typeof saved[key] === typeof value ? saved[key] : value]));
  if (!themes[prefs.theme]) prefs.theme = defaults.theme;
  if (!cloaks[prefs.cloak]) prefs.cloak = defaults.cloak;
  if (!engines[prefs.engine]) prefs.engine = defaults.engine;
  if (!/^#[0-9a-f]{6}$/i.test(prefs.color)) prefs.color = defaults.color;
  if (!['plain', 'aurora', 'grid'].includes(prefs.backdrop)) prefs.backdrop = 'plain';
  function guard(event) { event.preventDefault(); event.returnValue = ''; }
  function apply() {
    const root = document.documentElement;
    const palette = themes[prefs.theme];
    ['bg', 'panel', 'ink', 'muted', 'line', 'soft', 'accent'].forEach((key, i) => root.style.setProperty('--' + key, palette[i + 1]));
    if (prefs.theme === 'custom') root.style.setProperty('--accent', prefs.color);
    root.style.colorScheme = prefs.theme === 'light' ? 'light' : 'dark';
    root.dataset.backdrop = prefs.backdrop;
    root.classList.toggle('compact-ui', prefs.compact);
    root.classList.toggle('reduce-motion', prefs.motion);
    const cloak = cloaks[prefs.cloak];
    document.title = prefs.cloak === 'custom' ? prefs.title.trim() || cloak[0] : cloak[0];
    const icon = document.querySelector('link[rel="icon"]');
    icon.type = 'image/svg+xml';
    icon.href = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${cloak[2]}"/><text x="16" y="23" font-family="Arial" font-size="23" text-anchor="middle" fill="white">${cloak[1]}</text></svg>`);
    document.querySelector('meta[name="theme-color"]').content = palette[1];
    window.removeEventListener('beforeunload', guard);
    if (prefs.protect) window.addEventListener('beforeunload', guard);
  }
  function save() {
    apply();
    const status = document.getElementById('preferenceStatus');
    try { localStorage.setItem('auq_preferences', JSON.stringify(prefs)); status.textContent = 'Saved on this device'; }
    catch { status.textContent = 'Applied for this visit; storage is unavailable'; }
  }
  function mount() {
    const host = document.getElementById('preferences');
    host.innerHTML = `
      <section class="settings-row"><div><h3>Color theme</h3><p>A palette for the whole interface.</p></div><div><div class="theme-grid">${Object.entries(themes).map(([key, colors]) => `<button class="theme-card" data-theme="${key}" aria-pressed="${prefs.theme === key}"><span class="swatches">${[colors[7], colors[5], colors[1]].map(color => `<span style="background:${color}"></span>`).join('')}</span><span>${colors[0]}</span></button>`).join('')}</div><label class="color-control" for="customAccent">Custom accent <input type="color" id="customAccent" value="${prefs.color}"></label></div></section>
      <section class="settings-row"><div><h3>Background</h3><p>A little atmosphere for your new tab.</p></div><select id="backdrop" aria-label="Background"><option value="plain">Theme background</option><option value="aurora">Aurora glow</option><option value="grid">Subtle grid</option></select></section>
      <section class="settings-row"><div><h3>Tab cloaking</h3><p>Change this tab's title and icon.</p></div><div class="settings-controls"><select id="cloak" aria-label="Tab cloaking"><option value="none">AUQ</option><option value="khan">Khan Academy</option><option value="docs">Google Docs</option><option value="classroom">Google Classroom</option><option value="custom">Custom title</option></select><input id="cloakTitle" aria-label="Custom tab title" placeholder="My workspace" maxlength="100"><small class="muted">Appearance only; your browsing remains visible to your network.</small></div></section>
      <section class="settings-row"><div><h3>Close protection</h3><p>Ask before closing AUQ or an in-app tab. Browser prompts require interaction and may not appear on mobile.</p></div><label class="switch"><input id="protect" type="checkbox" role="switch" aria-label="Close protection"><span></span></label></section>
      <section class="settings-row"><div><h3>Search engine</h3><p>Used for searches from either address bar.</p></div><select id="engine" aria-label="Search engine"><option value="google">Google</option><option value="duckduckgo">DuckDuckGo</option><option value="bing">Bing</option><option value="brave">Brave</option></select></section>
      <section class="settings-row"><div><h3>Comfort</h3><p>Adjust spacing and animations.</p></div><div class="comfort-options"><label><input id="compact" type="checkbox"> Compact spacing</label><label><input id="motion" type="checkbox"> Reduce motion</label></div></section>`;
    function sync() {
      host.querySelectorAll('[data-theme]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.theme === prefs.theme)));
      document.getElementById('cloakTitle').hidden = prefs.cloak !== 'custom';
    }
    host.querySelectorAll('[data-theme]').forEach(button => button.onclick = () => { prefs.theme = button.dataset.theme; save(); sync(); });
    ['backdrop', 'cloak', 'engine'].forEach(key => {
      const input = document.getElementById(key);
      input.value = prefs[key];
      input.onchange = () => { prefs[key] = input.value; save(); sync(); };
    });
    ['protect', 'compact', 'motion'].forEach(key => {
      const input = document.getElementById(key);
      input.checked = prefs[key];
      input.onchange = () => { prefs[key] = input.checked; save(); };
    });
    const title = document.getElementById('cloakTitle');
    title.value = prefs.title;
    title.oninput = () => { prefs.title = title.value; save(); };
    document.getElementById('customAccent').oninput = event => { prefs.color = event.target.value; prefs.theme = 'custom'; save(); sync(); };
    sync();
  }
  window.AUQSettings = { mount, confirmClose: () => !prefs.protect || confirm('Do you want to close this tab?'), searchUrl: query => engines[prefs.engine] + encodeURIComponent(query) };
  apply();
})();
