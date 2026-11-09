import { charger } from './storage.js';
import { calculerSoldesClients, afficherClient } from './Statuts.js';

const resultat = charger();
const data = resultat.data;
const soldesCalcules = calculerSoldesClients(data.operations);

const filter = document.getElementById('filtre-statut');
const tri = document.getElementById('tri');
const recherche = document.getElementById('recherche');
const list = document.getElementById('liste-clients');
const aucunResultat = document.getElementById('etat-aucun-resultat');
const btnReinitialiser = document.getElementById('reinitialiser-filtres');

const date = new Date();
date.setDate(date.getDate() - 30);
const mois = String(date.getMonth() + 1).padStart(2, "0");
const jour = String(date.getDate()).padStart(2, "0");
const fulldate = `${date.getFullYear()}-${mois}-${jour}`;

const cli = data.clients.map(client => {
    const infoSolde = soldesCalcules.find(s => s.clientId === client.id) || {
        solde: 0,
        soldeFormate: "0,00 MAD"
    };

    const opsClient = data.operations.filter(op => op.clientId === client.id);
    let derniereDate = "";
    opsClient.forEach(op => {
        if (op.date > derniereDate) {
            derniereDate = op.date;
        }
    });

    return {
        ...client,
        solde: infoSolde.solde,
        soldef: infoSolde.soldeFormate,
        lastop: derniereDate
    };
});

// 2. Filter, sort, and display
function mettreAJourListe() {
    const mot = recherche.value.toLowerCase().trim();
    const statutChoisi = filter.value;
    const triChoisi = tri.value;

    let resultats = cli.filter(client => {
        const correspondNom = client.nom.toLowerCase().includes(mot);

        let correspondStatut = true;
        if (statutChoisi === "en-dette") {
            correspondStatut = client.creeLe > fulldate && client.solde > 0 && client.solde < client.plafond;
        } else if (statutChoisi === "en-retard") {
            correspondStatut = client.creeLe < fulldate && client.solde > 0 && client.solde < client.plafond;
        } else if (statutChoisi === "a-jour") {
            correspondStatut = client.solde === 0;
        }

        return correspondNom && correspondStatut;
    });

    if (triChoisi === "recent") {
        resultats.sort((a, b) => new Date(b.lastop || 0) - new Date(a.lastop || 0));
    } else if (triChoisi === "solde") {
        resultats.sort((a, b) => b.solde - a.solde);
    } else {
        resultats.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    list.innerHTML = "";
    resultats.forEach(client => {
        afficherClient(client);
    });

    if (cli.length > 0 && resultats.length === 0) {
        aucunResultat.classList.remove("hidden");
    } else {
        aucunResultat.classList.add("hidden");
    }
}

recherche.addEventListener('input', mettreAJourListe);
filter.addEventListener('change', mettreAJourListe);
tri.addEventListener('change', mettreAJourListe);

if (btnReinitialiser) {
    btnReinitialiser.addEventListener('click', () => {
        recherche.value = "";
        filter.value = "tous";
        tri.value = "nom";
        mettreAJourListe();
    });
}