/**
 * before-after.js — Drag/touch before-after image comparison
 */

(function () {
  'use strict';

  function initBA(container) {
    const clip    = container.querySelector('.ba-clip');
    const handle  = container.querySelector('.ba-handle');
    const clipImg = clip ? clip.querySelector('img') : null;
    if (!clip || !handle) return;

    let dragging = false;
    let percent  = 50;

    function syncClipImageSize() {
      if (clipImg) {
        // Ensure clip image renders at full container width (not clipped width)
        // 100cqw handles this in CSS, but set explicit px fallback for older browsers
        clipImg.style.width = container.getBoundingClientRect().width + 'px';
        clipImg.style.maxWidth = 'none';
      }
    }

    function setPosition(x) {
      const rect = container.getBoundingClientRect();
      let pos    = ((x - rect.left) / rect.width) * 100;
      pos        = Math.max(2, Math.min(98, pos));
      percent    = pos;

      clip.style.width        = pos + '%';
      handle.style.left       = pos + '%';
      syncClipImageSize();
    }

    // Mouse
    handle.addEventListener('mousedown', () => { dragging = true; });
    document.addEventListener('mousemove', e => {
      if (dragging) setPosition(e.clientX);
    });
    document.addEventListener('mouseup', () => { dragging = false; });

    // Touch
    handle.addEventListener('touchstart', e => {
      dragging = true;
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', e => {
      if (dragging) setPosition(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('touchend', () => { dragging = false; });

    // Click anywhere on container
    container.addEventListener('click', e => {
      if (!dragging) setPosition(e.clientX);
    });

    // Keep full image visible on resize (clip image must stay container-width)
    window.addEventListener('resize', syncClipImageSize);

    // Init at center
    setPosition(container.getBoundingClientRect().left + container.offsetWidth / 2);
    // Ensure image sized correctly after layout
    requestAnimationFrame(syncClipImageSize);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ba-container').forEach(initBA);
  });
})();
