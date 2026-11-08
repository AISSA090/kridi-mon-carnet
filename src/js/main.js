// Karni — point d'entrée, chargé comme module ES (<script type="module">).
// Lis d'abord le format des données (brief) et le HTML fourni, puis découpe ton code en modules
// (state.js, storage.js, validation.js, calculs.js, ui.js) que tu importes ici.

import { sauvegarder, charger } from "./storage.js";
import { afficherClient } from "./Statuts.js";
import { clients, operations } from "./state.js";
import { creerDemo } from "./demo.js";

// const btnajout = document.getElementById('nouveau-client');


const resultat = charger();
const data = resultat.data;

operations.push(...data.operations);

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

document.addEventListener("client-supprime", function(e) {
    const id = e.detail;
    const index = data.clients.findIndex(c => c.id === id);

    if (index !== -1) {
        data.clients.splice(index, 1); 
        sauvegarder(data);
        location.reload(); 
    }
});

document.addEventListener("client-modifie", function(e) {
    const id = e.detail;
    const clientAModifier = data.clients.find(c => c.id === id);

    if (clientAModifier) {
        document.getElementById('dialog-client-titre').textContent = "Modifier le client";
        document.getElementById('client-id').value = clientAModifier.id;
        document.getElementById('client-nom').value = clientAModifier.nom;
        document.getElementById('client-telephone').value = clientAModifier.telephone;
        document.getElementById('client-plafond').value = (clientAModifier.plafond / 100).toString().replace('.', ',');
        document.getElementById('dialog-client').showModal();
    }
});

document.addEventListener("client-modifie-sauvegarde", function(e) {
    const infos = e.detail;
    const client = data.clients.find(c => c.id === infos.id);

    if (client) {
        client.nom = infos.nom;
        client.telephone = infos.telephone;
        client.plafond = infos.plafond;
        sauvegarder(data);
        location.reload(); 
    }
});

// btnajout.addEventListener("click", function(){
//     for (let i = 0; i < data.clients.length; i++) {
//       afficherClient(data.clients[i])
//     };
// })
























































































































































































































































const confirmationTitre = document.getElementById("confirmation-titre");
const confirmationMessage = document.getElementById("confirmation-message");
const confirmationDetails = document.getElementById("confirmation-details");
const btnChargerDemo = document.getElementById("charger-demo");
btnChargerDemo.addEventListener("click", function() {
    confirmationTitre.textContent = "Charger la démo";
    confirmationMessage.textContent = "Voulez-vous remplacer les données actuelles par les données de démonstration ?";
    confirmationDetails.textContent = "6 clients et 15 opérations seront chargés";
    dialogConfirmation.dataset.action = "charger-demo";
    dialogConfirmation.showModal();
});

const dialogConfirmation = document.getElementById("dialog-confirmation");
const listeClients = document.getElementById("liste-clients");
dialogConfirmation.addEventListener("close", function() {
    if (dialogConfirmation.returnValue === "valider" && dialogConfirmation.dataset.action === "charger-demo") {
        const demo = creerDemo();
        data.clients = demo.clients;
        data.operations = demo.operations;
        operations.length = 0;
        operations.push(...demo.operations);
        const sauvegarde = sauvegarder(data);
        if (sauvegarde === true) {
            listeClients.textContent = "";
            location.reload();
        }
        else {
            erreur.classList.remove("hidden");
            erreur.textContent = "Impossible de sauvegarder les données de démonstration";
        }
    }
    else if (dialogConfirmation.returnValue === "valider" && dialogConfirmation.dataset.action === "vider-carnet") {
        data.clients = [];
        data.operations = [];
        clients.length = 0;
        operations.length = 0;
        const sauvegarde = sauvegarder(data);
        if (sauvegarde === true) {
            listeClients.textContent = "";
            location.reload();
        } 
        else {
            erreur.classList.remove("hidden");
            erreur.textContent = "Impossible de vider le carnet.";
        }
    }
});

const btnViderCarnet = document.getElementById("vider-carnet");
btnViderCarnet.addEventListener("click", function() {
    confirmationTitre.textContent = "Vider le carnet";
    confirmationMessage.textContent = "Voulez-vous vraiment supprimer tous les clients et toutes les opérations ?";
    confirmationDetails.textContent = "Cette action supprimera toutes les données du carnet";
    dialogConfirmation.dataset.action = "vider-carnet";
    dialogConfirmation.showModal();
});
const btnexport=document.getElementById('exporter')
btnexport.addEventListener('click',function(){
  data.exporteLe = new Date().toISOString();
  const texteJson = JSON.stringify(data, null, 2);
  const fichierBlob = new Blob([texteJson], { type: "application/json" });
  const urlFichier = URL.createObjectURL(fichierBlob);
  const lienTelechargement = document.createElement('a');
  lienTelechargement.href=urlFichier
  const dateDuJour = new Date().toISOString().split('T')[0];
  lienTelechargement.download="karni-"+dateDuJour+".json"
  lienTelechargement.click()
  URL.revokeObjectURL(urlFichier)
});