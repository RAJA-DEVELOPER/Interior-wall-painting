/**
 * slider.js — Auto-playing hero slider with touch support
 */

(function () {
  'use strict';

  function initSlider(wrapper) {
    const track  = wrapper.querySelector('.slider-track');
    const slides = wrapper.querySelectorAll('.slide');
    const dots   = wrapper.querySelectorAll('.slider-dot');
    const prevBtn = wrapper.querySelector('.slider-arrow.prev');
    const nextBtn = wrapper.querySelector('.slider-arrow.next');

    if (!track || slides.length < 2) return;

    let current   = 0;
    let autoTimer = null;
    let startX    = 0;
    let isDragging = false;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;

      dots.forEach((d, i) => d.classList.toggle('active', i === current));

      slides.forEach((s, i) => {
        s.setAttribute('aria-hidden', i !== current);
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, 5500);
    }

    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
    }

    // Arrow buttons
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

    // Dots
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAuto(); });
    });

    // Touch / Swipe
    wrapper.addEventListener('touchstart', e => {
      startX    = e.touches[0].clientX;
      isDragging = true;
      stopAuto();
    }, { passive: true });

    wrapper.addEventListener('touchend', e => {
      if (!isDragging) return;
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 50) delta > 0 ? prev() : next();
      isDragging = false;
      startAuto();
    });

    // Mouse drag
    wrapper.addEventListener('mousedown', e => {
      startX     = e.clientX;
      isDragging = true;
      stopAuto();
    });

    wrapper.addEventListener('mouseup', e => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 50) delta > 0 ? prev() : next();
      isDragging = false;
      startAuto();
    });

    wrapper.addEventListener('mouseleave', () => {
      if (isDragging) { isDragging = false; startAuto(); }
    });

    // Pause on hover
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);

    // Keyboard
    wrapper.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { prev(); startAuto(); }
      if (e.key === 'ArrowRight') { next(); startAuto(); }
    });

    // Init
    goTo(0);
    startAuto();
  }

  /* ── CARD SLIDER (e.g. Wallpaper Collections) ── */
  function initCardSlider(wrapper) {
    const track    = wrapper.querySelector('.wallpaper-slider-track');
    const cards    = wrapper.querySelectorAll('.wallpaper-card');
    const dotsWrap = wrapper.querySelector('.wallpaper-slider-dots');
    const prevBtn  = wrapper.querySelector('.slider-arrow.prev');
    const nextBtn  = wrapper.querySelector('.slider-arrow.next');

    if (!track || cards.length < 2) return;

    let current = 0;
    let startX  = 0;
    let isDragging = false;
    let didMove = false;

    function perView() {
      return Math.max(1, Math.round(getComputedStyle(wrapper).getPropertyValue('--per-view'))) || 1;
    }

    function maxIndex() {
      return Math.max(0, cards.length - perView());
    }

    function goTo(index) {
      current = Math.min(Math.max(0, index), maxIndex());
      const cardW = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      track.style.transform = `translateX(-${current * (cardW + gap)}px)`;

      const dots = dotsWrap ? dotsWrap.querySelectorAll('.slider-dot') : [];
      dots.forEach((d, i) => d.classList.toggle('active', i === current));

      if (prevBtn) prevBtn.setAttribute('aria-disabled', current === 0);
      if (nextBtn) nextBtn.setAttribute('aria-disabled', current === maxIndex());
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // Dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= maxIndex(); i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    // Arrows
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    // Touch / Swipe
    wrapper.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDragging = true;
      didMove = false;
    }, { passive: true });

    wrapper.addEventListener('touchmove', e => {
      if (!isDragging) return;
      if (Math.abs(e.touches[0].clientX - startX) > 10) didMove = true;
    }, { passive: true });

    wrapper.addEventListener('touchend', e => {
      if (!isDragging) return;
      const delta = e.changedTouches[0].clientX - startX;
      if (didMove && Math.abs(delta) > 50) delta > 0 ? prev() : next();
      isDragging = false;
    });

    // Mouse drag
    wrapper.addEventListener('mousedown', e => {
      startX = e.clientX;
      isDragging = true;
      didMove = false;
    });

    wrapper.addEventListener('mouseup', e => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      if (didMove && Math.abs(delta) > 50) delta > 0 ? prev() : next();
      isDragging = false;
    });

    wrapper.addEventListener('mouseleave', () => { isDragging = false; });

    // Keyboard
    wrapper.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    // Re-align on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        track.style.transition = 'none';
        goTo(current);
        requestAnimationFrame(() => { track.style.transition = ''; });
      }, 150);
    });

    goTo(0);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hero-slider').forEach(initSlider);
    document.querySelectorAll('.wallpaper-slider').forEach(initCardSlider);
  });
})();
