/* ============================================================
 * Random "Your Name." (君の名は。/ 你的名字。) movie wallpaper
 * Picks one wallpaper at random on each page load and applies it
 * as the full-screen background, then fades out the loader.
 * ============================================================ */
(function() {
  var WALLPAPERS = [
    "https://images3.alphacoders.com/100/thumb-1920-1006667.jpg",
    "https://images2.alphacoders.com/100/thumb-1920-1006672.jpg",
    "https://images8.alphacoders.com/100/thumb-1920-1007178.jpg",
    "https://images.alphacoders.com/100/thumb-1920-1006686.jpg",
    "https://images8.alphacoders.com/100/thumb-1920-1006728.jpg",
    "https://images4.alphacoders.com/100/thumb-1920-1007102.jpg",
    "https://images6.alphacoders.com/100/thumb-1920-1007172.jpg",
    "https://images4.alphacoders.com/100/thumb-1920-1007089.jpg",
    "https://images6.alphacoders.com/100/thumb-1920-1007097.jpg",
    "https://images3.alphacoders.com/100/thumb-1920-1007095.jpg",
    "https://images3.alphacoders.com/100/thumb-1920-1006664.jpg"
  ];

  var bg = document.getElementById('bg-wallpaper');
  var loadingDiv = document.getElementById('loading');

  // 随机挑一张，立刻设为背景（浏览器会流式加载显示）
  var url = WALLPAPERS[Math.floor(Math.random() * WALLPAPERS.length)];
  if (bg) {
    bg.style.backgroundImage = "url('" + url + "')";
  }

  // 页面加载完成后隐藏加载遮罩（与 main.js 移除 is-preload 一致）
  function hideLoading() {
    if (loadingDiv) loadingDiv.classList.add('hidden');
  }

  if (document.readyState === 'complete') {
    hideLoading();
  } else {
    window.addEventListener('load', hideLoading);
  }

  // 兜底：即使资源加载缓慢（如首屏壁纸/CDN），最多显示 6 秒 Loading，避免卡住
  setTimeout(hideLoading, 6000);
})();
