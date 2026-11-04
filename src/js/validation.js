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
    } else {
        plafonderreu.classList.add('hidden');
        plafonderreu.textContent = "";
        plafond.removeAttribute("aria-invalid");
        plafond.removeAttribute("aria-describedby");
    }
});

const client = [];

const ilYa = (jours) => {
  const date = new Date();
  date.setDate(date.getDate() - jours);
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mois}-${jour}`;
};

export function ajouterClient(nom, telephone, plafondEnCentimes, tableauClients) {
    const nouveauClient = {
        id: "c-" + Date.now(), 
        nom: nom,
        telephone: telephone,
        plafond: plafondEnCentimes,
        montant: 0,
        creeLe: ilYa(0)
    };

    tableauClients.push(nouveauClient); 
}
btnenrregistrer.addEventListener('click',function(){
 const erreur=document.querySelectorAll('[aria-invalid="true"]')

if (erreur.length===0){
    const change=plafond.value.replace(',','.')
    const plafondReel = parseFloat(change);
    const plafondEnCentimes = Math.round(plafondReel * 100);
    ajouterClient(clientname.value,clienttelephone.value,plafondEnCentimes,client)
}

});
const ilYa = (jours) => {
  const date = new Date();
  date.setDate(date.getDate() - jours);
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mois}-${jour}`;
};