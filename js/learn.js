(function () {
  'use strict';

  const config = window.CodePlayConfig;

  const lessons = [
    { id: 'lesson-coding', number: '01', title: 'What is Coding?', concept: 'Give clear instructions to solve a problem.', explanation: 'Coding is writing instructions that a computer can follow. Just like people follow a recipe, computers follow steps written in a programming language.', realWorld: 'A recipe tells you what to do, in what order, to make a meal. Code does the same thing for a computer.', visual: ['You', 'write steps', 'Computer', 'follows steps'], activity: { prompt: 'Which one is a set of instructions?', options: ['A recipe for making a sandwich', 'A favourite colour', 'A photograph'], answer: 0, success: 'A recipe is a set of instructions, just like code.' } },
    { id: 'lesson-sequence', number: '02', title: 'Sequence', concept: 'Put instructions in the correct order.', explanation: 'A sequence is a set of steps that happen in order. Computers do not guess what comes next, so the order of instructions matters.', realWorld: 'When brushing your teeth, you put toothpaste on the brush before brushing. Swapping those steps would not work well.', visual: ['Wake up', 'Brush teeth', 'Have breakfast', 'Start the day'], activity: { prompt: 'What should happen first when planting a seed?', options: ['Water the seed', 'Put the seed in soil', 'Wait for a plant'], answer: 1, success: 'The seed needs to go into soil before it can be watered or grow.' } },
    { id: 'lesson-algorithms', number: '03', title: 'Algorithms', concept: 'Plan a solution as a clear list of steps.', explanation: 'An algorithm is a plan for solving a problem. It does not have to be computer code; it can be any clear step-by-step method.', realWorld: 'Following directions to reach a new place is an algorithm: choose a road, turn, continue, and stop at the destination.', visual: ['Start', 'Choose a step', 'Repeat steps', 'Finish'], activity: { prompt: 'Which plan is easiest for a computer to follow?', options: ['Do something fun', 'Keep trying things', 'Move forward 3 times, then stop'], answer: 2, success: 'A good algorithm uses clear instructions that can be followed.' } },
    { id: 'lesson-variables', number: '04', title: 'Variables', concept: 'Store information using a named container.', explanation: 'A variable is a named place to store a value. The value can change while a program runs, which makes variables useful for scores, names, and counts.', realWorld: 'A labelled jar can hold marbles. If you add or remove marbles, the jar still has the same label but a new amount.', visual: ['score', '=', '10', 'points'], activity: { prompt: 'Which value would make sense to store in a variable called score?', options: ['10 points', 'Turn left', 'The colour blue'], answer: 0, success: 'A score variable stores a number that can change as you play.' } },
    { id: 'lesson-conditions', number: '05', title: 'Conditions / If-Else', concept: 'Make a choice based on what is happening.', explanation: 'A condition checks whether something is true or false. An if-else instruction chooses one action when the condition is true and another when it is false.', realWorld: 'If it is raining, take an umbrella. Else, leave the umbrella at home.', visual: ['IF', 'path blocked?', 'YES: turn right', 'ELSE: move forward'], activity: { prompt: 'If a door is locked, what should a helpful program do?', options: ['Try the handle forever', 'Find another way or ask for help', 'Pretend it is open'], answer: 1, success: 'A condition helps the program choose a useful response.' } },
    { id: 'lesson-loops', number: '06', title: 'Loops', concept: 'Repeat instructions without writing them again.', explanation: 'A loop repeats a group of instructions. Loops save time and make code shorter when an action needs to happen many times.', realWorld: 'Instead of saying “take one step” twenty times, you can say “repeat taking one step twenty times.”', visual: ['REPEAT 3 TIMES', 'clap', 'clap', 'clap'], activity: { prompt: 'What is the best loop for watering 5 plants?', options: ['Water one plant', 'Repeat water a plant 5 times', 'Ignore the plants'], answer: 1, success: 'A loop repeats the same action for each plant.' } },
    { id: 'lesson-functions', number: '07', title: 'Functions', concept: 'Name a reusable group of instructions.', explanation: 'A function is a named group of steps that performs one job. Once created, you can use it whenever you need that job again.', realWorld: 'A “make breakfast” routine could include several steps. You can use that routine each morning without rewriting every step.', visual: ['makeTea()', 'boil water', 'add tea', 'serve'], activity: { prompt: 'Why use a function called jump()?', options: ['To reuse the jumping instructions', 'To make the screen brighter', 'To delete all code'], answer: 0, success: 'A function keeps related steps together and makes them reusable.' } },
    { id: 'lesson-debugging', number: '08', title: 'Debugging', concept: 'Find and fix mistakes in a plan or program.', explanation: 'A bug is a mistake that makes a program behave incorrectly. Debugging means observing what happened, finding the cause, and changing the instructions.', realWorld: 'If a bicycle chain comes off, you inspect it, identify the problem, and fix it before riding again.', visual: ['Notice', 'Find the bug', 'Fix', 'Try again'], activity: { prompt: 'Your robot stops too early. What is the best first step?', options: ['Guess randomly', 'Check the instructions and test them', 'Give up'], answer: 1, success: 'Testing the instructions helps you find the exact step that needs fixing.' } },
    { id: 'lesson-problem-solving', number: '09', title: 'Problem Solving', concept: 'Break a big problem into manageable steps.', explanation: 'Problem solving means understanding a goal, breaking it into smaller parts, trying a plan, and improving it when needed. Programmers solve problems this way every day.', realWorld: 'Packing for a trip is easier when you make a list, group similar items, and check each item off.', visual: ['Understand', 'Break it down', 'Try a plan', 'Improve'], activity: { prompt: 'What helps most when a problem feels too big?', options: ['Break it into smaller tasks', 'Skip every step', 'Change the goal'], answer: 0, success: 'Smaller tasks make a problem easier to understand and solve.' } }
  ];

  function escapeHtml(value) { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])); }

  function renderVisual(items) { return `<div class="lesson-visual" aria-label="Example: ${escapeHtml(items.join(', '))}">${items.map((item, index) => `<span>${escapeHtml(item)}</span>${index < items.length - 1 ? '<b aria-hidden="true">&#8594;</b>' : ''}`).join('')}</div>`; }

  function renderLesson(lesson, completed) {
    const options = lesson.activity.options.map((option, index) => `<label class="activity-option"><input type="radio" name="${lesson.id}-answer" value="${index}"><span>${escapeHtml(option)}</span></label>`).join('');
    return `<article class="lesson-card${completed ? ' is-complete' : ''}" id="${lesson.id}" data-lesson-id="${lesson.id}"><div class="lesson-card-heading"><span class="lesson-number">${lesson.number}</span><div><p class="section-kicker">${escapeHtml(lesson.concept)}</p><h2>${escapeHtml(lesson.title)}</h2></div><span class="lesson-state" data-lesson-state aria-label="${completed ? 'Completed' : 'Lesson reward'}">${completed ? '&#10003; Completed' : `+${config.rewards.lesson} points`}</span></div><div class="lesson-content"><div class="lesson-copy"><div><h3>In simple words</h3><p>${escapeHtml(lesson.explanation)}</p></div><div><h3>In real life</h3><p>${escapeHtml(lesson.realWorld)}</p></div></div><div class="lesson-example"><h3>See the idea</h3>${renderVisual(lesson.visual)}</div><div class="lesson-activity"><h3>Quick check</h3><fieldset class="activity-options"><legend class="visually-hidden">${escapeHtml(lesson.activity.prompt)}</legend>${options}</fieldset><p class="activity-feedback" data-activity-feedback role="status" aria-live="polite"></p></div><button class="button ${completed ? 'button-complete' : 'button-primary'} complete-lesson" type="button" ${completed ? 'disabled' : ''}>${completed ? 'Lesson completed' : `Complete lesson & earn ${config.rewards.lesson} points`}</button></div></article>`;
  }

  function refreshSummary() {
    const progress = window.CodePlayStorage.getProgress();
    const completedCount = progress.lessonsCompleted.length;
    document.querySelectorAll('[data-lessons-completed]').forEach((element) => { element.textContent = completedCount; });
    document.querySelectorAll('[data-lesson-progress]').forEach((element) => { const percentage = Math.round((completedCount / config.getLessonCount()) * 100); element.style.width = `${percentage}%`; element.setAttribute('role', 'progressbar'); element.setAttribute('aria-valuemin', '0'); element.setAttribute('aria-valuemax', '100'); element.setAttribute('aria-valuenow', String(percentage)); });
  }

  function setupLessons() {
    const list = document.querySelector('#lesson-list');
    if (!list) return;
    const progress = window.CodePlayStorage.getProgress();
    list.innerHTML = lessons.map((lesson) => renderLesson(lesson, progress.lessonsCompleted.includes(lesson.id))).join('');
    const hash = window.location && window.location.hash;
    if (hash && typeof document.getElementById === 'function') {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target && typeof target.scrollIntoView === 'function') target.scrollIntoView({ block: 'start' });
    }
    list.addEventListener('click', (event) => {
      const button = event.target.closest('.complete-lesson');
      if (!button || button.disabled) return;
      const card = button.closest('[data-lesson-id]');
      const lesson = lessons.find((item) => item.id === card.dataset.lessonId);
      const selected = card.querySelector(`input[name="${lesson.id}-answer"]:checked`);
      const feedback = card.querySelector('[data-activity-feedback]');
      if (!selected) { feedback.textContent = 'Choose an answer for the quick check first.'; return; }
      if (Number(selected.value) !== lesson.activity.answer) { feedback.textContent = 'Not quite yet. Read the lesson and try the quick check again.'; return; }
      window.CodePlayStorage.completeLesson(lesson.id);
      card.classList.add('is-complete'); button.disabled = true; button.className = 'button button-complete complete-lesson'; button.textContent = 'Lesson completed';
      card.querySelector('[data-lesson-state]').innerHTML = '&#10003; Completed'; feedback.textContent = lesson.activity.success;
      refreshSummary();
      document.querySelectorAll('[data-points]').forEach((element) => { element.textContent = window.CodePlayStorage.getProgress().points; });
      const toast = document.querySelector('[data-toast]');
      if (toast) { toast.textContent = `Lesson complete! +${config.rewards.lesson} points`; toast.classList.add('is-visible'); window.setTimeout(() => toast.classList.remove('is-visible'), 2800); }
    });
  }

  setupLessons(); refreshSummary();
}());