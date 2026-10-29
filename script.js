<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#167a55">
  <title>Fitness Tracker</title>
  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer></script>
</head>
<body>
<div class="shell">

  <header class="site-header">
    <div class="brand-mark">✦</div>
    <div>
      <p class="eyebrow light">YOUR DAILY WELLNESS</p>
      <h1>Fitness Tracker</h1>
      <p class="subtitle">Small steps. Stronger habits.</p>
    </div>
  </header>

  <main>
    <section class="welcome-row">
      <div>
        <p class="eyebrow" id="todayDate"></p>
        <h2>Today at a glance</h2>
      </div>
      <span class="pill" id="goalBadge">Keep going</span>
    </section>

    <section class="metrics">
      <article class="metric-card">
        <div class="metric-top"><span class="chip">👟</span><span class="metric-label">Steps</span></div>
        <p class="metric-value"><span id="todaySteps">0</span> <small>steps</small></p>
        <p class="target">Goal: <span id="goalSteps"></span></p>
        <div class="track"><div class="fill" id="barSteps"></div></div>
        <p class="caption"><span id="stepsPercent">0%</span><span id="stepsRemaining"></span></p>
      </article>

      <article class="metric-card">
        <div class="metric-top"><span class="chip">🔥</span><span class="metric-label">Calories burned</span></div>
        <p class="metric-value"><span id="todayCalories">0</span> <small>kcal</small></p>
        <p class="target">Goal: <span id="goalCalories"></span> kcal</p>
        <div class="track"><div class="fill" id="barCalories"></div></div>
        <p class="caption"><span id="caloriesPercent">0%</span><span id="caloriesRemaining"></span></p>
      </article>

      <article class="metric-card">
        <div class="metric-top"><span class="chip">⏱️</span><span class="metric-label">Active time</span></div>
        <p class="metric-value"><span id="todayMinutes">0</span> <small>min</small></p>
        <p class="target">Goal: <span id="goalMinutes"></span> min</p>
        <div class="track"><div class="fill" id="barMinutes"></div></div>
        <p class="caption"><span id="minutesPercent">0%</span><span id="minutesRemaining"></span></p>
      </article>
    </section>

    <section class="panel live-panel">
      <div class="live-text">
        <p class="eyebrow">LIVE STEP COUNTER</p>
        <p class="live"><b id="liveSteps">0</b> <span>steps counted today</span></p>
        <p class="muted small">Uses your phone's motion sensor while this page is open and the screen is on. It's an estimate.</p>
        <p id="liveStatus" class="muted small" role="status"></p>
      </div>
      <button id="liveBtn" class="btn primary">▶ Start counting</button>
    </section>

    <section class="two-col">
      <article class="panel">
        <div class="heading"><div><p class="eyebrow">YOUR CONSISTENCY</p><h2>This week</h2></div><span class="mini">Last 7 days</span></div>
        <div class="week-stats">
          <div><span class="stat-label">Total steps</span><strong id="weekSteps">0</strong></div>
          <div><span class="stat-label">Daily average</span><strong id="averageSteps">0</strong></div>
        </div>
        <div class="chart" id="weekChart"></div>
        <p id="weekSummary" class="muted small"></p>
      </article>

      <article class="panel">
        <div class="heading"><div><p class="eyebrow">MAKE IT COUNT</p><h2>Log an activity</h2></div><span class="plus">＋</span></div>
        <form id="form" novalidate>
          <label>Activity
            <select id="type">
              <option>Walking</option><option>Running</option><option>Gym</option>
              <option>Yoga</option><option>Cycling</option><option>Swimming</option><option>Other</option>
            </select>
          </label>
          <div class="field-row">
            <label>Duration (min) <input type="number" id="minutes" min="0" max="1440" step="1" placeholder="30"></label>
            <label>Calories (kcal) <input type="number" id="calories" min="0" max="20000" step="1" placeholder="200"></label>
          </div>
          <label>Steps <input type="number" id="steps" min="0" max="200000" step="1" placeholder="4000"></label>
          <p class="muted small">Enter at least one value. Whole numbers only.</p>
          <button class="btn primary" type="submit">＋ Add activity</button>
          <p id="message" class="message" role="status"></p>
        </form>
      </article>
    </section>

    <section class="panel">
      <div class="heading">
        <div><p class="eyebrow">YOUR PROGRESS, SAVED</p><h2>Activity history</h2></div>
        <select id="activityFilter" class="filter" aria-label="Filter activities">
          <option value="All">All activities</option>
          <option>Walking</option><option>Running</option><option>Gym</option>
          <option>Yoga</option><option>Cycling</option><option>Swimming</option><option>Other</option>
        </select>
      </div>
      <ul id="list" class="list"></ul>
      <p class="muted small">Your entries are saved in this browser on this device.</p>
    </section>
  </main>

  <footer><p>Progress over perfection. Keep showing up. ♥</p></footer>
</div>
</body>
</html>
