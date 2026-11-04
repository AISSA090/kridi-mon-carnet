// Karni — point d'entrée, chargé comme module ES (<script type="module">).
// Lis d'abord le format des données (brief) et le HTML fourni, puis découpe ton code en modules
// (state.js, storage.js, validation.js, calculs.js, ui.js) que tu importes ici.



import { sauvegarder, charger } from "./storage.js";
import { ajouterClient, clients } from "./validation.js";

const resultat = charger();
const sauvegarde = sauvegarder(data);
const data = resultat.data;


data.clients.push(...clients);
sauvegarde
clients.length = 0;



