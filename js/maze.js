(function () {
  'use strict';

  const storage = window.CodePlayStorage;
  const config = window.CodePlayConfig;
  const host = document.querySelector('#maze-game');
  if (!host) return;
  const levels = config.mazeLevels;
  const names = { forward: 'MOVE FORWARD', left: 'TURN LEFT', right: 'TURN RIGHT' };
  const arrows = ['&#9650;', '&#9654;', '&#9660;', '&#9664;'];
  const levelSelect = document.querySelector('[data-maze-level]');
  const feedback = document.querySelector('[data-maze-feedback]');
  const status = document.querySelector('[data-maze-status]');
  const grid = document.querySelector('[data-maze-grid]');
  const commandList = document.querySelector('[data-command-list]');
  let level = 0;
  let commands = [];
  let robot;
  let running = false;

  feedback.setAttribute('aria-live', 'polite');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  levels.forEach((item, index) => { levelSelect.add(new Option(`Level ${index + 1}: ${item.name}`, index)); });

  function currentLevel() { return levels[level]; }

  function updateLevelOptions() {
    const completedLevels = storage.getProgress().maze.completedLevels;
    Array.from(levelSelect.options).forEach((option, index) => { option.disabled = index > 0 && !completedLevels.includes(levels[index - 1].id); });
    if (levelSelect.options[level].disabled) { level = 0; levelSelect.value = '0'; }
  }

  function resetRobot() {
    const maze = currentLevel();
    robot = { row: maze.start[0], column: maze.start[1], direction: maze.start[2] };
  }

  function reset() {
    resetRobot();
    commands = [];
    running = false;
    draw();
    feedback.textContent = '';
    status.textContent = storage.getProgress().maze.completedLevels.includes(currentLevel().id) ? 'Level complete' : 'Build your code';
  }

  function draw() {
    const maze = currentLevel();
    const cells = [];
    for (let row = 0; row < maze.size; row += 1) {
      for (let column = 0; column < maze.size; column += 1) {
        const wall = maze.walls.some((item) => item[0] === row && item[1] === column);
        const finish = maze.finish[0] === row && maze.finish[1] === column;
        const here = robot.row === row && robot.column === column;
        cells.push(`<div class="maze-cell${wall ? ' maze-wall' : ''}${finish ? ' maze-finish' : ''}" role="gridcell">${here ? `<span class="robot" aria-label="Robot">${arrows[robot.direction]}</span>` : finish ? '<span aria-label="Finish">&#9733;</span>' : ''}</div>`);
      }
    }
    grid.innerHTML = cells.join('');
    commandList.innerHTML = commands.length ? commands.map((command, index) => `<div class="command-chip"><span>${index + 1}</span>${names[command] || 'INVALID COMMAND'}</div>`).join('') : '<p class="empty-commands">Your commands will appear here.</p>';
  }

  function move(command) {
    if (command === 'left') robot.direction = (robot.direction + 3) % 4;
    if (command === 'right') robot.direction = (robot.direction + 1) % 4;
    if (command === 'forward') {
      const rows = [-1, 0, 1, 0];
      const columns = [0, 1, 0, -1];
      robot.row += rows[robot.direction];
      robot.column += columns[robot.direction];
    }
  }

  function collisionType() {
    const maze = currentLevel();
    if (robot.row < 0 || robot.column < 0 || robot.row >= maze.size || robot.column >= maze.size) return 'boundary';
    if (maze.walls.some((item) => item[0] === robot.row && item[1] === robot.column)) return 'wall';
    return '';
  }

  function finishAttempt(successful) {
    storage.recordMazeAttempt(currentLevel().id, commands.length, successful);
    running = false;
  }

  async function run() {
    if (running) return;
    if (!commands.length) { feedback.textContent = 'Add at least one command before running.'; status.textContent = 'Build your code'; return; }
    const invalidCommand = commands.find((command) => !Object.prototype.hasOwnProperty.call(names, command));
    if (invalidCommand) { feedback.textContent = `Invalid command: ${invalidCommand}. Choose a command button and try again.`; status.textContent = 'Invalid code'; finishAttempt(false); return; }
    running = true;
    const maze = currentLevel();
    const completed = storage.getProgress().maze.completedLevels.includes(maze.id);
    resetRobot();
    draw();
    for (const command of commands) {
      move(command);
      draw();
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      const collision = collisionType();
      if (collision === 'wall' || collision === 'boundary') {
        feedback.textContent = collision === 'wall' ? 'Your robot hit a wall. Debug the route and try again.' : 'Your robot left the grid. Debug the route and try again.';
        status.textContent = collision === 'wall' ? 'Wall collision' : 'Boundary collision';
        finishAttempt(false);
        return;
      }
      if (robot.row === maze.finish[0] && robot.column === maze.finish[1]) {
        finishAttempt(true);
        storage.completeMazeLevel(maze.id);
        updateLevelOptions();
        feedback.textContent = completed ? 'Congratulations! The robot still reaches the finish.' : `Congratulations! You programmed the robot! +${config.rewards.games['game-robot-maze-level']} points earned.`;
        status.textContent = 'Level complete';
        return;
      }
    }
    feedback.textContent = 'The robot is safe, but it has not reached the finish. Add commands and try again.';
    status.textContent = 'Route incomplete';
    finishAttempt(false);
  }

  host.addEventListener('click', (event) => {
    const command = event.target.closest('[data-command]');
    if (command && !running) { commands.push(command.dataset.command); draw(); return; }
    if (event.target.closest('[data-run-maze]')) { run(); return; }
    if (event.target.closest('[data-clear-maze]') && !running) { commands = []; resetRobot(); draw(); feedback.textContent = ''; status.textContent = 'Build your code'; return; }
    if (event.target.closest('[data-reset-maze]') && !running) reset();
  });
  levelSelect.addEventListener('change', () => { if (!running && !levelSelect.options[levelSelect.selectedIndex].disabled) { level = Number(levelSelect.value); reset(); } });
  updateLevelOptions();
  reset();
}());