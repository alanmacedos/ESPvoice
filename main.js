import { setMotorState, listenMotorState } from "./fbService.js";

const startButton = document.getElementById("startButton");
const result = document.getElementById("result");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "pt-BR";

recognition.onresult = (event) => {

    const texto = event.results[0][0].transcript;

    result.textContent = texto;

    // const text = texto.toLowerCase();
    const text = texto.trim();

    if (text.includes("Ligar") || text.includes("Liga")) {

        setMotorState(1)
            .then(() => {
                console.log("Luz ligada. Enviando: 1");

            })
            .catch((error) => {
                console.error("Erro ao ligar o motor:", error);
            });
    }
};

startButton.addEventListener("click", () => {
    recognition.start();
});