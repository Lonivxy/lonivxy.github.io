/* ============================================================
 * Site widgets: birthday countdown + click ripple
 * ============================================================ */
(function() {
  /* ---- birthday countdown (May 5) ---- */
  function nextBirthday(month, day) {
    var now = new Date();
    var b = new Date(now.getFullYear(), month - 1, day);
    if (b.getTime() < now.getTime()) b = new Date(now.getFullYear() + 1, month - 1, day);
    return b;
  }
  function updateCountdown() {
    var el = document.getElementById('birthday-countdown');
    if (!el) return;
    var now = new Date();
    var b = nextBirthday(5, 5);
    var diff = b.getTime() - now.getTime();
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var today = now.getMonth() === 4 && now.getDate() === 5;
    el.textContent = today
      ? '🎂 It\u2019s my birthday today!'
      : '🎂 ' + d + 'd ' + h + 'h ' + m + 'm ' + s + 's until my birthday';
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---- click ripple ---- */
  document.addEventListener('pointerdown', function(e) {
    var size = Math.max(40, Math.min(window.innerWidth, window.innerHeight) * 0.09);
    var r = document.createElement('span');
    r.className = 'ripple';
    r.style.width = r.style.height = size + 'px';
    r.style.left = e.clientX + 'px';
    r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(function() { if (r.parentNode) r.parentNode.removeChild(r); }, 700);
  });
})();
