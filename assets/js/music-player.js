/* ============================================================
 * Floating music player (v2)
 * ------------------------------------------------------------
 * - Playlist: assets/musics/*.ogg (+ optional .srt subtitles)
 * - Delayed auto-play a few seconds after page load (best-effort)
 * - Click the music button to expand a pill control bar
 *   with Previous / Play-Pause / Next (stretches to the right)
 * - Draggable; .srt subtitles shown as a bottom overlay
 * ============================================================ */
(function() {
  var PLAYLIST = [
    { src: 'assets/musics/57.ogg', srt: 'assets/musics/57.srt' }
    // add more tracks here, e.g. { src: 'assets/musics/xx.ogg', srt: 'assets/musics/xx.srt' }
  ];

  var AUTOPLAY_DELAY = 3000; // ms

  var player  = document.getElementById('music-player');
  var toggle  = document.getElementById('music-toggle');
  var btnPrev = document.getElementById('music-prev');
  var btnPlay = document.getElementById('music-playpause');
  var btnNext = document.getElementById('music-next');
  var subEl   = document.getElementById('music-subtitle');
  if (!player || !toggle || !btnPrev || !btnPlay || !btnNext) return;

  var audio = new Audio();
  audio.preload = 'auto';
  audio.loop = false;

  var current = 0;
  var playing = false;
  var cues = [];

  function toMs(h, m, s, ms) { return h * 3600000 + m * 60000 + s * 1000 + ms; }

  function loadTrack(i) {
    current = ((i % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    var t = PLAYLIST[current];
    audio.src = t.src;
    cues = [];
    if (t.srt) loadSubtitles(t.srt);
    audio.load();
  }

  function play() {
    var p = audio.play();
    if (p && p.catch) p.catch(function() {}); // autoplay policy / missing file
  }
  function togglePlay() {
    if (playing) audio.pause(); else play();
  }
  function next() { loadTrack(current + 1); play(); }
  function prev() { loadTrack(current - 1); play(); }

  function updateUI() {
    btnPlay.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    player.classList.toggle('playing', playing);
  }

  /* ---- .srt subtitles ---- */
  function loadSubtitles(url) {
    fetch(url)
      .then(function(r) { return r.text(); })
      .then(parseSrt)
      .catch(function() {}); // file:// may block fetch; works when deployed
  }
  function parseSrt(text) {
    cues = [];
    var blocks = text.replace(/\r/g, '').split(/\n\n+/);
    blocks.forEach(function(block) {
      var lines = block.split('\n');
      var m = (lines[1] || '').match(
        /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/
      );
      if (!m) return;
      cues.push({
        start: toMs(+m[1], +m[2], +m[3], +m[4]),
        end:   toMs(+m[5], +m[6], +m[7], +m[8]),
        text:  lines.slice(2).join(' ')
      });
    });
    cues.sort(function(a, b) { return a.start - b.start; });
  }
  audio.addEventListener('timeupdate', function() {
    if (!subEl) return;
    var t = audio.currentTime * 1000;
    var active = null;
    for (var i = 0; i < cues.length; i++) {
      if (t >= cues[i].start && t <= cues[i].end) { active = cues[i]; break; }
    }
    if (active) {
      subEl.textContent = active.text;
      subEl.classList.add('show');
    } else {
      subEl.textContent = '';
      subEl.classList.remove('show');
    }
  });

  /* ---- audio events ---- */
  audio.addEventListener('play', function() { playing = true; updateUI(); });
  audio.addEventListener('pause', function() { playing = false; updateUI(); });
  audio.addEventListener('ended', function() { next(); });
  audio.addEventListener('error', function() {
    player.classList.add('no-music');
    toggle.title = 'Music file not found';
  });

  /* ---- controls ---- */
  var suppressClick = false;

  function onClick(fn) {
    return function(e) {
      e.stopPropagation();
      if (suppressClick) { suppressClick = false; return; }
      fn();
    };
  }

  toggle.addEventListener('click', onClick(function() {
    player.classList.toggle('expanded');
  }));
  btnPlay.addEventListener('click', onClick(togglePlay));
  btnNext.addEventListener('click', onClick(next));
  btnPrev.addEventListener('click', onClick(prev));

  /* ---- draggable ---- */
  var dragging = false, moved = false;
  var startX = 0, startY = 0, curX = 0, curY = 0;

  player.addEventListener('pointerdown', function(e) {
    dragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    var r = player.getBoundingClientRect();
    curX = r.left;
    curY = r.top;
  });
  window.addEventListener('pointermove', function(e) {
    if (!dragging) return;
    var dx = e.clientX - startX, dy = e.clientY - startY;
    if (!moved && Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    if (moved) {
      player.style.left = (curX + dx) + 'px';
      player.style.top = (curY + dy) + 'px';
      player.style.right = 'auto';
      player.style.bottom = 'auto';
    }
  });
  window.addEventListener('pointerup', function() {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      suppressClick = true;
      setTimeout(function() { suppressClick = false; }, 120);
    }
  });
  window.addEventListener('pointercancel', function() { dragging = false; moved = false; });

  /* ---- init + delayed auto-play ---- */
  loadTrack(0);
  updateUI();
  setTimeout(function() {
    play(); // best-effort; some browsers block until a user gesture
  }, AUTOPLAY_DELAY);
})();
