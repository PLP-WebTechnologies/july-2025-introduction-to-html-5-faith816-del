/*
  script.js
  - All interactive features and form validation live here
  - Each section is commented so you can follow what it does
*/

// Wait until the page is ready
document.addEventListener('DOMContentLoaded', () => {
  // --------------------
  // Element selectors
  // --------------------
  const body = document.body;
  const darkToggle = document.getElementById('darkToggle');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // FAQ (collapsible)
  const faqQuestions = document.querySelectorAll('.faq-question');

  // Counter controls
  let count = 0;
  const countDisplay = document.getElementById('count');
  const incBtn = document.getElementById('inc');
  const decBtn = document.getElementById('dec');

  // Form and fields
  const form = document.getElementById('signupForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm');
  const phoneInput = document.getElementById('phone');
  const formMessage = document.getElementById('formMessage');

  // --------------------
  // Dark mode toggle
  // --------------------
  // Save preference in localStorage so it persists
  if (localStorage.getItem('dark') === '1') {
    body.classList.add('dark');
  }

  darkToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('dark', body.classList.contains('dark') ? '1' : '0');
  });

  // --------------------
  // Tabbed interface
  // --------------------
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // remove active class from all buttons and hide contents
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.add('hidden'));

      // activate the clicked tab
      e.currentTarget.classList.add('active');
      const target = e.currentTarget.dataset.tab;
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.remove('hidden');
    });
  });

  // --------------------
  // Collapsible FAQ
  // --------------------
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      // toggle open class on the question and the answer
      q.classList.toggle('open');
      const answer = q.nextElementSibling;
      if (answer) answer.classList.toggle('open');
    });
  });

  // --------------------
  // Simple counter (helpfulness)
  // --------------------
  function updateCount() {
    countDisplay.textContent = count;
    // small visual cue for negative
    if (count < 0) countDisplay.classList.add('negative');
    else countDisplay.classList.remove('negative');
  }

  if (incBtn && decBtn) {
    incBtn.addEventListener('click', () => { count++; updateCount(); });
    decBtn.addEventListener('click', () => { count--; updateCount(); });
  }

  updateCount();

  // --------------------
  // Custom form validation (no HTML5-only validation)
  // - Validates on input and on submit
  // - Shows helpful messages inside <small> elements
  // --------------------

  // helper: show error text next to an input
  function showError(input, message) {
    const err = document.getElementById(input.id + 'Error');
    if (err) err.textContent = message;
    input.classList.add('invalid');
  }

  function clearError(input) {
    const err = document.getElementById(input.id + 'Error');
    if (err) err.textContent = '';
    input.classList.remove('invalid');
  }

  // validators
  function validateName() {
    const v = nameInput.value.trim();
    if (v.length < 2 || !/^[A-Za-z\s]+$/.test(v)) {
      showError(nameInput, 'Enter a valid name (letters and spaces only, min 2 chars)');
      return false;
    }
    clearError(nameInput);
    return true;
  }

  function validateEmail() {
    const v = emailInput.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple but effective
    if (!re.test(v)) {
      showError(emailInput, 'Enter a valid email like you@example.com');
      return false;
    }
    clearError(emailInput);
    return true;
  }

  function validatePassword() {
    const v = passwordInput.value;
    // at least 8 chars, one letter, one number, one special char
    const re = /^(?=.[A-Za-z])(?=.\d)(?=.[!@#$%^&]).{8,}$/;
    if (!re.test(v)) {
      showError(passwordInput, 'Password must be 8+ chars and include a letter, number and special char');
      return false;
    }
    clearError(passwordInput);
    return true;
  }

  function validateConfirm() {
    if (confirmInput.value !== passwordInput.value) {
      showError(confirmInput, 'Passwords do not match');
      return false;
    }
    clearError(confirmInput);
    return true;
  }

  function validatePhone() {
    const v = phoneInput.value.trim();
    if (v === '') {
      clearError(phoneInput);
      return true; // optional
    }
    if (!/^\d{7,15}$/.test(v)) {
      showError(phoneInput, 'Phone must be 7–15 digits');
      return false;
    }
    clearError(phoneInput);
    return true;
  }

  function validateForm() {
    const a = validateName();
    const b = validateEmail();
    const c = validatePassword();
    const d = validateConfirm();
    const e = validatePhone();

    const ok = a && b && c && d && e;
    if (ok) {
      formMessage.textContent = 'Success! Form is valid — demo only (not sent).';
      formMessage.classList.remove('error');
      formMessage.classList.add('success');
    } else {
      formMessage.textContent = 'Please fix the errors above.';
      formMessage.classList.remove('success');
      formMessage.classList.add('error');
    }
    return ok;
  }

  // real-time validation while typing
  [nameInput, emailInput, passwordInput, confirmInput, phoneInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input === nameInput) validateName();
      if (input === emailInput) validateEmail();
      if (input === passwordInput) validatePassword();
      if (input === confirmInput) validateConfirm();
      if (input === phoneInput) validatePhone();
    });
  });

  // final submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // stop the page reloading
    const ok = validateForm();
    if (ok) {
      // demonstration behavior: reset form after a short moment
      setTimeout(() => {
        form.reset();
        formMessage.textContent = 'Form cleared (demo).';
      }, 700);
    }
  });

}); // end DOMContentLoaded