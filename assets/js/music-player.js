/* ============================================================
 * Floating music player
 * ------------------------------------------------------------
 * Audio file: put your .ogg (or any audio) in assets/musics/
 * and update MUSIC_URL below to match its filename.
 * ============================================================ */
(function() {
  var MUSIC_URL = 'assets/musics/music.ogg';

  var player = document.getElementById('music-player');
  var btn = document.getElementById('music-btn');
  if (!player || !btn) return;

  var audio = new Audio(MUSIC_URL);
  audio.loop = true;
  audio.preload = 'metadata';

  var playing = false;

  function toggle() {
    if (playing) {
      audio.pause();
    } else {
      var p = audio.play();
      // Autoplay policy / missing file: swallow the rejection.
      if (p && p.catch) p.catch(function() {});
    }
  }

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (suppressClick) { suppressClick = false; return; }
    toggle();
  });

  audio.addEventListener('play', function() {
    playing = true;
    player.classList.add('playing');
  });
  audio.addEventListener('pause', function() {
    playing = false;
    player.classList.remove('playing');
  });
  audio.addEventListener('ended', function() {
    playing = false;
    player.classList.remove('playing');
  });
  audio.addEventListener('error', function() {
    // Music file not found / can't play -> show a muted state.
    player.classList.add('no-music');
    btn.title = 'Music file not found';
  });

  /* ---- draggable (movable) ---- */
  var dragging = false, moved = false, suppressClick = false;
  var startX = 0, startY = 0, curX = 0, curY = 0;

  player.addEventListener('pointerdown', function(e) {
    dragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    var r = player.getBoundingClientRect();
    curX = r.left;
    curY = r.top;
    if (player.setPointerCapture) player.setPointerCapture(e.pointerId);
  });

  player.addEventListener('pointermove', function(e) {
    if (!dragging) return;
    var dx = e.clientX - startX, dy = e.clientY - startY;
    if (!moved && Math.abs(dx) + Math.abs(dy) > 5) {
      moved = true;
    }
    if (moved) {
      player.style.left = (curX + dx) + 'px';
      player.style.top = (curY + dy) + 'px';
      player.style.right = 'auto';
      player.style.bottom = 'auto';
    }
  });

  player.addEventListener('pointerup', function() {
    if (!dragging) return;
    dragging = false;
    // A real drag shouldn't also trigger the play/pause click.
    if (moved) {
      suppressClick = true;
      setTimeout(function() { suppressClick = false; }, 120);
    }
  });

  player.addEventListener('pointercancel', function() {
    dragging = false;
    moved = false;
  });
})();
