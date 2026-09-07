(function () {
  'use strict';

  const host = document.querySelector('[data-quiz-content]');
  if (!host) return;
  const config = window.CodePlayConfig;
  const storage = window.CodePlayStorage;
  const feedback = document.querySelector('[data-quiz-feedback]');
  const questionLabel = document.querySelector('[data-quiz-number]');
  const progressBar = document.querySelector('[data-quiz-progress]');
  const questions = [
    ['What is coding?', ['A set of instructions for a computer', 'A computer screen', 'A type of battery'], 0], ['What does sequence mean?', ['A random collection of ideas', 'Instructions in an order', 'A computer game'], 1], ['What is an algorithm?', ['A step-by-step plan', 'A keyboard key', 'A screen colour'], 0], ['What can a variable store?', ['Only a picture', 'Information such as a score', 'Only a sound'], 1], ['What does IF/ELSE help a program do?', ['Make a choice', 'Turn off every computer', 'Delete instructions'], 0], ['What is a loop useful for?', ['Repeating instructions', 'Renaming a computer', 'Drawing a keyboard'], 0], ['What is a function?', ['A reusable group of instructions', 'A broken program', 'A computer cable'], 0], ['What is a bug?', ['A useful variable', 'A mistake in a program', 'A type of loop'], 1], ['What is debugging?', ['Finding and fixing a mistake', 'Adding random steps', 'Closing a program'], 0], ['What is a good way to solve a big problem?', ['Ignore it', 'Break it into smaller parts', 'Make it more confusing'], 1]
  ];
  const state = { phase: 'QUESTION', index: 0, score: 0, selectedAnswer: null, pointsEarned: 0 };

  function setFeedback(message) {
    feedback.textContent = message;
  }

  function renderQuestion() {
    const question = questions[state.index];
    questionLabel.textContent = `Question ${state.index + 1} of ${questions.length}`;
    const percentage = Math.round(((state.index + 1) / questions.length) * 100);
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('role', 'progressbar'); progressBar.setAttribute('aria-valuemin', '0'); progressBar.setAttribute('aria-valuemax', '100'); progressBar.setAttribute('aria-valuenow', String(percentage));
    host.innerHTML = `<p class="section-kicker">Question ${state.index + 1}</p><h2>${question[0]}</h2><fieldset class="quiz-options"><legend class="visually-hidden">${question[0]}</legend>${question[1].map((answer, answerIndex) => `<label class="quiz-option"><input type="radio" name="quiz-answer" value="${answerIndex}"><span>${answer}</span></label>`).join('')}</fieldset><button class="button button-primary" type="button" data-quiz-action="check">Check answer</button>`;
    host.setAttribute('aria-live', 'polite');
    state.selectedAnswer = null;
    setFeedback('');
  }

  function checkAnswer() {
    const selected = host.querySelector('input[name="quiz-answer"]:checked');
    if (!selected) {
      setFeedback('Choose an answer first.');
      return;
    }
    state.selectedAnswer = Number(selected.value);
    state.phase = 'ANSWER';
    const question = questions[state.index];
    const isCorrect = state.selectedAnswer === question[2];
    if (isCorrect) state.score += 1;
    setFeedback(isCorrect ? 'Correct!' : `Not quite. The answer is: ${question[1][question[2]]}.`);
    const button = host.querySelector('[data-quiz-action="check"]');
    button.dataset.quizAction = 'next';
    button.textContent = state.index === questions.length - 1 ? 'See my result' : 'Next question';
  }

  function showResult() {
    const percentage = Math.round((state.score / questions.length) * 100);
    const alreadyRewarded = storage.hasRewarded(config.quiz.id);
    state.pointsEarned = alreadyRewarded ? 0 : config.getRewardForActivity(config.quiz.id, state.score, questions.length);
    storage.saveQuizResult(state.score, questions.length);
    state.phase = 'RESULT';
    questionLabel.textContent = 'Quiz complete';
    progressBar.style.width = '100%';
    host.innerHTML = `<p class="section-kicker">Your result</p><h2>${state.score} / ${questions.length} correct</h2><p class="result-copy">That is ${percentage}% of the questions. You earned ${state.pointsEarned} points on this attempt.</p><button class="button button-primary" type="button" data-quiz-action="retry">Try again</button>`;
    setFeedback(`Quiz complete. Score saved: ${state.score}/${questions.length} (${percentage}%).`);
  }

  function nextQuestion() {
    if (state.index === questions.length - 1) {
      showResult();
      return;
    }
    state.index += 1;
    state.phase = 'QUESTION';
    renderQuestion();
  }

  function retry() {
    state.phase = 'QUESTION';
    state.index = 0;
    state.score = 0;
    state.selectedAnswer = null;
    state.pointsEarned = 0;
    renderQuestion();
  }

  host.addEventListener('click', (event) => {
    const button = event.target.closest('[data-quiz-action]');
    if (!button) return;
    const action = button.dataset.quizAction;
    if (action === 'check' && state.phase === 'QUESTION') checkAnswer();
    if (action === 'next' && state.phase === 'ANSWER') nextQuestion();
    if (action === 'retry' && state.phase === 'RESULT') retry();
  });

  renderQuestion();
}());