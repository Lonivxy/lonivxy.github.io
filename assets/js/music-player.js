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
      src: 'assets/musics/第57次取消发送-菲菲公主.ogg',
      srt: 'assets/musics/第57次取消发送-菲菲公主.srt',
      title: '第57次取消发送 (菲菲公主)',
      subs: [
        { start: 11200,  end: 15480,  text: '♪ 好像只能礼貌的问候 ♪' },
        { start: 16440,  end: 20840,  text: '♪ 你的温柔也曾被我拥有 ♪' },
        { start: 22100,  end: 27360,  text: '♪ 不太习惯没了你的小宇宙 ♪' },
        { start: 27360,  end: 31010,  text: '♪ 念旧是上瘾感受 ♪' },
        { start: 33040,  end: 37120,  text: '♪ 仿佛只能轻声地低语 ♪' },
        { start: 38310,  end: 42550,  text: '♪ 你的笑容曾温暖我的心 ♪' },
        { start: 43980,  end: 49260,  text: '♪ 不太习惯失去你的小天地 ♪' },
        { start: 49260,  end: 52750,  text: '♪ 回忆成了大问题 ♪' },
        { start: 55600,  end: 58040,  text: '♪ 我好想你 ♪' },
        { start: 59200,  end: 64099,  text: '♪ 在每个夜里孤单自寻 ♪' },
        { start: 64499,  end: 66519,  text: '♪ 纷飞的回忆 ♪' },
        { start: 66519,  end: 71970,  text: '♪ 猜不透你褪色的熟悉 ♪' },
        { start: 71970,  end: 75350,  text: '♪ 是我编造的幻觉 ♪' },
        { start: 98180,  end: 100950, text: '♪ 熟悉的世界全是你的记号 ♪' },
        { start: 100950, end: 103690, text: '♪ 删掉的短信决定不想打扰 ♪' },
        { start: 103690, end: 106030, text: '♪ 可是想念却在脑袋理后 ♪' },
        { start: 106030, end: 110630, text: '♪ 照那些画面还是没有办法忘掉你现在在哪里 ♪' },
        { start: 110630, end: 114880, text: '♪ 我们聊的回忆是不是已经不是唯一 ♪' },
        { start: 114880, end: 118840, text: '♪ 念旧是我的问题 ♪' },
        { start: 121280, end: 132180, text: '♪ 我好想你在每个夜里离孤单思绪纷飞的回忆 ♪' },
        { start: 132180, end: 137630, text: '♪ 猜不透你褪色的熟悉 ♪' },
        { start: 137630, end: 141030, text: '♪ 是我编造的幻觉 ♪' },
        { start: 143160, end: 151650, text: '♪ 我好想你在每个夜里孤单自寻 ♪' },
        { start: 152050, end: 154090, text: '♪ 纷飞的回忆 ♪' },
        { start: 154090, end: 159520, text: '♪ 猜不透你褪色的熟悉 ♪' },
        { start: 159520, end: 162160, text: '♪ 是我们造的幻觉 ♪' }
      ]
    },
    {
      src: 'assets/musics/(カササギ_柿崎ユウタ)【本家】月が綺麗ねと言われたい！ - 初音ミク【カササギ】_360P.mp3',
      srt: 'assets/musics/(カササギ_柿崎ユウタ)【本家】月が綺麗ねと言われたい！ - 初音ミク【カササギ】.srt',
      title: '月が綺麗ねと言われたい！',
      subs: [
        { start: 13120,  end: 15420,  text: '♪ センチメンタル 嫌になる ♪', cn: '这份多愁善感，连自己都厌弃' },
        { start: 15580,  end: 18420,  text: '♪ 悲しみの君の言葉遊び ♪', cn: '你悲伤话语中的游戏' },
        { start: 19140,  end: 24420,  text: '♪ 君の口から出る感情の裏返しが全部私 ♪', cn: '你口中那些言不由衷，全都是我' },
        { start: 24940,  end: 27960,  text: '♪ 花占いでもやってみようかな ♪', cn: '不如用花瓣，来占卜一番吧' },
        { start: 28620,  end: 30480,  text: '♪ 好き？嫌い？好き？嫌い？ ♪', cn: '喜欢？讨厌？喜欢？讨厌？' },
        { start: 30960,  end: 33760,  text: '♪ 君占いなら私はずっと ♪', cn: '若占卜你的心，我一定永远' },
        { start: 33780,  end: 36400,  text: '♪ 嫌い、嫌い、でも、、、、、好き♡ ♪', cn: '讨厌、讨厌、可是……还是喜欢♡' },
        { start: 36420,  end: 39320,  text: '♪ 月が綺麗ねと言われたい！ ♪', cn: '好想听你说一句「月色真美」！' },
        { start: 39400,  end: 42480,  text: '♪ 君の目の先 ずっと私でいたい ♪', cn: '想一直，站在你目光的尽头' },
        { start: 42920,  end: 46420,  text: '♪ 月が綺麗ねが私じゃないから ♪', cn: '只因那句「月色真美」，不是对我说' },
        { start: 46900,  end: 48460,  text: '♪ なら今夜だけ ♪', cn: '那便只限今夜' },
        { start: 48660,  end: 51280,  text: '♪ 月が綺麗ねと言われたい！ ♪', cn: '好想听你说一句「月色真美」！' },
        { start: 51400,  end: 54480,  text: '♪ 私の隣 そっと囁かれたい ♪', cn: '想被你贴近耳边，轻轻呢喃' },
        { start: 54900,  end: 58400,  text: '♪ 月が綺麗ねが私じゃないから ♪', cn: '只因那句「月色真美」，不是对我说' },
        { start: 58900,  end: 60520,  text: '♪ なら今夜だけ ♪', cn: '那便只限今夜' },
        { start: 61160,  end: 63440,  text: '♪ ロマンティックな夢を見る ♪', cn: '沉入一场浪漫的梦' },
        { start: 63580,  end: 66440,  text: '♪ 君なりの最の愛の形？ ♪', cn: '属于你的，爱的模样？' },
        { start: 67180,  end: 69180,  text: '♪ 同じ色 交わらない ♪', cn: '同样的色彩，却永不相交' },
        { start: 69220,  end: 72420,  text: '♪ 恋は言わなければ無いと同じ ♪', cn: '爱若不说出口，便如同未曾有过' },
        { start: 72940,  end: 76660,  text: '♪ 「月の夜に咲く一輪の花みたいね」 ♪', cn: '「宛如月夜里，悄然绽放的一朵花呢」' },
        { start: 78960,  end: 81200,  text: '♪ 君を見て書いた句は ♪', cn: '望着你写下的诗句' },
        { start: 81260,  end: 83460,  text: '♪ いつもいつでも字余り ♪', cn: '无论何时，总是不合韵脚' },
        { start: 83480,  end: 84920,  text: '♪ 私みたいだね ♪', cn: '就像我一样呢' },
        { start: 84980,  end: 87940,  text: '♪ 花占いでもやってみようかな ♪', cn: '不如用花瓣，来占卜一番吧' },
        { start: 87980,  end: 90700,  text: '♪ 好き？嫌い？好き？嫌い？ ♪', cn: '喜欢？讨厌？喜欢？讨厌？' },
        { start: 90960,  end: 93760,  text: '♪ 君占いなら私はずっと ♪', cn: '若占卜你的心，我一定永远' },
        { start: 93800,  end: 96400,  text: '♪ 嫌い、嫌い、でも、、、、、好き♡ ♪', cn: '讨厌、讨厌、可是……还是喜欢♡' },
        { start: 96420,  end: 99340,  text: '♪ 月が綺麗ねと言われたい！ ♪', cn: '好想听你说一句「月色真美」！' },
        { start: 99380,  end: 102520, text: '♪ 君の目の先ずっと私でいたい ♪', cn: '想一直，站在你目光的尽头' },
        { start: 102940, end: 106500, text: '♪ 月が綺麗ねが私じゃないから ♪', cn: '只因那句「月色真美」，不是对我说' },
        { start: 106900, end: 108520, text: '♪ なら今夜だけ ♪', cn: '那便只限今夜' },
        { start: 108540, end: 111380, text: '♪ 月が綺麗ねと言われたい！ ♪', cn: '好想听你说一句「月色真美」！' },
        { start: 111400, end: 114480, text: '♪ 私の隣 そっと囁かれたい ♪', cn: '想被你贴近耳边，轻轻呢喃' },
        { start: 114940, end: 118460, text: '♪ 月が綺麗ねが私じゃないから ♪', cn: '只因那句「月色真美」，不是对我说' },
        { start: 118900, end: 120440, text: '♪ なら今夜だけ ♪', cn: '那便只限今夜' },
        { start: 120580, end: 123260, text: '♪ 月が綺麗ねと言われたい！ ♪', cn: '好想听你说一句「月色真美」！' },
        { start: 123400, end: 126460, text: '♪ 君の目の先ずっと私でいたい ♪', cn: '想一直，站在你目光的尽头' },
        { start: 126940, end: 130500, text: '♪ 月が綺麗ねが私じゃないから ♪', cn: '只因那句「月色真美」，不是对我说' },
        { start: 130900, end: 132440, text: '♪ なら今夜だけ ♪', cn: '那便只限今夜' },
        { start: 132900, end: 135280, text: '♪ 月が綺麗ねと言われたい！ ♪', cn: '好想听你说一句「月色真美」！' },
        { start: 135400, end: 138460, text: '♪ 私の隣 そっと囁かれたい ♪', cn: '想被你贴近耳边，轻轻呢喃' },
        { start: 138940, end: 141760, text: '♪ 月が綺麗ねが私じゃないから ♪', cn: '只因那句「月色真美」，不是对我说' },
        { start: 141780, end: 143700, text: '♪ なら今夜だけ ♪', cn: '那便只限今夜' },
        { start: 144840, end: 146320, text: '♪ 愛してみてね？ ♪', cn: '试着，爱上我吧？' }
      ]
    },
    {
      src: 'assets/musics/(d0tc0mmie)I Cant Wait feat. GUMI.mp3',
      srt: 'assets/musics/(d0tc0mmie)I Cant Wait feat. GUMI.srt',
      title: 'I Cant Wait (GUMI)',
      subs: [
        { start: 2660,   end: 4360,   text: '♪ i cant wait ♪', cn: '我等不及了' },
        { start: 4360,   end: 5660,   text: '♪ no mistake ♪', cn: '没有错' },
        { start: 5660,   end: 6870,   text: "♪ i'm in love ♪", cn: '我坠入爱河' },
        { start: 6870,   end: 8680,   text: '♪ like a drug ♪', cn: '像中了毒' },
        { start: 8680,   end: 10000,  text: '♪ pick me up ♪', cn: '带我走吧' },
        { start: 10000,  end: 11400,  text: '♪ these feelings ♪', cn: '这些情愫' },
        { start: 11400,  end: 13790,  text: '♪ will never leave my heart ♪', cn: '永远不会离开我的心' },
        { start: 13790,  end: 14780,  text: '♪ love me ♪', cn: '爱我' },
        { start: 14780,  end: 17990,  text: '♪ love me ahh~ ♪', cn: '爱我啊~' },
        { start: 17990,  end: 19090,  text: '♪ i cant wait ♪', cn: '我等不及了' },
        { start: 19090,  end: 20630,  text: '♪ no mistake ♪', cn: '没有错' },
        { start: 20630,  end: 22060,  text: "♪ i'm in love ♪", cn: '我坠入爱河' },
        { start: 22060,  end: 23420,  text: '♪ like a drug ♪', cn: '像中了毒' },
        { start: 23420,  end: 24780,  text: '♪ pick me up ♪', cn: '带我走吧' },
        { start: 24780,  end: 26120,  text: '♪ these feelings ♪', cn: '这些情愫' },
        { start: 26120,  end: 28870,  text: '♪ will never leave my heart ♪', cn: '永远不会离开我的心' },
        { start: 28870,  end: 32880,  text: '♪ love me love me ahh~ ♪', cn: '爱我 爱我啊~' },
        { start: 32880,  end: 48870,  text: '♪ (teto sax solo) ♪', cn: '(teto 萨克斯独奏)' },
        { start: 48870,  end: 52530,  text: '♪ ドキドキ 愛してる ♪', cn: '心跳加速 我爱你' },
        { start: 52530,  end: 55980,  text: '♪ ずっと離さない ♪', cn: '永远不放开你' },
        { start: 55980,  end: 60020,  text: '♪ この feeling good ♪', cn: '这种感觉真好' },
        { start: 60020,  end: 63780,  text: '♪ 愛して愛して aaa~ ♪', cn: '爱我 爱我 aaa~' },
        { start: 63780,  end: 65100,  text: '♪ i cant wait ♪', cn: '我等不及了' },
        { start: 65100,  end: 66500,  text: '♪ no mistake ♪', cn: '没有错' },
        { start: 66500,  end: 67750,  text: "♪ i'm in love ♪", cn: '我坠入爱河' },
        { start: 67750,  end: 69390,  text: '♪ like a drug ♪', cn: '像中了毒' },
        { start: 69390,  end: 70630,  text: '♪ pick me up ♪', cn: '带我走吧' },
        { start: 70630,  end: 72130,  text: '♪ these feelings ♪', cn: '这些情愫' },
        { start: 72130,  end: 74900,  text: '♪ will never leave my heart ♪', cn: '永远不会离开我的心' },
        { start: 74900,  end: 79900,  text: '♪ love me love me ahh~ ♪', cn: '爱我 爱我啊~' }
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
  var btnLyrics  = document.getElementById('music-lyrics');
  var lyricsPanel = document.getElementById('music-lyrics-panel');
  var seekEl   = document.getElementById('music-seek');
  var seekFill = document.getElementById('music-seek-fill');
  var timeCur  = document.getElementById('music-time-cur');
  var timeTotal = document.getElementById('music-time-total');
  var volBtn   = document.getElementById('music-vol');
  var volRange = document.getElementById('music-vol-range');
  var visCanvas = document.getElementById('page-visualizer');
  var minibtn   = document.getElementById('music-minibtn');
  var miniTitle = document.getElementById('music-mini-title');
  var miniPlay  = document.getElementById('music-mini-play');
  var miniNext  = document.getElementById('music-mini-next');
  var miniExpand = document.getElementById('music-mini-expand');
  if (!player || !toggle || !btnPrev || !btnPlay || !btnNext) return;

  var audio = new Audio();
  audio.preload = 'auto';
  audio.loop = false;

  var current = 0;
  var playing = false;
  var cues = [];
  var visCtx = null, analyser = null, audioCtx = null, rafId = null;
  var visSmooth = null; // 每根条的平滑高度（逐帧插值，让频谱平滑起伏）

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
      if (miniTitle) miniTitle.textContent = '♪ ' + name;
    }
    renderPlaylist();
    renderLyricsPanel();
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
    var ic = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    btnPlay.innerHTML = ic;
    if (miniPlay) miniPlay.innerHTML = ic;
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
        else parseSrt(text);        renderLyricsPanel();      })
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
  var lastCue = null;
  var subTimer = null;
  // 换行时先淡出旧字幕，再淡入新字幕（支持日文 + 中文双语）
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function swapSubtitle(cue) {
    if (subTimer) { clearTimeout(subTimer); subTimer = null; }
    subEl.classList.remove('show'); // 触发淡出
    if (!cue) { subEl.innerHTML = ''; return; }
    subTimer = setTimeout(function() {
      if (cue.cn) {
        subEl.innerHTML =
          '<div class="sub-jp">' + esc(cue.text) + '</div>' +
          '<div class="sub-cn">' + esc(cue.cn) + '</div>';
      } else {
        subEl.textContent = cue.text;
      }
      void subEl.offsetWidth; // 重新触发过渡，实现淡入
      subEl.classList.add('show');
      subTimer = null;
    }, 250); // 与 CSS 淡出时长一致
  }
  audio.addEventListener('timeupdate', function() {
    saveState();
    if (!subEl) return;
    var t = audio.currentTime * 1000;
    var active = null;
    for (var i = 0; i < cues.length; i++) {
      if (t >= cues[i].start && t <= cues[i].end) { active = cues[i]; break; }
    }
    if (active === lastCue) return;
    lastCue = active;
    swapSubtitle(active);
    updateLyricsActive(active);
  });

  /* ---- audio events ---- */
  audio.addEventListener('play', function() { playing = true; updateUI(); startVisualizer(); });
  audio.addEventListener('pause', function() { playing = false; updateUI(); stopVisualizer(); saveState(true); });
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

  /* ---- progress / seek ---- */
  function fmtTime(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }
  function updateProgress() {
    var d = audio.duration || 0, c = audio.currentTime || 0;
    if (seekFill) seekFill.style.width = (d ? (c / d) * 100 : 0) + '%';
    if (timeCur) timeCur.textContent = fmtTime(c);
    if (timeTotal) timeTotal.textContent = fmtTime(d);
  }
  var seeking = false;
  function seekFromEvent(e) {
    if (!seekEl || !audio.duration) return;
    var r = seekEl.getBoundingClientRect();
    var p = (e.clientX - r.left) / r.width;
    if (!isFinite(p)) return;
    p = Math.max(0, Math.min(1, p));
    audio.currentTime = p * audio.duration;
    if (seekFill) seekFill.style.width = (p * 100) + '%';
  }
  if (seekEl) {
    seekEl.addEventListener('pointerdown', function(e) {
      seeking = true;
      seekEl.classList.add('dragging');
      if (seekEl.setPointerCapture) seekEl.setPointerCapture(e.pointerId);
      seekFromEvent(e);
    });
    seekEl.addEventListener('pointermove', function(e) { if (seeking) seekFromEvent(e); });
    window.addEventListener('pointerup', function() {
      if (seeking) { seeking = false; if (seekEl) seekEl.classList.remove('dragging'); }
    });
  }
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('durationchange', updateProgress);

  /* ---- 记住上次播放的歌曲和进度 ---- */
  var lastSave = 0;
  function saveState(force) {
    var now = Date.now();
    if (!force && now - lastSave < 3000) return;
    lastSave = now;
    try { localStorage.setItem('music-state', JSON.stringify({ i: current, t: audio.currentTime })); } catch (e) {}
  }
  window.addEventListener('beforeunload', function() { saveState(true); });

  /* ---- volume ---- */
  function updateVolIcon() {
    if (!volBtn) return;
    var muted = audio.muted || audio.volume === 0;
    volBtn.innerHTML = '<i class="fas ' + (muted ? 'fa-volume-mute' : 'fa-volume-up') + '"></i>';
  }
  if (volRange) {
    volRange.addEventListener('input', function() {
      audio.volume = volRange.value / 100;
      audio.muted = false;
      updateVolIcon();
    });
  }
  if (volBtn) {
    volBtn.addEventListener('click', onClick(function() {
      audio.muted = !audio.muted;
      updateVolIcon();
    }));
  }
  updateVolIcon();

  /* ---- audio visualizer ---- */
  function sizeVisualizer() {
    if (!visCanvas) return;
    visCanvas.width = Math.max(320, Math.round(window.innerWidth));
    visCanvas.height = 48;
  }
  function initVisualizer() {
    if (!visCanvas || audioCtx || !(window.AudioContext || window.webkitAudioContext)) return;
    try {
      visCtx = visCanvas.getContext('2d');
      sizeVisualizer();
      var AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
      var src = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.85;
      src.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (e) { audioCtx = null; }
  }
  function startVisualizer() {
    if (!visCanvas) return;
    initVisualizer();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function() {});
    if (rafId || !visCtx || !analyser) return;
    var draw = function() {
      if (!playing) { rafId = null; return; }
      var w = visCanvas.width, h = visCanvas.height;
      visCtx.clearRect(0, 0, w, h);
      var data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      var MAX_BAR = 30, MIN_BAR = 5; // 低基线：安静时贴底、响时才缓升
      // 左右镜像对称：中心为镜轴，两边画同一份频谱
      var half = Math.max(1, Math.floor(w / 6));
      if (!visSmooth || visSmooth.length !== half) visSmooth = new Float32Array(half);
      for (var i = 0; i < half; i++) {
        var idx = Math.min(data.length - 1, Math.floor((i / half) * data.length));
        var raw = data[idx] / 255;
        var v = Math.pow(raw, 0.8); // 平缓曲线：安静时低、响时缓升
        var wgt = 0.55 + 0.45 * (idx / (data.length - 1)); // 轻度抬高中高频，避免中段贴死
        var target = MIN_BAR + v * wgt * (MAX_BAR - MIN_BAR);
        visSmooth[i] += (target - visSmooth[i]) * 0.3; // 逐帧插值：平滑起伏不跳变
        var bh = visSmooth[i];
        var g = visCtx.createLinearGradient(0, h, 0, h - MAX_BAR);
        g.addColorStop(0, '#d6bcff');
        g.addColorStop(1, '#fdcbf1');
        visCtx.fillStyle = g;
        var xl = i * 3;
        var xr = w - (i + 1) * 3;
        visCtx.fillRect(xl, h - bh, 2, bh); // 左半边
        visCtx.fillRect(xr, h - bh, 2, bh); // 右半边（镜像）
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
  }
  function stopVisualizer() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (visCtx && visCanvas) visCtx.clearRect(0, 0, visCanvas.width, visCanvas.height);
  }

  /* ---- lyrics panel ---- */
  function renderLyricsPanel() {
    if (!lyricsPanel) return;
    lyricsPanel.innerHTML = '';
    cues.forEach(function(c, i) {
      var line = document.createElement('div');
      line.className = 'lyrics-line' + (i === 0 ? ' active' : '');
      var jp = document.createElement('span');
      jp.className = 'lyrics-jp';
      jp.textContent = c.text;
      line.appendChild(jp);
      if (c.cn) {
        var cn = document.createElement('span');
        cn.className = 'lyrics-cn';
        cn.textContent = c.cn;
        line.appendChild(cn);
      }
      lyricsPanel.appendChild(line);
    });
  }
  function updateLyricsActive(active) {
    if (!lyricsPanel) return;
    var idx = cues.indexOf(active);
    var lines = lyricsPanel.children;
    for (var i = 0; i < lines.length; i++) {
      lines[i].classList.toggle('active', i === idx);
    }
    if (idx >= 0 && lines[idx]) {
      lines[idx].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }
  if (btnLyrics) {
    btnLyrics.addEventListener('click', onClick(function() {
      player.classList.toggle('lyrics-open');
    }));
  }

  /* ---- 迷你模式 ---- */
  if (minibtn) minibtn.addEventListener('click', onClick(function() {
    player.classList.add('mini');
    player.classList.remove('expanded', 'menu-open', 'lyrics-open');
  }));
  if (miniExpand) miniExpand.addEventListener('click', onClick(function() {
    player.classList.remove('mini');
    player.classList.add('expanded');
  }));
  if (miniPlay) miniPlay.addEventListener('click', onClick(togglePlay));
  if (miniNext) miniNext.addEventListener('click', onClick(next));

  /* ---- fixed to bottom-right (locked position) ---- */

  /* ---- 页面底部可视化：加载即撑满全宽 ---- */
  sizeVisualizer();
  window.addEventListener('resize', sizeVisualizer);

  /* ---- init：恢复上次播放的歌曲/进度；否则随机或第一首 ---- */
  var startIdx = 0, startTime = 0, hasSaved = false;
  try {
    var saved = JSON.parse(localStorage.getItem('music-state') || 'null');
    if (saved && saved.i >= 0 && saved.i < PLAYLIST.length) {
      startIdx = saved.i; startTime = saved.t || 0; hasSaved = true;
    }
  } catch (e) {}
  if (!hasSaved && mode === 'shuffle' && PLAYLIST.length > 1) startIdx = Math.floor(Math.random() * PLAYLIST.length);
  loadTrack(startIdx);
  if (startTime > 2) {
    audio.addEventListener('loadedmetadata', function once() {
      audio.removeEventListener('loadedmetadata', once);
      try { audio.currentTime = Math.min(startTime, (audio.duration || startTime) - 2); } catch (e) {}
      updateProgress();
    });
  }
  updateUI();
  /* ---- 自动播放：等音频就绪后立即尝试；被拦截则等首次手势 ---- */
  var autoplayAttempted = false;
  function tryAutoplay() {
    if (autoplayAttempted) return;
    autoplayAttempted = true;
    var p = audio.play();
    if (p && p.catch) p.catch(function() {
      // 浏览器拦截自动播放 → 首次手势时播放
      player.classList.add('autoplay-blocked');
      var start = function() {
        play();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function() {});
        document.removeEventListener('pointerdown', start);
        document.removeEventListener('keydown', start);
        document.removeEventListener('touchstart', start);
      };
      document.addEventListener('pointerdown', start);
      document.addEventListener('keydown', start);
      document.addEventListener('touchstart', start);
    });
  }
  // 音频就绪（canplay）立刻播放，不再干等固定延时
  var onReady = function() {
    audio.removeEventListener('canplay', onReady);
    tryAutoplay();
  };
  audio.addEventListener('canplay', onReady);
  // 兜底：若一直未就绪（加载慢），到 AUTOPLAY_DELAY 也试一次
  setTimeout(tryAutoplay, AUTOPLAY_DELAY);
})();
