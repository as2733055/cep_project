(function () {
  'use strict';
  const storage = window.CodePlayStorage;
  const config = window.CodePlayConfig;

  function renderQuizHistory(history) {
    const columns = document.querySelector('.progress-columns');
    if (!columns) return;
    let section = document.querySelector('[data-quiz-history-section]');
    if (!section) {
      section = document.createElement('section');
      section.className = 'progress-extra-section';
      section.dataset.quizHistorySection = 'true';
      section.innerHTML = '<div class="section-heading"><div><p class="section-kicker">Recent attempts</p><h2>Quiz history</h2></div></div><div class="quiz-history-list" data-quiz-history-list></div>';
      columns.appendChild(section);
    }
    const list = section.querySelector('[data-quiz-history-list]');
    list.innerHTML = history.length ? history.slice().reverse().map((attempt) => `<div class="quiz-history-item"><strong>${attempt.score} / ${attempt.total}</strong><span>${attempt.percentage}%</span><small>${new Date(attempt.date).toLocaleDateString()}</small></div>`).join('') : '<p class="progress-empty">No quiz attempts yet.</p>';
  }

  function renderMazeStats(progress) {
    const columns = document.querySelector('.progress-columns');
    if (!columns) return;
    let section = document.querySelector('[data-maze-stats-section]');
    if (!section) {
      section = document.createElement('section');
      section.className = 'progress-extra-section';
      section.dataset.mazeStatsSection = 'true';
      section.innerHTML = '<div class="section-heading"><div><p class="section-kicker">Robot Maze</p><h2>Maze statistics</h2></div></div><div class="maze-stats-list" data-maze-stats-list></div>';
      columns.appendChild(section);
    }
    const list = section.querySelector('[data-maze-stats-list]');
    list.innerHTML = config.mazeLevels.map((maze, index) => `<div class="maze-stat-item"><strong>Level ${index + 1}</strong><span>${progress.maze.attempts[maze.id] || 0} attempts</span><small>${progress.maze.bestMoves[maze.id] ? `${progress.maze.bestMoves[maze.id]} best moves` : 'Not completed'}</small></div>`).join('');
  }

  function render() {
    const progress = storage.syncGamification(); const levels = storage.getLevels(); const badges = storage.getBadges();
    document.querySelector('[data-progress-name]').textContent = progress.name || 'learner'; document.querySelector('[data-progress-points]').textContent = config.getCurrentPoints(progress); document.querySelector('[data-current-level]').textContent = progress.currentLevel; document.querySelector('[data-current-level-name]').textContent = levels[progress.currentLevel - 1].name;
    document.querySelector('.big-points span').textContent = `Points / ${config.getTotalPossiblePoints()}`;
    document.querySelector('[data-progress-lessons]').parentElement.innerHTML = `<span data-progress-lessons>${progress.lessonsCompleted.length}</span> / ${config.getLessonCount()}`;
    document.querySelector('[data-progress-games]').parentElement.innerHTML = `<span data-progress-games>${progress.gamesCompleted.length}</span> / ${config.gameIds.length}`;
    document.querySelector('[data-progress-challenges]').parentElement.innerHTML = `<span data-progress-challenges>${progress.challengesCompleted.length}</span> / ${config.challengeIds.length}`;
    document.querySelector('[data-progress-quiz]').textContent = progress.quiz.attempts ? `${progress.quiz.bestScore}/${config.getQuizQuestionCount()} (${progress.quiz.bestPercentage}%) · ${progress.quiz.attempts} attempt${progress.quiz.attempts === 1 ? '' : 's'}` : 'Not played';
    const overallPercentage = config.getOverallProgress(progress); const overallProgress = document.querySelector('[data-progress-overall]'); overallProgress.style.width = `${overallPercentage}%`; overallProgress.setAttribute('role', 'progressbar'); overallProgress.setAttribute('aria-valuemin', '0'); overallProgress.setAttribute('aria-valuemax', '100'); overallProgress.setAttribute('aria-valuenow', String(overallPercentage));
    document.querySelector('[data-level-list]').innerHTML = levels.map((level) => `<div class="level-item${level.current ? ' is-current' : ''}${level.unlocked ? '' : ' is-locked'}"><span class="level-icon">${level.unlocked ? (level.current ? '&#9679;' : '&#10003;') : '&#128274;'}</span><div><strong>Level ${level.number}: ${level.name}</strong><small>${level.unlocked ? (level.current ? 'You are here' : 'Unlocked') : 'Complete earlier activities to unlock'}</small></div></div>`).join('');
    document.querySelector('[data-badge-list]').innerHTML = badges.map((badge) => `<div class="badge-item${badge.unlocked ? ' is-unlocked' : ''}"><span class="badge-icon">${badge.unlocked ? '&#9733;' : '&#9675;'}</span><div><strong>${badge.title}</strong><small>${badge.description}</small></div></div>`).join('');
    renderQuizHistory(progress.quiz.history);
    renderMazeStats(progress);
  }
  document.querySelector('[data-reset-progress]').addEventListener('click', () => { if (!window.confirm('Reset your name, points, activities, and badges?')) return; storage.resetProgress(); render(); document.querySelector('[data-reset-feedback]').textContent = 'Your progress has been reset.'; });
  render();
}());