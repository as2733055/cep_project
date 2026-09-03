# CodePlay — GitHub Copilot Project Instructions

## Project

Project Name: CodePlay

Project Title:
Coding Through Games and Activities

This is a college Community Engagement Project (CEP).

Community:
Janseva Hindi High School, Kalyan, Maharashtra

Target Users:
School students who are beginners in coding.

## Purpose

Build a beginner-friendly educational website that teaches basic coding and computational-thinking concepts through games, activities, puzzles, quizzes, and challenges.

The website should address the learning problem of students finding coding difficult when it is presented mainly through theory and syntax.

The core learning cycle is:

LEARN → PLAY → SOLVE → EARN → PROGRESS

The website should be educational first and entertaining second.

---

# Development Philosophy

Build a polished, functional MVP.

Do not create static mockups.

Every button, game, score, navigation item, progress indicator, and interactive element shown in the UI must actually work.

Prefer simple, maintainable code that college students can understand and explain during a viva.

Do not over-engineer the project.

---

# Technology

Preferred stack:

- HTML5
- CSS3
- Vanilla JavaScript
- Browser LocalStorage

Avoid unnecessary frameworks.

Do not add React, Angular, Vue, Node.js backend, databases, authentication, or external services unless explicitly requested.

The project should ideally work by opening the main HTML file or through a simple local development server.

---

# Architecture

Use a clean structure similar to:

CodePlay/
│
├── index.html
├── learn.html
├── games.html
├── challenges.html
├── quiz.html
├── progress.html
├── about.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── learn.js
│   ├── games.js
│   ├── maze.js
│   ├── quiz.js
│   ├── challenges.js
│   ├── progress.js
│   └── badges.js
│
└── assets/

The structure may be simplified if there is a good reason.

Keep reusable logic separate from page-specific logic.

---

# Design

The website should look:

- Modern
- Friendly
- Colorful
- Clean
- Educational
- Gamified
- Professional enough for a college project

Use:

- Rounded cards
- Clear typography
- Large buttons
- Simple icons
- Progress bars
- Cards
- Subtle animations
- Consistent spacing
- Clear visual hierarchy

Avoid:

- Clutter
- Excessive animations
- Tiny text
- Complicated menus
- Excessive gradients
- Corporate UI
- Large walls of text

The design should be appropriate for school students without looking overly childish.

---

# Responsive Design

The site must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Avoid horizontal scrolling.

Buttons and controls must be touch-friendly.

Use responsive CSS.

---

# Navigation

Main navigation:

Home
Learn
Games
Challenges
Quiz
Progress
About

Navigation should be consistent across pages.

On mobile, provide a mobile-friendly navigation menu.

---

# Student Onboarding

On first visit, ask for a simple display name.

Message:

"Welcome to CodePlay! 👋"

"What's your name?"

Input:
Enter your name

Button:
Start My Coding Journey 🚀

Save the name using LocalStorage.

Do not collect unnecessary personal information.

---

# Home Page

Hero:

CODEPLAY

"Learn Coding. Play Games. Build Your Logic."

Buttons:

Start Learning
Play Games

Feature cards:

🎮 Learn Through Games
🧠 Build Logical Thinking
🏆 Earn Badges

Show:

Student name
Total points
Current progress

Add:

"How CodePlay Works"

1. Learn
2. Play
3. Solve
4. Earn
5. Unlock

---

# Learning Content

Include beginner lessons:

1. What is Coding?
2. Sequence
3. Algorithms
4. Variables
5. Conditions / If-Else
6. Loops
7. Functions
8. Debugging
9. Problem Solving

Lessons must use simple language.

Every lesson should include:

- Explanation
- Real-world example
- Example/visual
- Small activity
- Completion action

Completing a lesson awards 5 points.

Save completion state.

---

# Games

Implement at least five functional activities.

## Game 1 — Code Order

Teach sequence and algorithms.

Students arrange shuffled instruction blocks into the correct order.

Example:

START
MOVE FORWARD
TURN RIGHT
MOVE FORWARD
END

Requirements:

- Interactive ordering
- Submit
- Reset
- Feedback
- Explanation
- Score

Correct:
+10 points

Do not award duplicate points for repeatedly completing the same activity.

---

## Game 2 — Find the Bug

Teach debugging.

Display simple beginner-friendly code/instructions.

Ask students to identify the incorrect instruction.

Use multiple questions.

Provide explanations after answering.

---

## Game 3 — Coding Quiz

Cover:

- Coding
- Algorithms
- Sequence
- Variables
- Conditions
- Loops
- Functions
- Debugging

Use at least 10 questions.

Show:

Question number
Progress
Answer feedback
Final score
Percentage
Points earned

Allow retry.

---

## Game 4 — Robot Maze

This is the primary game.

Create a grid-based maze.

Student controls a robot.

Goal:
Reach the finish.

Provide coding blocks:

MOVE FORWARD
TURN LEFT
TURN RIGHT

Student builds a sequence.

Example:

MOVE FORWARD
MOVE FORWARD
TURN RIGHT
MOVE FORWARD

Button:

RUN CODE

Animate the robot executing the commands.

If successful:

"Congratulations! You programmed the robot! 🎉"

If unsuccessful:

"Your code needs debugging. Try again! 🤔"

Include:

- Run
- Reset
- Clear Code
- Multiple levels
- Visual feedback

Teach:

- Sequence
- Algorithms
- Planning
- Debugging
- Problem solving

---

## Game 5 — Conditional Challenge

Teach IF/ELSE logic without requiring complicated syntax.

Example:

IF path is blocked:
    TURN RIGHT
ELSE:
    MOVE FORWARD

Use interactive scenarios.

---

# Levels

Create:

Level 1 — Coding Basics
Level 2 — Sequence
Level 3 — Logic
Level 4 — Debugging
Level 5 — Challenge Mode

Lock later levels until appropriate earlier activities are completed.

Show:

🔒 Locked
🔓 Unlocked
⭐ Completed

---

# Points

Centralize point management.

Suggested:

Lesson = 5 points
Easy game = 10 points
Medium game = 15 points
Hard challenge = 20 points
Quiz = up to 30 points
Maze = 20 points

Prevent duplicate rewards.

---

# Badges

Implement:

FIRST STEP
Complete first activity.

GAME STARTER
Complete first game.

BUG HUNTER
Complete debugging activity.

LOGIC MASTER
Complete 3 logic activities.

ROBOT PROGRAMMER
Complete Robot Maze.

FAST LEARNER
Complete 5 lessons.

CODING CHAMPION
Complete the major learning journey.

Badges should automatically unlock.

Show a celebration notification when a badge is unlocked.

---

# Progress Dashboard

Display:

Student name
Total points
Lessons completed
Games completed
Challenges completed
Quiz score
Badges
Current level

Show an overall progress bar.

Progress must update automatically.

---

# LocalStorage

Create centralized storage functions.

Use functions such as:

getProgress()
saveProgress()
addPoints()
completeLesson()
completeGame()
completeChallenge()
unlockBadge()
resetProgress()

Handle missing or corrupted LocalStorage data gracefully.

Refreshing the page must preserve progress.

---

# Reset

Provide:

Reset My Progress

Before resetting, show confirmation.

Reset:

- Name
- Points
- Lessons
- Games
- Challenges
- Quiz results
- Badges
- Level

---

# Accessibility

Use:

- Semantic HTML
- Labels
- Keyboard-friendly controls
- Visible focus
- Readable text
- Large buttons
- Clear feedback
- Good contrast

Do not communicate information using color alone.

---

# Educational Requirements

Every game must have a clear learning objective.

Each activity should contain:

Learning Objective
Instructions
Activity
Feedback
Explanation
Reward

Do not create games purely for decoration.

---

# Privacy

Only collect a simple display name.

Do not collect:

- Email
- Phone number
- Address
- Password
- Sensitive information

No tracking or analytics is required.

---

# Error Handling

Handle:

- Empty name
- Missing LocalStorage
- Invalid LocalStorage
- Page refresh
- Game retry
- Duplicate scoring
- Missing data

The website must not crash.

---

# Code Quality

Use:

- Meaningful variable names
- Small reusable functions
- Comments for important logic
- Consistent formatting
- No unnecessary duplication

Do not use giant functions when smaller functions would be clearer.

Do not leave TODOs for core functionality.

Do not create fake buttons.

Do not use placeholder functionality.

---

# QA

Before considering a feature complete, verify:

- Navigation works
- Student onboarding works
- Lessons work
- Games work
- Quiz works
- Maze works
- Scores work
- Badges work
- Levels work
- Progress works
- LocalStorage works
- Reset works
- Mobile layout works
- No broken links
- No missing scripts
- No JavaScript errors

Fix problems instead of simply reporting them.

---

# CEP Context

This is a Community Engagement Project.

The website should clearly connect:

Community Problem
↓
Student Need
↓
Technology Solution
↓
Learning Activities
↓
Community Benefit

The project should be easy to demonstrate to school students and college faculty.

A typical demonstration should take approximately 5–10 minutes.

---

# Development Rules for Copilot

Before making large changes:

1. Inspect the existing project.
2. Understand the current architecture.
3. Reuse existing components/functions where appropriate.
4. Avoid unnecessarily rewriting working code.
5. Keep changes focused.

When implementing a feature:

1. Explain briefly what will be changed.
2. Implement it completely.
3. Check related files.
4. Check for broken dependencies.
5. Fix errors.
6. Only then move to the next feature.

Do not repeatedly ask for permission for normal implementation decisions.

If something is ambiguous, choose the simplest implementation that matches the project goals.

If a requested feature can be implemented without an external dependency, prefer that approach.

---

# Most Important Rule

Do not optimize for the amount of code.

Optimize for:

FUNCTIONALITY
EDUCATIONAL VALUE
USER EXPERIENCE
RELIABILITY
SIMPLICITY
PRESENTATION QUALITY

The final website should be a polished, genuinely functional educational game-based coding platform suitable for a college CEP demonstration.