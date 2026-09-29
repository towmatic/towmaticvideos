/* Towmatic marketing site — shared behavior (no libraries). */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- New pages start at the top ----------
     Embedded viewers (like the preview) can keep the previous page's scroll spot.
     Skip this for #anchor links and Back/Forward, where the browser restores your place. */
  (function () {
    var entry = window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (location.hash || (entry && entry.type === 'back_forward')) return;
    window.scrollTo(0, 0);
    var root = document.documentElement;
    var pad = root.style.scrollPaddingTop;
    root.style.scrollPaddingTop = '0px'; // don't offset for the sticky nav here
    try { root.scrollIntoView({ block: 'start' }); } catch (e) {}
    root.style.scrollPaddingTop = pad;
  })();

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
    // Keep keyboard focus inside the open menu
    document.querySelectorAll('main, footer').forEach(function (el) {
      if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
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

  /* ---------- Pricing: monthly cost calculator ----------
     Voice AI ≈ $0.20/min. Each text $0.016: 1 per quote, 2 per booked job.
     The $30 monthly credit applies to texts only. */
  document.querySelectorAll('[data-calc]').forEach(function (calc) {
    var RATE_MIN = 0.20, RATE_TEXT = 0.016, TEXT_CREDIT = 30;
    var plan = calc.querySelector('[data-calc-plan]');
    var inputs = {};
    calc.querySelectorAll('[data-calc-input]').forEach(function (el) { inputs[el.getAttribute('data-calc-input')] = el; });
    var out = {};
    calc.querySelectorAll('[data-out]').forEach(function (el) { out[el.getAttribute('data-out')] = el; });
    var voiceBits = calc.querySelectorAll('[data-calc-voice]');
    var money = function (n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    var whole = function (n) { return n.toLocaleString('en-US'); };

    function update() {
      var parts = plan.value.split('|');
      var sub = +parts[0], setup = +parts[1], hasVoice = parts[2] === '1';
      var calls = +inputs.calls.value, length = +inputs.length.value;
      var quotes = +inputs.quotes.value, jobs = +inputs.jobs.value;

      voiceBits.forEach(function (el) { el.hidden = !hasVoice; });
      var minutes = hasVoice ? calls * length : 0;
      var voice = minutes * RATE_MIN;
      var texts = quotes + jobs * 2;
      var textCost = texts * RATE_TEXT;
      var credit = Math.min(textCost, TEXT_CREDIT);
      var total = sub + voice + textCost - credit;

      out.calls.textContent = whole(calls);
      out.length.textContent = length + ' min';
      out.quotes.textContent = whole(quotes);
      out.jobs.textContent = whole(jobs);
      out.sub.textContent = money(sub);
      out.mins.textContent = whole(Math.round(minutes)) + ' min';
      out.voice.textContent = money(voice);
      out.texts.textContent = whole(texts) + ' texts';
      out.textcost.textContent = money(textCost);
      out.credit.textContent = credit > 0 ? '−' + money(credit) : money(0);
      out.total.textContent = money(total);
      out.setup.textContent = setup ? 'Plus ' + money(setup) + ' one-time setup' : 'No setup fee';
    }

    plan.addEventListener('change', update);
    Object.keys(inputs).forEach(function (k) { inputs[k].addEventListener('input', update); });
    update();
  });

  /* ---------- Contact form (prototype: not connected to anything) ---------- */
  document.querySelectorAll('[data-contact-form]').forEach(function (form) {
    var status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (field) {
        var bad = !field.checkValidity();
        field.closest('.field-group').classList.toggle('is-invalid', bad);
        field.setAttribute('aria-invalid', String(bad));
        if (bad && !firstBad) firstBad = field;
      });
      status.hidden = false;
      if (firstBad) {
        status.textContent = 'Please fill in the highlighted fields.';
        firstBad.focus();
      } else {
        status.textContent = 'Thanks! This preview form isn’t connected yet, so nothing was sent.';
      }
    });
    form.addEventListener('input', function (e) {
      var group = e.target.closest('.field-group');
      if (group && e.target.checkValidity()) {
        group.classList.remove('is-invalid');
        e.target.removeAttribute('aria-invalid');
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
