// Karni — point d'entrée, chargé comme module ES (<script type="module">).
// Lis d'abord le format des données (brief) et le HTML fourni, puis découpe ton code en modules
// (state.js, storage.js, validation.js, calculs.js, ui.js) que tu importes ici.

import {sauvegarder, charger } from "./storage.js";
import {ajouterClient } from "./validation.js";

const resultat = charger();
const data = resultat.data;

btnenrregistrer.addEventListener('click',function(){
 const erreur=document.querySelectorAll('[aria-invalid="true"]')

if (erreur.length===0){
    const change=plafond.value.replace(',','.')
    const plafondReel = parseFloat(change);
    const plafondEnCentimes = Math.round(plafondReel * 100);
    ajouterClient(clientname.value,clienttelephone.value,plafondEnCentimes,data.clients);
    const erreurstorage = document.getElementById("erreur-stockage");
    const result = sauvegarder(data);
    if (result){
        erreurstorage.classList.add("hidden");
     } else {
        erreurstorage.classList.remove("hidden");
        erreurstorage.textContent = "Attention: Impossible de sauvegarder les données. Vos modifications risquent de ne pas etre sauvegarder!";
    }
   
}

});



// lors de l'appelle du fonction sauvegarder()
// il faut appeler la fonction sauvegarder lors du fonction modifier 


// lors de l'appelle du fonction charger()

const erreurstorage = document.getElementById("erreur-stockage");
const resultat = charger();
const data = resultat.data;
if (resultat.erreur){
    erreurstorage.classList.remove("hidden");
    erreurstorage.textContent = "Impossible de lire les données!"
}

data.clients.push(ajouterclient);
data.operations.push(ajouteroperation);
sauvegarder(data);