const nullthrows = (v) => {
    if (v == null) throw new Error("it's a null");
    return v;
}

function injectCode(src) {
    const script = document.createElement('script');
    // This is why it works!
    script.src = src;
    script.onload = function() {
        console.log("script injected");
        // this.remove();
    };

    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script);
}

injectCode(chrome.runtime.getURL('tfjs.js'));
injectCode(chrome.runtime.getURL('qna.js'));

var addQAInterval = setInterval(tryAddQADiv, 1000);

function tryAddQADiv() {
    const host = document.querySelector('#topicContent');
    if (host === null) return;

    const qaDiv = document.createElement('div');
    qaDiv.innerHTML = `
        <div>
            <input type="text" id="qna-question-box" /><input type="submit" id="qna-submit-btn" />
            <script id="qna-fxn-loader">
            </script>
        </div>
        <p id="qna-answer-box">Type a question to start</p>`;
    host.prepend(qaDiv);
    injectCode(chrome.runtime.getURL('atq.js'));
    // qaDiv.querySelector('input[type="submit"]').onclick = answerTheQuestion;
    clearInterval(addQAInterval);
}

// async function answerTheQuestion() {
//     document.querySelector('#qna-answer-box').textContent = 'Thinking...';
//     const qna = await ExtractPageVariable('qna').data;
//     const model = await qna.load();
//     const question = document.querySelector('qna-question-box').value;
//     const passage = document.querySelector('#topicText').textContent;
//     const answers = await model.findAnswers(question, passage);
//     console.log(answers);
// }


// class ExtractPageVariable {
//     constructor(variableName) {
//       this._variableName = variableName;
//       this._handShake = this._generateHandshake();
//       this._inject();
//       this._data = this._listen();
//     }
  
//     get data() {
//       return this._data;
//     }
  
//     // Private
  
//     _generateHandshake() {
//       const array = new Uint32Array(5);
//       return window.crypto.getRandomValues(array).toString();
//     }
  
//     _inject() {
//       function propagateVariable(handShake, variableName) {
//         const message = { handShake };
//         message[variableName] = window[variableName];
//         window.postMessage(message, "*");
//       }
  
//       const script = `( ${propagateVariable.toString()} )('${this._handShake}', '${this._variableName}');`
//       const scriptTag = document.createElement('script');
//       const scriptBody = document.createTextNode(script);
  
//       scriptTag.id = 'chromeExtensionDataPropagator';
//       scriptTag.appendChild(scriptBody);
//       document.body.append(scriptTag);
//     }
  
//     _listen() {
//       return new Promise(resolve => {
//         window.addEventListener("message", ({data}) => {
//           // We only accept messages from ourselves
//           if (data.handShake != this._handShake) return;
//           resolve(data);
//         }, false);
//       })
//     }
//   }
  
//   const windowData = new ExtractPageVariable('somePageVariable').data;
//   windowData.then(console.log);
//   windowData.then(data => {
//      // Do work here
//   });
