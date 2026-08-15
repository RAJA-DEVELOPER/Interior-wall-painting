/**
 * form.js — Form validation + submission
 */

(function () {
  'use strict';

  const RULES = {
    required: v => v.trim() !== '',
    email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone:    v => /^[\+\d\s\(\)\-]{7,20}$/.test(v.trim()),
    minlen:   (v, n) => v.trim().length >= parseInt(n),
  };

  const MESSAGES = {
    required: 'This field is required.',
    email:    'Please enter a valid email address.',
    phone:    'Please enter a valid phone number.',
    minlen:   n => `Please enter at least ${n} characters.`,
  };

  function getMsg(rule, arg) {
    const m = MESSAGES[rule];
    return typeof m === 'function' ? m(arg) : m;
  }

  function validateField(field) {
    const group = field.closest('.form-group');
    const rules = (field.dataset.validate || '').split('|').filter(Boolean);
    let valid   = true;
    let message = '';

    for (const ruleStr of rules) {
      const [rule, arg] = ruleStr.split(':');
      const fn = RULES[rule];
      if (fn && !fn(field.value, arg)) {
        valid   = false;
        message = getMsg(rule, arg);
        break;
      }
    }

    field.classList.toggle('error', !valid);

    if (group) {
      group.classList.toggle('has-error', !valid);
      const errEl = group.querySelector('.form-error-msg');
      if (errEl) errEl.textContent = message;
    }

    return valid;
  }

  function validateForm(form) {
    const fields = form.querySelectorAll('[data-validate]');
    let allValid = true;
    fields.forEach(f => { if (!validateField(f)) allValid = false; });
    return allValid;
  }

  function showToast(msg, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    const icon = type === 'success'
      ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
      : '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>';
    toast.innerHTML = icon + msg;
    toast.className   = `toast toast-${type}`;

    requestAnimationFrame(() => {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    });
  }

  function simulateSubmit(form) {
    const btn = form.querySelector('[type="submit"]');
    const origText = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled    = true;
      btn.textContent = 'Sending…';
    }

    return new Promise(resolve => {
      setTimeout(() => {
        if (btn) {
          btn.disabled    = false;
          btn.textContent = origText;
        }
        resolve(true);
      }, 1800);
    });
  }

  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(form => {
      // Live validation
      form.querySelectorAll('[data-validate]').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('error')) validateField(field);
        });
      });

      // Submit
      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!validateForm(form)) {
          const first = form.querySelector('.error');
          if (first) first.focus();
          showToast('Please fix the errors above.', 'error');
          return;
        }

        await simulateSubmit(form);

        const successEl = form.querySelector('.form-success');
        if (successEl) {
          form.querySelectorAll('.form-fields').forEach(el => el.style.display = 'none');
          successEl.classList.add('show');
        } else {
          showToast('Message sent! We\'ll be in touch soon.', 'success');
          form.reset();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initForms);
})();
