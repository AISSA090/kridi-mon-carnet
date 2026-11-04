// Karni — point d'entrée, chargé comme module ES (<script type="module">).
// Lis d'abord le format des données (brief) et le HTML fourni, puis découpe ton code en modules
// (state.js, storage.js, validation.js, calculs.js, ui.js) que tu importes ici.

import { sauvegarder, charger } from "./storage.js";
import {clients } from "./validation.js";


const resultat = charger();
const data = resultat.data;
const erreur = document.getElementById("erreur-stockage");

if (resultat.erreur1) {
    erreur.classList.remove("hidden");
    erreur.textContent = "Impossible de lire les données!";
}
document.addEventListener("client-ajoute", function(){

    console.log("1. Data au chargement :", data);
    console.log("2. Clients avant push :", clients);

    data.clients.push(...clients);
    console.log("3. Data après push :", data.clients);
    const sauvegarde = sauvegarder(data);
    console.log("4. Résultat sauvegarde :", sauvegarde);
    if (sauvegarde){
        clients.length = 0;
        erreur.classList.add("hidden");
     } else {
        erreur.classList.remove("hidden");
        erreur.textContent = "Attention: Impossible de sauvegarder les données. Vos modifications risquent de ne pas etre sauvegarder!";
    }
    console.log("4. Résultat sauvegarde :", sauvegarde);
})
// console.log(clients.value)
