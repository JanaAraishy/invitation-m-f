const WEDDING_DATE = '2026-11-21T18:00:00+03:00';
const MAP_LINKS = {venue: 'https://maps.app.goo.gl/48dhT8N7qmnUYuaU9', home: 'https://maps.app.goo.gl/685kjyxKFbem78mW9'};
function countdownParts(now, target = Date.parse(WEDDING_DATE)) {
  const remaining = Math.max(0, Math.floor((target - now) / 1000));
  return {days: Math.floor(remaining / 86400), hours: Math.floor(remaining % 86400 / 3600), minutes: Math.floor(remaining % 3600 / 60), seconds: remaining % 60};
}
function arabicDigits(value) {return String(value).padStart(2, '0').replace(/[0-9]/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);}
function tick() {const parts = countdownParts(Date.now()); for (const key of Object.keys(parts)) document.getElementById(key).textContent = arabicDigits(parts[key]);}
tick(); setInterval(tick, 1000);
const cover = document.getElementById('cover'), envelope = document.getElementById('envelope'), main = document.getElementById('invitation'), replay = document.getElementById('replay');
let opening = false;
const popCard = document.getElementById('pop-card'), pocket = document.getElementById('envelope-pocket');
let openingTimers = [], openingAnimations = [];
function resetOpeningEffect() {
 document.querySelector('.hero').classList.remove('text-playing','text-finished');
 openingTimers.forEach(clearTimeout); openingTimers = [];
 openingAnimations.forEach(animation => animation.cancel()); openingAnimations = [];
 envelope.classList.remove('leaving');
 popCard.classList.remove('reveal');
 popCard.style.opacity = '0'; pocket.style.opacity = '0';
}
function openInvitation() {
 if (opening) return;
 opening = true;
 startMusic();
 const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
 const bounds = envelope.getBoundingClientRect();
 envelope.classList.add('opening');
 const finish = () => {
 const hero = document.querySelector('.hero');
 hero.classList.add('text-playing');
 if (reduced) hero.classList.add('text-finished');
 else openingTimers.push(setTimeout(() => hero.classList.add('text-finished'), 3100));
 cover.classList.add('done'); main.inert = false; document.body.classList.remove('locked'); document.querySelector('.hero').classList.add('visible'); replay.classList.add('show'); opening = false;};
 if (reduced) {openingTimers.push(setTimeout(finish, 50)); return;}
 const finalWidth = main.getBoundingClientRect().width;
 const initialScale = bounds.width * .76 / finalWidth;
 const finalLeft = main.getBoundingClientRect().left;
 const startLeft = bounds.left + bounds.width * .12;
 const startTop = bounds.top + bounds.height * .34;
 popCard.style.width = finalWidth + 'px';
 Object.assign(pocket.style, {left:bounds.left+'px',top:bounds.top+'px',width:bounds.width+'px',height:bounds.height+'px'});
 openingTimers.push(setTimeout(() => {
  // The envelope disappears at the same instant the blank card emerges.
  envelope.classList.add('leaving');
  openingAnimations.push(popCard.animate([
   {transform:`translate(${startLeft}px,${startTop}px) scale(${initialScale})`,opacity:1,offset:0},
   {transform:`translate(${startLeft}px,${bounds.top - bounds.height * .08}px) scale(${initialScale})`,opacity:1,offset:.52},
   {transform:`translate(${finalLeft}px,0px) scale(1)`,opacity:1,offset:1}
  ],{duration:1200,easing:'cubic-bezier(.2,.65,.25,1)',fill:'forwards'}));
 }, 850));
 openingTimers.push(setTimeout(() => popCard.classList.add('reveal'), 2150));
 openingTimers.push(setTimeout(finish, 3000));
}
document.getElementById('open').addEventListener('click', openInvitation);
replay.addEventListener('click', () => {resetOpeningEffect();window.scrollTo({top:0,behavior:'instant'});document.body.classList.add('locked');main.inert=true;cover.classList.remove('done');envelope.classList.remove('opening');replay.classList.remove('show');document.getElementById('open').focus();});
const observer = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) entry.target.classList.add('visible');}), {threshold:.08});document.querySelectorAll('section').forEach(section => observer.observe(section));
let toastTimeout;
document.querySelectorAll('[data-map]').forEach(button => button.addEventListener('click', () => {const url = MAP_LINKS[button.dataset.map]; if (url && /^https:\/\//.test(url)) {window.open(url,'_blank','noopener,noreferrer');} else {const message = document.getElementById('map-message');message.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>message.hidden=true,2500);}}));

// A sparse, non-interactive layer of falling rose petals.
const petalLayer = document.getElementById('petals');
for (let i = 0; i < 18; i++) {
 const petal = document.createElement('span');
 petal.className = 'petal';
 const left = (i * 37 + 13) % 100;
 petal.style.cssText = `--left:${left}%;--size:${8 + i % 6}px;--duration:${13 + i % 8}s;--delay:-${i * 1.43}s;--drift:${i % 2 ? 38 : -32}px;--end:${i % 2 ? -16 : 26}px;--turn:${2.4 + i % 4}s`;
 petal.innerHTML = `<svg viewBox="0 0 20 30" focusable="false" aria-hidden="true"><path d="M3 3C12-2 23 5 18 19C16 26 10 30 4 27C-2 22 0 13 3 3Z" fill="${i % 3 ? '#d7a8ae' : '#e8bec0'}"/><path d="M6 24Q10 12 6 5" fill="none" stroke="#efcdd0" stroke-width=".7" opacity=".5"/></svg>`;
 petalLayer.append(petal);
}

const music = document.getElementById('wedding-music');
const musicButton = document.getElementById('music-toggle');
function updateMusicControl() {
 const audible = !music.paused && !music.muted;
 musicButton.classList.toggle('is-muted', music.muted);
 musicButton.classList.toggle('is-paused', music.paused);
 musicButton.setAttribute('aria-pressed', String(audible));
 musicButton.setAttribute('aria-label', audible ? 'كتم الموسيقى' : 'تشغيل الموسيقى');
}
function startMusic() {
 musicButton.hidden = false;
 if (music.paused) music.play().then(updateMusicControl).catch(updateMusicControl);
}
musicButton.addEventListener('click', () => {
 if (music.paused) {music.muted = false;startMusic();}
 else {music.muted = !music.muted;updateMusicControl();}
});
for (const event of ['play','pause','volumechange','error']) music.addEventListener(event, updateMusicControl);
