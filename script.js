let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function updateButtons() {
  startBtn.disabled = isRunning;
  pauseBtn.disabled = !isRunning;
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
  timeLeft = 25 * 60;
  updateDisplay();
  isRunning = false;
  updateButtons();
  localStorage.removeItem('pomodoroTimeLeft');
}

// Call updateButtons() after DOM loads and after each state change
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
updateDisplay();
updateButtons();

// Restore timer from localStorage if available
const saved = localStorage.getItem('pomodoroTimeLeft');
if (saved !== null) {
  timeLeft = parseInt(saved, 10);
  updateDisplay();
}
