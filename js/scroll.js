/**
 * scroll.js — Scroll reveal, parallax, back-to-top, sticky navbar, counters
 */

(function () {
  'use strict';

  /* ── SCROLL REVEAL ── */
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
  }

  /* ── STICKY NAVBAR ── */
  function initStickyNav() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── BACK TO TOP ── */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const onScroll = () => {
      btn.classList.toggle('visible', window.scrollY > 400);

      const footer = document.querySelector('.footer');
      if (footer) {
        const fr = footer.getBoundingClientRect();
        const br = btn.getBoundingClientRect();
        btn.classList.toggle('on-dark', fr.top < br.bottom && fr.bottom > br.top);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── PARALLAX ── */
  function initParallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          els.forEach(el => {
            const speed  = parseFloat(el.dataset.parallax) || 0.3;
            const rect   = el.getBoundingClientRect();
            const center = rect.top + rect.height / 2 - window.innerHeight / 2;
            el.style.transform = `translateY(${center * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target || el.textContent);
    const duration = 2000;
    const start    = performance.now();
    const isFloat  = String(target).includes('.');
    const suffix   = el.dataset.suffix || '';

    function update(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased   = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
      const value   = eased * target;
      el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
      if (elapsed < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const els = document.querySelectorAll('[data-counter]');
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    els.forEach(el => io.observe(el));
  }

  /* ── PROGRESS BARS ── */
  function initProgressBars() {
    const bars = document.querySelectorAll('.progress-fill');
    if (!bars.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(b => io.observe(b));
  }

  /* ── ACTIVE NAV LINK ── */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ── MOBILE MENU ── */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── FAQ ACCORDION ── */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

        // Toggle current
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── TABS ── */
  function initTabs() {
    document.querySelectorAll('.tab-nav').forEach(nav => {
      nav.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const panel = document.querySelector(btn.dataset.tab);
          if (!panel) return;

          nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const container = nav.closest('[data-tabs-container]') || document.body;
          container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          panel.classList.add('active');
        });
      });
    });
  }

  /* ── CUSTOM CURSOR ── */
  function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor   = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    // Smooth follower
    function animateFollower() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    const hoverEls = document.querySelectorAll('a, button, .cursor-hover');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initStickyNav();
    initBackToTop();
    initParallax();
    initCounters();
    initProgressBars();
    initActiveNav();
    initMobileMenu();
    initFAQ();
    initTabs();
    initCursor();
  });
})();
