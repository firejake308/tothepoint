var model = null;

const loadModelIvl = setInterval(tryLoadModel, 1000);
async function tryLoadModel() {
    if (!qna)
        return;
    
    clearInterval(loadModelIvl);
    model = await qna.load();
}

async function answerTheQuestion() {
    console.log('answering the question')
    document.querySelector('#qna-answer-box').textContent = 'Loading model...';
    if (!model) {
        model = await qna.load();
        clearInterval(loadModelIvl);
    }
    document.querySelector('#qna-answer-box').textContent = 'Processing question...';
    const question = document.querySelector('#qna-question-box').value;
    const passage = document.querySelector('#topicText').textContent;
    const answers = await model.findAnswers(question, passage);
    console.log(answers);
    let ansText = '';
    answers.forEach(ans => {ansText += ans.text + '<br>'});
    document.querySelector('#qna-answer-box').innerHTML = ansText;
}

document.querySelector('#qna-submit-btn').onclick = answerTheQuestion;