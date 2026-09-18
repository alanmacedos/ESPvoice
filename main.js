const startButton = document.getElementById("startButton");
const result = document.getElementById("result");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "pt-BR";

recognition.onresult = (event) => {

    const texto = event.results[0][0].transcript;

    result.textContent = texto;
};

startButton.addEventListener("click", () => {
    recognition.start();
});