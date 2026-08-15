/**
 * main.js — Core init: marquee, modals, misc
 */

(function () {
  'use strict';

  /* ── MODAL ── */
  function initModals() {
    document.querySelectorAll('[data-modal-open]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const modal = document.querySelector(trigger.dataset.modalOpen);
        if (modal) modal.classList.add('open');
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      const closeBtn = overlay.querySelector('.modal-close');
      if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('open'));

      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
      }
    });
  }

  /* ── MARQUEE CLONE ── */
  function initMarquee() {
    document.querySelectorAll('.marquee-track').forEach(track => {
      const clone = track.cloneNode(true);
      track.parentElement.appendChild(clone);
    });
  }

  /* ── HEADER TRANSPARENT > COLOR ── */
  function initNavColor() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    // Hero overlay nav
    if (document.querySelector('.hero-overlay-nav')) {
      window.addEventListener('scroll', () => {
        if (window.scrollY < 80) nav.classList.remove('scrolled');
      }, { passive: true });
    }
  }

  /* ── LIGHTBOX (simple image zoom) ── */
  function initLightbox() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(20,19,17,0.95);
      z-index:5000;display:flex;align-items:center;justify-content:center;
      opacity:0;visibility:hidden;transition:all 0.3s;cursor:zoom-out;
      padding:2rem;
    `;

    const img = document.createElement('img');
    img.style.cssText = `
      max-width:92vw;max-height:92vh;object-fit:contain;
      border-radius:8px;transform:scale(0.95);transition:transform 0.3s;
    `;

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', () => {
        img.src = el.dataset.lightbox || el.src || el.querySelector('img')?.src;
        overlay.style.opacity    = '1';
        overlay.style.visibility = 'visible';
        img.style.transform      = 'scale(1)';
        document.body.style.overflow = 'hidden';
      });
    });

    overlay.addEventListener('click', () => {
      overlay.style.opacity    = '0';
      overlay.style.visibility = 'hidden';
      img.style.transform      = 'scale(0.95)';
      document.body.style.overflow = '';
    });
  }

  /* ── SMOOTH ANCHOR SCROLL ── */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ── READING PROGRESS ── */
  function initReadingProgress() {
    const bar = document.querySelector('.reading-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const doc  = document.documentElement;
      const prog = (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100;
      bar.style.width = Math.min(100, prog) + '%';
    }, { passive: true });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', () => {
    initModals();
    initMarquee();
    initNavColor();
    initLightbox();
    initAnchorScroll();
    initReadingProgress();
  });
})();
