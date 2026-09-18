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

    if (result.includes("ligar") || result.includes("liga")) {

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