import { set, ref, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { database } from "./fbConfig.js";

const motorRef = ref(database, "motor/state");

function setMotorState(state) {
    return set(motorRef, Number(state));
}

export function listenMotorState(callback, onError) {
    return onValue(motorRef, (snapshot) => {
        callback(snapshot.val());
    }, onError);
}

export { setMotorState };
