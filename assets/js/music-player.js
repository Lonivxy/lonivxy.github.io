/* ============================================================
 * Floating music player (v4)
 * ------------------------------------------------------------
 * - Playlist: assets/musics/* (ogg / mp4) + optional lyrics
 * - Each track can carry an inline `subs` array (works even on
 *   file:// where fetch() is blocked by the browser), OR a
 *   .srt / .lrc file that is fetched over HTTP when no `subs`.
 * - Play modes: shuffle (default) / sequential / repeat-one.
 * - Playlist menu: pick any track directly.
 * - Draggable; lyrics shown as a bottom overlay.
 * ============================================================ */
(function() {
  // ---- add a song here ----
  //   { src: 'assets/musics/xx.ogg', title: 'Name',
  //     srt: 'assets/musics/xx.srt',               // optional, fetched over HTTP
  //     subs: [ { start: 12000, end: 16000, text: 'line' } ] } // optional inline (works offline)
  var PLAYLIST = [
    {
      src: 'assets/musics/57.ogg',
      srt: 'assets/musics/57.srt',
      title: '57',
      subs: [
        { start: 11500,  end: 15820,  text: '♪ 好像只能禮貌地問候 (問候) ♪' },
        { start: 16859,  end: 21300,  text: '♪ 你的溫柔也曾被我擁有 (擁有) ♪' },
        { start: 22600,  end: 27960,  text: '♪ 不太習慣沒了你的小宇宙 ♪' },
        { start: 27960,  end: 31449,  text: '♪ 念舊是上癮感受 (感受) ♪' },
        { start: 33780,  end: 37939,  text: '♪ 彷彿只能輕聲地低語 (低語) ♪' },
        { start: 39140,  end: 43460,  text: '♪ 你的笑容曾溫暖我的心 (我的心) ♪' },
        { start: 44920,  end: 50320,  text: '♪ 不太習慣失去你的小天地 ♪' },
        { start: 50320,  end: 53799,  text: '♪ 回憶成了大問題 ♪' },
        { start: 56780,  end: 65459,  text: '♪ 我好想你 ♪' },
        { start: 65859,  end: 67939,  text: '♪ 在每個夜裡孤單自敘 ♪' },
        { start: 67939,  end: 71500,  text: '♪ 紛飛的回憶猜不透你 ♪' },
        { start: 71500,  end: 76939,  text: '♪ 褪色的熟悉是我編造的幻覺 ♪' },
        { start: 100239, end: 103049, text: '♪ 熟悉的世界全是你的記號 ♪' },
        { start: 103049, end: 105829, text: '♪ 刪掉的簡訊確定不想打擾 ♪' },
        { start: 105829, end: 108640, text: '♪ 可是想念卻在腦袋裡吼叫 ♪' },
        { start: 108640, end: 112920, text: '♪ 那些畫面還是沒有辦法忘掉 ♪' },
        { start: 112920, end: 117250, text: '♪ 你現在在哪裡? ♪' },
        { start: 117250, end: 121290, text: '♪ 我們倆的回憶是不是已經不是唯一? ♪' },
        { start: 121290, end: 123760, text: '♪ 念舊是我的問題 ♪' },
        { start: 123760, end: 127439, text: '♪ 我好想你 ♪' }
      ]
    },
    {
      src: 'assets/musics/(カササギ_柿崎ユウタ)【本家】月が綺麗ねと言われたい！ - 初音ミク【カササギ】_360P.mp3',
      srt: 'assets/musics/(カササギ_柿崎ユウタ)【本家】月が綺麗ねと言われたい！ - 初音ミク【カササギ】.srt',
      title: '月が綺麗ねと言われたい！',
      subs: [
        { start: 13120,  end: 15420,  text: '♪ センチメンタル 嫌になる ♪' },
        { start: 15580,  end: 18420,  text: '♪ 悲しみの君の言葉遊び ♪' },
        { start: 19140,  end: 24420,  text: '♪ 君の口から出る感情の裏返しが全部私 ♪' },
        { start: 24940,  end: 27960,  text: '♪ 花占いでもやってみようかな ♪' },
        { start: 28620,  end: 30480,  text: '♪ 好き？嫌い？好き？嫌い？ ♪' },
        { start: 30960,  end: 33760,  text: '♪ 君占いなら私はずっと ♪' },
        { start: 33780,  end: 36400,  text: '♪ 嫌い、嫌い、でも、、、、、好き♡ ♪' },
        { start: 36420,  end: 39320,  text: '♪ 月が綺麗ねと言われたい！ ♪' },
        { start: 39400,  end: 42480,  text: '♪ 君の目の先 ずっと私でいたい ♪' },
        { start: 42920,  end: 46420,  text: '♪ 月が綺麗ねが私じゃないから ♪' },
        { start: 46900,  end: 48460,  text: '♪ なら今夜だけ ♪' },
        { start: 48660,  end: 51280,  text: '♪ 月が綺麗ねと言われたい！ ♪' },
        { start: 51400,  end: 54480,  text: '♪ 私の隣 そっと囁かれたい ♪' },
        { start: 54900,  end: 58400,  text: '♪ 月が綺麗ねが私じゃないから ♪' },
        { start: 58900,  end: 60520,  text: '♪ なら今夜だけ ♪' },
        { start: 61160,  end: 63440,  text: '♪ ロマンティックな夢を見る ♪' },
        { start: 63580,  end: 66440,  text: '♪ 君なりの最の愛の形？ ♪' },
        { start: 67180,  end: 69180,  text: '♪ 同じ色 交わらない ♪' },
        { start: 69220,  end: 72420,  text: '♪ 恋は言わなければ無いと同じ ♪' },
        { start: 72940,  end: 76660,  text: '♪ 「月の夜に咲く一輪の花みたいね」 ♪' },
        { start: 78960,  end: 81200,  text: '♪ 君を見て書いた句は ♪' },
        { start: 81260,  end: 83460,  text: '♪ いつもいつでも字余り ♪' },
        { start: 83480,  end: 84920,  text: '♪ 私みたいだね ♪' },
        { start: 84980,  end: 87940,  text: '♪ 花占いでもやってみようかな ♪' },
        { start: 87980,  end: 90700,  text: '♪ 好き？嫌い？好き？嫌い？ ♪' },
        { start: 90960,  end: 93760,  text: '♪ 君占いなら私はずっと ♪' },
        { start: 93800,  end: 96400,  text: '♪ 嫌い、嫌い、でも、、、、、好き♡ ♪' },
        { start: 96420,  end: 99340,  text: '♪ 月が綺麗ねと言われたい！ ♪' },
        { start: 99380,  end: 102520, text: '♪ 君の目の先ずっと私でいたい ♪' },
        { start: 102940, end: 106500, text: '♪ 月が綺麗ねが私じゃないから ♪' },
        { start: 106900, end: 108520, text: '♪ なら今夜だけ ♪' },
        { start: 108540, end: 111380, text: '♪ 月が綺麗ねと言われたい！ ♪' },
        { start: 111400, end: 114480, text: '♪ 私の隣 そっと囁かれたい ♪' },
        { start: 114940, end: 118460, text: '♪ 月が綺麗ねが私じゃないから ♪' },
        { start: 118900, end: 120440, text: '♪ なら今夜だけ ♪' },
        { start: 120580, end: 123260, text: '♪ 月が綺麗ねと言われたい！ ♪' },
        { start: 123400, end: 126460, text: '♪ 君の目の先ずっと私でいたい ♪' },
        { start: 126940, end: 130500, text: '♪ 月が綺麗ねが私じゃないから ♪' },
        { start: 130900, end: 132440, text: '♪ なら今夜だけ ♪' },
        { start: 132900, end: 135280, text: '♪ 月が綺麗ねと言われたい！ ♪' },
        { start: 135400, end: 138460, text: '♪ 私の隣 そっと囁かれたい ♪' },
        { start: 138940, end: 141760, text: '♪ 月が綺麗ねが私じゃないから ♪' },
        { start: 141780, end: 143700, text: '♪ なら今夜だけ ♪' },
        { start: 144840, end: 146320, text: '♪ 愛してみてね？ ♪' }
      ]
    }
  ];

  var AUTOPLAY_DELAY = 3000; // ms

  var player  = document.getElementById('music-player');
  var toggle  = document.getElementById('music-toggle');
  var btnPrev = document.getElementById('music-prev');
  var btnPlay = document.getElementById('music-playpause');
  var btnNext = document.getElementById('music-next');
  var btnMode = document.getElementById('music-mode');
  var btnList = document.getElementById('music-playlist');
  var menuEl  = document.getElementById('music-playlist-menu');
  var titleEl = document.getElementById('music-title');
  var subEl   = document.getElementById('music-subtitle');
  if (!player || !toggle || !btnPrev || !btnPlay || !btnNext) return;

  var audio = new Audio();
  audio.preload = 'auto';
  audio.loop = false;

  var current = 0;
  var playing = false;
  var cues = [];

  // ---- play modes: shuffle (default) / sequential / single ----
  var MODES = ['shuffle', 'sequential', 'single'];
  var MODE_META = {
    shuffle:    { icon: 'fa-random', title: 'Random (shuffle)' },
    sequential: { icon: 'fa-repeat', title: 'Sequential (loop all)' },
    single:     { icon: 'fa-repeat', title: 'Repeat one', one: true }
  };
  var mode = 'shuffle';
  try {
    var saved = localStorage.getItem('music-mode');
    if (saved && MODES.indexOf(saved) >= 0) mode = saved;
  } catch (e) {}

  function toMs(h, m, s, ms) { return h * 3600000 + m * 60000 + s * 1000 + ms; }

  function loadTrack(i) {
    current = ((i % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    var t = PLAYLIST[current];
    audio.src = t.src; // setting src already starts loading; no need for load()
    cues = t.subs && t.subs.length ? t.subs.slice() : [];
    if (!cues.length) {
      if (t.srt) loadLyrics(t.srt);
      else if (t.lrc) loadLyrics(t.lrc);
    }
    if (titleEl) {
      var name = t.title || t.src.split('/').pop().replace(/\.[^.]+$/, '');
      titleEl.textContent = '♪ ' + name;
    }
    renderPlaylist();
  }

  function play() {
    var p = audio.play();
    if (p && p.catch) p.catch(function() {});
  }
  function togglePlay() { if (playing) audio.pause(); else play(); }

  function nextIndex() {
    if (PLAYLIST.length < 2) return current;
    if (mode === 'shuffle') {
      var i;
      do { i = Math.floor(Math.random() * PLAYLIST.length); } while (i === current);
      return i;
    }
    return (current + 1) % PLAYLIST.length;
  }
  function prevIndex() {
    if (PLAYLIST.length < 2) return current;
    if (mode === 'shuffle') {
      var i;
      do { i = Math.floor(Math.random() * PLAYLIST.length); } while (i === current);
      return i;
    }
    return (current - 1 + PLAYLIST.length) % PLAYLIST.length;
  }
  function next() { loadTrack(mode === 'single' ? current : nextIndex()); play(); }
  function prev() { loadTrack(mode === 'single' ? current : prevIndex()); play(); }

  function cycleMode() {
    mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    try { localStorage.setItem('music-mode', mode); } catch (e) {}
    updateModeUI();
  }
  function updateModeUI() {
    if (!btnMode) return;
    var meta = MODE_META[mode];
    btnMode.innerHTML = '<i class="fas ' + meta.icon + '"></i>' + (meta.one ? '<span class="mode-badge">1</span>' : '');
    btnMode.title = meta.title;
  }

  function updateUI() {
    btnPlay.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    player.classList.toggle('playing', playing);
    player.classList.remove('autoplay-blocked');
    updateModeUI();
  }

  /* ---- lyrics (.srt / .lrc) ---- */
  function loadLyrics(url) {
    fetch(url)
      .then(function(r) { return r.text(); })
      .then(function(text) {
        if (/\\.lrc$/i.test(url)) parseLrc(text);
        else parseSrt(text);
      })
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
  // LRC (incl. enhanced/word-timed LRC)
  function parseLrc(text) {
    cues = [];
    var re = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
    var lines = text.replace(/\r/g, '').split('\n');
    lines.forEach(function(line) {
      var matches = [];
      var m;
      re.lastIndex = 0;
      while ((m = re.exec(line))) matches.push(m);
      if (!matches.length) return;
      var last = matches[matches.length - 1];
      // text = everything after the last [time] tag, minus word tags
      var content = line.slice(last.index + last[0].length)
        .replace(/<[^>]*>/g, '')        // enhanced LRC <word> tags
        .replace(/\(\d+,\d+\)/g, '') // qrc-style (start,dur) tags
        .trim();
      if (!content) return;
      matches.forEach(function(mm) {
        var min = +mm[1], sec = +mm[2], frac = mm[3] ? +mm[3] : 0;
        var ms = min * 60000 + sec * 1000;
        if (mm[3] && mm[3].length === 1) ms += frac * 100;
        else if (mm[3] && mm[3].length === 2) ms += frac * 10;
        else ms += frac;
        cues.push({ start: ms, end: ms + 5000, text: content });
      });
    });
    cues.sort(function(a, b) { return a.start - b.start; });
    // fill end times from the next cue
    for (var i = 0; i < cues.length; i++) {
      cues[i].end = (i + 1 < cues.length) ? cues[i + 1].start : cues[i].start + 5000;
    }
  }
  var lastSub = '';
  var subTimer = null;
  // 换行时先淡出旧字幕，再淡入新字幕
  function swapSubtitle(txt) {
    if (subTimer) { clearTimeout(subTimer); subTimer = null; }
    subEl.classList.remove('show'); // 触发淡出
    if (!txt) { subEl.textContent = ''; return; }
    subTimer = setTimeout(function() {
      subEl.textContent = txt;
      void subEl.offsetWidth; // 重新触发过渡，实现淡入
      subEl.classList.add('show');
      subTimer = null;
    }, 250); // 与 CSS 淡出时长一致
  }
  audio.addEventListener('timeupdate', function() {
    if (!subEl) return;
    var t = audio.currentTime * 1000;
    var active = null;
    for (var i = 0; i < cues.length; i++) {
      if (t >= cues[i].start && t <= cues[i].end) { active = cues[i]; break; }
    }
    var txt = active ? active.text : '';
    if (txt === lastSub) return;
    lastSub = txt;
    swapSubtitle(txt);
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
  function onClick(fn) {
    return function(e) {
      e.stopPropagation();
      fn();
    };
  }

  toggle.addEventListener('click', onClick(function() {
    player.classList.toggle('expanded');
  }));
  btnPlay.addEventListener('click', onClick(togglePlay));
  btnNext.addEventListener('click', onClick(next));
  btnPrev.addEventListener('click', onClick(prev));
  if (btnMode) btnMode.addEventListener('click', onClick(cycleMode));
  if (btnList) btnList.addEventListener('click', onClick(function() {
    player.classList.toggle('menu-open');
  }));
  document.addEventListener('click', function(e) {
    if (player.classList.contains('menu-open') && !player.contains(e.target)) {
      player.classList.remove('menu-open');
    }
  });

  /* ---- playlist menu ---- */
  function renderPlaylist() {
    if (!menuEl) return;
    menuEl.innerHTML = '';
    PLAYLIST.forEach(function(t, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'playlist-item' + (i === current ? ' current' : '');
      var name = t.title || t.src.split('/').pop().replace(/\.[^.]+$/, '');
      var num = document.createElement('span');
      num.className = 'p-num';
      num.textContent = (i + 1) + '.';
      b.appendChild(num);
      b.appendChild(document.createTextNode(name));
      b.addEventListener('click', onClick(function() {
        loadTrack(i);
        play();
        player.classList.remove('menu-open');
      }));
      menuEl.appendChild(b);
    });
  }

  /* ---- fixed to bottom-right (locked position) ---- */

  /* ---- init + delayed auto-play ---- */
  if (mode === 'shuffle' && PLAYLIST.length > 1) loadTrack(Math.floor(Math.random() * PLAYLIST.length));
  else loadTrack(0);
  updateUI();
  setTimeout(function() {
    var p = audio.play();
    if (p && p.catch) p.catch(function() {
      // Autoplay blocked by the browser -> start on first user gesture.
      player.classList.add('autoplay-blocked');
      var start = function() {
        play();
        document.removeEventListener('pointerdown', start);
        document.removeEventListener('keydown', start);
        document.removeEventListener('touchstart', start);
      };
      document.addEventListener('pointerdown', start);
      document.addEventListener('keydown', start);
      document.addEventListener('touchstart', start);
    });
  }, AUTOPLAY_DELAY);
})();
