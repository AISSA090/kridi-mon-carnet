import {sauvegarder} from "./storage.js";


const fichier = document.getElementById("import-fichier");
const btnimport = document.getElementById("importer");
const dialog = document.getElementById("dialog-confirmation");
const details = document.getElementById("confirmation-details");
const valider = document.getElementById("confirmation-valider");
const annuler = document.getElementById("confirmation-annuler");
const message = document.getElementById("confirmation-message");

let donneesImportees = null;
btnimport.addEventListener("click", function () {
    fichier.click();
});

fichier.addEventListener("change", function () {
    const file = fichier.files[0];
    if (!file) {
        return
    }
    const reader = new FileReader();

    reader.onload = function (event) {
        donneesImportees = null;
        let data;
        let erreur = [];
        const contenu = event.target.result;

        try {
            data = JSON.parse(contenu);
        } catch (error) {
            console.log("fichier invalide!!");
            return;
        }
            if (!data || typeof data !== "object" || Array.isArray(data)){
                erreur.push("le fichier doit contenir un fichier JSON!!")
            }
            else {
                if (data.app !== "karni"){
                    erreur.push("app invalide!!")
                }
                if (data.version !== 1){
                    erreur.push("version invalide!!")
                }
                if (!Array.isArray(data.clients)){
                    erreur.push("clients invalide!!")
                }
                 if (!Array.isArray(data.operations)){
                    erreur.push("operations invalide!!")
                }
            }

            
            if (erreur.length > 0){
                details.innerHTML = "";
                erreur.slice(0, 10).forEach((erreur) => {
                    const li = document.createElement("li");
                    li.textContent = erreur;
                    details.appendChild(li);
                    
                });
                dialog.showModal();
                return;    
            }
            
            erreur = validerinfos(data);
            if (erreur.length > 0) {
                details.innerHTML = "";
                erreur.slice(0, 10).forEach((erreur) => {
                    const li = document.createElement("li");
                    li.textContent = erreur;
                    details.appendChild(li);
                    
                });
                dialog.showModal();
                return;   
            }
            donneesImportees = data;
            message.textContent = ("Ce fichier contient " + data.clients.length + " clients et " + data.operations.length + " operations, Voulez vous les importer?");
            dialog.showModal();
    }
    reader.readAsText(file);
});

dialog.addEventListener("close", function(){
    if(dialog.returnValue === "valider" && donneesImportees !== null){
        const resultat = sauvegarder(donneesImportees);
        if (resultat){
            console.log("importation reussie")
            document.dispatchEvent(new CustomEvent("donnees-importees", {
            detail: donneesImportees
        }));
        }else {
            console.log("erreur lors de l'importation!!")
        }
    }
    else {
        console.log("l'utilisateur a refusé l'importation");
    }
})














































export function validerinfos(data){
        const erreur = [];
    data.clients.forEach((clients, index) => {
        if (typeof clients.nom !== "string" || clients.nom.length <2 || clients.nom.length > 40){
            erreur.push(`clients[${index}].nom est invalide!!`);
        }
        const phoneregex = /^0[567][0-9]{8}$/;
        if (clients.telephone !== "" && !phoneregex.test(clients.telephone)){
            erreur.push(`clients[${index}].telephone est invalide!!`);
        }
        if (typeof clients.plafond !== "number" || !Number.isInteger(clients.plafond) || clients.plafond < 5000 || clients.plafond > 1000000){
            erreur.push(`clients[${index}].plafond est invalide!!`)
        }
        if (typeof clients.creeLe !== "string"){
            erreur.push(`clients[${index}].creeLe est invalide!!`)
        }
        if (clients.id === "" || typeof clients.id !== "string" ){
            erreur.push(`clients[${index}].id est invalide!!`)
        }  
    });

    data.operations.forEach((operations, index) => {
         if (operations.id === "" || typeof operations.id !== "string" ){
            erreur.push(`operations[${index}].id est invalide!!`)
        }
        if (!data.clients.some(client => client.id === operations.clientId)){
            erreur.push(`operations[${index}].clientId est invalide!!`)
        }
        if (operations.type !== "achat" && operations.type !== "remboursement"){
            erreur.push(`operations[${index}].type est invalide!!`)
        } 
        if (typeof operations.montant !== "number" || !Number.isInteger(operations.montant) || operations.montant <= 0){
            erreur.push(`operations[${index}].montant est invalide!!`)
        }
        if (typeof operations.libelle != "string" || operations.libelle.length > 60){
            erreur.push(`operations[${index}].libelle est invalide!!`)
        }
        if (operations.type === "achat" && typeof operations.libelle != "string" && operations.libelle.length < 2){
            erreur.push(`operations[${index}].libelle est invalide!!`)
        }
        if (typeof operations.date !== "string"){
            erreur.push(`operations[${index}].date est invalide!!`)
        }
    });
        return erreur.slice(0, 10);
          
}


