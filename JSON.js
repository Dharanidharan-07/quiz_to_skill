const quizQuestions = [ /* 20 MCQs as shown earlier */ ];
let currentQuestion = 0;
let score = 0;
let selectedOptions = Array(quizQuestions.length).fill(null);
let timeElapsed = 0;
let timerInterval;

// Handle Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';
  displayQuiz();
  timerInterval = setInterval(updateTimer, 1000);
});

function displayQuiz() {
  const quizElement = document.getElementById('quiz');
  let quizContent = '';

  quizQuestions.forEach((question, index) => {
    quizContent += `<div class="question-container" style="display:${index === currentQuestion ? 'block' : 'none'};">
      <div class="question">${index + 1}. ${question.question}</div>
      <div class="options">`;

    question.options.forEach(option => {
      quizContent += `
        <div class="option">
          <input type="radio" id="q${index}-${option}" name="question${index}" value="${option}" onchange="saveAnswer(${index}, '${option}')">
          <label for="q${index}-${option}">${option}</label>
        </div>`;
    });

    quizContent += `</div></div>`;
  });

  quizElement.innerHTML = quizContent;
  updateProgressBar();
}

function saveAnswer(questionIndex, option) {
  selectedOptions[questionIndex] = option;
}

function nextQuestion() {
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    showQuestion(currentQuestion);
  }
  updateProgressBar();
}

function showQuestion(index) {
  const allQuestions = document.querySelectorAll('.question-container');
  allQuestions.forEach((el, i) => {
    el.style.display = i === index ? 'block' : 'none';
  });
  document.getElementById('question-number').textContent = `Question ${index + 1} of ${quizQuestions.length}`;
}

function updateProgressBar() {
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  document.getElementById('progress-bar-fill').style.width = `${progress}%`;
}

function updateTimer() {
  timeElapsed++;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.getElementById('next').addEventListener('click', nextQuestion);

document.getElementById('submit').addEventListener('click', () => {
  if (confirm('Are you sure you want to submit your answers?')) {
    showResults();
  }
});

function calculateScore() {
  score = 0;
  quizQuestions.forEach((question, i) => {
    if (selectedOptions[i] === question.answer) score++;
  });
  return score;
}

function showResults() {
  clearInterval(timerInterval);
  const score = calculateScore();
  document.getElementById('quiz-container').style.display = 'none';
  const name = document.getElementById('name').value;
  const rollno = document.getElementById('rollno').value;
  const email = document.getElementById('email').value;

  document.getElementById('user-details').innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Roll No:</strong> ${rollno}</p>
    <p><strong>Email:</strong> ${email}</p>`;
  document.getElementById('final-score').innerHTML = `<h3>Your Score: ${score}/${quizQuestions.length}</h3>`;
  document.getElementById('results-container').style.display = 'block';

  // Confetti or animation logic could be added here
  setTimeout(() => window.location.reload(), 10000); // redirect to login
}

function shareResults() {
  const score = calculateScore();
  const shareText = `I scored ${score}/${quizQuestions.length} in Skill Diet Quiz! Try it here: [your_site_url]`;
  if (navigator.share) {
    navigator.share({
      title: 'Skill Diet Quiz Score',
      text: shareText,
      url: window.location.href
    });
  } else {
    window.location.href = `mailto:?subject=Skill Diet Quiz Score&body=${encodeURIComponent(shareText)}`;
  }
}
