// Karni — point d'entrée, chargé comme module ES (<script type="module">).
// Lis d'abord le format des données (brief) et le HTML fourni, puis découpe ton code en modules
// (state.js, storage.js, validation.js, calculs.js, ui.js) que tu importes ici.

import { sauvegarder, charger } from "./storage.js";
import { afficherClient } from "./Statuts.js";
import { clients } from "./state.js";

// const btnajout = document.getElementById('nouveau-client');


const resultat = charger();
const data = resultat.data;

const erreur = document.getElementById("erreur-stockage");

if (resultat.erreur1) {
    erreur.classList.remove("hidden");
    erreur.textContent = "Impossible de lire les données!";
}


data.clients.forEach(client => {
    afficherClient(client);
});



document.addEventListener("client-ajoute", function(){

    console.log("1. Data au chargement :", data);
    console.log("2. Clients avant push :", clients);

    const nouveauClients = [...clients];
    data.clients.push(...nouveauClients);

    console.log("3. Data après push :", data.clients);
    const sauvegarde = sauvegarder(data);

    const erreur = document.getElementById("erreur-stockage");

    if (sauvegarde){
        nouveauClients.forEach(client => {
            afficherClient(client);
        });
        clients.length = 0;
        erreur.classList.add("hidden");
        
     } else {
        erreur.classList.remove("hidden");
        erreur.textContent = "Attention: Impossible de sauvegarder les données. Vos modifications risquent de ne pas etre sauvegarder!";
    }
     console.log("4. Résultat sauvegarde :", sauvegarde);
})


// btnajout.addEventListener("click", function(){
//     for (let i = 0; i < data.clients.length; i++) {
//       afficherClient(data.clients[i])
//     };
// })


