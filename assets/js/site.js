/* ============================================================
 * Site bootstrap (vanilla JS — no jQuery)
 * - reveals the page after load
 * - restores the template's centered nav divider
 * - keeps the footer year current
 * - animated cursor only on fine pointers, never with reduced motion
 * ============================================================ */
(function() {
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- reveal content after load ---- */
  function reveal() {
    window.setTimeout(function() {
      document.body.classList.remove('is-preload');
    }, 100);
  }
  if (document.readyState === 'complete') reveal();
  else window.addEventListener('load', reveal);

  /* ---- footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- even nav: center divider (previously done by main.js) ---- */
  var nav = document.querySelector('#header > nav');
  if (nav) {
    var navItems = nav.querySelectorAll('li');
    if (navItems.length % 2 === 0) {
      nav.classList.add('use-middle');
      var middle = navItems[navItems.length / 2];
      if (middle) middle.classList.add('is-middle');
    }
  }

  /* ---- custom cursor + trailing line ---- */
  if (prefersReducedMotion) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var cursor = document.getElementById('cursor');
  var glow = document.getElementById('cursor-glow');
  var trailCanvas = document.getElementById('trail');
  if (!cursor || !glow || !trailCanvas) return;

  var tctx = trailCanvas.getContext('2d');
  if (!tctx) return;

  // Only now hide the native cursor and show the custom one.
  document.documentElement.classList.add('has-custom-cursor');

  function sizeTrail() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  sizeTrail();
  window.addEventListener('resize', sizeTrail);

  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var gx = mx, gy = my;
  var raf = null;
  var points = [];
  var TRAIL_MS = 350;

  function trailColor(t) {
    var r = Math.round(179 + (255 - 179) * t);
    var g = Math.round(222 + (197 - 222) * t);
    var b = Math.round(255 + (227 - 255) * t);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function updateGlow() {
    gx += (mx - gx) * 0.75;
    gy += (my - gy) * 0.75;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
  }

  function drawTrail(now) {
    tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    while (points.length && now - points[0].t > TRAIL_MS) points.shift();

    var n = points.length;
    if (n < 2) return;

    for (var i = 0; i < n - 1; i++) {
      var a = points[i], b = points[i + 1];
      var t = i / (n - 1);
      var age = now - b.t;
      var fade = Math.max(0, 1 - age / TRAIL_MS);

      tctx.strokeStyle = trailColor(t);
      tctx.globalAlpha = fade * (0.25 + 0.75 * t);
      tctx.lineWidth = 1 + 1.6 * t;
      tctx.lineCap = 'round';
      tctx.lineJoin = 'round';
      tctx.beginPath();
      tctx.moveTo(a.x, a.y);
      tctx.lineTo(b.x, b.y);
      tctx.stroke();
    }
    tctx.globalAlpha = 1;
  }

  function loop(now) {
    updateGlow();
    drawTrail(now || performance.now());
    raf = requestAnimationFrame(loop);
  }

  var lastMove = performance.now();
  var IDLE_MS = 8000;

  function hideCursorUI() {
    document.documentElement.classList.add('cursor-idle');
  }
  function showCursorUI() {
    document.documentElement.classList.remove('cursor-idle');
  }

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
    lastMove = performance.now();
    showCursorUI();
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    points.push({ x: mx, y: my, t: performance.now() });
    if (!raf) raf = requestAnimationFrame(loop);
  });

  document.addEventListener('mouseleave', hideCursorUI);
  document.addEventListener('mouseenter', showCursorUI);
  document.documentElement.addEventListener('mouseleave', hideCursorUI);
  document.documentElement.addEventListener('mouseenter', showCursorUI);
  window.addEventListener('blur', hideCursorUI);

  setInterval(function() {
    if (performance.now() - lastMove > IDLE_MS) hideCursorUI();
  }, 500);
})();
