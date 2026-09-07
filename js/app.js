(function () {
  'use strict';

  const storage = window.CodePlayStorage;
  function updateStudentSummary() {
    const currentProgress = storage.getProgress();
    const progressPercent = window.CodePlayConfig.getOverallProgress(currentProgress);
    const studentName = currentProgress.name || 'learner';
    document.querySelectorAll('[data-student-name]').forEach((element) => { element.textContent = studentName; });
    document.querySelectorAll('[data-avatar]').forEach((element) => { element.textContent = studentName === 'learner' ? '?' : studentName.charAt(0).toUpperCase(); });
    document.querySelectorAll('[data-points]').forEach((element) => { element.textContent = window.CodePlayConfig.getCurrentPoints(currentProgress); });
    document.querySelectorAll('[data-lessons-completed]').forEach((element) => { element.textContent = currentProgress.lessonsCompleted.length; });
    document.querySelectorAll('[data-total-possible-points]').forEach((element) => { element.textContent = window.CodePlayConfig.getTotalPossiblePoints(); });
    document.querySelectorAll('[data-total-lessons]').forEach((element) => { element.textContent = window.CodePlayConfig.getLessonCount(); });
    document.querySelectorAll('[data-lesson-reward]').forEach((element) => { element.textContent = window.CodePlayConfig.rewards.lesson; });
    document.querySelectorAll('[data-quiz-total]').forEach((element) => { element.textContent = window.CodePlayConfig.getQuizQuestionCount(); });
    document.querySelectorAll('[data-home-lesson-count]').forEach((element) => { element.textContent = `${currentProgress.lessonsCompleted.length} / ${window.CodePlayConfig.getLessonCount()} lessons`; });
    document.querySelectorAll('[data-overall-progress]').forEach((element) => { element.style.width = `${progressPercent}%`; element.setAttribute('role', 'progressbar'); element.setAttribute('aria-valuemin', '0'); element.setAttribute('aria-valuemax', '100'); element.setAttribute('aria-valuenow', String(progressPercent)); });
    document.querySelectorAll('[data-progress-label]').forEach((element) => { element.textContent = progressPercent ? `${progressPercent}% of your foundation complete` : 'Just getting started'; });
    updateContinueLearning(currentProgress);
  }

  function updateContinueLearning(currentProgress) {
    const continueLink = document.querySelector('[data-continue-learning]');
    const secondaryLink = document.querySelector('[data-home-secondary]');
    const suggestion = document.querySelector('[data-continue-suggestion]');
    if (!continueLink) return;
    const nextLessonIndex = window.CodePlayConfig.lessonIds.findIndex((lessonId) => !currentProgress.lessonsCompleted.includes(lessonId));
    if (nextLessonIndex >= 0) {
      continueLink.href = `learn.html#${window.CodePlayConfig.lessonIds[nextLessonIndex]}`;
      continueLink.childNodes[0].textContent = currentProgress.lessonsCompleted.length ? 'Continue learning ' : 'Start learning ';
      if (secondaryLink) { secondaryLink.href = 'games.html'; secondaryLink.childNodes[0].textContent = 'Explore games'; }
      if (suggestion) suggestion.textContent = `Next up: lesson ${String(nextLessonIndex + 1).padStart(2, '0')}.`;
      return;
    }
    continueLink.href = 'games.html';
    continueLink.childNodes[0].textContent = 'Play games ';
    if (secondaryLink) { secondaryLink.href = 'challenges.html'; secondaryLink.childNodes[0].textContent = 'Try challenges'; }
    if (suggestion) suggestion.innerHTML = 'Ready for a knowledge check? <a href="quiz.html">Take the quiz</a>.';
  }

  function setupNavigation() {
    const currentPage = document.body.dataset.page;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      if (link.dataset.nav === currentPage) link.setAttribute('aria-current', 'page');
    });
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.main-nav');
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    const closeMenu = (returnFocus = false) => {
      navigation.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      if (returnFocus) menuToggle.focus();
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      if (isOpen) {
        const firstLink = navigation.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.matches('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
        event.preventDefault();
        closeMenu(true);
      }
    });
  }

  function showToast(message) {
    const toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.textContent = message; toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  window.addEventListener('codeplay:badge-unlocked', (event) => { showToast(`Badge unlocked: ${event.detail.title}`); });
  window.addEventListener('codeplay:progress-updated', updateStudentSummary);

  function setupOnboarding() {
    const modal = document.querySelector('#onboarding-modal');
    const form = document.querySelector('#onboarding-form');
    if (!modal || !form || storage.getProgress().name) return;
    const focusableSelector = 'button:not([disabled]), input:not([disabled]), a[href], select:not([disabled]), textarea:not([disabled])';
    const previousFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : document.querySelector('.brand');
    const closeModal = () => {
      modal.hidden = true;
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    };
    modal.hidden = false;
    const input = form.querySelector('input');
    input.focus();
    modal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...modal.querySelectorAll(focusableSelector)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      form.querySelector('[data-name-error]').textContent = '';
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = input.value.trim();
      const error = form.querySelector('[data-name-error]');
      if (!name) { error.textContent = 'Please enter a name to begin.'; input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
      const currentProgress = storage.getProgress(); currentProgress.name = name; storage.saveProgress(currentProgress);
      closeModal(); updateStudentSummary(); showToast(`Welcome to CodePlay, ${name}!`);
    });
    modal.querySelector('[data-close-onboarding]').addEventListener('click', closeModal);
  }

  setupNavigation(); updateStudentSummary(); setupOnboarding();
}());