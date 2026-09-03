(function () {
  'use strict';

  const STORAGE_KEY = 'codeplayProgress';
  const levelDefinitions = [
    { number: 1, name: 'Coding Basics', unlocked: () => true },
    { number: 2, name: 'Sequence', unlocked: (progress) => progress.lessonsCompleted.includes('lesson-sequence') || progress.gamesCompleted.includes('game-code-order') },
    { number: 3, name: 'Logic', unlocked: (progress) => progress.lessonsCompleted.includes('lesson-conditions') || progress.lessonsCompleted.includes('lesson-loops') || progress.challengesCompleted.includes('challenge-conditionals') },
    { number: 4, name: 'Debugging', unlocked: (progress) => progress.lessonsCompleted.includes('lesson-debugging') || progress.gamesCompleted.includes('game-find-the-bug') },
    { number: 5, name: 'Challenge Mode', unlocked: (progress) => progress.lessonsCompleted.length >= 9 || progress.challengesCompleted.includes('challenge-conditionals') }
  ];
  const badgeDefinitions = [
    { id: 'first-step', title: 'FIRST STEP', description: 'Complete your first activity.', unlocked: (progress) => progress.lessonsCompleted.length + progress.gamesCompleted.length + progress.challengesCompleted.length > 0 },
    { id: 'game-starter', title: 'GAME STARTER', description: 'Complete your first game.', unlocked: (progress) => progress.gamesCompleted.length > 0 },
    { id: 'bug-hunter', title: 'BUG HUNTER', description: 'Complete Find the Bug.', unlocked: (progress) => progress.gamesCompleted.includes('game-find-the-bug') },
    { id: 'logic-master', title: 'LOGIC MASTER', description: 'Complete three logic activities.', unlocked: (progress) => { const logic = ['lesson-algorithms', 'lesson-conditions', 'lesson-loops', 'challenge-conditionals', 'game-robot-maze']; return logic.filter((id) => progress.lessonsCompleted.includes(id) || progress.challengesCompleted.includes(id) || progress.gamesCompleted.includes(id)).length >= 3; } },
    { id: 'robot-programmer', title: 'ROBOT PROGRAMMER', description: 'Complete a Robot Maze level.', unlocked: (progress) => progress.maze.completedLevels.length > 0 },
    { id: 'fast-learner', title: 'FAST LEARNER', description: 'Complete five lessons.', unlocked: (progress) => progress.lessonsCompleted.length >= 5 },
    { id: 'coding-champion', title: 'CODING CHAMPION', description: 'Complete all nine lessons and a game.', unlocked: (progress) => progress.lessonsCompleted.length >= 9 && progress.gamesCompleted.length > 0 }
  ];
  const defaultProgress = () => ({
    name: '', points: 0, lessonsCompleted: [], gamesCompleted: [], challengesCompleted: [],
    quiz: { attempts: 0, bestScore: 0, bestPercentage: 0, lastScore: 0, lastPercentage: 0 },
    maze: { completedLevels: [], currentLevel: 1 }, rewardedActivities: [], badges: [], currentLevel: 1
  });
  let memoryProgress = defaultProgress();

  function readProgress() {
    try {
      const rawProgress = window.localStorage.getItem(STORAGE_KEY);
      if (!rawProgress) return defaultProgress();
      const savedProgress = JSON.parse(rawProgress);
      const normalizedProgress = mergeProgress(savedProgress);
      normalizedProgress.currentLevel = getCurrentLevel(normalizedProgress);
      return normalizedProgress;
    } catch (error) {
      const normalizedProgress = mergeProgress(memoryProgress);
      normalizedProgress.currentLevel = getCurrentLevel(normalizedProgress);
      return normalizedProgress;
    }
  }

  function mergeProgress(progress) {
    const defaults = defaultProgress();
    const mergedProgress = { ...defaults, ...(progress || {}) };
    mergedProgress.lessonsCompleted = Array.isArray(mergedProgress.lessonsCompleted) ? mergedProgress.lessonsCompleted : [];
    mergedProgress.gamesCompleted = Array.isArray(mergedProgress.gamesCompleted) ? mergedProgress.gamesCompleted : [];
    mergedProgress.challengesCompleted = Array.isArray(mergedProgress.challengesCompleted) ? mergedProgress.challengesCompleted : [];
    mergedProgress.rewardedActivities = Array.isArray(mergedProgress.rewardedActivities) ? mergedProgress.rewardedActivities : [];
    mergedProgress.badges = Array.isArray(mergedProgress.badges) ? mergedProgress.badges : [];
    mergedProgress.quiz = { ...defaults.quiz, ...(progress && progress.quiz) };
    mergedProgress.maze = { ...defaults.maze, ...(progress && progress.maze) };
    mergedProgress.points = Math.max(0, Number(mergedProgress.points) || 0);
    mergedProgress.quiz.attempts = Math.max(0, Number(mergedProgress.quiz.attempts) || 0);
    mergedProgress.quiz.bestScore = Math.max(0, Number(mergedProgress.quiz.bestScore) || 0);
    mergedProgress.quiz.bestPercentage = Math.max(0, Number(mergedProgress.quiz.bestPercentage) || 0);
    mergedProgress.quiz.lastScore = Math.max(0, Number(mergedProgress.quiz.lastScore) || 0);
    mergedProgress.quiz.lastPercentage = Math.max(0, Number(mergedProgress.quiz.lastPercentage) || 0);
    return mergedProgress;
  }

  function getCurrentLevel(progress) {
    let currentLevel = 1;
    levelDefinitions.forEach((level) => { if (level.unlocked(progress)) currentLevel = level.number; });
    return currentLevel;
  }

  function evaluateGamification(progress) {
    progress.currentLevel = getCurrentLevel(progress);
    const newlyUnlocked = [];
    badgeDefinitions.forEach((badge) => { if (badge.unlocked(progress) && !progress.badges.includes(badge.id)) { progress.badges.push(badge.id); newlyUnlocked.push(badge); } });
    return newlyUnlocked;
  }

  function saveProgress(progress) {
    memoryProgress = mergeProgress(progress);
    const newlyUnlocked = evaluateGamification(memoryProgress);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryProgress)); } catch (error) { /* Session fallback remains available. */ }
    if (typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') window.dispatchEvent(new window.CustomEvent('codeplay:progress-updated'));
    if (newlyUnlocked.length && typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') newlyUnlocked.forEach((badge) => window.dispatchEvent(new window.CustomEvent('codeplay:badge-unlocked', { detail: badge })));
    return memoryProgress;
  }

  window.CodePlayStorage = {
    getProgress: readProgress,
    saveProgress,
    addPoints(points) { const progress = readProgress(); progress.points += Math.max(0, Number(points) || 0); return saveProgress(progress); },
    completeLesson(lessonId, points = 5) {
      const progress = readProgress();
      if (progress.lessonsCompleted.includes(lessonId)) return progress;
      progress.lessonsCompleted.push(lessonId);
      const rewardId = `lesson:${lessonId}`;
      if (!progress.rewardedActivities.includes(rewardId)) {
        progress.points += Math.max(0, Number(points) || 0);
        progress.rewardedActivities.push(rewardId);
      }
      return saveProgress(progress);
    },
    completeGame(gameId, points = 10) {
      const progress = readProgress();
      if (progress.gamesCompleted.includes(gameId)) return progress;
      progress.gamesCompleted.push(gameId);
      const rewardId = `game:${gameId}`;
      if (!progress.rewardedActivities.includes(rewardId)) { progress.points += Math.max(0, Number(points) || 0); progress.rewardedActivities.push(rewardId); }
      return saveProgress(progress);
    },
    completeChallenge(challengeId, points = 20) {
      const progress = readProgress();
      if (progress.challengesCompleted.includes(challengeId)) return progress;
      progress.challengesCompleted.push(challengeId);
      const rewardId = `challenge:${challengeId}`;
      if (!progress.rewardedActivities.includes(rewardId)) { progress.points += Math.max(0, Number(points) || 0); progress.rewardedActivities.push(rewardId); }
      return saveProgress(progress);
    },
    completeMazeLevel(levelId, points = 20) {
      const progress = readProgress();
      if (!progress.maze.completedLevels.includes(levelId)) progress.maze.completedLevels.push(levelId);
      const rewardId = `maze:${levelId}`;
      if (!progress.rewardedActivities.includes(rewardId)) { progress.points += Math.max(0, Number(points) || 0); progress.rewardedActivities.push(rewardId); }
      if (!progress.gamesCompleted.includes('game-robot-maze')) progress.gamesCompleted.push('game-robot-maze');
      return saveProgress(progress);
    },
    saveQuizResult(score, total = 10) {
      const progress = readProgress();
      const safeTotal = Math.max(1, Number(total) || 10);
      const safeScore = Math.min(safeTotal, Math.max(0, Number(score) || 0));
      const percentage = Math.round((safeScore / safeTotal) * 100);
      progress.quiz.attempts += 1; progress.quiz.lastScore = safeScore; progress.quiz.lastPercentage = percentage;
      progress.quiz.bestScore = Math.max(progress.quiz.bestScore, safeScore); progress.quiz.bestPercentage = Math.max(progress.quiz.bestPercentage, percentage);
      if (!progress.rewardedActivities.includes('quiz:completion')) { progress.points += Math.min(30, Math.round((safeScore / safeTotal) * 30)); progress.rewardedActivities.push('quiz:completion'); }
      return saveProgress(progress);
    },
    unlockBadge(badgeId) { const progress = readProgress(); if (!progress.badges.includes(badgeId)) progress.badges.push(badgeId); return saveProgress(progress); },
    resetProgress() { const progress = defaultProgress(); saveProgress(progress); return progress; },
    hasRewarded(activityId) { return readProgress().rewardedActivities.includes(activityId); },
    markRewarded(activityId) { const progress = readProgress(); if (!progress.rewardedActivities.includes(activityId)) progress.rewardedActivities.push(activityId); return saveProgress(progress); },
    getLevels() { const progress = readProgress(); return levelDefinitions.map((level) => ({ number: level.number, name: level.name, unlocked: level.unlocked(progress), current: progress.currentLevel === level.number })); },
    getBadges() { const progress = readProgress(); return badgeDefinitions.map((badge) => ({ id: badge.id, title: badge.title, description: badge.description, unlocked: progress.badges.includes(badge.id) })); }
  };
}());