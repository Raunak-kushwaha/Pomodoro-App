let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let totalTime = 25 * 60;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const FULL_DASH_ARRAY = 2 * Math.PI * 100; // 2πr, r=100
const progressBar = document.getElementById('progress-bar');

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
  updateProgress();
}

function updateProgress() {
  const progress = timeLeft / totalTime;
  document.getElementById('progress-bar').style.width = `${progress * 100}%`;
}

function updateButtons() {
  startBtn.disabled = isRunning;
  pauseBtn.disabled = !isRunning;
  presetButtons.forEach(btn => {
    btn.disabled = isRunning;
    btn.classList.toggle('active', !isRunning && totalTime / 60 === Number(btn.dataset.minutes));
  });
  if (isRunning) {
    startBtn.classList.add('active');
  } else {
    startBtn.classList.remove('active');
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  updateButtons();
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
      localStorage.setItem('pomodoroTimeLeft', timeLeft); // persist
    } else {
      clearInterval(timer);
      isRunning = false;
      updateButtons();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  updateButtons();
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = totalTime;
  isRunning = false;
  updateDisplay();
  updateButtons();
}

const presetButtons = document.querySelectorAll('.preset-time');

function setTimer(minutes) {
  clearInterval(timer);
  timeLeft = minutes * 60;
  totalTime = minutes * 60;
  isRunning = false;
  updateDisplay();
  updateButtons();
  localStorage.setItem('pomodoroTimeLeft', timeLeft);
  localStorage.setItem('pomodoroTotalTime', totalTime);
}

presetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!isRunning) { // Only allow changing timer when not running
      setTimer(Number(btn.dataset.minutes));
    }
  });
});

// Call updateButtons() after DOM loads and after each state change
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
updateDisplay();
updateButtons();
updateProgress();

// Restore timer from localStorage if available
const saved = localStorage.getItem('pomodoroTimeLeft');
if (saved !== null) {
  timeLeft = parseInt(saved, 10);
  updateDisplay();
}

// On page load, restore totalTime if present
const savedTotal = localStorage.getItem('pomodoroTotalTime');
if (savedTotal !== null) {
  totalTime = parseInt(savedTotal, 10);
}
