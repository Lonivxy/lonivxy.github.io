(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);
// ============================================================
// 自定义光标 + 线条渐变拖尾（浅蓝 -> 浅粉）
// 仅在精细指针设备（鼠标/触控板）上启用，触屏不启用
// ============================================================
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var cursor = document.getElementById('cursor');
  var glow = document.getElementById('cursor-glow');
  var trailCanvas = document.getElementById('trail');
  if (!cursor || !glow || !trailCanvas) return;

  // 隐藏系统光标
  document.documentElement.classList.add('has-custom-cursor');

  var tctx = trailCanvas.getContext('2d');

  function sizeTrail() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  sizeTrail();
  window.addEventListener('resize', sizeTrail);

  var mx = window.innerWidth / 2, my = window.innerHeight / 2; // 鼠标实际位置
  var gx = mx, gy = my;                                        // 光晕位置（滞后拖尾）
  var raf = null;
  var points = [];
  var TRAIL_MS = 350; // 拖尾存活时长（毫秒）

  // 浅蓝(#b3deff) -> 浅粉(#ffc5e3) 渐变
  function trailColor(t) {
    var r = Math.round(179 + (255 - 179) * t);
    var g = Math.round(222 + (197 - 222) * t);
    var b = Math.round(255 + (227 - 255) * t);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function updateGlow() {
    // 光晕紧贴光标（高插值系数，基本无延迟）
    gx += (mx - gx) * 0.75;
    gy += (my - gy) * 0.75;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
  }

  function drawTrail(now) {
    tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    // 移除过期的点，鼠标停下时拖尾会自然淡出
    while (points.length && now - points[0].t > TRAIL_MS) points.shift();

    var n = points.length;
    if (n < 2) return;

    for (var i = 0; i < n - 1; i++) {
      var a = points[i], b = points[i + 1];
      var t = i / (n - 1);            // 0=旧尾 -> 1=新头
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
    if (!document.documentElement.classList.contains('cursor-idle')) {
      document.documentElement.classList.add('cursor-idle');
    }
  }
  function showCursorUI() {
    document.documentElement.classList.remove('cursor-idle');
  }

  // 鼠标移动：显示光标并重置空闲计时
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

  // 鼠标移出窗口隐藏，移入窗口显示
  document.addEventListener('mouseleave', hideCursorUI);
  document.addEventListener('mouseenter', showCursorUI);
  document.documentElement.addEventListener('mouseleave', hideCursorUI);
  document.documentElement.addEventListener('mouseenter', showCursorUI);
  window.addEventListener('blur', hideCursorUI);

  // 8 秒无操作自动隐藏光标
  setInterval(function() {
    if (performance.now() - lastMove > IDLE_MS) hideCursorUI();
  }, 500);
})();
