(function () {
  'use strict';
  const storage = window.CodePlayStorage;
  function render() {
    const progress = storage.getProgress(); const levels = storage.getLevels(); const badges = storage.getBadges();
    document.querySelector('[data-progress-name]').textContent = progress.name || 'learner'; document.querySelector('[data-progress-points]').textContent = progress.points; document.querySelector('[data-current-level]').textContent = progress.currentLevel; document.querySelector('[data-current-level-name]').textContent = levels[progress.currentLevel - 1].name;
    document.querySelector('[data-progress-lessons]').textContent = progress.lessonsCompleted.length; document.querySelector('[data-progress-games]').textContent = progress.gamesCompleted.length; document.querySelector('[data-progress-challenges]').textContent = progress.challengesCompleted.length; document.querySelector('[data-progress-quiz]').textContent = progress.quiz.attempts ? `${progress.quiz.bestScore}/10 (${progress.quiz.bestPercentage}%)` : 'Not played';
    const total = progress.lessonsCompleted.length + progress.gamesCompleted.length + progress.challengesCompleted.length; document.querySelector('[data-progress-overall]').style.width = `${Math.min(100, Math.round((total / 12) * 100))}%`;
    document.querySelector('[data-level-list]').innerHTML = levels.map((level) => `<div class="level-item${level.current ? ' is-current' : ''}${level.unlocked ? '' : ' is-locked'}"><span class="level-icon">${level.unlocked ? (level.current ? '&#9679;' : '&#10003;') : '&#128274;'}</span><div><strong>Level ${level.number}: ${level.name}</strong><small>${level.unlocked ? (level.current ? 'You are here' : 'Unlocked') : 'Complete earlier activities to unlock'}</small></div></div>`).join('');
    document.querySelector('[data-badge-list]').innerHTML = badges.map((badge) => `<div class="badge-item${badge.unlocked ? ' is-unlocked' : ''}"><span class="badge-icon">${badge.unlocked ? '&#9733;' : '&#9675;'}</span><div><strong>${badge.title}</strong><small>${badge.description}</small></div></div>`).join('');
  }
  document.querySelector('[data-reset-progress]').addEventListener('click', () => { if (!window.confirm('Reset your name, points, activities, and badges?')) return; storage.resetProgress(); render(); document.querySelector('[data-reset-feedback]').textContent = 'Your progress has been reset.'; });
  render();
}());