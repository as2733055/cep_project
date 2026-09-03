(function () {
  'use strict';

  const storage = window.CodePlayStorage;
  const progress = storage.getProgress();

  function updateStudentSummary() {
    const currentProgress = storage.getProgress();
    const studentName = currentProgress.name || 'learner';
    document.querySelectorAll('[data-student-name]').forEach((element) => { element.textContent = studentName; });
    document.querySelectorAll('[data-avatar]').forEach((element) => { element.textContent = studentName === 'learner' ? '?' : studentName.charAt(0).toUpperCase(); });
    document.querySelectorAll('[data-points]').forEach((element) => { element.textContent = currentProgress.points; });
    document.querySelectorAll('[data-lessons-completed]').forEach((element) => { element.textContent = currentProgress.lessonsCompleted.length; });
    document.querySelectorAll('[data-home-lesson-count]').forEach((element) => { element.textContent = `${currentProgress.lessonsCompleted.length} / 9 lessons`; });
    const activityCount = currentProgress.lessonsCompleted.length + currentProgress.gamesCompleted.length + currentProgress.challengesCompleted.length;
    const progressPercent = Math.min(100, Math.round((activityCount / 9) * 100));
    document.querySelectorAll('[data-overall-progress]').forEach((element) => { element.style.width = `${progressPercent}%`; });
    document.querySelectorAll('[data-progress-label]').forEach((element) => { element.textContent = progressPercent ? `${progressPercent}% of your foundation complete` : 'Just getting started'; });
  }

  function setupNavigation() {
    const currentPage = document.body.dataset.page;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      if (link.dataset.nav === currentPage) link.setAttribute('aria-current', 'page');
    });
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.main-nav');
    if (!menuToggle || !navigation) return;
    menuToggle.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.matches('a')) { navigation.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  function showToast(message) {
    const toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.textContent = message; toast.classList.add('is-visible');
    window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  window.addEventListener('codeplay:badge-unlocked', (event) => { showToast(`Badge unlocked: ${event.detail.title}`); });
  window.addEventListener('codeplay:progress-updated', updateStudentSummary);

  function setupOnboarding() {
    const modal = document.querySelector('#onboarding-modal');
    const form = document.querySelector('#onboarding-form');
    if (!modal || !form || progress.name) return;
    modal.hidden = false;
    const input = form.querySelector('input');
    input.focus();
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = input.value.trim();
      const error = form.querySelector('[data-name-error]');
      if (!name) { error.textContent = 'Please enter a name to begin.'; input.focus(); return; }
      const currentProgress = storage.getProgress(); currentProgress.name = name; storage.saveProgress(currentProgress);
      modal.hidden = true; updateStudentSummary(); showToast(`Welcome to CodePlay, ${name}!`);
    });
    modal.querySelector('[data-close-onboarding]').addEventListener('click', () => { modal.hidden = true; });
  }

  setupNavigation(); updateStudentSummary(); setupOnboarding();
}());