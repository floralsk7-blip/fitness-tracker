# Fitness Tracker

A fitness tracking web app built for the CodeAlpha App Development internship (Task 3).

## Features

- Log daily activities manually (type, duration, calories, steps)
- Dashboard for today with progress bars for steps, calories and active minutes
- Daily goals with a "to go" counter and an "All goals reached" badge
- Live step counter that uses the phone's motion sensor (an estimate)
- Weekly summary: total steps, daily average and a 7-day bar chart
- Activity history with icons, a filter by activity type, and delete
- Data saved in the browser (localStorage), so it stays after a refresh
- Responsive layout for phones and laptops, with automatic dark mode

## Technologies Used

- HTML for the page structure
- CSS for the styling and layout (grid and flexbox)
- JavaScript for the app logic
- localStorage for saving data
- DeviceMotion API for the live step counter

## How to Run

1. Download or clone this repository.
2. Open `index.html` in a browser.

## Live Demo

https://yourusername.github.io/CodeAlpha_FitnessTracker/

## Project Structure

- `index.html`: the page
- `style.css`: the styling
- `script.js`: the app logic

## Notes

- The live step counter needs a phone with a motion sensor and a secure (https) page, such as the live demo link. Laptops usually have no motion sensor.
- It only counts while the page is open and the screen is on, and the count is an estimate.
- Calories and active minutes are entered manually.
- Data is stored only in your browser on your device. Clearing browser data removes it.

## What I Learned

- Storing data in arrays and objects and redrawing the screen from them
- Saving and loading data with localStorage
- Working with dates to build daily and weekly totals
- Building progress bars and a bar chart with HTML and CSS
- Using a browser sensor API
- Validating form input

## Author

Sheetal Kumari
