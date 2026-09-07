# CodePlay

CodePlay is a static educational website that introduces beginner students to coding and computational thinking through short lessons, interactive games, challenges, quizzes, points, badges, and progress tracking.

The project is designed as a college Community Engagement Project for beginner students at Janseva Hindi High School, Kalyan, Maharashtra.

## Project Overview

CodePlay follows a simple learning cycle:

**Learn -> Play -> Solve -> Earn -> Progress**

The application turns introductory programming ideas into small, approachable activities. Learners can study a concept, answer a quick check, practise it in a game or challenge, and see their progress saved in the browser.

CodePlay is a client-side application. It does not have a backend, user accounts, analytics, or server-side persistence.

## Problem Statement

Beginners can find programming difficult when it is introduced mainly through theory, syntax, and long explanations. Without immediate practice, it can be hard to understand sequence, conditions, loops, debugging, and problem-solving strategies.

CodePlay addresses this problem with short explanations, real-world examples, visual learning aids, guided activities, and immediate feedback.

## Objectives

- Make basic coding concepts approachable for first-time learners.
- Teach programming ideas through active practice rather than theory alone.
- Build sequencing, debugging, condition, planning, and problem-solving skills.
- Give learners immediate feedback after activities.
- Make learning progress visible through points, levels, badges, and statistics.
- Provide a simple application that is easy to demonstrate in a classroom or college project presentation.
- Keep the implementation understandable using standard web technologies.

## Target Users

CodePlay is designed for:

- School students who are beginners in coding.
- Learners with little or no programming experience.
- Teachers or college students demonstrating introductory computational thinking.
- The Janseva Hindi High School community engagement context described above.

The application collects only a learner-selected display name. It does not request email addresses, phone numbers, passwords, or other sensitive information.

## Features

### Learning Modules

The Learn page contains nine beginner lessons:

1. What is Coding?
2. Sequence
3. Algorithms
4. Variables
5. Conditions / If-Else
6. Loops
7. Functions
8. Debugging
9. Problem Solving

Each lesson includes:

- A simple explanation.
- A real-world example.
- A visual representation.
- A quick multiple-choice activity.
- Completion feedback and a visible `Completed` indicator.
- A one-time five-point reward.

### Games

The Games page contains three activities:

- **Code Order:** Arrange instructions into a correct sequence. Reward: 10 points.
- **Find the Bug:** Identify incorrect instructions in short programs. Reward: 15 points.
- **Robot Maze:** Program a robot with movement and turn commands across three levels. Each completed maze level rewards 20 points.

The Robot Maze includes sequential level unlocking, reset and clear controls, collision feedback, attempt counts, best move counts, and refresh-safe completion state.

### Challenges

The Conditional Challenge teaches IF/ELSE decision-making through three scenarios. Completing the challenge rewards 20 points once.

### Quiz

The Coding Quiz contains ten questions covering the concepts introduced by the lessons. It provides:

- Question progress.
- Correct and incorrect feedback.
- A final score and percentage.
- Best score preservation.
- Attempt count.
- A history of the ten most recent attempts.
- A first-completion reward of up to 30 points based on the score.

Retrying the quiz is allowed. Repeated attempts update history and statistics but do not award the completion reward again.

### Progress Tracking

The Progress page displays:

- Learner name.
- Current points and configured maximum points.
- Completed lesson, game, and challenge counts.
- Overall activity percentage.
- Current level and level unlock state.
- Quiz best score, percentage, attempts, and history.
- Robot Maze attempts and best moves per level.
- Unlocked and locked badges.
- A reset control for clearing local progress.

The application currently models 14 overall activities: nine lessons, three games, one challenge, and one quiz. Maze levels are tracked within the Robot Maze activity.

### Badges

The current badge system contains seven badges:

- **FIRST STEP:** Complete the first activity.
- **GAME STARTER:** Complete the first game.
- **BUG HUNTER:** Complete Find the Bug.
- **LOGIC MASTER:** Complete three logic activities.
- **ROBOT PROGRAMMER:** Complete a Robot Maze level.
- **FAST LEARNER:** Complete five lessons.
- **CODING CHAMPION:** Complete all nine lessons and at least one game.

Badges are evaluated centrally, stored without duplicates, preserved across refreshes, and announced with a status notification when newly unlocked.

### Points and Levels

Rewards are centrally configured:

- Lesson: 5 points.
- Code Order: 10 points.
- Find the Bug: 15 points.
- Robot Maze level: 20 points.
- Conditional Challenge: 20 points.
- Quiz: up to 30 points.

The configured maximum is 180 points. Five sequential levels are available: Coding Basics, Sequence, Logic, Debugging, and Challenge Mode.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`

No frontend framework, backend, database, authentication service, or build dependency is required.

## Project Structure

```text
CodePlay/
├── index.html                 Home page and onboarding
├── learn.html                 Learning modules
├── games.html                 Code Order, Find the Bug, and Robot Maze
├── challenges.html            Conditional Challenge
├── quiz.html                  Coding Quiz
├── progress.html              Progress, levels, badges, and statistics
├── about.html                 Community project information
├── 404.html                   Static-hosting not-found page
├── robots.txt                 Crawler instructions
├── sitemap.xml                Public page sitemap
├── favicon.svg                Site icon
├── .gitignore                 Local/editor/build exclusions
├── css/
│   └── style.css              Shared design, responsive layout, and focus styles
├── js/
│   ├── config.js              Central activity, reward, level, badge, and calculation configuration
│   ├── storage.js              State normalization, localStorage persistence, rewards, and reset logic
│   ├── app.js                 Shared navigation, onboarding, summaries, toast notifications, and continuation links
│   ├── learn.js               Lesson rendering, activities, completion, and lesson progress
│   ├── games.js               Code Order and Find the Bug behavior
│   ├── maze.js                Robot Maze levels, movement, collisions, and statistics
│   ├── challenges.js           Conditional Challenge behavior
│   ├── quiz.js                Quiz state flow, scoring, retry, and results
│   └── progress.js             Progress dashboard, badge/level display, quiz history, and maze statistics
└── .github/
    └── copilot-instructions.md Project development guidance
```

## How to Run Locally

The project has no build step. A local static server is recommended because it matches static hosting behavior:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000/](http://localhost:8000/) in a modern browser.

The main page can also be opened directly as `index.html`, but a local server is preferable for testing relative paths and deployment behavior.

## How Data Is Stored

Progress is stored in browser localStorage under the key `codeplayProgress`.

The stored state includes normalized values for:

- Display name.
- Points.
- Completed lessons, games, and challenges.
- Quiz attempts, scores, percentages, and recent history.
- Maze completed levels, attempts, and best moves.
- Rewarded activities.
- Badges and current levels.

`js/storage.js` validates and normalizes saved data when it is read. It filters invalid IDs, removes duplicates, clamps invalid numbers, handles malformed JSON, and falls back to in-memory state when localStorage is unavailable.

## Privacy and Data Limitation

CodePlay has no server account system. It does not send progress to a server and does not collect analytics or sensitive personal data.

Progress is specific to the browser and device where it was created. Clearing site data, changing browsers, using private browsing, or moving to another device can remove or hide the saved progress. Because the state is client-side, a learner can also alter it using browser developer tools.

## How to Deploy

CodePlay is a static site and can be deployed without a build command.

### GitHub Pages

1. Push the repository to GitHub.
2. Open repository **Settings -> Pages**.
3. Select the deployment branch and repository root as the source.
4. Save and wait for GitHub Pages to publish the site.

The repository includes a `404.html` page and relative paths suitable for a GitHub Pages project site.

### Netlify

1. Import the repository into Netlify.
2. Set the publish directory to the repository root.
3. Leave the build command empty.
4. Deploy the site.

### Vercel

1. Import the repository into Vercel.
2. Configure it as a static project with no build command.
3. Use the repository root as the output directory.
4. Deploy the site.

The current `robots.txt`, `sitemap.xml`, and Open Graph URLs use the repository's GitHub Pages URL. Update those URLs if the canonical deployment domain is Netlify, Vercel, or a custom domain.

## Browser Compatibility

The application targets current versions of:

- Google Chrome and Chromium-based browsers.
- Microsoft Edge.
- Mozilla Firefox.
- Apple Safari.

The application requires JavaScript and browser localStorage. Very old browsers without modern JavaScript, CSS Grid, or localStorage support are not targeted.

## Accessibility

The project includes practical WCAG 2.1 AA-oriented features:

- Semantic headings, navigation, forms, buttons, fieldsets, and legends.
- Labels for form controls and radio groups.
- `aria-current` for the active navigation item.
- `aria-expanded` and keyboard support for mobile navigation.
- Accessible onboarding dialog name and description.
- Dialog focus entry, focus trapping, Escape handling, and focus restoration.
- Visible `:focus-visible` styles.
- Keyboard-operable native links, buttons, radio controls, and selects.
- Live status regions for activity, game, maze, quiz, badge, and reset feedback.
- Progressbar semantics for visual progress indicators.
- Responsive layouts and touch-friendly controls.
- Color contrast improvements for primary controls and focus indicators.

## Testing

The following checks were performed during development:

- JavaScript syntax checks with `node --check` across all scripts.
- Editor diagnostics on modified JavaScript files.
- Lesson harness tests covering all nine lessons, valid/invalid answers, completion, refresh persistence, and duplicate rewards.
- Code Order and Find the Bug interaction tests.
- Robot Maze tests for all official solutions, collisions, invalid commands, reset, clear, level locking/unlocking, refresh, attempts, best moves, and duplicate rewards.
- Quiz state tests for unanswered, incorrect, correct, next, result, retry, history, best score, attempts, and duplicate rewards.
- Gamification tests from zero progress through all activities, badge unlocking, refresh, and reset.
- Accessibility keyboard harness tests for onboarding modal focus trapping, Escape, focus restoration, and mobile menu behavior.
- Static responsive checks at approximately 320px, 375px, 425px, 768px, 1024px, 1280px, and 1440px.
- Case-sensitive local reference checks for HTML, CSS, JavaScript, favicon, and crawler files.
- Metadata, sitemap, robots, unsafe-execution, local-path, and credential scans.

No automated browser screenshot, screen-reader, axe, or real-device test was performed in the current environment.

## Known Limitations

- Progress is browser/device-specific and client-controlled.
- There are no user accounts or cloud synchronization.
- There is no teacher or administrator dashboard.
- The site requires JavaScript and localStorage.
- The Google Fonts stylesheet is an external network dependency; offline use falls back to the declared font families.
- Open Graph and sitemap URLs currently use the GitHub Pages project URL and must be updated for another canonical deployment domain.
- No automated CI pipeline is included.

## Future Scope

Possible future improvements include:

- Optional learner accounts.
- Cloud synchronization across devices.
- A teacher dashboard for classroom progress.
- Additional lessons and language support.
- More games and challenge levels.
- Server-side persistence with appropriate privacy controls.
- Automated browser and accessibility testing in CI.

## License

No license has been selected for this college project yet. Until a license is added, the repository should be treated as reserved by its copyright holder. Add an appropriate license, such as MIT, before redistributing or reusing the project outside its intended academic context.
