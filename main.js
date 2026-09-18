import { setMotorState, listenMotorState } from "./fbService.js";

const startButton = document.getElementById("startButton");
const buttonLabel = document.getElementById("buttonLabel");
const result = document.getElementById("result");
const speechStatus = document.getElementById("speechStatus");
const motorStatus = document.getElementById("motorStatus");
const motorIndicator = document.getElementById("motorIndicator");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function updateMotorStatus(state) { const isOn = state === 1 || state === true || state === "1"; motorStatus.textContent = isOn ? "Dispositivo ligado" : "Dispositivo desligado"; motorIndicator.className = `indicator ${isOn ? "on" : "off"}`; }
function normalize(text) { return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); }

listenMotorState((state) => updateMotorStatus(state), (error) => { console.error("Erro ao acompanhar o estado:", error); motorStatus.textContent = "Sem conexão com o dispositivo"; speechStatus.textContent = "Não foi possível consultar o Firebase."; });

if (!SpeechRecognition) { startButton.disabled = true; speechStatus.textContent = "O reconhecimento de voz não é compatível com este navegador."; }
else {
    const recognition = new SpeechRecognition(); recognition.lang = "pt-BR"; recognition.interimResults = false; recognition.maxAlternatives = 1;
    recognition.onstart = () => { startButton.disabled = true; startButton.classList.add("listening"); buttonLabel.textContent = "Ouvindo…"; speechStatus.textContent = "Fale “ligar” ou “desligar”."; };
    recognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript; result.textContent = transcript; const command = normalize(transcript);
        const state = /\b(desligar|desliga|apagar|apaga)\b/.test(command) ? 0 : /\b(ligar|liga|acender|acende)\b/.test(command) ? 1 : null;
        if (state === null) { speechStatus.textContent = "Não reconheci um comando. Tente “ligar” ou “desligar”."; return; }
        speechStatus.textContent = "Enviando comando…";
        try { await setMotorState(state); speechStatus.textContent = state ? "Comando para ligar enviado." : "Comando para desligar enviado."; } catch (error) { console.error("Erro ao atualizar o dispositivo:", error); speechStatus.textContent = "Não foi possível enviar o comando. Verifique a conexão."; }
    };
    recognition.onerror = (event) => { const messages = { "not-allowed": "Permita o uso do microfone para continuar.", "no-speech": "Não ouvi nada. Tente novamente.", network: "Falha de rede no reconhecimento de voz." }; speechStatus.textContent = messages[event.error] || "Ocorreu um erro ao reconhecer a fala."; };
    recognition.onend = () => { startButton.disabled = false; startButton.classList.remove("listening"); buttonLabel.textContent = "Falar"; };
    startButton.addEventListener("click", () => recognition.start());
}
