import { validateUsername } from "./identity.js";

// --------- Handle User

// User Score
let username = ``;
let score = 0;

// Get the username from URL parameter
const getParameterByName = (name) =>
  new URLSearchParams(window.location.search).get(name) || "";

// Get the username from URL parameter
username = getParameterByName("username");
// Validate the username if it was manualy changed
if (!(await validateUsername(username)))
  window.location.replace(`../identity/identity.html`);

// Stop the access of the user to the main without being set their name
if (window.location.pathname.endsWith(`/main.html`) && username == "") {
  window.location.replace(`../identity/identity.html`);
}

// Initialize the static values for the page
const colourSets = {
  special: [
    "#FFC300",
    "#DAF7A6",
    "#9f002e",
    "#FF7650",
    "#4069e6",
    "#FFC300",
    "#797676",
    "#faebef",
    "#7c8962",
    "#FF5741",
  ],
  common: [
    "#66CCFF",
    "#66FF99",
    "#c70039",
    "#FF6666",
    "#3366FF",
    "#ffc91a",
    "#787676",
    "#fbeef1",
    "#7d8962",
    "#FF5740",
  ],
};
const testPartsHeadingNumbers = [`I`, `II`];
const questionDifficultiesPart2 = [
  `[Easy]`,
  `[Easy]`,
  `[Easy]`,
  `[Medium]`,
  `[Medium]`,
  `[Medium]`,
  `[Hard]`,
  `[Hard]`,
  `[Hard]`,
  `[Extreme]`,
];

// Generator of random numbers -- for the answers of the test part 2
function generateRandomNumbers() {
  const numbers = [];
  for (let i = 0; i < 10; i++) numbers.push(Math.floor(Math.random() * 4) + 1);

  return numbers;
}

const testAnswersPart1ByImages = [74, 16, 4, 6, 6, 9, 1, 2, 5, 2];

const shuffle = (array) => array.sort(() => Math.random() - 0.5);
const testAnswersPart1Order = shuffle(
  Array.from({ length: 10 }, (_, index) => index + 1)
); // All images Selection is by numbers[1..10] suffled

const partOneKey = [];
for (let index = 0; index < testAnswersPart1ByImages.length; index++)
  partOneKey[index] =
    testAnswersPart1ByImages[testAnswersPart1Order[index] - 1];

// Generate randow answers for the test
const testAnswers = partOneKey.concat(generateRandomNumbers());
console.log(testAnswers);

// --------- Handle Page

// Retrieve a reference the test form
const test = document.getElementById(`test`);

// Generate Test Parts
for (let sectionIndex = 1; sectionIndex <= 2; sectionIndex++) {
  // Initialize a new section
  const testSection = document.createElement(`section`);

  // Initialize the part heading
  const heading = document.createElement(`h2`);
  heading.className = `testPart`;
  heading.innerText = `Part ${testPartsHeadingNumbers[sectionIndex - 1]}`;

  // Append the heading and a horizontal rule
  testSection.appendChild(heading);
  testSection.appendChild(document.createElement(`hr`));

  // Generate Test Questions Per Part
  for (let index = 1; index <= 10; index++) {
    // Generate a new question an initialize 4 answers for each of them [calling the function generateAnswers with 4]
    const question = document.createElement(`section`);
    question.className = `questionBox`;
    question.innerHTML = ` ${sectionIndex === 2 ? `` : ``}
        
        ${sectionIndex == 2 ? `` : ``}
        
      `;

    question.innerHTML =
      sectionIndex == 1
        ? `<h2 class="questionNumber">Question ${index}:</h2>
    <h4>What is written in the image?</h4>
    <div class="imgBox">
      <img src="../main/test images/${testAnswersPart1Order[index - 1]}.png" />
    </div>
    <p class="task">Type your answer below:</p>
        <input type="text" class="userPrompt" />
    `
        : ` <h2 class="questionNumber">Question ${index} ${
            questionDifficultiesPart2[index - 1]
          }:</h2>
            <h4>Which field has different colour?</h4>
            <div class="colourBox">
              ${generateColourCells(4, index)}
            </div>
            <p class="task">Select the correct answer:</p>
            <div class="answersBox">
              ${generateAnswers(sectionIndex, index, 4)}
            </div>`;

    // Append the section
    testSection.appendChild(question);
    test.appendChild(testSection);
  }
}

// Generate a submit button
const handInButton = document.createElement(`button`);
handInButton.id = `handInButton`;
handInButton.className = `submitBTN`;
handInButton.type = `submit`;
handInButton.innerText = `Submit`;

// Appent the button
test.appendChild(handInButton);

const mainForm = document.getElementById(`test`);
mainForm.onsubmit = function (event) {
  event.preventDefault();
  // Retrieve all answers boxes
  const answerBoxes = document.querySelectorAll(".answersBox");

  // Iterate through each answers box
  for (let index = 0; index < answerBoxes.length; index++) {
    // Retrieve all radio buttons within the current answers box
    const radioButtons = answerBoxes[index].querySelectorAll(
      'input[type="radio"]'
    );
    let selectedValue = null;

    // Iterate through each radio button
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        // Retrieve the value of the selected radio button
        selectedValue = parseInt(radioButton.value);
      }
    });

    // Check if the selected value matches
    if (selectedValue === testAnswers[index + 10]) score++;
  }

  const userArguments = document.querySelectorAll(".userPrompt");
  for (let index = 0; index < userArguments.length; index++) {
    if (parseInt(userArguments[index].value) === testAnswers[index]) score++;
  }

  alert(score);
  window.location.replace(`../leaderboard/leaderboard.html`);
};

// Generator for the answers HTML fields
function generateAnswers(section, question, answersCount) {
  let result = ``;
  for (let index = 1; index <= answersCount; index++) {
    result += `<div class="answer">
                  <input type="radio" id="s${section}_q${question}_option${index}" name="s${section}_q${question}_answer" value="${index}" />
                  <label for="s${section}_q${question}_option${index}">${index}</label>
               </div>`;
  }

  return result;
}

// Generator for the colour cells int the qustions
function generateColourCells(cellsCount, currentQuestion) {
  let result = ``;
  for (let index = 1; index <= cellsCount; index++) {
    if (testAnswers[currentQuestion - 1 + 10] === index) {
      result += `<div class="colourCell" style="background-color: ${
        colourSets.special[currentQuestion - 1]
      };">${index}</div>`;
    } else {
      result += `<div class="colourCell" style="background-color: ${
        colourSets.common[currentQuestion - 1]
      };">${index}</div>`;
    }
  }

  return result;
}

// Score calculator
function calculateScore(points, time) {
  const timeScore = 0.5 * time;
  const score = (points / timeScore) * 1000;
  return score;
}
