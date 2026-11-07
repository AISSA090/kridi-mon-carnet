import { calculerSoldeClient, calculerCreditDisponible, trierOperations } from "./calculs.js";
import { selectionnerClient, operations, clientSelectionne } from "./state.js";
import { sauvegarder, charger } from "./storage.js";

const ficheNom = document.getElementById("fiche-nom");
const ficheTelephone = document.getElementById("fiche-telephone");
const ficheSolde = document.getElementById("fiche-solde");
const fichePlafond = document.getElementById("fiche-plafond");
const ficheDisponible = document.getElementById("fiche-disponible");
const historique = document.getElementById("historique");
const modeleOperation = document.getElementById("modele-operation");
const historiqueVide = document.getElementById("historique-vide");
const ficheClient = document.getElementById("fiche-client");
const btnfermer = document.getElementById("fiche-fermer");
const dialogConfirmation = document.getElementById("dialog-confirmation");
const confirmationTitre = document.getElementById("confirmation-titre");
const confirmationMessage = document.getElementById("confirmation-message");
const confirmationDetails = document.getElementById("confirmation-details");
const confirmationValider = document.getElementById("confirmation-valider");
const formOperation = document.getElementById("form-operation");
const operationMontant = document.getElementById("operation-montant");
const operationDate = document.getElementById("operation-date");
const operationLibelle = document.getElementById("operation-libelle");

function formaterMontant(montant) {
    return (montant / 100).toFixed(2).replace(".", ",") + " MAD";
}

export function afficherFicheClient(client, operations) {
    selectionnerClient(client);
    ficheNom.textContent = client.nom;
    ficheNom.dataset.clientId = client.id;
    ficheTelephone.textContent = client.telephone;
    fichePlafond.textContent = formaterMontant(client.plafond);
    const solde = calculerSoldeClient(client.id, operations);
    ficheSolde.textContent = formaterMontant(solde);
    const creditDisponible = calculerCreditDisponible(client, operations);
    ficheDisponible.textContent = formaterMontant(creditDisponible);
}

export function afficherHistorique(operations) {
    historique.textContent = "";
    const clientId = document.getElementById("fiche-nom").dataset.clientId;
    const operationsClient = operations.filter( operation => 
        operation.clientId === clientId);
    const operationsTriees = trierOperations(operationsClient);
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

historique.addEventListener("click", (event) => {
    const btn = event.target.closest('[data-action="supprimer-operation"]');
    if (!btn) {
        return;
    }
    const ligne = btn.closest("li");
    const operationId = ligne.dataset.operationId;
    const index = operations.findIndex(operation => operation.id === operationId);
    if (index === -1) {
        return;
    }
    const operation = operations[index];
    confirmationTitre.textContent = "Supprimer l'opération ?";
    confirmationMessage.textContent = "Voulez-vous vraiment supprimer cette opération ?";
    confirmationDetails.textContent = operation.libelle;
    dialogConfirmation.dataset.operationId = operationId;
    dialogConfirmation.showModal();
});

dialogConfirmation.addEventListener("close", () => {
        if (dialogConfirmation.returnValue !== "valider") {
            return;
        }
        const operationId = dialogConfirmation.dataset.operationId;
        const index = operations.findIndex(operation => operation.id === operationId);
        if (index === -1) {
            return;
        }
        operations.splice(index, 1);
        const resultat = charger();
        const data = resultat.data;
        if (resultat.erreur1) {
            console.error("Impossible de charger les données pour la sauvegarde");
            return;
        }
        data.operations = [...operations];
        const sauvegarde = sauvegarder(data);
        if(!sauvegarde) {
            console.error("Impossible de sauvegarder la suppression");
        }
        afficherFicheClient(clientSelectionne, operations);
        afficherHistorique(operations);
});

btnfermer.addEventListener("click", () => {
    ficheClient.close();
});

