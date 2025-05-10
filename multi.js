const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");
const quizContainer = document.getElementById("quizContainer");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const summaryEl = document.getElementById("summary");

let correctCount = 0;
let totalCount = 0;
let startTime = null;
let questionStart = null;
let totalTime = 0;
let streakCount = 0;
let longestStreak = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startSession() {
  correctCount = 0;
  totalCount = 0;
  totalTime = 0;
  startTime = Date.now();
  questionStart = Date.now();
  scoreEl.innerText = `Score: 0 / 0`;

  startBtn.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  summaryEl.classList.add("hidden");
  streakCount = 0;
  document.getElementById("streak").innerText = "";

  nextQuestion();
}

function endSession() {
  const endTime = Date.now();
  const avgTime = totalCount > 0 ? (totalTime / totalCount / 1000).toFixed(2) : 0;
  const percent = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : 0;

  quizContainer.classList.add("hidden");
  summaryEl.classList.remove("hidden");

  summaryEl.innerHTML = `
    <h2>🏁 Session Summary</h2>
    <p>Total Questions: ${totalCount}</p>
    <p>Total Correct: ${correctCount}</p>
    <p>Percentage Correct: ${percent}% ${percent >= 90 ? '🎉' : percent >= 50 ? '👍' : '🤮'}</p>
    <p>Avg Time / Question: ${avgTime} s ⏱️</p>
    <p>Longest Streak: ${longestStreak} 🔥</p>
    <div>
      <button class="button" onclick="startSession()">Play Again</button>
      <button class="button" onclick="window.location.href='index.html'">Main Menu</button>
    </div>
  `;
}

function nextQuestion() {
  questionStart = Date.now();
  const allowedNumbers = [7, 13, 17, 19];
  const num1 = allowedNumbers[Math.floor(Math.random() * allowedNumbers.length)];
  const num2 = getRandomInt(2, 20);
  const correct = num1 * num2;
  const lastDigit = correct % 10;

  let wrong1, wrong2;

  function generateTrickyWrong() {
    let val;
    do {
      const offset = getRandomInt(-30, 30);
      val = correct + offset;
    } while (
      val === correct || val < 0 || (val % 10 !== lastDigit)
    );
    return val;
  }

  wrong1 = generateTrickyWrong();
  do {
    wrong2 = generateTrickyWrong();
  } while (wrong2 === wrong1);

  const options = [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);

  const asking_way = getRandomInt(0, 1);
  questionEl.innerText = `What is ${asking_way === 1 ? num1 : num2} × ${asking_way === 1 ? num2 : num1}?`;

  optionsEl.innerHTML = "";
  feedbackEl.innerText = "";

  function triggerCorrectExplosion() {
    const explosion = document.getElementById("correctExplosion");
    explosion.classList.remove("active");
    void explosion.offsetWidth;
    explosion.classList.add("active");
  }

  function triggerWrongExplosion(correctOption) {
    const explosion = document.getElementById("wrongExplosion");
    explosion.classList.remove("active");
    void explosion.offsetWidth;
    explosion.classList.add("active");

    const correctBtn = document.querySelector(`[data-answer='${correctOption}']`);
    if (correctBtn) {
      correctBtn.classList.add("highlightCorrect");
    }

    setTimeout(() => {
      if (correctBtn) {
        correctBtn.classList.remove("highlightCorrect");
      }
    }, 1500);
  }

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = opt;
    btn.setAttribute("data-answer", opt);

    btn.onclick = () => {
      const timeTaken = Date.now() - questionStart;
      totalTime += timeTaken;
      totalCount++;

      optionsEl.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
      });

      if (opt === correct) {
        correctCount++;
        streakCount++;
        longestStreak = Math.max(longestStreak, streakCount);
        triggerCorrectExplosion();
      } else {
        streakCount = 0;
        triggerWrongExplosion(correct);
      }

      scoreEl.innerText = `Score: ${correctCount} / ${totalCount}`;

      const streakEl = document.getElementById("streak");
      if (streakCount >= 2) {
        streakEl.innerHTML = `<img src="fire_long.gif" style="height: 85px; width: auto; vertical-align: middle;"> x${streakCount}`;
      } else {
        streakEl.innerText = "";
      }

      if (opt === correct) {
        setTimeout(nextQuestion, 500);
      } else {
        setTimeout(nextQuestion, 1000);
      }
    };

    optionsEl.appendChild(btn);
  });
}

startBtn.onclick = startSession;
endBtn.onclick = endSession;
