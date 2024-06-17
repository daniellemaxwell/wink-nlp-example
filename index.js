const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-web-model');
const nlp = winkNLP(model);

const its = nlp.its;

const text = document.getElementById('text-input')
const submitBttn = document.getElementById('text-submit-bttn')
const readingStats = document.getElementById('reading-stats')
const highlightedText = document.getElementById('highlighted-text')


// Get text from the input field.
submitBttn.addEventListener('click', (e) => {
  e.preventDefault()
  const textInput = text.value
  const doc = nlp.readDoc(textInput);

  // Clear the form input.
  text.value = '';

  // Get readability stats for the text input.
  const readabilityStats = doc.out(its.readabilityStats);

  readingStats.insertAdjacentHTML('afterbegin', `
  <h2>Readability Stats</h2>
  <li>Flesch Reading Ease Score: ${readabilityStats.fres}</li>
  <li>Reading Time: ${readabilityStats.readingTimeMins} minutes and ${readabilityStats.readingTimeSecs} seconds</li>
  <li>Sentiment: ${readabilityStats.sentiment}</li>
  <li>Word Count: ${readabilityStats.numOfWords}</li>
  <li>Sentence Count: ${readabilityStats.numOfSentences}</li>
  <li>Complex Words Count: ${readabilityStats.numOfComplexWords}</li>
`);

  // Loop through the complex words object inside the readability stats object to display the complex words.
  const complexWords = readabilityStats.complexWords
  let complexWordsList = []
  for (let word in complexWords) {
    // Add the complex word to the complexWordsList array.
    complexWordsList.push(word.toLowerCase())
  };

  const textList = textInput.split(' ');
  textList.forEach((word, idx) => {
    // Remove any special characters from the word.
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    if (complexWordsList.includes(cleanWord.toLowerCase())) {
      textList[idx] = `<span class="complex-word">${word}</span>`
    }
  })

  const modifiedText = textList.join(' ');
  highlightedText.innerHTML = modifiedText;
})