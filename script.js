const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -40px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const menuButton = document.querySelector('.menu-button');
const menuDrawer = document.querySelector('.menu-drawer');
const menuLinks = menuDrawer.querySelectorAll('a');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuDrawer.setAttribute('aria-hidden', 'true');
  menuDrawer.classList.remove('is-open');
  document.body.style.overflow = '';
}

menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuDrawer.setAttribute('aria-hidden', String(!opening));
  menuDrawer.classList.toggle('is-open', opening);
  document.body.style.overflow = opening ? 'hidden' : '';
});
menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

const sections = document.querySelectorAll('main section[id], footer[id]');
const railLinks = document.querySelectorAll('.rail-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    railLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: 0.42 });
sections.forEach((section) => sectionObserver.observe(section));

const journalEntries = document.querySelectorAll('[data-accordion] details');
journalEntries.forEach((entry) => {
  entry.addEventListener('toggle', () => {
    if (!entry.open) return;
    journalEntries.forEach((other) => {
      if (other !== entry) other.open = false;
    });
  });
});

const video = document.querySelector('.motion-frame video');
const videoButton = document.querySelector('.video-control');
const videoLabel = videoButton.querySelector('span');

function setVideoState(playing) {
  videoLabel.textContent = playing ? 'Pause' : 'Play';
  videoButton.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
}

videoButton.addEventListener('click', async () => {
  if (video.paused) {
    await video.play();
    setVideoState(true);
  } else {
    video.pause();
    setVideoState(false);
  }
});

const videoObserver = new IntersectionObserver(async ([entry]) => {
  if (entry.isIntersecting && !reducedMotion) {
    try {
      await video.play();
      setVideoState(true);
    } catch {
      setVideoState(false);
    }
  } else {
    video.pause();
    setVideoState(false);
  }
}, { threshold: 0.55 });
videoObserver.observe(video);

const termAudio=document.querySelector('#term-audio');
const musicButton=document.querySelector('#music-toggle');
const volume=document.querySelector('#music-volume');
let playRequest=0;
const tracks={prelims:{src:'assets/out-of-the-woods.mp3',title:'Out of the Woods'},midterms:{src:'assets/aint-in-la.mp3',title:'Ain’t in LA'}};
termAudio.volume=.4;
function musicState(){musicButton.textContent=termAudio.paused?'Play ▶':'Pause Ⅱ';musicButton.setAttribute('aria-pressed',String(!termAudio.paused));musicButton.setAttribute('aria-label',termAudio.paused?'Play music':'Pause music');}
function playTrack(){const request=++playRequest;termAudio.play().then(()=>{if(request===playRequest)document.querySelector('#music-message').textContent='';}).catch(()=>{if(request===playRequest)document.querySelector('#music-message').textContent='Press Play to start the soundtrack.';});}
function selectTerm(term,play=false){const selected=term==='prelims'?'prelims':'midterms';document.querySelectorAll('[data-period]').forEach(p=>p.hidden=p.dataset.period!==selected);document.querySelectorAll('[data-term]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.term===selected)));const track=tracks[selected];if(termAudio.getAttribute('src')!==track.src){++playRequest;termAudio.pause();termAudio.setAttribute('src',track.src);termAudio.load();}document.querySelector('#track-title').textContent=track.title;document.querySelector('#track-period').textContent=selected.toUpperCase()+' SOUNDTRACK';if(play)playTrack();}
document.querySelectorAll('[data-term]').forEach(b=>b.addEventListener('click',()=>selectTerm(b.dataset.term,true)));
musicButton.addEventListener('click',()=>{if(termAudio.paused)playTrack();else{++playRequest;termAudio.pause();}});
termAudio.addEventListener('play',musicState);termAudio.addEventListener('pause',musicState);volume.addEventListener('input',()=>termAudio.volume=Number(volume.value)/100);
document.querySelector('.midterm-hero-link').addEventListener('click',()=>selectTerm('midterms',true));
selectTerm(new URLSearchParams(location.search).get('term'));
