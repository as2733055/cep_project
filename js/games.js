(function () {
  'use strict';
  const storage = window.CodePlayStorage;
  const config = window.CodePlayConfig;

  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])); }

  function updateRewardLabels() {
    const rewards = { '#code-order-game .reward-tag': config.rewards.games['game-code-order'], '#bug-game .reward-tag': config.rewards.games['game-find-the-bug'], '#maze-game .reward-tag': config.rewards.games['game-robot-maze-level'] };
    Object.entries(rewards).forEach(([selector, points]) => { const element = document.querySelector(selector); if (element) element.textContent = selector.includes('maze') ? `+${points} per level` : `+${points} points`; });
  }

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function codeOrder() {
    const list = document.querySelector('[data-order-list]'); if (!list) return;
    const solution = ['START', 'MOVE FORWARD', 'TURN RIGHT', 'MOVE FORWARD', 'END']; let blocks = shuffle(solution);
    if (blocks.join('|') === solution.join('|')) [blocks[0], blocks[1]] = [blocks[1], blocks[0]];
    const draw = () => { list.innerHTML = blocks.map((block, index) => `<div class="order-block"><span>${index + 1}</span><strong>${escapeHtml(block)}</strong><button type="button" data-move="up" data-index="${index}" aria-label="Move ${escapeHtml(block)} up" ${index === 0 ? 'disabled' : ''}>&#8593;</button><button type="button" data-move="down" data-index="${index}" aria-label="Move ${escapeHtml(block)} down" ${index === blocks.length - 1 ? 'disabled' : ''}>&#8595;</button></div>`).join(''); };
    list.addEventListener('click', (event) => { const button = event.target.closest('[data-move]'); if (!button) return; const index = Number(button.dataset.index); const next = button.dataset.move === 'up' ? index - 1 : index + 1; if (index < 0 || next < 0 || index >= blocks.length || next >= blocks.length) return; [blocks[index], blocks[next]] = [blocks[next], blocks[index]]; draw(); });
    document.querySelector('[data-reset-order]').addEventListener('click', () => { blocks = shuffle(solution); if (blocks.join('|') === solution.join('|')) [blocks[0], blocks[1]] = [blocks[1], blocks[0]]; draw(); document.querySelector('[data-order-feedback]').textContent = ''; });
    document.querySelector('[data-submit-order]').addEventListener('click', () => { const submitButton = document.querySelector('[data-submit-order]'); const feedback = document.querySelector('[data-order-feedback]'); if (submitButton.disabled) return; if (blocks.join('|') !== solution.join('|')) { feedback.textContent = 'Not quite. Check which step should happen next.'; return; } storage.completeGame('game-code-order'); feedback.textContent = `Correct! The sequence is clear and complete. +${config.rewards.games['game-code-order']} points earned.`; submitButton.disabled = true; }); draw();
    if (storage.getProgress().gamesCompleted.includes('game-code-order')) { document.querySelector('[data-submit-order]').disabled = true; document.querySelector('[data-order-feedback]').textContent = `Code Order completed. Your ${config.rewards.games['game-code-order']} points are already saved.`; }
  }

  function findBug() {
    const host = document.querySelector('[data-bug-content]'); if (!host) return;
    const questions = [{ prompt: 'The robot should move three steps.', lines: ['repeat 3 times', 'move forward', 'turn left'], answer: 2, why: 'The robot should move forward three times; turning left changes the plan.' }, { prompt: 'The program should greet a visitor.', lines: ['say "Hello!"', 'wait 2 seconds', 'say "Goodbye!"'], answer: 2, why: 'The goodbye message ends the greeting too soon.' }, { prompt: 'The lamp should turn on when it is dark.', lines: ['if it is dark', 'turn lamp on', 'else turn lamp on'], answer: 2, why: 'The else action should turn the lamp off when it is not dark.' }]; let answers = [];
    const draw = () => { host.innerHTML = questions.map((question, q) => `<fieldset class="bug-question"><legend>${q + 1}. ${question.prompt}</legend>${question.lines.map((line, i) => `<label class="bug-option"><input type="radio" name="bug-${q}" value="${i}"><code>${line}</code></label>`).join('')}<button class="button button-secondary bug-check" type="button" data-bug-index="${q}">Check instruction</button><p class="mini-feedback" data-mini-feedback="${q}" role="status"></p></fieldset>`).join(''); };
    host.addEventListener('click', (event) => { const button = event.target.closest('[data-bug-index]'); if (!button) return; const index = Number(button.dataset.bugIndex); const selected = host.querySelector(`input[name="bug-${index}"]:checked`); const feedback = host.querySelector(`[data-mini-feedback="${index}"]`); if (!selected) { feedback.textContent = 'Choose one instruction first.'; return; } if (Number(selected.value) !== questions[index].answer) { feedback.textContent = 'Keep looking. Ask which step does not match the goal.'; return; } answers[index] = true; feedback.textContent = `Correct. ${questions[index].why}`; button.disabled = true; if (answers.filter(Boolean).length === questions.length) { storage.completeGame('game-find-the-bug'); document.querySelector('[data-bug-feedback]').textContent = `Bug hunter complete! +${config.rewards.games['game-find-the-bug']} points earned.`; } }); draw();
    if (storage.getProgress().gamesCompleted.includes('game-find-the-bug')) { answers = questions.map(() => true); host.querySelectorAll('[data-bug-index]').forEach((button) => { button.disabled = true; }); document.querySelector('[data-bug-feedback]').textContent = `Find the Bug completed. Your ${config.rewards.games['game-find-the-bug']} points are already saved.`; }
  }
  updateRewardLabels(); codeOrder(); findBug();
}());