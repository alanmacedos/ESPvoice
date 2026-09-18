// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

// Configuração do Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCw4vQ3ds1KMaFUpStquQwdSyUAXdQzV_c",
  authDomain: "temperaturecheck-a7073.firebaseapp.com",
  databaseURL: "https://temperaturecheck-a7073-default-rtdb.firebaseio.com/",
  projectId: "temperaturecheck-a7073",
  storageBucket: "temperaturecheck-a7073.firebasestorage.app",
  messagingSenderId: "999459268434",
  appId: "1:77209930508:web:5febc2d0d6d6c9570f5729",
  measurementId: "1:999459268434:web:b43e308869466c81f3fc8b"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exporta apenas o banco de dados
export { database };