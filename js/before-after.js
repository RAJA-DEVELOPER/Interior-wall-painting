/**
 * before-after.js — Drag/touch before-after image comparison
 */

(function () {
  'use strict';

  function initBA(container) {
    const clip    = container.querySelector('.ba-clip');
    const handle  = container.querySelector('.ba-handle');
    if (!clip || !handle) return;

    let dragging = false;
    let percent  = 50;

    function setPosition(x) {
      const rect = container.getBoundingClientRect();
      let pos    = ((x - rect.left) / rect.width) * 100;
      pos        = Math.max(2, Math.min(98, pos));
      percent    = pos;

      clip.style.width        = pos + '%';
      handle.style.left       = pos + '%';
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

    // Init at center
    setPosition(container.getBoundingClientRect().left + container.offsetWidth / 2);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ba-container').forEach(initBA);
  });
})();
