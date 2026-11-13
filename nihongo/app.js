/* Nihongo Yatra — app logic */
(() => {
'use strict';

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const todayStr = (off = 0) => { const d = new Date(); d.setDate(d.getDate() + off); return d.toISOString().slice(0, 10); };
const STEPS = [
  {id:'learn', ic:'📖', n:'Learn'}, {id:'cards', ic:'🃏', n:'Cards'}, {id:'listen', ic:'👂', n:'Listen'},
  {id:'read', ic:'📜', n:'Read'}, {id:'speak', ic:'🗣️', n:'Speak'}, {id:'write', ic:'✍️', n:'Write'}];

/* ---------- kana lookup ---------- */
const KMAP = {};
[HIRA, KATA, HIRA_D, KATA_D, YOON, KANJI].forEach(list => list.forEach(([k, r, d, m]) => { KMAP[k] = {k, r, d, m}; }));
const ALLVOCAB = DAYS.flatMap(x => (x.vocab || []).map(v => ({k:v[0], r:v[1], d:v[2], m:v[3], h:v[4], day:x.d})));
const vocabByJp = Object.fromEntries(ALLVOCAB.map(v => [v.k, v]));

/* ---------- state ---------- */
const DEF = {xp:0, streak:0, last:null, days:{}, log:{}, traces:0, speaks:0, badges:[], cur:1,
  settings:{rate:0.85, sfx:true, unlockAll:false, jaVoice:'', hiVoice:'', theme:'auto'}};
let S;
try { S = JSON.parse(localStorage.getItem('nihongoYatra') || 'null'); } catch (e) { S = null; }
S = Object.assign(structuredClone(DEF), S || {});
S.settings = Object.assign(structuredClone(DEF.settings), S.settings || {});
const save = () => { try { localStorage.setItem('nihongoYatra', JSON.stringify(S)); } catch (e) {} };
const dayState = d => (S.days[d] ||= {steps:{}, best:0, done:false});
const isDone = d => !!(S.days[d] && S.days[d].done);
const unlocked = d => d === 1 || S.settings.unlockAll || isDone(d - 1);
const nextDay = () => { for (const x of DAYS) if (!isDone(x.d)) return x.d; return 30; };
const level = () => Math.floor(S.xp / 150) + 1;

function applyTheme() {
  const t = S.settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

/* ---------- sound effects (Web Audio) ---------- */
let AC;
function tone(freq, dur = .12, type = 'sine', when = 0, vol = .18) {
  if (!S.settings.sfx) return;
  try {
    AC ||= new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime + when, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + dur + .02);
  } catch (e) {}
}
const sfx = {
  ok(){ tone(660,.1,'triangle'); tone(990,.16,'triangle',.09); },
  bad(){ tone(180,.22,'sawtooth',0,.12); tone(140,.25,'sawtooth',.1,.1); },
  click(){ tone(880,.04,'square',0,.05); },
  flip(){ tone(520,.06,'sine',0,.1); tone(780,.06,'sine',.05,.08); },
  win(){ [523,659,784,1047,1319].forEach((f,i)=>tone(f,.22,'triangle',i*.11,.16)); },
  level(){ [392,523,659,784,1047].forEach((f,i)=>tone(f,.3,'square',i*.09,.07)); },
  gong(){ tone(110,1.6,'sine',0,.3); tone(220,1.2,'sine',0,.12); },
};

/* ---------- voices (Web Speech API) ---------- */
let voices = [];
function loadVoices() {
  voices = speechSynthesis ? speechSynthesis.getVoices() : [];
  const hasJa = voices.some(v => /^ja/i.test(v.lang));
  $('#voiceBanner').classList.toggle('on', voices.length > 0 && !hasJa);
  if ($('#view-settings').classList.contains('on')) renderSettings();
}
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function voiceFor(lang) {
  const pref = lang === 'ja' ? S.settings.jaVoice : S.settings.hiVoice;
  const list = voices.filter(v => v.lang.toLowerCase().startsWith(lang));
  return list.find(v => v.name === pref) || list.find(v => /google|natural|premium|enhanced|kyoko|otoya|lekha/i.test(v.name)) || list[0] || null;
}
function speak(text, lang = 'ja', rateMul = 1) {
  if (!('speechSynthesis' in window)) { toast('Speech is not supported in this browser'); return; }
  text = String(text).replace(/^[^:：]{1,12}[:：]\s*/, '').replace(/〜|~/g, '').replace(/\(.*?\)/g, '');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'ja' ? 'ja-JP' : 'hi-IN';
  const v = voiceFor(lang); if (v) u.voice = v;
  u.rate = Math.max(.4, Math.min(1.4, S.settings.rate * rateMul));
  speechSynthesis.speak(u);
}

/* ---------- XP / streak / badges ---------- */
function touchStreak() {
  const t = todayStr();
  if (S.last === t) return;
  S.streak = S.last === todayStr(-1) ? S.streak + 1 : 1;
  S.last = t;
}
function addXP(n, el) {
  const before = level();
  S.xp += n; touchStreak();
  S.log[todayStr()] = (S.log[todayStr()] || 0) + n;
  save(); header();
  floatXP('+' + n + ' XP', el);
  if (level() > before) { sfx.level(); setTimeout(() => toast('🎉 Level up! Lv ' + level() + ' · ' + LEVELS[Math.min(level() - 1, LEVELS.length - 1)]), 400); }
  checkBadges();
}
function floatXP(txt, el) {
  const f = document.createElement('div'); f.className = 'xpfloat'; f.textContent = txt;
  const r = el ? el.getBoundingClientRect() : {left: innerWidth / 2, top: innerHeight / 2, width: 0};
  f.style.left = (r.left + r.width / 2 - 30) + 'px'; f.style.top = (r.top - 10) + 'px';
  document.body.appendChild(f); setTimeout(() => f.remove(), 1300);
}
function header() {
  $('#hXp').textContent = S.xp; $('#hStreak').textContent = S.streak; $('#hLvl').textContent = level();
}
function checkBadges() {
  const doneCount = DAYS.filter(x => isDone(x.d)).length;
  const conds = {
    first: S.xp > 0, day1: isDone(1), hira: isDone(9), kata: isDone(14), half: doneCount >= 15, grad: doneCount >= 30,
    streak3: S.streak >= 3, streak7: S.streak >= 7, perfect: !!S.perfect, speaker: S.speaks >= 10, brush: S.traces >= 20, xp1000: S.xp >= 1000,
  };
  for (const b of BADGES) if (conds[b.id] && !S.badges.includes(b.id)) {
    S.badges.push(b.id); save();
    setTimeout(() => { sfx.level(); toast(`${b.e} Badge unlocked: ${b.n}!`); }, 700);
  }
}
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600);
}
function confetti() {
  const cols = ['#c8372d', '#d99a2b', '#2b3a67', '#2f8a57', '#f4a7b9', '#fff'];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement('div'); c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw'; c.style.background = cols[i % cols.length];
    c.style.animationDuration = (1.8 + Math.random() * 1.8) + 's'; c.style.animationDelay = Math.random() * .4 + 's';
    if (i % 5 === 0) { c.textContent = '🌸'; c.style.background = 'none'; c.style.fontSize = '18px'; }
    document.body.appendChild(c); setTimeout(() => c.remove(), 4200);
  }
}
function modal(html) { $('#modalCard').innerHTML = html; $('#modal').classList.add('on'); }
function closeModal() { $('#modal').classList.remove('on'); }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

/* ---------- routing ---------- */
function go(v, arg) {
  $$('nav.tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  $$('.view').forEach(s => s.classList.toggle('on', s.id === 'view-' + v));
  if (v !== 'lesson' && 'speechSynthesis' in window) speechSynthesis.cancel();
  ({home: renderHome, lesson: () => openLesson(arg || S.cur || nextDay()), chart: renderChart,
    write: () => renderWrite(arg), badges: renderBadges, settings: renderSettings})[v]();
  scrollTo({top: 0, behavior: 'smooth'});
}
window.go = go;
$$('nav.tabs button').forEach(b => b.addEventListener('click', () => { sfx.click(); go(b.dataset.v); }));

/* ---------- HOME ---------- */
function renderHome() {
  const nd = nextDay(), day = DAYS[nd - 1];
  const doneCount = DAYS.filter(x => isDone(x.d)).length;
  const lvlPct = (S.xp % 150) / 150 * 100;
  const todayXp = S.log[todayStr()] || 0, goal = 100;
  const lvlName = LEVELS[Math.min(level() - 1, LEVELS.length - 1)];
  let html = `
  <div class="hero">
    <div class="sun"></div>
    <div style="position:relative;z-index:1">
      <h1>${doneCount === 30 ? 'おめでとう! You graduated 🎓' : 'Today: Day ' + nd + ' — ' + esc(day.title)}</h1>
      <p class="hi">${doneCount ? 'शाबाश! रोज़ एक पाठ — 30 दिन में जापानी की मज़बूत नींव।' : 'शून्य से शुरू करें — हिंदी की मदद से जापानी सीखें। रोज़ बस 20–30 मिनट!'}</p>
      <div class="row">
        <button class="btn" onclick="go('lesson',${nd})">▶ ${isDone(nd) ? 'Review' : (dayState(nd).steps.learn ? 'Continue' : 'Start')} Day ${nd}</button>
        <button class="btn" style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,.5);box-shadow:none" onclick="go('write')">✍️ Print a writing sheet</button>
      </div>
    </div>
    <div class="mascot" title="Neko-sensei">🐱</div>
  </div>
  <div class="statgrid">
    <div class="stat"><b>🔥 ${S.streak}</b><span>day streak</span></div>
    <div class="stat"><b>⭐ ${S.xp}</b><span>total XP</span></div>
    <div class="stat"><b>📅 ${doneCount}/30</b><span>days done</span></div>
    <div class="stat"><b>🏆 ${S.badges.length}</b><span>badges</span></div>
  </div>
  <div class="card" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div><b>🎌 Level ${level()}</b> <span class="muted jp">${lvlName}</span>
      <div class="lvlbar"><i style="width:${lvlPct}%"></i></div>
      <small class="muted">${150 - S.xp % 150} XP to next level</small></div>
    <div><b>🎯 Daily goal</b> <span class="muted">${Math.min(todayXp, goal)}/${goal} XP today</span>
      <div class="lvlbar"><i style="width:${Math.min(100, todayXp / goal * 100)}%;background:linear-gradient(90deg,var(--green),#7bd3a0)"></i></div>
      <small class="muted">${todayXp >= goal ? 'Goal reached! 今日も よく できました 🎉' : 'One full lesson ≈ 100 XP'}</small></div>
  </div>`;
  for (const w of WEEKS) {
    html += `<div class="week"><h3>${w.name} <span class="tag jp">${w.tag}</span> <span class="muted hi" style="font-size:.85rem;font-weight:400">${w.hi}</span></h3><div class="path">`;
    for (let d = w.days[0]; d <= w.days[1]; d++) {
      const x = DAYS[d - 1], ds = S.days[d], done = isDone(d), lock = !unlocked(d), cur = d === nd && !done;
      const nsteps = ds ? Object.keys(ds.steps).length : 0;
      const stars = done ? '⭐'.repeat(ds.stars || 1) : (lock ? '🔒' : (nsteps ? `${nsteps}/6` : ''));
      html += `<button class="node ${done ? 'done' : ''} ${lock ? 'locked' : ''} ${cur ? 'current' : ''}" data-d="${d}">
        <span class="num">${done ? '✓' : d}</span><span class="st">${stars}</span>
        <span class="t">${esc(x.title)}</span><small class="muted">Day ${d}</small></button>`;
    }
    html += `</div></div>`;
  }
  $('#view-home').innerHTML = html;
  $$('#view-home .node').forEach(n => n.addEventListener('click', () => {
    const d = +n.dataset.d;
    if (!unlocked(d)) { sfx.bad(); toast('🔒 Finish Day ' + (d - 1) + ' first (or enable “Unlock all days” in Settings)'); return; }
    sfx.click(); go('lesson', d);
  }));
}

/* ---------- LESSON content builders ---------- */
function cardsFor(day) {
  if (day.chars) return day.chars.map(c => KMAP[c]).filter(Boolean);
  if (day.kind === 'final') return pick(ALLVOCAB, 14).map(v => ({k:v.k, r:v.r, d:v.d, m:v.m + ' · ' + v.h}));
  return day.vocab.map(v => ({k:v[0], r:v[1], d:v[2], m:v[3] + ' · ' + v[4]}));
}
function speakItems(day) {
  if (day.speak) return day.speak.map(s => ({k:s[0], r:s[1], d:s[2], m:s[3]}));
  if (day.kind === 'kana' || day.kind === 'review') {
    return (day.vocab || []).slice(0, 5).map(v => ({k:v[0], r:v[1], d:v[2], m:v[3]}));
  }
  return (day.vocab || []).slice(0, 6).map(v => ({k:v[0], r:v[1], d:v[2], m:v[3]}));
}
function writeItems(day) { return Array.isArray(day.write) ? day.write : Array.from(day.write || ''); }

let curDay = 1, curStep = 0;
function openLesson(d) {
  if (!unlocked(d)) d = nextDay();
  curDay = d; S.cur = d; save();
  const ds = dayState(d);
  curStep = STEPS.findIndex(s => !ds.steps[s.id]); if (curStep < 0) curStep = 0;
  renderLesson();
}
function renderLesson() {
  const day = DAYS[curDay - 1], ds = dayState(curDay);
  const v = $('#view-lesson');
  v.innerHTML = `
    <div class="lesson-head">
      <button class="btn ghost sm" onclick="go('home')">← Journey</button>
      <h2>Day ${day.d}: ${esc(day.title)}</h2>
      ${ds.done ? '<span class="pill">✅ Completed ' + '⭐'.repeat(ds.stars || 1) + '</span>' : ''}
    </div>
    <div class="steps">${STEPS.map((s, i) => `<button class="step ${i === curStep ? 'on' : ''} ${ds.steps[s.id] ? 'ok' : ''}" data-i="${i}"><span class="ic">${s.ic}</span>${s.n}</button>`).join('')}</div>
    <div class="card lesson-body" id="stepBody"></div>
    <div class="nav-btns">
      <button class="btn ghost" id="prevDay" ${curDay <= 1 ? 'disabled' : ''}>◀ Day ${curDay - 1}</button>
      <button class="btn ghost" id="nextDay" ${curDay >= 30 || !unlocked(curDay + 1) ? 'disabled' : ''}>Day ${curDay + 1} ▶</button>
    </div>`;
  $$('.step', v).forEach(b => b.addEventListener('click', () => { sfx.click(); curStep = +b.dataset.i; renderLesson(); }));
  $('#prevDay').onclick = () => go('lesson', curDay - 1);
  $('#nextDay').onclick = () => go('lesson', curDay + 1);
  ({learn: stepLearn, cards: stepCards, listen: stepListen, read: stepRead, speak: stepSpeak, write: stepWrite})[STEPS[curStep].id](day, $('#stepBody'));
}
function completeStep(id, xp, el) {
  const ds = dayState(curDay);
  if (!ds.steps[id]) { ds.steps[id] = true; addXP(xp, el); sfx.ok(); }
  save();
  if (!ds.done && STEPS.every(s => ds.steps[s.id])) return finishDay();
  goNextStep();
}
function goNextStep() {
  const ds = dayState(curDay);
  const nxt = STEPS.findIndex((s, i) => i > curStep && !ds.steps[s.id]);
  curStep = nxt >= 0 ? nxt : Math.min(curStep + 1, STEPS.length - 1);
  renderLesson(); scrollTo({top: 0, behavior: 'smooth'});
}
function finishDay() {
  const ds = dayState(curDay);
  ds.done = true;
  ds.stars = ds.best >= .9 ? 3 : ds.best >= .7 ? 2 : 1;
  save(); addXP(50);
  sfx.win(); confetti();
  const last = curDay === 30;
  modal(`<div style="font-size:3.4rem">${last ? '🎓' : '🏮'}</div>
    <h2>${last ? 'そつぎょう おめでとう!' : 'Day ' + curDay + ' complete!'}</h2>
    <p class="hi">${last ? 'आपने 30 दिन का कोर्स पूरा कर लिया! बहुत बढ़िया!' : 'शाबाश! कल फिर मिलते हैं।'}</p>
    <div style="font-size:2rem;letter-spacing:6px">${'⭐'.repeat(ds.stars)}${'☆'.repeat(3 - ds.stars)}</div>
    <p class="muted">+50 XP bonus · Streak 🔥 ${S.streak}${ds.stars < 3 ? '<br>Score 90%+ in the listening quiz for ⭐⭐⭐' : ''}</p>
    ${last ? certificate() : ''}
    <div class="row" style="justify-content:center;margin-top:10px">
      <button class="btn ghost" onclick="closeModal();go('home')">🗺️ Journey</button>
      ${!last ? `<button class="btn red" onclick="closeModal();go('lesson',${curDay + 1})">Next day ▶</button>` : ''}
    </div>`);
  renderLesson();
}
window.closeModal = closeModal;
function certificate() {
  return `<div style="border:3px double var(--red);border-radius:12px;padding:12px;margin:10px 0">
    <div class="kl" style="font-size:1.6rem;color:var(--red)">修了証</div>
    <b>Certificate of Completion</b><br><span class="muted">Nihongo Yatra · 30-day Japanese foundation</span><br>
    <span class="muted">${new Date().toLocaleDateString()} · ${S.xp} XP</span></div>`;
}

/* --- step 1: learn --- */
function stepLearn(day, el) {
  const tiles = day.chars ? `<h3>Tap a letter to hear it 🔊</h3><div class="kgrid">${day.chars.map(c => {
    const k = KMAP[c]; return `<button class="ktile" data-say="${esc(c)}"><span class="k">${c}</span><span class="r">${esc(k.r)}</span><br><span class="d">${k.d}</span></button>`;
  }).join('')}</div>` : '';
  el.innerHTML = `
    <div class="row" style="margin-bottom:6px">
      <button class="btn red sm" id="hiNarr">🔊 हिंदी में सुनें</button>
      <span class="muted" style="font-size:.85rem">Hindi voice summary of today’s lesson</span>
    </div>
    ${day.lesson}${tiles}
    ${day.vocab && day.vocab.length && day.chars ? `<h3>Words you can read today</h3>${vocabTable(day.vocab)}` : ''}
    ${!day.chars && day.vocab.length ? `<h3>Today’s vocabulary — tap 🔊</h3>${vocabTable(day.vocab)}` : ''}
    <div class="nav-btns"><span></span><button class="btn green" id="learnDone">I understood — next ▶</button></div>`;
  $('#hiNarr').onclick = () => speak(day.hi, 'hi', 1.05);
  $$('[data-say]', el).forEach(b => b.addEventListener('click', () => speak(b.dataset.say)));
  $('#learnDone').onclick = e => completeStep('learn', 10, e.target);
}
function vocabTable(v) {
  return `<div class="tbl"><table class="t"><tr><th></th><th>Japanese</th><th>Romaji</th><th class="hi">उच्चारण</th><th>Meaning</th><th class="hi">हिंदी</th></tr>
  ${v.map(x => `<tr><td><button class="spk" data-say="${esc(x[0])}" aria-label="play">🔊</button></td><td class="jp" style="font-size:1.15rem">${esc(x[0])}</td><td>${esc(x[1])}</td><td class="hi">${esc(x[2])}</td><td>${esc(x[3])}</td><td class="hi">${esc(x[4])}</td></tr>`).join('')}</table></div>`;
}

/* --- step 2: flashcards --- */
function stepCards(day, el) {
  const cards = cardsFor(day); let i = 0; const seen = new Set();
  el.innerHTML = `<p class="muted" style="text-align:center;margin-top:0">Tap the card to flip it. Say it out loud before flipping! <span class="hi">पलटने से पहले बोलकर देखें।</span></p>
    <div class="flash" id="fc"><div class="inner"><div class="face front"></div><div class="face back"></div></div></div>
    <div class="counter" id="fcCount"></div>
    <div class="row" style="justify-content:center;margin-top:10px">
      <button class="btn ghost" id="fcPrev">◀</button><button class="btn" id="fcSay">🔊 Listen</button>
      <button class="btn ghost" id="fcSlow">🐢 Slow</button><button class="btn ghost" id="fcNext">▶</button></div>
    <div class="nav-btns"><span class="muted" id="fcSeen"></span><button class="btn green" id="fcDone" disabled>Done — next ▶</button></div>`;
  const fc = $('#fc');
  function show() {
    const c = cards[i]; seen.add(i); fc.classList.remove('flip');
    const long = c.k.length > 3;
    $('.front', fc).innerHTML = `<div class="big ${long ? 'long' : ''}">${esc(c.k)}</div><div class="muted" style="margin-top:8px">tap to flip ↺</div>`;
    $('.back', fc).innerHTML = `<div class="big ${long ? 'long' : ''}" style="font-size:${long ? '1.8rem' : '2.6rem'}">${esc(c.k)}</div><div class="ro">${esc(c.r)}</div><div class="dv">${esc(c.d)}</div><div class="mn">${esc(c.m || '')}</div>`;
    $('#fcCount').textContent = `${i + 1} / ${cards.length}`;
    $('#fcSeen').textContent = `Seen ${seen.size}/${cards.length}`;
    $('#fcDone').disabled = seen.size < cards.length && seen.size < 12;
    speak(c.k);
  }
  fc.onclick = () => { fc.classList.toggle('flip'); sfx.flip(); };
  $('#fcPrev').onclick = () => { i = (i - 1 + cards.length) % cards.length; show(); };
  $('#fcNext').onclick = () => { i = (i + 1) % cards.length; show(); };
  $('#fcSay').onclick = () => speak(cards[i].k);
  $('#fcSlow').onclick = () => speak(cards[i].k, 'ja', .6);
  $('#fcDone').onclick = e => completeStep('cards', 10, e.target);
  show();
}

/* --- step 3: listening quiz --- */
function buildQuiz(day) {
  const qs = [];
  if (day.chars) {
    const pool = day.chars.map(c => KMAP[c]).filter(x => x.k !== 'っ');
    const dpool = pool.length >= 6 ? pool : [...pool, ...(day.set === 'k' ? KATA : HIRA).map(x => KMAP[x[0]]).filter(x => !pool.includes(x))];
    const n = day.kind === 'review' ? 14 : Math.min(10, Math.max(8, pool.length));
    const targets = [...shuffle(pool), ...shuffle(pool)].slice(0, n);
    targets.forEach((t, j) => {
      const opts = shuffle([t, ...pick(dpool.filter(x => x !== t && x.r !== t.r), 3)]);
      const type = j % 3;
      if (type === 0) qs.push({t, audio:t.k, prompt:'', label:'Which letter did you hear?', opts:opts.map(o => ({v:o, html:`<span class="jp kl" style="font-size:1.9rem">${o.k}</span>`}))});
      else if (type === 1) qs.push({t, audio:null, prompt:t.k, label:'How do you read this?', opts:opts.map(o => ({v:o, html:`${esc(o.r)} · <span class="hi">${o.d}</span>`}))});
      else qs.push({t, audio:null, prompt:`${t.r} · ${t.d}`, txt:true, label:'Pick the matching letter', opts:opts.map(o => ({v:o, html:`<span class="jp kl" style="font-size:1.9rem">${o.k}</span>`}))});
    });
  } else {
    const src = day.kind === 'final' ? pick(ALLVOCAB, 15) : day.vocab.map(v => ({k:v[0], r:v[1], d:v[2], m:v[3], h:v[4]}));
    const dpool = src.length >= 6 ? src : [...src, ...pick(ALLVOCAB.filter(x => !src.some(s => s.k === x.k)), 8)];
    const n = day.kind === 'final' ? 15 : Math.min(10, Math.max(6, src.length));
    const targets = [...shuffle(src), ...shuffle(src)].slice(0, n);
    targets.forEach((t, j) => {
      const opts = shuffle([t, ...pick(dpool.filter(x => x.k !== t.k && x.m !== t.m), 3)]);
      const type = j % 3;
      if (type === 0) qs.push({t, audio:t.k, label:'What does it mean?', opts:opts.map(o => ({v:o, html:`${esc(o.m)}<br><small class="hi muted">${esc(o.h)}</small>`}))});
      else if (type === 1) qs.push({t, audio:t.k, prompt:t.k, label:'Read & choose the meaning', opts:opts.map(o => ({v:o, html:`${esc(o.m)}<br><small class="hi muted">${esc(o.h)}</small>`}))});
      else qs.push({t, audio:null, prompt:`${t.h} · ${t.m}`, txt:true, label:'Which Japanese word is this?', opts:opts.map(o => ({v:o, html:`<span class="jp">${esc(o.k)}</span>`}))});
    });
  }
  return qs;
}
function stepListen(day, el) {
  const qs = buildQuiz(day); let qi = 0, score = 0, combo = 0;
  function q() {
    if (qi >= qs.length) return result();
    const Q = qs[qi]; let answered = false;
    el.innerHTML = `<div class="qbox">
      <div class="qbar"><i style="width:${qi / qs.length * 100}%"></i></div>
      <div class="muted">Question ${qi + 1}/${qs.length} · Score ${score}</div>
      <h3>${Q.label}</h3>
      ${Q.audio ? `<button class="playbig" id="qPlay" aria-label="play">🔊</button><div><button class="btn ghost sm" id="qSlow" style="margin-top:8px">🐢 slow</button></div>` : ''}
      ${Q.prompt ? `<div class="qprompt ${Q.txt ? 'txt' : ''} ${Q.prompt.length > 4 && !Q.txt ? 'jp' : ''}" style="${Q.prompt.length > 4 && !Q.txt ? 'font-size:2rem' : ''}">${esc(Q.prompt)}</div>` : ''}
      <div class="combo">${combo >= 3 ? '🔥 Combo x' + combo + '!' : ''}</div>
      <div class="opts">${Q.opts.map((o, i) => `<button class="opt" data-i="${i}">${o.html}</button>`).join('')}</div>
      <div id="qFb" style="min-height:2.4em;margin-top:10px"></div></div>`;
    if (Q.audio) { $('#qPlay').onclick = () => speak(Q.audio); $('#qSlow').onclick = () => speak(Q.audio, 'ja', .6); setTimeout(() => speak(Q.audio), 250); }
    $$('.opt', el).forEach(b => b.addEventListener('click', () => {
      if (answered) return; answered = true;
      const o = Q.opts[+b.dataset.i], right = o.v === Q.t;
      $$('.opt', el).forEach(x => { if (Q.opts[+x.dataset.i].v === Q.t) x.classList.add('right'); });
      if (right) { score++; combo++; sfx.ok(); if (combo >= 3) tone(1200 + combo * 40, .08, 'triangle', .2, .1); }
      else { combo = 0; b.classList.add('wrong'); sfx.bad(); }
      $('#qFb').innerHTML = `${right ? '<b style="color:var(--green)">正解! Correct — सही!</b>' : '<b style="color:var(--red)">Oops — गलत।</b>'} <span class="jp">${esc(Q.t.k)}</span> = ${esc(Q.t.r)} · <span class="hi">${esc(Q.t.d)}</span>${Q.t.m && !day.chars ? ' · ' + esc(Q.t.m) : ''}`;
      if (!Q.audio) speak(Q.t.k);
      setTimeout(() => { qi++; q(); }, right ? 1100 : 2200);
    }));
  }
  function result() {
    const pct = score / qs.length, ds = dayState(curDay);
    ds.best = Math.max(ds.best || 0, pct);
    if (pct === 1) S.perfect = true;
    save();
    const stars = pct >= .9 ? 3 : pct >= .7 ? 2 : pct >= .4 ? 1 : 0;
    (stars >= 2 ? sfx.win : sfx.gong)();
    if (stars === 3) confetti();
    el.innerHTML = `<div class="qbox"><div style="font-size:3rem">${stars === 3 ? '🏆' : stars === 2 ? '🎉' : stars === 1 ? '👍' : '💪'}</div>
      <h2>${score} / ${qs.length} correct</h2>
      <div style="font-size:2rem;letter-spacing:6px">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <p class="hi">${stars >= 2 ? 'बहुत बढ़िया! आगे बढ़ें।' : 'कोई बात नहीं — फ़्लैशकार्ड दोबारा देखें और फिर कोशिश करें।'}</p>
      <div class="row" style="justify-content:center"><button class="btn ghost" id="qRetry">↻ Try again</button>
      <button class="btn green" id="qNext">${pct >= .5 ? 'Next ▶' : 'Continue anyway ▶'}</button></div></div>`;
    $('#qRetry').onclick = () => stepListen(day, el);
    $('#qNext').onclick = e => { addXP(score * 3, e.target); completeStep('listen', 10, e.target); };
  }
  q();
}

/* --- step 4: reading --- */
function stepRead(day, el) {
  const lines = (day.read || []).map(r => ({k:r[0], r:r[1], d:r[2], m:r[3]}));
  const read = new Set();
  const tg = S.readToggles ||= {ro:true, dv:true, mean:false};
  el.innerHTML = `<h3>📜 Reading practice</h3>
    <p class="muted" style="margin-top:0">Read each line yourself first. Then tap 🔊 to check. Hide the helpers as you get stronger! <span class="hi">पहले खुद पढ़ें, फिर सुनें।</span></p>
    <div class="toggles"><button class="chip" data-t="ro">Romaji</button><button class="chip" data-t="dv">देवनागरी</button><button class="chip" data-t="mean">Meaning</button><button class="chip" id="playAll">▶ Play all</button></div>
    <div id="rlines">${lines.map((l, i) => `<div class="rline" data-i="${i}"><button class="spk" data-i="${i}" aria-label="play">🔊</button>
      <div><div class="jp">${esc(l.k)}</div><div class="ro">${esc(l.r)}</div><div class="dv">${esc(l.d)}</div><div class="mean">${esc(l.m)}</div></div></div>`).join('')}</div>
    <div class="nav-btns"><span class="muted" id="rCount"></span><button class="btn green" id="rDone">I read everything — next ▶</button></div>`;
  const box = $('#rlines');
  function applyT() {
    box.classList.toggle('hide-ro', !tg.ro); box.classList.toggle('hide-dv', !tg.dv); box.classList.toggle('hide-mean', !tg.mean);
    $$('.chip[data-t]', el).forEach(c => c.classList.toggle('on', tg[c.dataset.t]));
    $('#rCount').textContent = `Listened ${read.size}/${lines.length}`;
  }
  $$('.chip[data-t]', el).forEach(c => c.onclick = () => { tg[c.dataset.t] = !tg[c.dataset.t]; save(); applyT(); });
  $$('.spk', box).forEach(b => b.onclick = () => { const i = +b.dataset.i; speak(lines[i].k); read.add(i); b.closest('.rline').classList.add('read'); applyT(); });
  $('#playAll').onclick = () => {
    speechSynthesis.cancel();
    lines.forEach((l, i) => {
      const u = new SpeechSynthesisUtterance(l.k.replace(/^[^:：]{1,12}[:：]\s*/, ''));
      u.lang = 'ja-JP'; const v = voiceFor('ja'); if (v) u.voice = v; u.rate = S.settings.rate;
      u.onstart = () => { $$('.rline', box)[i].classList.add('read'); read.add(i); applyT(); };
      speechSynthesis.speak(u);
    });
  };
  $('#rDone').onclick = e => completeStep('read', 15, e.target);
  applyT();
}

/* --- step 5: speaking --- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const kataToHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = s => kataToHira(String(s)).replace(/[\s、。！？!?,.・ー〜~「」]/g, '').replace(/^[^:：]{1,12}[:：]/, '');
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({length: n + 1}, (_, j) => j);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return prev[n];
}
function similarity(heard, targets) {
  let best = 0;
  for (const h of heard) for (const t of targets) {
    const a = norm(h), b = norm(t); if (!a || !b) continue;
    const s = (a.includes(b) || (b.includes(a) && a.length >= b.length * .7)) ? 1 : 1 - lev(a, b) / Math.max(a.length, b.length);
    best = Math.max(best, s);
  }
  return best;
}
function stepSpeak(day, el) {
  const items = speakItems(day); const tried = new Set();
  const alts = day.speakAlt || {};
  el.innerHTML = `<h3>🗣️ Speaking practice</h3>
    <p class="muted" style="margin-top:0">1) 🔊 Listen  2) 🎙️ Speak — the app listens and checks you  3) ⏺ Record yourself and compare.
    ${SR ? '' : '<br><b>Speech recognition isn’t available in this browser</b> (try Chrome/Edge). You can still record yourself and self-check.'}
    <span class="hi">ज़ोर से बोलें — जापानी बोलने में शर्म नहीं!</span></p>
    ${items.map((it, i) => `<div class="sp-item" data-i="${i}">
      <div class="jp">${esc(it.k)}</div><div><b>${esc(it.r)}</b> · <span class="hi" style="color:var(--red)">${esc(it.d)}</span> · <span class="muted">${esc(it.m)}</span></div>
      <div class="row" style="margin-top:8px">
        <button class="btn sm" data-a="say">🔊 Listen</button><button class="btn ghost sm" data-a="slow">🐢</button>
        ${SR ? '<button class="btn red sm" data-a="mic">🎙️ Speak</button>' : ''}
        <button class="btn ghost sm" data-a="rec">⏺ Record</button><button class="btn ghost sm" data-a="play" disabled>▶ My voice</button>
        <button class="btn ghost sm" data-a="self">✓ I said it right</button>
      </div><div class="sp-res"></div></div>`).join('')}
    <div class="nav-btns"><span class="muted" id="spCount"></span><button class="btn green" id="spDone" disabled>Next ▶</button></div>`;
  const need = Math.min(3, items.length);
  const upd = () => { $('#spCount').textContent = `Practised ${tried.size}/${items.length} (need ${need})`; $('#spDone').disabled = tried.size < need; };
  const mark = i => { if (!tried.has(i)) { tried.add(i); S.speaks++; save(); checkBadges(); } upd(); };
  $$('.sp-item', el).forEach(box => {
    const i = +box.dataset.i, it = items[i], res = $('.sp-res', box); let blobUrl = null, rec = null;
    box.addEventListener('click', async e => {
      const a = e.target.closest('[data-a]')?.dataset.a; if (!a) return;
      if (a === 'say') speak(it.k);
      if (a === 'slow') speak(it.k, 'ja', .6);
      if (a === 'self') { res.className = 'sp-res good'; res.textContent = '👍 Great — keep practising aloud!'; sfx.ok(); mark(i); }
      if (a === 'mic') {
        speechSynthesis.cancel();
        const r = new SR(); r.lang = 'ja-JP'; r.maxAlternatives = 5; r.interimResults = false;
        res.className = 'sp-res'; res.textContent = '🎙️ Listening… speak now';
        let got = false;
        r.onresult = ev => {
          got = true;
          const heard = [...ev.results[0]].map(x => x.transcript);
          const sc = similarity(heard, [it.k, ...(alts[it.k] || [])]);
          mark(i);
          if (sc >= .7) { res.className = 'sp-res good'; res.innerHTML = `${sc >= .9 ? '🌟 素晴らしい! Perfect!' : '✅ Good! Close enough.'} <span class="muted">Heard: ${esc(heard[0])}</span>`; sfx.ok(); addXP(5, e.target); }
          else { res.className = 'sp-res bad'; res.innerHTML = `🤔 Heard “${esc(heard[0])}”. Listen once more and try again — or tap “I said it right”.`; sfx.bad(); }
        };
        r.onerror = ev => { res.className = 'sp-res bad'; res.textContent = ev.error === 'not-allowed' ? '🚫 Microphone permission denied.' : '⚠️ ' + ev.error + ' — try again.'; };
        r.onend = () => { if (!got && !res.className.includes('bad')) { res.className = 'sp-res bad'; res.textContent = '🔇 Didn’t catch that. Try again, a bit louder.'; } };
        try { r.start(); } catch (err) { res.textContent = '⚠️ ' + err.message; }
      }
      if (a === 'rec') {
        const btn = e.target.closest('button');
        if (rec && rec.state === 'recording') { rec.stop(); return; }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({audio: true});
          const chunks = []; rec = new MediaRecorder(stream);
          rec.ondataavailable = ev => chunks.push(ev.data);
          rec.onstop = () => {
            stream.getTracks().forEach(t => t.stop());
            if (blobUrl) URL.revokeObjectURL(blobUrl);
            blobUrl = URL.createObjectURL(new Blob(chunks, {type: rec.mimeType}));
            btn.textContent = '⏺ Record'; $('[data-a=play]', box).disabled = false;
            res.className = 'sp-res'; res.textContent = 'Recorded! Tap ▶ My voice, then 🔊 Listen to compare.';
            mark(i);
          };
          rec.start(); btn.textContent = '⏹ Stop';
          res.className = 'sp-res'; res.textContent = '⏺ Recording… (auto-stops in 4s)';
          setTimeout(() => rec && rec.state === 'recording' && rec.stop(), 4000);
        } catch (err) { res.className = 'sp-res bad'; res.textContent = '🚫 Could not access the microphone.'; }
      }
      if (a === 'play' && blobUrl) new Audio(blobUrl).play();
    });
  });
  $('#spDone').onclick = e => completeStep('speak', 15, e.target);
  upd();
}

/* --- step 6: writing --- */
let lessonPad;
function stepWrite(day, el) {
  const items = writeItems(day); let i = 0; const checked = new Set();
  el.innerHTML = `<h3>✍️ Writing practice</h3>
    <p class="muted" style="margin-top:0">Trace the grey letter, then press ✅ Check. Turn off 👁️ Guide to write from memory. For pencil practice, print today’s sheet.</p>
    <div class="charchips" id="lwChips">${items.map((c, j) => `<button data-j="${j}">${esc(c)}</button>`).join('')}</div>
    <div class="pad" id="lwPad"></div>
    <div class="stars" id="lwStars"></div>
    <div class="row" style="justify-content:center">
      <button class="btn ghost sm" id="lwHear">🔊</button><button class="btn ghost sm" id="lwClear">🧽 Clear</button>
      <button class="btn ghost sm" id="lwGuide">👁️ Guide</button><button class="btn green sm" id="lwCheck">✅ Check</button>
      <button class="btn sm" id="lwNext">Next ▶</button></div>
    <div class="tip" style="margin-top:14px"><b>Stroke tips:</b> write top → bottom, left → right. Horizontal lines before vertical lines (like <span class="hi">शिरोरेखा</span> comes last in Hindi, but in Japanese the top line usually comes first!).</div>
    <div class="nav-btns">
      <button class="btn red" id="lwPrint">🖨️ Print today’s worksheet</button>
      <button class="btn green" id="lwDone" disabled>Done ▶</button></div>`;
  if (lessonPad) lessonPad._ro.disconnect();
  lessonPad = new TracePad($('#lwPad'));
  const need = Math.min(3, items.length);
  const sel = () => {
    $$('#lwChips button').forEach(b => b.classList.toggle('on', +b.dataset.j === i));
    lessonPad.setText(items[i]); $('#lwStars').textContent = '';
    $('#lwDone').disabled = checked.size < need;
  };
  $$('#lwChips button').forEach(b => b.onclick = () => { i = +b.dataset.j; sel(); });
  $('#lwHear').onclick = () => speak(items[i]);
  $('#lwClear').onclick = () => { lessonPad.clear(); $('#lwStars').textContent = ''; };
  $('#lwGuide').onclick = () => lessonPad.toggleGuide();
  $('#lwNext').onclick = () => { i = (i + 1) % items.length; sel(); };
  $('#lwCheck').onclick = e => {
    const st = lessonPad.stars();
    if (st < 0) { toast('Draw the letter first ✍️'); return; }
    $('#lwStars').textContent = st ? '⭐'.repeat(st) + '☆'.repeat(3 - st) : 'Try again — follow the grey lines';
    if (st >= 1) { sfx.ok(); if (!checked.has(i)) { checked.add(i); addXP(2 * st, e.target); } if (st >= 2) { S.traces++; save(); checkBadges(); } }
    else sfx.bad();
    $('#lwDone').disabled = checked.size < need;
  };
  $('#lwPrint').onclick = () => go('write', 'day-' + day.d);
  $('#lwDone').onclick = e => completeStep('write', 15, e.target);
  sel();
}

/* ---------- Trace pad ---------- */
class TracePad {
  constructor(host) {
    host.innerHTML = '<canvas></canvas><canvas></canvas>';
    [this.g, this.c] = $$('canvas', host); this.host = host;
    this.strokes = []; this.guide = true; this.text = '';
    this.resize(); this._ro = new ResizeObserver(() => this.resize()); this._ro.observe(host);
    let drawing = false;
    const pos = e => { const r = this.c.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    this.c.addEventListener('pointerdown', e => { drawing = true; this.c.setPointerCapture(e.pointerId); this.strokes.push([pos(e)]); this.redraw(); });
    this.c.addEventListener('pointermove', e => { if (!drawing) return; this.strokes[this.strokes.length - 1].push(pos(e)); this.redraw(); });
    const end = () => { drawing = false; };
    this.c.addEventListener('pointerup', end); this.c.addEventListener('pointercancel', end);
  }
  resize() {
    const r = this.host.getBoundingClientRect(), dpr = devicePixelRatio || 1;
    if (!r.width) return;
    for (const cv of [this.g, this.c]) { cv.width = r.width * dpr; cv.height = r.height * dpr; }
    this.drawGuide(); this.redraw();
  }
  font(px) { return `${px}px "Klee One","Noto Sans JP",sans-serif`; }
  fontSize(W) { const n = Array.from(this.text).length || 1; return W * (n === 1 ? .74 : Math.min(.46, .9 / n)); }
  drawText(ctx, W, H, mode, lw) {
    const fs = this.fontSize(W); ctx.font = this.font(fs); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    const m = ctx.measureText(this.text);
    const y = H / 2 + ((m.actualBoundingBoxAscent || fs * .8) - (m.actualBoundingBoxDescent || 0)) / 2;
    if (mode === 'stroke') { ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.strokeText(this.text, W / 2, y); }
    ctx.fillText(this.text, W / 2, y);
  }
  drawGuide() {
    const ctx = this.g.getContext('2d'), W = this.g.width, H = this.g.height, cs = getComputedStyle(document.documentElement);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = cs.getPropertyValue('--line').trim() || '#ddd'; ctx.lineWidth = Math.max(1, W / 300);
    ctx.setLineDash([W / 40, W / 50]);
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke(); ctx.setLineDash([]);
    if (this.guide && this.text) { ctx.fillStyle = cs.getPropertyValue('--guide').trim() || '#ccc'; this.drawText(ctx, W, H); }
  }
  redraw() {
    const ctx = this.c.getContext('2d'), W = this.c.width, H = this.c.height;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#222';
    this.paint(ctx, W, H, W * .045);
  }
  paint(ctx, W, H, lw) {
    ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const s of this.strokes) {
      ctx.beginPath(); ctx.moveTo(s[0][0] * W, s[0][1] * H);
      if (s.length === 1) ctx.lineTo(s[0][0] * W + .1, s[0][1] * H);
      for (const p of s) ctx.lineTo(p[0] * W, p[1] * H);
      ctx.stroke();
    }
  }
  async setText(t) {
    this.text = t; this.strokes = [];
    try { await document.fonts.load(this.font(64), t); } catch (e) {}
    this.drawGuide(); this.redraw();
  }
  clear() { this.strokes = []; this.redraw(); }
  toggleGuide() { this.guide = !this.guide; this.drawGuide(); }
  score() {
    if (!this.strokes.length) return -1;
    const N = 140, mk = () => { const c = document.createElement('canvas'); c.width = c.height = N; return c.getContext('2d', {willReadFrequently: true}); };
    const A = mk(), B = mk(), T = mk(), U = mk();
    A.fillStyle = '#000'; this.drawText(A, N, N);
    B.fillStyle = '#000'; B.strokeStyle = '#000'; this.drawText(B, N, N, 'stroke', N * .09);
    T.strokeStyle = '#000'; this.paint(T, N, N, N * .1);
    U.strokeStyle = '#000'; this.paint(U, N, N, N * .03);
    const da = A.getImageData(0, 0, N, N).data, db = B.getImageData(0, 0, N, N).data, dt = T.getImageData(0, 0, N, N).data, du = U.getImageData(0, 0, N, N).data;
    let g = 0, cov = 0, u = 0, inside = 0;
    for (let i = 3; i < da.length; i += 4) {
      if (da[i] > 100) { g++; if (dt[i] > 100) cov++; }
      if (du[i] > 100) { u++; if (db[i] > 100) inside++; }
    }
    if (u < 15 || !g) return 0;
    return .55 * Math.min(1, (cov / g) / .8) + .45 * (inside / u);
  }
  stars() { const s = this.score(); if (s < 0) return -1; return s >= .85 ? 3 : s >= .68 ? 2 : s >= .45 ? 1 : 0; }
}

/* ---------- KANA CHART ---------- */
let chartTab = 'h';
function renderChart() {
  const toK = c => c ? KATA[HIRA.findIndex(x => x[0] === c)][0] : '';
  let grid = '';
  if (chartTab === 'h' || chartTab === 'k') {
    grid = CHART_ROWS.flat().map(c => { const k = chartTab === 'k' ? toK(c) : c; if (!k) return '<div class="ktile empty"></div>'; const o = KMAP[k];
      return `<button class="ktile" data-k="${k}"><span class="k">${k}</span><span class="r">${o.r}</span><br><span class="d">${o.d}</span></button>`; }).join('');
  } else {
    const list = chartTab === 'd' ? [...HIRA_D, ...KATA_D] : chartTab === 'y' ? YOON : KANJI;
    grid = list.map(([k, r, d]) => `<button class="ktile" data-k="${k}"><span class="k">${k}</span><span class="r">${r}</span><br><span class="d">${d}</span></button>`).join('');
  }
  $('#view-chart').innerHTML = `<h2>あ Kana chart</h2>
    <p class="muted" style="margin-top:0">Tap any letter to hear it and see its memory hint. Order = Sanskrit varnamala order (अ इ उ ए ओ → क → स → त → न → ह → म → य → र → व).</p>
    <div class="toggles">${[['h','Hiragana ひらがな'],['k','Katakana カタカナ'],['d','゛゜ Dakuten'],['y','Combos きゃ'],['j','Kanji 漢字']].map(([id, n]) => `<button class="chip ${chartTab === id ? 'on' : ''}" data-c="${id}">${n}</button>`).join('')}</div>
    <div class="card" id="chartInfo" style="margin-bottom:12px;min-height:70px"><span class="muted">👆 Tap a letter</span></div>
    <div class="${chartTab === 'h' || chartTab === 'k' ? 'chart-grid' : 'kgrid'}">${grid}</div>`;
  $$('[data-c]').forEach(b => b.onclick = () => { chartTab = b.dataset.c; renderChart(); });
  $$('#view-chart .ktile[data-k]').forEach(b => b.onclick = () => {
    const o = KMAP[b.dataset.k]; speak(o.k);
    $('#chartInfo').innerHTML = `<div class="row"><span class="kl" style="font-size:3rem;line-height:1">${o.k}</span><div><b>${o.r}</b> · <span class="hi" style="color:var(--red)">${o.d}</span><br><span class="muted">${esc(o.m)}</span></div>
      <button class="btn sm ghost" style="margin-left:auto" onclick="go('write','single:${o.k}')">✍️ Practise</button></div>`;
  });
}

/* ---------- WRITING SHEETS ---------- */
const SETS = [
  ['hira', 'Hiragana — all 46', () => HIRA], ['kata', 'Katakana — all 46', () => KATA],
  ['hira-d', 'Hiragana ゛゜ (が ざ だ ば ぱ)', () => HIRA_D], ['kata-d', 'Katakana ゛゜ (ガ ザ ダ バ パ)', () => KATA_D],
  ['yoon', 'Combo sounds (きゃ しゃ ちゃ…)', () => YOON.filter(x => x[0] !== 'っ')], ['kanji', 'First 10 kanji', () => KANJI],
  ...DAYS.map(x => ['day-' + x.d, `Day ${x.d}: ${x.title}`, () => writeItems(x).map(t => labelFor(t))]),
  ['custom', '✏️ My own letters / words', () => ($('#wsCustom').value || '').split(/\s+/).filter(Boolean).map(t => labelFor(t))],
];
function labelFor(t) {
  if (KMAP[t]) { const o = KMAP[t]; return [t, o.r, o.d]; }
  if (vocabByJp[t]) { const v = vocabByJp[t]; return [t, v.r, v.d]; }
  return [t, toRomaji(t), ''];
}
function toRomaji(t) {
  let out = '', arr = Array.from(t);
  for (let i = 0; i < arr.length; i++) {
    const two = arr[i] + (arr[i + 1] || '');
    if (KMAP[two] && arr[i + 1] && /[ゃゅょ]/.test(arr[i + 1])) { out += KMAP[two].r; i++; continue; }
    if (arr[i] === 'っ' || arr[i] === 'ッ') { const nx = KMAP[arr[i + 1]]; out += nx ? nx.r[0] : ''; continue; }
    if (arr[i] === 'ー') { out += out.slice(-1); continue; }
    out += KMAP[arr[i]] ? KMAP[arr[i]].r : '';
  }
  return out;
}
let wsPad, padItems = [], padI = 0;
function renderWrite(arg) {
  const wsSel = $('#wsSet'), padSel = $('#padSet');
  if (!wsSel.options.length) {
    wsSel.innerHTML = padSel.innerHTML = SETS.map(([id, n]) => `<option value="${id}">${esc(n)}</option>`).join('');
    padSel.querySelector('option[value=custom]').remove();
    wsSel.onchange = () => { $('#wsCustomBox').style.display = wsSel.value === 'custom' ? 'block' : 'none'; buildSheet(); };
    $('#wsCustom').oninput = buildSheet; $('#wsStyle').onchange = buildSheet; $('#wsLabels').onchange = buildSheet;
    $('#wsPrint').onclick = async () => {
      buildSheet();
      try { await document.fonts.load('40px "Klee One"', $('#sheet').textContent); await document.fonts.ready; } catch (e) {}
      setTimeout(() => window.print(), 150);
    };
    padSel.onchange = () => loadPadSet(padSel.value);
    wsPad = new TracePad($('#pad'));
    $('#padHear').onclick = () => speak(padItems[padI][0]);
    $('#padClear').onclick = () => { wsPad.clear(); $('#padStars').textContent = ''; };
    $('#padGuideT').onclick = () => wsPad.toggleGuide();
    $('#padNext').onclick = () => { padI = (padI + 1) % padItems.length; selPad(); };
    $('#padCheck').onclick = e => {
      const st = wsPad.stars(); if (st < 0) { toast('Draw the letter first ✍️'); return; }
      $('#padStars').textContent = st ? '⭐'.repeat(st) + '☆'.repeat(3 - st) : 'Try again — follow the grey lines';
      if (st >= 2) { sfx.ok(); S.traces++; addXP(st, e.target); } else sfx.bad();
    };
    wsSel.value = 'hira'; padSel.value = 'hira';
  }
  if (arg && arg.startsWith('day-')) { wsSel.value = arg; padSel.value = arg; }
  if (arg && arg.startsWith('single:')) {
    const k = arg.slice(7), set = SETS.find(s => s[2]().some(x => (Array.isArray(x) ? x[0] : x) === k));
    if (set) { padSel.value = set[0]; wsSel.value = set[0]; }
    loadPadSet(padSel.value, k);
  } else loadPadSet(padSel.value);
  $('#wsCustomBox').style.display = wsSel.value === 'custom' ? 'block' : 'none';
  buildSheet();
}
function loadPadSet(id, focus) {
  padItems = SETS.find(s => s[0] === id)[2]().map(x => Array.isArray(x) ? x : labelFor(x));
  padI = Math.max(0, padItems.findIndex(x => x[0] === focus));
  $('#padChips').innerHTML = padItems.map((x, j) => `<button data-j="${j}">${esc(x[0])}</button>`).join('');
  $$('#padChips button').forEach(b => b.onclick = () => { padI = +b.dataset.j; selPad(); });
  selPad();
}
function selPad() {
  $$('#padChips button').forEach(b => b.classList.toggle('on', +b.dataset.j === padI));
  const [t, r, d] = padItems[padI];
  wsPad.setText(t); $('#padStars').textContent = '';
  $('#padInfo').innerHTML = `<b>${esc(t)}</b> · ${esc(r)} ${d ? '· <span class="hi">' + esc(d) + '</span>' : ''}`;
}
function cellSVG(ch, color) {
  const fs = /[ゃゅょャュョっッぁぃぅぇぉ]/.test(ch) ? 52 : 74;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="98" height="98" fill="#fff" stroke="#444" stroke-width="1.6"/>
    <line x1="50" y1="2" x2="50" y2="98" stroke="#c4c4c4" stroke-width="1" stroke-dasharray="4 4"/>
    <line x1="2" y1="50" x2="98" y2="50" stroke="#c4c4c4" stroke-width="1" stroke-dasharray="4 4"/>
    ${ch ? `<text x="50" y="${fs === 52 ? 66 : 77}" text-anchor="middle" font-family="Klee One, Noto Sans JP, sans-serif" font-size="${fs}" fill="${color}">${esc(ch)}</text>` : ''}</svg>`;
}
function buildSheet() {
  const id = $('#wsSet').value, set = SETS.find(s => s[0] === id);
  const items = set[2]().map(x => Array.isArray(x) ? x : labelFor(x));
  const style = $('#wsStyle').value, labels = $('#wsLabels').checked;
  const COLORS = {model:'#111', trace:'#a6a6a6', faint:'#dcdcdc', blank:''};
  const single = {balanced:['model','trace','trace','trace','faint','faint','blank','blank','blank','blank'],
    trace:['model','trace','trace','trace','trace','trace','trace','blank','blank','blank'],
    memory:['model','trace','blank','blank','blank','blank','blank','blank','blank','blank']}[style];
  const word = {balanced:['model','trace','trace','faint','blank','blank'], trace:['model','trace','trace','trace','trace','blank'], memory:['model','blank','blank','blank']}[style];
  let rows = '';
  for (const [t, r, d] of items) {
    const chars = Array.from(t).slice(0, 10), L = chars.length;
    const cells = [];
    if (L === 1) single.forEach(k => cells.push([k === 'blank' ? '' : t, COLORS[k]]));
    else {
      const per = Math.floor(10 / L); let row = [];
      const flush = () => { while (row.length < 10) row.push(['', '']); cells.push(...row); row = []; };
      for (const k of word) { if (row.length + L > 10) flush(); chars.forEach(c => row.push([k === 'blank' ? '' : c, COLORS[k]])); if (per === 1) flush(); }
      if (row.length) flush();
    }
    for (let i = 0; i < cells.length; i += 10) {
      const lab = i === 0 && labels ? `<b>${esc(t)}</b>${r ? ' · ' + esc(r) : ''}${d ? ' · ' + esc(d) : ''}` : '';
      rows += `<div class="ws-row"><div class="ws-cells">${cells.slice(i, i + 10).map(([c, col]) => cellSVG(c, col)).join('')}</div><div class="ws-lab">${lab}</div></div>`;
    }
  }
  $('#sheet').innerHTML = `<div class="ws-head"><div><h1>Nihongo Yatra · <span class="kl">れんしゅう</span> Practice</h1><div style="font-size:9.5pt">${esc(set[1])}</div></div>
    <div class="fill">Name / नाम: __________ &nbsp; Date / तारीख़: ______</div></div>
    ${rows || '<p>Type some letters in the box above.</p>'}
    <div class="ws-foot">Trace the grey letters, then write on your own in the empty boxes. Stroke order: top → bottom, left → right. がんばって! (लगे रहो!)</div>`;
  fitSheet();
}
function fitSheet() {
  const sh = $('#sheet'), wrap = sh.parentElement;
  sh.style.transform = ''; wrap.style.height = '';
  const avail = wrap.clientWidth - 28, w = sh.offsetWidth;
  if (avail > 0 && w > avail) { const s = avail / w; sh.style.transform = `scale(${s})`; wrap.style.height = (sh.offsetHeight * s + 28) + 'px'; sh.style.margin = '0'; }
  else sh.style.margin = '0 auto';
}
addEventListener('resize', () => { if ($('#view-write').classList.contains('on')) fitSheet(); });
addEventListener('beforeprint', () => { $('#sheet').style.transform = ''; });
addEventListener('afterprint', fitSheet);

/* ---------- BADGES ---------- */
function renderBadges() {
  const doneCount = DAYS.filter(x => isDone(x.d)).length;
  $('#view-badges').innerHTML = `<h2>🏆 Badges & progress</h2>
    <div class="statgrid"><div class="stat"><b>${S.xp}</b><span>XP</span></div><div class="stat"><b>${level()}</b><span>Level · ${LEVELS[Math.min(level() - 1, LEVELS.length - 1)]}</span></div>
    <div class="stat"><b>${doneCount}/30</b><span>days</span></div><div class="stat"><b>${S.speaks}</b><span>speaking tries</span></div></div>
    <div class="badges">${BADGES.map(b => `<div class="badge ${S.badges.includes(b.id) ? '' : 'off'}"><span class="e">${b.e}</span><b>${b.n}</b><br><small class="muted">${b.d}</small></div>`).join('')}</div>
    <h3 style="margin-top:20px">📅 30-day plan</h3>
    <div class="tbl"><table class="t"><tr><th>Day</th><th>Topic</th><th>Status</th></tr>
    ${DAYS.map(x => `<tr><td>${x.d}</td><td>${esc(x.title)}</td><td>${isDone(x.d) ? '✅ ' + '⭐'.repeat(S.days[x.d].stars || 1) : unlocked(x.d) ? '▶ open' : '🔒'}</td></tr>`).join('')}</table></div>`;
}

/* ---------- SETTINGS ---------- */
function renderSettings() {
  const ja = voices.filter(v => /^ja/i.test(v.lang)), hi = voices.filter(v => /^hi/i.test(v.lang));
  const st = S.settings;
  $('#view-settings').innerHTML = `<h2>⚙️ Settings</h2>
    <div class="card">
      <label class="f">🇯🇵 Japanese voice</label>
      <select id="sJa">${ja.length ? ja.map(v => `<option ${voiceFor('ja') === v ? 'selected' : ''}>${esc(v.name)}</option>`).join('') : '<option>(none found — browser default)</option>'}</select>
      <label class="f">🇮🇳 Hindi voice</label>
      <select id="sHi">${hi.length ? hi.map(v => `<option ${voiceFor('hi') === v ? 'selected' : ''}>${esc(v.name)}</option>`).join('') : '<option>(none found — browser default)</option>'}</select>
      <label class="f">Speech speed: <span id="sRateV">${st.rate.toFixed(2)}</span>×</label>
      <input type="range" id="sRate" min=".5" max="1.2" step=".05" value="${st.rate}">
      <div class="row" style="margin-top:10px"><button class="btn sm" id="sTest">🔊 Test voices</button></div>
      <label class="f">Theme</label>
      <select id="sTheme"><option value="auto">Auto (device)</option><option value="light">Light</option><option value="dark">Dark</option></select>
      <label class="row" style="margin-top:12px;gap:6px"><input type="checkbox" id="sSfx" ${st.sfx ? 'checked' : ''}> Sound effects</label>
      <label class="row" style="margin-top:6px;gap:6px"><input type="checkbox" id="sUnlock" ${st.unlockAll ? 'checked' : ''}> Unlock all days (skip ahead)</label>
      <div class="row" style="margin-top:16px"><button class="btn ghost sm" id="sReset">♻️ Reset all progress</button></div>
      <p class="muted" style="font-size:.85rem">Progress is saved in this browser only. Voices come from your device — for best results use Chrome or Edge, and install Japanese &amp; Hindi voices in your system’s text-to-speech settings.</p>
    </div>`;
  $('#sTheme').value = st.theme;
  $('#sJa').onchange = e => { st.jaVoice = e.target.value; save(); };
  $('#sHi').onchange = e => { st.hiVoice = e.target.value; save(); };
  $('#sRate').oninput = e => { st.rate = +e.target.value; $('#sRateV').textContent = st.rate.toFixed(2); save(); };
  $('#sTest').onclick = () => { speak('こんにちは。にほんごを べんきょう しましょう。'); setTimeout(() => speak('नमस्ते! चलिए जापानी सीखते हैं।', 'hi'), 3200); };
  $('#sTheme').onchange = e => { st.theme = e.target.value; save(); applyTheme(); };
  $('#sSfx').onchange = e => { st.sfx = e.target.checked; save(); sfx.ok(); };
  $('#sUnlock').onchange = e => { st.unlockAll = e.target.checked; save(); };
  $('#sReset').onclick = () => { if (confirm('Reset ALL progress, XP and badges?')) { S = structuredClone(DEF); save(); header(); go('home'); } };
}

/* ---------- boot ---------- */
applyTheme(); header(); renderHome();
document.fonts && document.fonts.load('40px "Klee One"', 'あア');
})();
