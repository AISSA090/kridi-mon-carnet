import { creerDemo } from './demo.js';
import { sauvegarder, charger } from "./storage.js";
import { afficherFicheClient, afficherHistorique } from "./ui.js";
const resultat = charger();
const data = resultat.data;
// const operations = resultat.operations;

const nbClients = document.getElementById('nb-clients');
const nbDette = document.getElementById('nb-en-dette');
const nbRetard = document.getElementById('nb-en-retard');
const etat = document.getElementById('etat-vide');
const toutal = document.getElementById('total-du')

  const date = new Date();
  date.setDate(date.getDate() - 30);
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  
  const fulldate = `${date.getFullYear()}-${mois}-${jour}`;

export function statuts(clients) {
  
    if (clients.length > 0) {
      etat.classList.add('hidden')
    } else {
      etat.classList.remove('hidden')
    }

    nbClients.textContent = clients.length;
    
    let datte = 0;
    let retard = 0;
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].creeLe < fulldate) {
          retard++;
      } else if (clients[i].creeLe > fulldate) {
          datte++;
      }
      
    }
    
    nbDette.textContent = datte
    nbRetard.textContent = retard
}

statuts(data.clients)



export function total(totalDH) {
  let tota = 0;

      for (let i = 0; i < totalDH.length; i++) {
        if (totalDH[i].type === "achat") {
            tota += totalDH[i].montant
        }
        
      }
      for (let i = 0; i < totalDH.length; i++) {
        if (totalDH[i].type === "remboursement") {
            tota -= totalDH[i].montant
        }
        
      }
      
let formattedTotal = (tota / 100).toFixed(2).replace('.', ',');

toutal.textContent = formattedTotal + " MAD"
}

total(data.operations)


export function calculerSoldesClients(operations) {
    const soldesParClient = {};

    operations.forEach(op => {
        if (!soldesParClient[op.clientId]) {
            soldesParClient[op.clientId] = 0;
        }
        if (op.type === "achat") {
            soldesParClient[op.clientId] += op.montant;
        } else if (op.type === "remboursement") {
            soldesParClient[op.clientId] -= op.montant;
        }
    });

    const resultatArray = Object.keys(soldesParClient).map(clientId => {
        return {
            clientId: clientId,
            solde: soldesParClient[clientId],
            soldeFormate: (soldesParClient[clientId] / 100).toFixed(2).replace('.', ',') + " MAD"
        };
    });

    return resultatArray;
}
const soldesCalcules = calculerSoldesClients(data.operations);
console.log(soldesCalcules);

let clientendix = 0;

export function afficherClient(clientData) {
    const template = document.getElementById('modele-client');
    
    const clone = template.content.cloneNode(true);
    clone.querySelector('li').dataset.clientId = clientData.id;
    
    const soldeClient = soldesCalcules.find(
    solde => solde.clientId === clientData.id
) || {
    solde: 0,
    soldeFormate: "0,00 MAD"
};
    
    clone.querySelector('.client-nom').textContent = clientData.nom;
    clone.querySelector(".client-nom").addEventListener("click", () => {
      afficherFicheClient(clientData, data.operations);
      afficherHistorique(data.operations);
      document.getElementById("fiche-client").showModal();
    });
    clone.querySelector('.client-telephone').textContent = clientData.telephone || "Aucun téléphone";

    let chek = "";
      if (clientData.creeLe > fulldate &&  clientData.solde < clientData.plafond) {
        chek = "En dette"
      } else if (clientData.creeLe < fulldate &&  clientData.solde < clientData.plafond) {
        chek = " En retard"
      } else if (clientData.solde == clientData.plafond) {
        chek = "Plafond atteint"
      } else  {
        chek = "À jour"
      }
      

    clone.querySelector('.client-badges').textContent = chek
    
    clone.querySelector('.client-solde').textContent = clientData.soldef;
    

  
    const ulListe = document.getElementById('liste-clients');
    ulListe.appendChild(clone);
}

