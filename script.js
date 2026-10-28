const STORAGE_KEY = "fitnessEntries";

const GOALS = {
  steps: 10000,
  calories: 500,
  minutes: 60
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ACTIVITY_ICONS = {
  Walking: "🚶",
  Running: "🏃",
  Gym: "🏋️",
  Yoga: "🧘",
  Cycling: "🚴",
  Swimming: "🏊",
  Other: "✨"
};

const LIMITS = {
  minutes: 1440,
  calories: 20000,
  steps: 200000
};

const $ = (id) => document.getElementById(id);

const form = $("activityForm");
const message = $("message");

let entries = loadEntries();

// ---------- STORAGE ----------

function loadEntries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((entry) =>
      entry &&
      typeof entry.type === "string" &&
      isValidDateString(entry.date) &&
      ["minutes", "calories", "steps"].every((key) =>
        Number.isFinite(entry[key]) &&
        entry[key] >= 0 &&
        entry[key] <= LIMITS[key]
      )
    );
  } catch (error) {
    return [];
  }
}

function saveEntries() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries)
    );

    return true;
  } catch (error) {
    showMessage(
      "Could not save data. Browser storage may be full or disabled."
    );

    return false;
  }
}

// ---------- DATES ----------

function pad2(value) {
  return String(value).padStart(2, "0");
}

function dateToString(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function todayString() {
  return dateToString(new Date());
}

function isValidDateString(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);

  return !Number.isNaN(date.getTime()) &&
    dateToString(date) === value;
}

function parseLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function formatDate(value) {
  return parseLocalDate(value).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}

function formatNumber(value) {
  return Number(value).toLocaleString();
}

// ---------- MESSAGES ----------

function showMessage(text, success = false) {
  message.textContent = text;
  message.classList.toggle("success", success);
}

// ---------- INPUT VALIDATION ----------

function readNumber(id, label, max) {
  const raw = $(id).value.trim();

  if (raw === "") {
    return { value: 0, error: null };
  }

  const value = Number(raw);

  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return {
      value: 0,
      error: `${label} must be a whole number.`
    };
  }

  if (value < 0) {
    return {
      value: 0,
      error: `${label} cannot be negative.`
    };
  }

  if (value > max) {
    return {
      value: 0,
      error: `${label} cannot exceed ${formatNumber(max)}.`
    };
  }

  return { value, error: null };
}

// ---------- FORM RESET ----------

function resetForm() {
  form.reset();

  $("activityDate").value = todayString();
  $("editIndex").value = "";

  $("formHeading").textContent = "Log an activity";
  $("submitButton").textContent = "＋ Add activity";

  $("cancelEdit").classList.add("hidden");

  showMessage("");
}

// ---------- ADD OR UPDATE ----------

function addOrUpdateEntry(event) {
  event.preventDefault();

  const type = $("type").value;
  const date = $("activityDate").value;

  const minutes = readNumber(
    "minutes",
    "Duration",
    LIMITS.minutes
  );

  const calories = readNumber(
    "calories",
    "Calories",
    LIMITS.calories
  );

  const steps = readNumber(
    "steps",
    "Steps",
    LIMITS.steps
  );

  if (!isValidDateString(date)) {
    showMessage("Please select a valid activity date.");
    $("activityDate").focus();
    return;
  }

  const firstError = [minutes, calories, steps].find(
    (item) => item.error
  );

  if (firstError) {
    showMessage(firstError.error);
    return;
  }

  if (
    minutes.value === 0 &&
    calories.value === 0 &&
    steps.value === 0
  ) {
    showMessage(
      "Enter a duration, calories, or steps greater than zero."
    );
    return;
  }

  const entry = {
    id: (
      typeof crypto !== "undefined" &&
      crypto.randomUUID
    )
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    type,
    date,
    minutes: minutes.value,
    calories: calories.value,
    steps: steps.value
  };

  const editIndex = $("editIndex").value;

  if (editIndex !== "") {
    const index = Number(editIndex);

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= entries.length
    ) {
      showMessage("Activity not found. Please try again.");
      resetForm();
      return;
    }

    const previousEntry = entries[index];

    entries[index] = {
      ...previousEntry,
      ...entry,
      id: previousEntry.id || entry.id
    };

    if (!saveEntries()) {
      entries[index] = previousEntry;
      return;
    }

    resetForm();
    render();

    showMessage("Activity updated successfully.", true);
  } else {
    entries.push(entry);

    if (!saveEntries()) {
      entries.pop();
      return;
    }

    resetForm();
    render();

    showMessage("Activity added successfully.", true);
  }
}

// ---------- EDIT ACTIVITY ----------

function startEdit(index) {
  const entry = entries[index];

  if (!entry) return;

  $("type").value = entry.type;
  $("activityDate").value = entry.date;
  $("minutes").value = entry.minutes || "";
  $("calories").value = entry.calories || "";
  $("steps").value = entry.steps || "";

  $("editIndex").value = String(index);

  $("formHeading").textContent = "Edit activity";
  $("submitButton").textContent = "Save changes";

  $("cancelEdit").classList.remove("hidden");

  showMessage("Update the details and save your changes.");

  $("type").focus();

  $("formHeading").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

// ---------- DELETE ACTIVITY ----------

function deleteEntry(index) {
  if (!entries[index]) return;

  if (!window.confirm("Delete this activity? This cannot be undone.")) {
    return;
  }

  const removed = entries.splice(index, 1);

  if (!saveEntries()) {
    entries.splice(index, 0, removed[0]);
    return;
  }

  resetForm();
  render();

  showMessage("Activity deleted.", true);
}

// ---------- CALCULATE TOTALS ----------

function totalsForDate(dateString) {
  return entries.reduce(
    (total, entry) => {
      if (entry.date === dateString) {
        total.minutes += entry.minutes;
        total.calories += entry.calories;
        total.steps += entry.steps;
      }

      return total;
    },
    {
      minutes: 0,
      calories: 0,
      steps: 0
    }
  );
}

// ---------- PROGRESS BARS ----------

function setProgress(metric, value, goal) {
  const percent = Math.min(
    100,
    Math.round((value / goal) * 100)
  );

  const capitalized =
    metric[0].toUpperCase() + metric.slice(1);

  $(`today${capitalized}`).textContent =
    formatNumber(value);

  $(`goal${capitalized}`).textContent =
    formatNumber(goal);

  $(`bar${capitalized}`).style.width =
    `${percent}%`;

  $(`${metric}Percent`).textContent =
    `${percent}%`;

  $(`${metric}Progress`).setAttribute(
    "aria-valuenow",
    String(percent)
  );

  const remaining = Math.max(0, goal - value);

  $(`${metric}Remaining`).textContent =
    remaining === 0
      ? "Goal reached!"
      : `${formatNumber(remaining)} to go`;
}

// ---------- TODAY'S DASHBOARD ----------

function renderToday() {
  const totals = totalsForDate(todayString());

  $("todayDate").textContent =
    new Date().toLocaleDateString(
      undefined,
      {
        weekday: "long",
        month: "long",
        day: "numeric"
      }
    ).toUpperCase();

  setProgress("steps", totals.steps, GOALS.steps);

  setProgress(
    "calories",
    totals.calories,
    GOALS.calories
  );

  setProgress(
    "minutes",
    totals.minutes,
    GOALS.minutes
  );

  const completed =
    totals.steps >= GOALS.steps &&
    totals.calories >= GOALS.calories &&
    totals.minutes >= GOALS.minutes;

  $("goalBadge").textContent = completed
    ? "✓ All goals reached"
    : "Keep going";

  $("goalBadge").classList.toggle(
    "complete",
    completed
  );
}

// ---------- WEEKLY CHART ----------

function getLastSevenDays() {
  const days = [];

  for (let back = 6; back >= 0; back--) {
    const date = new Date();

    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - back);

    const dateString = dateToString(date);

    days.push({
      date,
      dateString,
      totals: totalsForDate(dateString)
    });
  }

  return days;
}

function renderWeek() {
  const chart = $("weekChart");

  chart.replaceChildren();

  const days = getLastSevenDays();

  const totalSteps = days.reduce(
    (sum, day) => sum + day.totals.steps,
    0
  );

  const totalCalories = days.reduce(
    (sum, day) => sum + day.totals.calories,
    0
  );

  const totalMinutes = days.reduce(
    (sum, day) => sum + day.totals.minutes,
    0
  );

  const maxSteps = Math.max(
    GOALS.steps,
    ...days.map((day) => day.totals.steps)
  );

  $("weekSteps").textContent =
    formatNumber(totalSteps);

  $("averageSteps").textContent =
    formatNumber(Math.round(totalSteps / 7));

  days.forEach((day) => {
    const wrapper = document.createElement("div");

    wrapper.className = "chart-day";

    if (day.dateString === todayString()) {
      wrapper.classList.add("today");
    }

    const value = document.createElement("span");

    value.className = "chart-value";

    value.textContent =
      day.totals.steps >= 1000
        ? `${(day.totals.steps / 1000).toFixed(
            day.totals.steps % 1000 === 0 ? 0 : 1
          )}k`
        : String(day.totals.steps);

    value.title =
      `${formatDate(day.dateString)}: ${formatNumber(day.totals.steps)} steps`;

    const barWrap = document.createElement("div");

    barWrap.className = "chart-bar-wrap";

    const bar = document.createElement("div");

    bar.className = "chart-bar";

    const height =
      day.totals.steps === 0
        ? 0
        : Math.max(
            3,
            (day.totals.steps / maxSteps) * 100
          );

    bar.style.height = `${height}%`;

    bar.title =
      `${formatDate(day.dateString)}: ${formatNumber(day.totals.steps)} steps`;

    barWrap.appendChild(bar);

    const label = document.createElement("span");

    label.className = "chart-label";
    label.textContent = DAY_NAMES[day.date.getDay()];
    label.title = formatDate(day.dateString);

    wrapper.append(value, barWrap, label);

    chart.appendChild(wrapper);
  });

  $("weekSummary").textContent =
    `${formatNumber(totalSteps)} steps · ` +
    `${formatNumber(totalCalories)} kcal · ` +
    `${formatNumber(totalMinutes)} active minutes over the last 7 days.`;
}

// ---------- ACTIVITY HISTORY ----------

function renderList() {
  const list = $("list");

  list.replaceChildren();

  const filter = $("activityFilter").value;

  const visibleEntries = entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) =>
      filter === "All" || entry.type === filter
    )
    .sort((a, b) =>
      b.entry.date.localeCompare(a.entry.date) ||
      b.index - a.index
    );

  if (visibleEntries.length === 0) {
    const empty = document.createElement("div");

    empty.className = "empty-state";

    const title = document.createElement("strong");

    title.textContent =
      entries.length === 0
        ? "Your journey starts here"
        : "No matching activities";

    const detail = document.createElement("span");

    detail.textContent =
      entries.length === 0
        ? "Add your first activity above to see your progress."
        : "Try choosing a different activity filter.";

    empty.append(title, detail);
    list.appendChild(empty);

    return;
  }

  visibleEntries.forEach(({ entry, index }) => {
    const item = document.createElement("article");

    item.className = "activity-item";

    const main = document.createElement("div");

    main.className = "activity-main";

    const symbol = document.createElement("div");

    symbol.className = "activity-symbol";
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = ACTIVITY_ICONS[entry.type] || "✨";

    const copy = document.createElement("div");

    copy.className = "activity-copy";

    const date = document.createElement("span");

    date.className = "activity-date";
    date.textContent = formatDate(entry.date);

    const title = document.createElement("p");

    title.className = "activity-title";
    title.textContent = entry.type;

    const meta = document.createElement("p");

    meta.className = "activity-meta";

    meta.textContent =
      `${formatNumber(entry.minutes)} min · ` +
      `${formatNumber(entry.calories)} kcal · ` +
      `${formatNumber(entry.steps)} steps`;

    copy.append(date, title, meta);
    main.append(symbol, copy);

    const buttons = document.createElement("div");

    buttons.className = "activity-buttons";

    const editButton = document.createElement("button");

    editButton.type = "button";
    editButton.className = "icon-button";
    editButton.textContent = "Edit";

    editButton.setAttribute(
      "aria-label",
      `Edit ${entry.type} activity from ${formatDate(entry.date)}`
    );

    editButton.addEventListener(
      "click",
      () => startEdit(index)
    );

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "icon-button delete";
    deleteButton.textContent = "Delete";

    deleteButton.setAttribute(
      "aria-label",
      `Delete ${entry.type} activity from ${formatDate(entry.date)}`
    );

    deleteButton.addEventListener(
      "click",
      () => deleteEntry(index)
    );

    buttons.append(editButton, deleteButton);

    item.append(main, buttons);

    list.appendChild(item);
  });
}

// ---------- EXPORT CSV ----------

function exportCSV() {
  if (entries.length === 0) {
    showMessage("There is no activity history to export.");
    return;
  }

  const headers = [
    "Date",
    "Activity",
    "Minutes",
    "Calories",
    "Steps"
  ];

  const rows = entries.map((entry) => [
    entry.date,
    entry.type,
    entry.minutes,
    entry.calories,
    entry.steps
  ]);

  const escapeCSV = (value) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(","))
    .join("\r\n");

  const blob = new Blob(
    ["\uFEFF", csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `fitness-activity-${todayString()}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  showMessage("Activity history exported as CSV.", true);
}

// ---------- EVENT LISTENERS ----------

form.addEventListener("submit", addOrUpdateEntry);

$("cancelEdit").addEventListener(
  "click",
  resetForm
);

$("activityFilter").addEventListener(
  "change",
  renderList
);

$("exportButton").addEventListener(
  "click",
  exportCSV
);

// ---------- INITIALIZE WEBSITE ----------

$("activityDate").value = todayString();

renderToday();
renderWeek();
renderList();