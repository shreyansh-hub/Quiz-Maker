let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
let currentUserId = localStorage.getItem('currentUserId') || uuid.v4();
localStorage.setItem('currentUserId', currentUserId);

const quizCreator = document.getElementById('quiz-creator');
const quizList = document.getElementById('quiz-list');
const quizTaker = document.getElementById('quiz-taker');
const quizResults = document.getElementById('quiz-results');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question');
const saveQuizBtn = document.getElementById('save-quiz');
const quizzesList = document.getElementById('quizzes');
const currentQuizTitle = document.getElementById('current-quiz-title');
const questionContainer = document.getElementById('question-container');
const submitQuizBtn = document.getElementById('submit-quiz');
const scoreElement = document.getElementById('score');
const backToListBtn = document.getElementById('back-to-list');

function addQuestion() {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.innerHTML = `
        <input type="text" class="question-text" placeholder="Question">
        <input type="text" class="option" placeholder="Option 1">
        <input type="text" class="option" placeholder="Option 2">
        <input type="text" class="option" placeholder="Option 3">
        <input type="text" class="option" placeholder="Option 4">
        <select class="correct-answer">
            <option value="0">Option 1</option>
            <option value="1">Option 2</option>
            <option value="2">Option 3</option>
            <option value="3">Option 4</option>
        </select>
        <button class="remove-question">Remove Question</button>
    `;
    questionDiv.querySelector('.remove-question').addEventListener('click', function() {
        questionsContainer.removeChild(questionDiv);
    });
    questionsContainer.appendChild(questionDiv);
}

function saveQuiz() {
    const title = document.getElementById('quiz-title').value;
    if (!title) {
        alert("Please enter a quiz title.");
        return;
    }
    const questions = Array.from(document.getElementsByClassName('question')).map(q => ({
        question: q.querySelector('.question-text').value,
        options: Array.from(q.querySelectorAll('.option')).map(o => o.value),
        correctAnswer: parseInt(q.querySelector('.correct-answer').value)
    }));
    if (questions.length === 0) {
        alert("Please add at least one question.");
        return;
    }
    quizzes.push({ 
        title, 
        questions, 
        creatorId: currentUserId 
    });
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    updateQuizList();
    resetQuizCreator();
}

function updateQuizList() {
    quizzesList.innerHTML = '';
    quizzes.forEach((quiz, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${quiz.title}</span>
            <button class="take-quiz">Take Quiz</button>
            ${quiz.creatorId === currentUserId ? '<button class="delete-quiz">Delete</button>' : ''}
        `;
        li.querySelector('.take-quiz').addEventListener('click', () => startQuiz(index));
        if (quiz.creatorId === currentUserId) {
            li.querySelector('.delete-quiz').addEventListener('click', () => deleteQuiz(index));
        }
        quizzesList.appendChild(li);
    });
}

function deleteQuiz(index) {
    if (confirm('Are you sure you want to delete this quiz?')) {
        quizzes.splice(index, 1);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        updateQuizList();
    }
}

function resetQuizCreator() {
    document.getElementById('quiz-title').value = '';
    questionsContainer.innerHTML = '';
}

function startQuiz(index) {
    const quiz = quizzes[index];
    currentQuizTitle.textContent = quiz.title;
    questionContainer.innerHTML = '';
    quiz.questions.forEach((q, i) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `
            <p>${q.question}</p>
            ${q.options.map((option, j) => `
                <label>
                    <input type="radio" name="q${i}" value="${j}">
                    ${option}
                </label>
            `).join('')}
        `;
        questionContainer.appendChild(questionDiv);
    });
    quizCreator.style.display = 'none';
    quizList.style.display = 'none';
    quizTaker.style.display = 'block';
}

function submitQuiz() {
    const quiz = quizzes.find(q => q.title === currentQuizTitle.textContent);
    let score = 0;
    quiz.questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && parseInt(selected.value) === q.correctAnswer) {
            score++;
        }
    });
    scoreElement.textContent = `You scored ${score} out of ${quiz.questions.length}`;
    quizTaker.style.display = 'none';
    quizResults.style.display = 'block';
}

function backToList() {
    quizResults.style.display = 'none';
    quizList.style.display = 'block';
    quizCreator.style.display = 'block';
}

addQuestionBtn.addEventListener('click', addQuestion);
saveQuizBtn.addEventListener('click', saveQuiz);
submitQuizBtn.addEventListener('click', submitQuiz);
backToListBtn.addEventListener('click', backToList);

updateQuizList();

// function deleteAllQuizzes() {
//     localStorage.removeItem('quizzes');
//     quizzes = [];
//     updateQuizList();
// }
// const deleteAllQuizzesBtn = document.getElementById('delete-all-quizzes');
// deleteAllQuizzesBtn.addEventListener('click', deleteAllQuizzes);