import { calculerSoldeClient, calculerCreditDisponible, trierOperations } from "./calculs.js";
const ficheNom = document.getElementById("fiche-nom");
const ficheTelephone = document.getElementById("fiche-telephone");
const ficheSolde = document.getElementById("fiche-solde");
const fichePlafond = document.getElementById("fiche-plafond");
const ficheDisponible = document.getElementById("fiche-disponible");
const historique = document.getElementById("historique");
const modeleOperation = document.getElementById("modele-operation");
const historiqueVide = document.getElementById("historique-vide");

function formaterMontant(montant) {
    return (montant / 100).toFixed(2).replace(".", ",") + " MAD";
}

export function afficherFicheClient(client, operations) {
    ficheNom.textContent = client.nom;
    ficheTelephone.textContent = client.telephone;
    fichePlafond.textContent = formaterMontant(client.plafond);
    const solde = calculerSoldeClient(client.id, operations);
    ficheSolde.textContent = formaterMontant(solde);
    const creditDisponible = calculerCreditDisponible(client, operations);
    ficheDisponible.textContent = formaterMontant(creditDisponible);
}

export function afficherHistorique(operations) {
    historique.textContent = "";
    const operationsTriees = trierOperations(operations);
    if (operationsTriees.length === 0) {
        historiqueVide.classList.remove("hidden");
    }
    else {
        historiqueVide.classList.add("hidden");
    }
    operationsTriees.forEach(operation => {
        const copy = modeleOperation.content.cloneNode(true);
        copy.querySelector(".operation-libelle").textContent = operation.libelle;
        copy.querySelector(".operation-date").textContent = operation.date;
        const opMontant = copy.querySelector(".operation-montant");
        opMontant.textContent = formaterMontant(operation.montant);
        const ligne = copy.querySelector("li");
        ligne.dataset.operationId = operation.id;
        ligne.classList.add("operation-" + operation.type);
        historique.append(copy);
    });
}

