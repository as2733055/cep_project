(function () {
  'use strict';

  const lessonIds = [
    'lesson-coding', 'lesson-sequence', 'lesson-algorithms', 'lesson-variables',
    'lesson-conditions', 'lesson-loops', 'lesson-functions', 'lesson-debugging',
    'lesson-problem-solving'
  ];
  const gameIds = ['game-code-order', 'game-find-the-bug', 'game-robot-maze'];
  const challengeIds = ['challenge-conditionals'];
  const rewards = {
    lesson: 5,
    games: {
      'game-code-order': 10,
      'game-find-the-bug': 15,
      'game-robot-maze-level': 20
    },
    challenge: 20,
    quizMaximum: 30
  };
  const quiz = { id: 'quiz-coding', totalQuestions: 10, rewardMaximum: rewards.quizMaximum, historyLimit: 10 };
  const mazeLevels = [
    { id: 'maze-1', name: 'First steps', start: [0, 0, 1], finish: [0, 3], walls: [[1, 1], [2, 3]], size: 5, solution: ['forward', 'forward', 'forward'] },
    { id: 'maze-2', name: 'Make a turn', start: [0, 0, 1], finish: [2, 2], walls: [[1, 1], [3, 2]], size: 5, solution: ['forward', 'forward', 'right', 'forward', 'forward'] },
    { id: 'maze-3', name: 'Plan ahead', start: [4, 0, 0], finish: [2, 3], walls: [[3, 1], [1, 2], [3, 3]], size: 5, solution: ['forward', 'forward', 'right', 'forward', 'forward', 'forward'] }
  ];
  const levelDefinitions = [
    { number: 1, name: 'Coding Basics' },
    { number: 2, name: 'Sequence', requirement: (progress) => progress.lessonsCompleted.includes('lesson-sequence') || progress.gamesCompleted.includes('game-code-order') },
    { number: 3, name: 'Logic', requirement: (progress) => progress.lessonsCompleted.includes('lesson-conditions') || progress.lessonsCompleted.includes('lesson-loops') || progress.challengesCompleted.includes('challenge-conditionals') },
    { number: 4, name: 'Debugging', requirement: (progress) => progress.lessonsCompleted.includes('lesson-debugging') || progress.gamesCompleted.includes('game-find-the-bug') },
    { number: 5, name: 'Challenge Mode', requirement: (progress) => progress.lessonsCompleted.length >= lessonIds.length || progress.challengesCompleted.includes('challenge-conditionals') }
  ];
  const badgeDefinitions = [
    { id: 'first-step', title: 'FIRST STEP', description: 'Complete your first activity.', unlocked: (progress) => getCompletedActivities(progress) > 0 },
    { id: 'game-starter', title: 'GAME STARTER', description: 'Complete your first game.', unlocked: (progress) => progress.gamesCompleted.length > 0 },
    { id: 'bug-hunter', title: 'BUG HUNTER', description: 'Complete Find the Bug.', unlocked: (progress) => progress.gamesCompleted.includes('game-find-the-bug') },
    { id: 'logic-master', title: 'LOGIC MASTER', description: 'Complete three logic activities.', unlocked: (progress) => ['lesson-algorithms', 'lesson-conditions', 'lesson-loops', 'challenge-conditionals', 'game-robot-maze'].filter((id) => isActivityCompleted(progress, id)).length >= 3 },
    { id: 'robot-programmer', title: 'ROBOT PROGRAMMER', description: 'Complete a Robot Maze level.', unlocked: (progress) => progress.maze.completedLevels.length > 0 },
    { id: 'fast-learner', title: 'FAST LEARNER', description: 'Complete five lessons.', unlocked: (progress) => progress.lessonsCompleted.length >= 5 },
    { id: 'coding-champion', title: 'CODING CHAMPION', description: 'Complete all nine lessons and a game.', unlocked: (progress) => progress.lessonsCompleted.length >= lessonIds.length && progress.gamesCompleted.length > 0 }
  ];

  function getActivityDefinitions() {
    return [
      ...lessonIds.map((id) => ({ id, type: 'lesson' })),
      ...gameIds.map((id) => ({ id, type: 'game' })),
      ...challengeIds.map((id) => ({ id, type: 'challenge' })),
      { id: quiz.id, type: 'quiz' }
    ];
  }

  function getTotalActivities() {
    return getActivityDefinitions().length;
  }

  function getLessonCount() {
    return lessonIds.length;
  }

  function getQuizQuestionCount() {
    return quiz.totalQuestions;
  }

  function isActivityCompleted(progress, activityId) {
    if (!progress || typeof activityId !== 'string') return false;
    if (lessonIds.includes(activityId)) return progress.lessonsCompleted.includes(activityId);
    if (gameIds.includes(activityId)) return progress.gamesCompleted.includes(activityId);
    if (challengeIds.includes(activityId)) return progress.challengesCompleted.includes(activityId);
    if (activityId === quiz.id) return progress.quiz.attempts > 0;
    if (mazeLevels.some((level) => level.id === activityId)) return progress.maze.completedLevels.includes(activityId);
    return false;
  }

  function getCompletedActivities(progress) {
    return getActivityDefinitions().filter((activity) => isActivityCompleted(progress, activity.id)).length;
  }

  function getOverallProgress(progress) {
    return Math.min(100, Math.round((getCompletedActivities(progress) / getTotalActivities()) * 100));
  }

  function getTotalPossiblePoints() {
    const gamePoints = rewards.games['game-code-order'] + rewards.games['game-find-the-bug'];
    const mazePoints = mazeLevels.length * rewards.games['game-robot-maze-level'];
    return lessonIds.length * rewards.lesson + gamePoints + mazePoints + challengeIds.length * rewards.challenge + quiz.rewardMaximum;
  }

  function getCurrentPoints(progress) {
    const points = Number(progress && progress.points);
    return Number.isFinite(points) ? Math.max(0, Math.min(getTotalPossiblePoints(), points)) : 0;
  }

  function getRewardForActivity(activityId, quizScore, quizTotal) {
    if (lessonIds.includes(activityId)) return rewards.lesson;
    if (activityId === 'game-code-order') return rewards.games['game-code-order'];
    if (activityId === 'game-find-the-bug') return rewards.games['game-find-the-bug'];
    if (activityId === 'challenge-conditionals') return rewards.challenge;
    if (mazeLevels.some((level) => level.id === activityId)) return rewards.games['game-robot-maze-level'];
    if (activityId === quiz.id) {
      const safeTotal = Math.max(1, Number(quizTotal) || quiz.totalQuestions);
      const safeScore = Math.max(0, Math.min(safeTotal, Number(quizScore) || 0));
      return Math.min(quiz.rewardMaximum, Math.round((safeScore / safeTotal) * quiz.rewardMaximum));
    }
    return 0;
  }

  function getRewardKey(activityId) {
    if (lessonIds.includes(activityId)) return `lesson:${activityId}`;
    if (gameIds.includes(activityId)) return `game:${activityId}`;
    if (challengeIds.includes(activityId)) return `challenge:${activityId}`;
    if (mazeLevels.some((level) => level.id === activityId)) return `maze:${activityId}`;
    if (activityId === quiz.id) return `quiz:completion`;
    return '';
  }

  function awardActivityReward(progress, activityId, quizScore, quizTotal) {
    const rewardKey = getRewardKey(activityId);
    if (!rewardKey || progress.rewardedActivities.includes(rewardKey)) return 0;
    const points = getRewardForActivity(activityId, quizScore, quizTotal);
    progress.points += points;
    progress.rewardedActivities.push(rewardKey);
    return points;
  }

  window.CodePlayConfig = {
    lessonIds,
    gameIds,
    challengeIds,
    rewards,
    quiz,
    mazeLevels,
    levelDefinitions,
    badgeDefinitions,
    getTotalActivities,
    getLessonCount,
    getQuizQuestionCount,
    getCompletedActivities,
    getOverallProgress,
    getTotalPossiblePoints,
    getCurrentPoints,
    isActivityCompleted,
    awardActivityReward,
    getRewardKey,
    getRewardForActivity
  };
}());
