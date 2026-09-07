(function () {
  'use strict';

  const config = window.CodePlayConfig;
  const storageKey = 'codeplayProgress';
  let memoryProgress = createDefaultProgress();

  function createDefaultProgress() {
    return {
      name: '', points: 0, lessonsCompleted: [], gamesCompleted: [], challengesCompleted: [],
      quiz: { attempts: 0, bestScore: 0, bestPercentage: 0, lastScore: 0, lastPercentage: 0, history: [] },
      maze: { completedLevels: [], currentLevel: 1, attempts: {}, bestMoves: {} }, rewardedActivities: [], badges: [], currentLevel: 1
    };
  }

  function toSafeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function toSafeInteger(value, fallback = 0) {
    return Math.max(0, Math.floor(toSafeNumber(value, fallback)));
  }

  function uniqueValidIds(value, validIds) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((id) => typeof id === 'string' && validIds.includes(id)))];
  }

  function normalizeMazeStats(value, validIds) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value)
      .filter(([id, count]) => validIds.includes(id) && Number.isFinite(Number(count)) && Number(count) >= 0)
      .map(([id, count]) => [id, Math.floor(Number(count))]));
  }

  function normalizeQuizHistory(value) {
    if (!Array.isArray(value)) return [];
    return value.filter((entry) => entry && typeof entry === 'object' && typeof entry.date === 'string' && !Number.isNaN(Date.parse(entry.date)))
      .map((entry) => {
        const total = Math.max(1, toSafeInteger(entry.total, config.quiz.totalQuestions));
        const score = Math.min(total, toSafeInteger(entry.score));
        return { date: new Date(entry.date).toISOString(), score, total, percentage: Math.round((score / total) * 100) };
      })
      .slice(-config.quiz.historyLimit);
  }

  function getValidRewardKeys() {
    return [
      ...config.lessonIds.map((id) => `lesson:${id}`),
      ...config.gameIds.map((id) => `game:${id}`),
      ...config.challengeIds.map((id) => `challenge:${id}`),
      ...config.mazeLevels.map((level) => `maze:${level.id}`),
      'quiz:completion',
      ...config.gameIds.map((id) => `game:${id}`)
    ];
  }

  function mergeProgress(progress) {
    const defaults = createDefaultProgress();
    const source = progress && typeof progress === 'object' ? progress : {};
    const quizSource = source.quiz && typeof source.quiz === 'object' ? source.quiz : {};
    const mazeSource = source.maze && typeof source.maze === 'object' ? source.maze : {};
    const normalized = { ...defaults, ...source };

    normalized.name = typeof source.name === 'string' ? source.name.trim().slice(0, 30) : '';
    normalized.lessonsCompleted = uniqueValidIds(source.lessonsCompleted, config.lessonIds);
    normalized.gamesCompleted = uniqueValidIds(source.gamesCompleted, config.gameIds);
    normalized.challengesCompleted = uniqueValidIds(source.challengesCompleted, config.challengeIds);
    normalized.rewardedActivities = uniqueValidIds(source.rewardedActivities, getValidRewardKeys());
    normalized.badges = uniqueValidIds(source.badges, config.badgeDefinitions.map((badge) => badge.id));
    normalized.quiz = { ...defaults.quiz, ...quizSource };
    normalized.quiz.attempts = toSafeInteger(normalized.quiz.attempts);
    normalized.quiz.bestScore = Math.min(config.quiz.totalQuestions, toSafeInteger(normalized.quiz.bestScore));
    normalized.quiz.bestPercentage = Math.min(100, toSafeInteger(normalized.quiz.bestPercentage));
    normalized.quiz.lastScore = Math.min(config.quiz.totalQuestions, toSafeInteger(normalized.quiz.lastScore));
    normalized.quiz.lastPercentage = Math.min(100, toSafeInteger(normalized.quiz.lastPercentage));
    normalized.quiz.history = normalizeQuizHistory(quizSource.history);
    normalized.maze = { ...defaults.maze, ...mazeSource };
    normalized.maze.completedLevels = uniqueValidIds(mazeSource.completedLevels, config.mazeLevels.map((level) => level.id));
    const mazeIds = config.mazeLevels.map((level) => level.id);
    normalized.maze.attempts = normalizeMazeStats(mazeSource.attempts, mazeIds);
    normalized.maze.bestMoves = normalizeMazeStats(mazeSource.bestMoves, mazeIds);
    let nextMazeLevel = 1;
    while (nextMazeLevel < config.mazeLevels.length && normalized.maze.completedLevels.includes(mazeIds[nextMazeLevel - 1])) nextMazeLevel += 1;
    normalized.maze.currentLevel = Math.min(config.mazeLevels.length, nextMazeLevel);
    normalized.points = Math.min(config.getTotalPossiblePoints(), Math.max(0, toSafeNumber(normalized.points)));
    normalized.currentLevel = getCurrentLevel(normalized);
    return normalized;
  }

  function getCurrentLevel(progress) {
    let currentLevel = 1;
    for (let index = 1; index < config.levelDefinitions.length; index += 1) {
      if (!config.levelDefinitions[index].requirement(progress)) break;
      currentLevel = config.levelDefinitions[index].number;
    }
    return currentLevel;
  }

  function evaluateGamification(progress) {
    progress.currentLevel = getCurrentLevel(progress);
    const newlyUnlocked = [];
    config.badgeDefinitions.forEach((badge) => {
      if (badge.unlocked(progress) && !progress.badges.includes(badge.id)) {
        progress.badges.push(badge.id);
        newlyUnlocked.push(badge);
      }
    });
    return newlyUnlocked;
  }

  function readProgress() {
    try {
      const rawProgress = window.localStorage.getItem(storageKey);
      if (!rawProgress) return mergeProgress(memoryProgress);
      memoryProgress = mergeProgress(JSON.parse(rawProgress));
      return memoryProgress;
    } catch (error) {
      return mergeProgress(memoryProgress);
    }
  }

  function saveProgress(progress) {
    memoryProgress = mergeProgress(progress);
    const newlyUnlocked = evaluateGamification(memoryProgress);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(memoryProgress));
    } catch (error) {
      // Keep the normalized session state when storage is unavailable.
    }
    if (typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') {
      window.dispatchEvent(new window.CustomEvent('codeplay:progress-updated'));
      newlyUnlocked.forEach((badge) => window.dispatchEvent(new window.CustomEvent('codeplay:badge-unlocked', { detail: badge })));
    }
    return memoryProgress;
  }

  function completeActivity(progress, collection, activityId) {
    collection.push(activityId);
    config.awardActivityReward(progress, activityId);
    return saveProgress(progress);
  }

  window.CodePlayStorage = {
    getProgress: readProgress,
    saveProgress,
    addPoints(points) {
      const progress = readProgress();
      progress.points += Math.max(0, toSafeNumber(points));
      return saveProgress(progress);
    },
    completeLesson(lessonId) {
      if (!config.lessonIds.includes(lessonId)) return readProgress();
      const progress = readProgress();
      if (progress.lessonsCompleted.includes(lessonId)) return progress;
      return completeActivity(progress, progress.lessonsCompleted, lessonId);
    },
    completeGame(gameId) {
      if (!config.gameIds.includes(gameId)) return readProgress();
      const progress = readProgress();
      if (progress.gamesCompleted.includes(gameId)) return progress;
      return completeActivity(progress, progress.gamesCompleted, gameId);
    },
    completeChallenge(challengeId) {
      if (!config.challengeIds.includes(challengeId)) return readProgress();
      const progress = readProgress();
      if (progress.challengesCompleted.includes(challengeId)) return progress;
      return completeActivity(progress, progress.challengesCompleted, challengeId);
    },
    completeMazeLevel(levelId) {
      if (!config.mazeLevels.some((level) => level.id === levelId)) return readProgress();
      const progress = readProgress();
      if (progress.maze.completedLevels.includes(levelId)) return progress;
      const levelIndex = config.mazeLevels.findIndex((level) => level.id === levelId);
      if (levelIndex > 0 && !progress.maze.completedLevels.includes(config.mazeLevels[levelIndex - 1].id)) return progress;
      progress.maze.completedLevels.push(levelId);
      config.awardActivityReward(progress, levelId);
      if (!progress.gamesCompleted.includes('game-robot-maze')) progress.gamesCompleted.push('game-robot-maze');
      return saveProgress(progress);
    },
    recordMazeAttempt(levelId, moves, successful = false) {
      if (!config.mazeLevels.some((level) => level.id === levelId)) return readProgress();
      const progress = readProgress();
      progress.maze.attempts[levelId] = (progress.maze.attempts[levelId] || 0) + 1;
      const safeMoves = Math.max(0, toSafeInteger(moves));
      if (successful && safeMoves > 0 && (!progress.maze.bestMoves[levelId] || safeMoves < progress.maze.bestMoves[levelId])) progress.maze.bestMoves[levelId] = safeMoves;
      return saveProgress(progress);
    },
    saveQuizResult(score, total = config.quiz.totalQuestions) {
      const progress = readProgress();
      const safeTotal = config.quiz.totalQuestions;
      const safeScore = Math.min(safeTotal, toSafeInteger(score));
      const percentage = Math.round((safeScore / safeTotal) * 100);
      progress.quiz.attempts += 1;
      progress.quiz.lastScore = Math.min(config.quiz.totalQuestions, safeScore);
      progress.quiz.lastPercentage = Math.min(100, percentage);
      progress.quiz.bestScore = Math.max(progress.quiz.bestScore, progress.quiz.lastScore);
      progress.quiz.bestPercentage = Math.max(progress.quiz.bestPercentage, progress.quiz.lastPercentage);
      progress.quiz.history.push({ date: new Date().toISOString(), score: progress.quiz.lastScore, total: safeTotal, percentage });
      progress.quiz.history = progress.quiz.history.slice(-config.quiz.historyLimit);
      config.awardActivityReward(progress, config.quiz.id, safeScore, safeTotal);
      return saveProgress(progress);
    },
    unlockBadge(badgeId) {
      const progress = readProgress();
      if (config.badgeDefinitions.some((badge) => badge.id === badgeId) && !progress.badges.includes(badgeId)) progress.badges.push(badgeId);
      return saveProgress(progress);
    },
    syncGamification() {
      const progress = readProgress();
      const hasMissingBadge = config.badgeDefinitions.some((badge) => badge.unlocked(progress) && !progress.badges.includes(badge.id));
      return hasMissingBadge ? saveProgress(progress) : progress;
    },
    resetProgress() {
      return saveProgress(createDefaultProgress());
    },
    hasRewarded(activityId) {
      const rewardKey = config.getRewardKey(activityId);
      return rewardKey ? readProgress().rewardedActivities.includes(rewardKey) : false;
    },
    markRewarded(activityId) {
      const progress = readProgress();
      const rewardKey = config.getRewardKey(activityId);
      if (rewardKey && !progress.rewardedActivities.includes(rewardKey)) progress.rewardedActivities.push(rewardKey);
      return saveProgress(progress);
    },
    getLevels() {
      const progress = readProgress();
      const currentLevel = getCurrentLevel(progress);
      return config.levelDefinitions.map((level) => ({ number: level.number, name: level.name, unlocked: level.number <= currentLevel, current: currentLevel === level.number }));
    },
    getBadges() {
      const progress = readProgress();
      return config.badgeDefinitions.map((badge) => ({ id: badge.id, title: badge.title, description: badge.description, unlocked: progress.badges.includes(badge.id) }));
    }
  };
}());