import { clients, operations, clientSelectionne } from "./state.js";
import { calculerSoldeClient, calculerCreditDisponible } from "./calculs.js";
import { afficherFicheClient, afficherHistorique } from "./ui.js";

const btnimport = document.getElementById('importer');
const btnexport = document.getElementById('exporter');
const clientname = document.getElementById('client-nom');
const clientnameerreu = document.getElementById('client-nom-erreur');
const clienttelephone = document.getElementById('client-telephone');
const clienttelephoneerreu = document.getElementById('client-telephone-erreur');
const nameregex = /^[a-zA-ZÀ-ÿ ]{2,40}$/;
const phoneregex = /^0[567][0-9]{8}$/;
const btnannuler = document.getElementById('client-annuler');
const plafond = document.getElementById('client-plafond'); 
const plafonderreu = document.getElementById('client-plafond-erreur');
const plafondregex = /^[0-9]+([,.][0-9]{1,2})?$/;
const dialogClient = document.getElementById('dialog-client');
const btnajout = document.getElementById('nouveau-client');
const formClient = document.getElementById('form-client');
const formOperation = document.getElementById("form-operation");
const operationMontant = document.getElementById("operation-montant");
const operationMontantErreur = document.getElementById("operation-montant-erreur");
const operationDate = document.getElementById("operation-date");
const operationDateErreur = document.getElementById("operation-date-erreur");
const operationLibelle = document.getElementById("operation-libelle");
const operationLibelleErreur = document.getElementById("operation-libelle-erreur");
const montantRegex = /^[0-9]+([,.][0-9]{1,2})?$/;

function validerMontant() {
    const montant = operationMontant.value.trim();
    const montantReel = parseFloat(montant.replace(",", "."));
    if (montant === "") {
        operationMontantErreur.textContent = "Le montant est obligatoire.";
    } 
    else if (!montantRegex.test(montant)) {
        operationMontantErreur.textContent = "Entrez un montant valide.";
    } 
    else if (montantReel < 0.01 || montantReel > 10000) {
        operationMontantErreur.textContent = "Le montant doit être entre 0,01 et 10 000 MAD.";
    } 
    else {
        operationMontantErreur.textContent = "";
    }
    const invalide = operationMontantErreur.textContent !== "";
    if (invalide) {
        operationMontantErreur.classList.remove("hidden");
        operationMontant.setAttribute("aria-invalid", "true");
        operationMontant.setAttribute("aria-describedby", "operation-montant-erreur");
    } 
    else {
        operationMontantErreur.classList.add("hidden");
        operationMontant.removeAttribute("aria-invalid");
        operationMontant.removeAttribute("aria-describedby");
    }
    return !invalide;
}
operationMontant.addEventListener("input", validerMontant);

function validerDate() {
    const date = operationDate.value;
    const aujourdHui = new Date();
    const annee = aujourdHui.getFullYear();
    const mois = String(aujourdHui.getMonth() + 1).padStart(2, "0");
    const jour = String(aujourdHui.getDate()).padStart(2, "0");
    const dateAujourdhui = `${annee}-${mois}-${jour}`;
    if (date === "") {
        operationDateErreur.textContent = "La date est obligatoire.";
    } 
    else if (date > dateAujourdhui) {
        operationDateErreur.textContent = "La date ne peut pas être dans le futur.";
    } 
    else {
        operationDateErreur.textContent = "";
    }
    const invalide = operationDateErreur.textContent !== "";
    operationDateErreur.classList.toggle("hidden", !invalide);
    if (invalide) {
        operationDate.setAttribute("aria-invalid", "true");
        operationDate.setAttribute("aria-describedby", "operation-date-erreur");
    } 
    else {
        operationDate.removeAttribute("aria-invalid");
        operationDate.removeAttribute("aria-describedby");
    }
    return !invalide;
}
operationDate.addEventListener("input", validerDate);

function validerLibelle() {
    const libelle = operationLibelle.value.trim();
    const typeOperation = document.querySelector('input[name="operation-type"]:checked').value;
    if (typeOperation === "achat" && libelle.length < 2) {
        operationLibelleErreur.textContent = "Le libellé doit contenir au moins 2 caractères pour un achat.";
    } 
    else if (libelle.length > 60) {
        operationLibelleErreur.textContent = "Le libellé ne doit pas dépasser 60 caractères.";
    } 
    else {
        operationLibelleErreur.textContent = "";
    }
    const invalide = operationLibelleErreur.textContent !== "";
    operationLibelleErreur.classList.toggle("hidden", !invalide);
    if (invalide) {
        operationLibelle.setAttribute("aria-invalid", "true");
        operationLibelle.setAttribute("aria-describedby", "operation-libelle-erreur");
    } 
    else {
        operationLibelle.removeAttribute("aria-invalid");
        operationLibelle.removeAttribute("aria-describedby");
    }
    return !invalide;
}
operationLibelle.addEventListener("input", validerLibelle);
document.querySelectorAll('input[name="operation-type"]').forEach(radio => {
    radio.addEventListener("change", validerLibelle);
});

function convertirEnCentimes(valeur) {
    let montant = Number(valeur.replace(",", "."));
    let centimes = montant * 100;
    return Math.round(centimes);
    
}

formOperation.addEventListener("submit", function(event) {
    event.preventDefault();
    const montantValide = validerMontant();
    const dateValide = validerDate();
    const libelleValide = validerLibelle();
    if (montantValide === false || dateValide === false || libelleValide === false) {
        return;
    }
    else if (clientSelectionne === null){
        return;
    }
    const montant = operationMontant.value;
    const montantEnCentimes = convertirEnCentimes(montant);
    const typeOperation = document.querySelector('input[name = "operation-type"]:checked').value;
    const creditDis = calculerCreditDisponible(clientSelectionne, operations);
    const solde = calculerSoldeClient(clientSelectionne.id, operations);
    if (typeOperation === "remboursement" && montantEnCentimes > solde) {
        operationMontantErreur.textContent = "le remboursement dépasse le  solde de client";
        operationMontantErreur.classList.remove("hidden");
        return;
    }
    else {
        operationMontantErreur.textContent = "";
        operationMontantErreur.classList.add("hidden");
    }
    if (typeOperation === "achat" && montantEnCentimes > creditDis) {
        operationMontantErreur.textContent = "le montant a dépassé le crédit disponible";
        operationMontantErreur.classList.remove("hidden");
        return;
    }
    else {
        operationMontantErreur.textContent = "";
        operationMontantErreur.classList.add("hidden");
    }
    const operation = {
        id: "o-" + Date.now(),
        clientId: clientSelectionne.id,
        type: typeOperation,
        montant: montantEnCentimes,
        libelle: operationLibelle.value.trim(),
        date: operationDate.value
    }
    operations.push(operation);
    afficherFicheClient(clientSelectionne, operations);
    afficherHistorique(operations);
    console.log("Les champs sont valides !");
});

clientname.addEventListener('input', function() {
    if (clientname.value === "") {
        clientnameerreu.classList.add('hidden');
        clientnameerreu.textContent = "";
        clientname.removeAttribute("aria-invalid");
        clientname.removeAttribute("aria-describedby");
    } else if (!nameregex.test(clientname.value)) {
        clientnameerreu.classList.remove('hidden');
        clientnameerreu.textContent = "le nom de client doit avoir just des lettres en majuscule et miniscule ( 2 character au moin )";
        clientname.setAttribute("aria-describedby", "client-nom-erreur");
        clientname.setAttribute("aria-invalid", "true");
    } else {
        clientnameerreu.classList.add('hidden'); 
        clientnameerreu.textContent = "";
        clientname.removeAttribute("aria-invalid");
        clientname.removeAttribute("aria-describedby");
    }
});

clienttelephone.addEventListener('input', function() {
    if (clienttelephone.value === "") {
        clienttelephoneerreu.classList.add('hidden');
        clienttelephoneerreu.textContent = "";
        clienttelephone.removeAttribute("aria-invalid");
        clienttelephone.removeAttribute("aria-describedby");
    } else if (!phoneregex.test(clienttelephone.value)) {
        clienttelephoneerreu.classList.remove('hidden');
        clienttelephoneerreu.textContent = "le nombre de telephone doit commencer avec (Ex 05, 06 , 07) et avoir 10 nombre";
        clienttelephone.setAttribute("aria-invalid", "true");
        clienttelephone.setAttribute("aria-describedby", "client-telephone-erreur"); 
    } else {
        clienttelephoneerreu.classList.add('hidden'); 
        clienttelephoneerreu.textContent = "";
        clienttelephone.removeAttribute("aria-invalid");
        clienttelephone.removeAttribute("aria-describedby");
    }
});

plafond.addEventListener('input', function() {
    if (plafond.value === "") {
        plafonderreu.classList.add('hidden');
        plafonderreu.textContent = "";
        plafond.removeAttribute("aria-invalid");
        plafond.removeAttribute("aria-describedby");
    } else if (!plafondregex.test(plafond.value)) {
        plafonderreu.classList.remove('hidden');
        plafonderreu.textContent = "Le plafond doit être un nombre valide (ex: 1500 ou 15,50)";
        plafond.setAttribute("aria-invalid", "true");
        plafond.setAttribute("aria-describedby", "client-plafond-erreur");
    } else if (
        parseFloat(plafond.value.replace(",", ".")) < 50 ||
        parseFloat(plafond.value.replace(",", ".")) > 10000) 
    {
        plafonderreu.classList.remove("hidden");
        plafonderreu.textContent = "Le plafond doit être entre 50 et 10 000 MAD.";
        plafond.setAttribute("aria-invalid", "true");
        plafond.setAttribute("aria-describedby", "client-plafond-erreur");
    } else {
        plafonderreu.classList.add('hidden');
        plafonderreu.textContent = "";
        plafond.removeAttribute("aria-invalid");
        plafond.removeAttribute("aria-describedby");
    }
});

const ilYa = (jours) => {
  const date = new Date();
  date.setDate(date.getDate() - jours);
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mois}-${jour}`;
};

export function ajouterClient(nom, telephone, plafondEnCentimes) {
    const nouveauClient = {
        id: "c-" + Date.now(),
        nom: nom.trim(),
        telephone: telephone.trim(),
        plafond: plafondEnCentimes,
        creeLe: ilYa(0)
    };
    clients.push(nouveauClient);
}

function nettoyerErreurs() {
    const champs = [clientname, clienttelephone, plafond];
    const erreurs = [clientnameerreu, clienttelephoneerreu, plafonderreu];

    champs.forEach(champ => {
        champ.removeAttribute("aria-invalid");
        champ.removeAttribute("aria-describedby");
    });
    
    erreurs.forEach(erreurTxt => {
        erreurTxt.classList.add('hidden');
        erreurTxt.textContent = "";
    });
}

btnajout.addEventListener('click', function() {
    dialogClient.showModal(); 
});

btnannuler.addEventListener('click', function() {
    dialogClient.close(); 
});

dialogClient.addEventListener('close', function() {
    formClient.reset();
    nettoyerErreurs(); 
});

formClient.addEventListener('submit', function(event) {
    event.preventDefault(); 

    if (clientname.value.trim() === "") {
        clientnameerreu.classList.remove('hidden');
        clientnameerreu.textContent = "Le nom est obligatoire";
        clientname.setAttribute("aria-describedby", "client-nom-erreur");
        clientname.setAttribute("aria-invalid", "true");
    }

    if (plafond.value.trim() === "") {
        plafonderreu.classList.remove('hidden');
        plafonderreu.textContent = "Le plafond est obligatoire";
        plafond.setAttribute("aria-describedby", "client-plafond-erreur");
        plafond.setAttribute("aria-invalid", "true");
    }

    const erreur = document.querySelectorAll('[aria-invalid="true"]');
    if (erreur.length === 0) {
        const change = plafond.value.replace(',', '.');
        const plafondReel = parseFloat(change);
        const plafondEnCentimes = Math.round(plafondReel * 100);
        
        ajouterClient(clientname.value, clienttelephone.value, plafondEnCentimes);
        dialogClient.close();
    }
});