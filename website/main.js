/* Towmatic marketing site — shared behavior (no libraries). */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Nav: transparent over the hero, solid after scrolling ---------- */
  var nav = document.querySelector('[data-nav]');
  var hasHero = !!document.querySelector('.hero');

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('is-solid', !hasHero || window.scrollY > 8);
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ---------- Products mega-menu ---------- */
  var menuItem = document.querySelector('[data-menu]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var menuPanel = menuToggle && document.getElementById(menuToggle.getAttribute('aria-controls'));
  var hoverTimer;

  function setMenu(open) {
    if (!menuToggle || !menuPanel) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuPanel.hidden = !open;
  }

  if (menuToggle && menuPanel) {
    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    // Open on hover for mouse users
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    menuItem.addEventListener('mouseenter', function () {
      if (!finePointer.matches) return;
      clearTimeout(hoverTimer);
      setMenu(true);
    });
    menuItem.addEventListener('mouseleave', function () {
      if (!finePointer.matches) return;
      hoverTimer = setTimeout(function () { setMenu(false); }, 150);
    });

    // Close when focus or a click moves outside, or on Escape
    document.addEventListener('click', function (e) {
      if (!menuItem.contains(e.target)) setMenu(false);
    });
    menuItem.addEventListener('focusout', function (e) {
      if (!menuItem.contains(e.relatedTarget)) setMenu(false);
    });
    menuItem.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuToggle.focus();
      }
    });
  }

  /* ---------- Mobile full-screen menu ---------- */
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileMenu = mobileToggle && document.getElementById(mobileToggle.getAttribute('aria-controls'));

  function setMobile(open) {
    if (!mobileToggle || !mobileMenu) return;
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.hidden = !open;
    document.body.classList.toggle('is-locked', open);
    nav.classList.toggle('is-menu-open', open);
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      setMobile(mobileToggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMobile(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileToggle.getAttribute('aria-expanded') === 'true') {
        setMobile(false);
        mobileToggle.focus();
      }
    });
    // Close it if the window grows to desktop width
    window.matchMedia('(min-width: 1080px)').addEventListener('change', function (e) {
      if (e.matches) setMobile(false);
    });
  }

  /* ---------- Hero: cycling word, every 2.5 seconds ---------- */
  var cycleWord = document.querySelector('[data-cycle]');
  if (cycleWord && !reduceMotion.matches) {
    var words = cycleWord.getAttribute('data-cycle').split('|');
    var index = 0;
    var canAnimate = typeof cycleWord.animate === 'function';

    setInterval(function () {
      if (document.hidden || reduceMotion.matches) return;
      index = (index + 1) % words.length;
      var next = words[index];
      if (!canAnimate) { cycleWord.textContent = next; return; }
      cycleWord.animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-0.18em)' }],
        { duration: 220, easing: 'ease-in', fill: 'forwards' }
      ).onfinish = function () {
        cycleWord.textContent = next;
        cycleWord.animate(
          [{ opacity: 0, transform: 'translateY(0.18em)' }, { opacity: 1, transform: 'none' }],
          { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
        );
      };
    }, 2500);
  }

  /* ---------- Hero video: desktop only, never with reduced motion ---------- */
  var video = document.querySelector('[data-hero-video]');
  if (video) {
    var wide = window.matchMedia('(min-width: 768px)');
    var hasSource = video.querySelector('source');
    if (hasSource && wide.matches && !reduceMotion.matches) {
      video.preload = 'auto';
      var playing = video.play();
      if (playing && playing.catch) playing.catch(function () {});
    }
  }

  /* ---------- Platform tabs (arrow keys, Home and End supported) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      // Keep the active tab visible in the scrolling mobile row
      if (tab.scrollIntoView && tab.parentElement.scrollWidth > tab.parentElement.clientWidth) {
        tab.parentElement.scrollTo({
          left: tab.offsetLeft - tab.parentElement.offsetLeft - 20,
          behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
      }
      stopAudio();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  });

  /* ---------- Waveform bars (drawn once, same every time) ---------- */
  document.querySelectorAll('[data-waveform]').forEach(function (wave) {
    var count = 34;
    for (var i = 0; i < count; i++) {
      var bar = document.createElement('i');
      var h = 22 + Math.abs(Math.sin(i * 0.9) * 48 + Math.sin(i * 0.37) * 30);
      bar.style.setProperty('--h', Math.min(h, 100).toFixed(0) + '%');
      bar.style.setProperty('--d', ((i * 97) % 900) + 'ms');
      wave.appendChild(bar);
    }
  });

  /* ---------- Sample call audio ---------- */
  var activeAudio = null;
  var activeButton = null;

  function stopAudio() {
    if (activeAudio) activeAudio.pause();
  }

  document.querySelectorAll('[data-audio]').forEach(function (button) {
    var audio = new Audio();
    audio.preload = 'none';
    var label = button.querySelector('.audio-btn__label');
    var idleText = label.textContent;
    var panel = button.closest('[data-audio-scope], [role="tabpanel"], section');
    var wave = panel && panel.querySelector('[data-waveform]');

    function setPlaying(on) {
      button.setAttribute('aria-pressed', String(on));
      label.textContent = on ? 'Pause sample call' : idleText;
      if (wave && !reduceMotion.matches) wave.classList.toggle('is-playing', on);
    }

    audio.addEventListener('play', function () { setPlaying(true); });
    audio.addEventListener('pause', function () { setPlaying(false); });
    audio.addEventListener('ended', function () { setPlaying(false); });
    audio.addEventListener('error', function () {
      setPlaying(false);
      button.disabled = true;
      label.textContent = 'Sample plays on the live site';
    });

    button.addEventListener('click', function () {
      if (!audio.src) audio.src = button.getAttribute('data-audio');
      if (audio.paused) {
        if (activeAudio && activeAudio !== audio) activeAudio.pause();
        activeAudio = audio;
        activeButton = button;
        var p = audio.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        audio.pause();
      }
    });
  });

  /* ---------- Sections fade and rise on scroll, one time only ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  }
})();
