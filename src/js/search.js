import { creerDemo } from './demo.js';
import { calculerSoldesClients, ajouterClient } from  './Statuts.js';

const soldesCalcules = calculerSoldesClients(creerDemo().operations);
const op = []

for (let i = 0; i < creerDemo().clients.length; i++) {
    let a = ``;
    for (let k = 0; k < creerDemo().operations.length; k++) {
        if (creerDemo().operations[k].clientId === `c-demo-${i +1}`) {
            a = creerDemo().operations[k].date
        }
    }
    op.push(a)
}
const cli = []

for (let i = 0; i < creerDemo().clients.length; i++) {
    const arr = {
            id: creerDemo().clients[i].id, 
            nom: creerDemo().clients[i].nom,
            telephone: creerDemo().clients[i].telephone,
            plafond: creerDemo().clients[i].plafond,
            creeLe: creerDemo().clients[i].creeLe,
            solde: soldesCalcules[i].solde,
            soldef: soldesCalcules[i].soldeFormate,
            lastop: op[i]
        }
    cli.push(arr)
}

console.log(cli)

const filter = document.getElementById('filtre-statut')
const list = document.getElementById('liste-clients')

  const date = new Date();
  date.setDate(date.getDate() - 30);
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  
  const fulldate = `${date.getFullYear()}-${mois}-${jour}`;

for (let i = 0; i < creerDemo().clients.length; i++) {
    ajouterClient(cli[i])
}

export function filtreparStatus(status) {
    filter.addEventListener('change', ()=> {
        list.innerHTML = ""
        if ( filter.value == "en-dette") {
            for (let i = 0; i < status.length; i++) {
                if (status[i].creeLe > fulldate &&  status[i].solde < status[i].plafond) {
                  ajouterClient(status[i])
                 }
            }
        } else if (filter.value == "en-retard") {
            for (let i = 0; i < creerDemo().clients.length; i++) {
                if (status[i].creeLe < fulldate &&  status[i].solde < status[i].plafond) {
                    ajouterClient(status[i])
                } 
            }
        }  else if (filter.value == "a-jour") {
            for (let i = 0; i < status.length; i++) {
                 if (status[i].solde === 0) {
                   ajouterClient(status[i])
                 } 
            }
        } else {
            for (let i = 0; i < status.length; i++) {
                ajouterClient(status[i])
            }
        }
    })
    
}
filtreparStatus(cli)


const tri = document.getElementById('tri')

export function triparnom(tris) {
    
    tri.addEventListener('change', ()=> {
        list.innerHTML = ""
        const dateSort = [...tris].sort((a,b) => new Date(b.lastop) - new Date(a.lastop))
        const nameSort = [...tris].sort((a,b) => a.nom.localeCompare(b.nom))
        const soldeSorte = [...tris].sort((a,b) => b.solde - a.solde)
    
        
        if (tri.value === "recent") {
             for (let i = 0; i < dateSort.length; i++) {
                ajouterClient(dateSort[i])
            }
        } else if (tri.value === "solde") {
            for (let i = 0; i < soldeSorte.length; i++) {
                ajouterClient(soldeSorte[i])
            }
        } else {
             for (let i = 0; i < nameSort.length; i++) {
                ajouterClient(nameSort[i])
            }
        }
    })
}
triparnom(cli)

const icune = document.getElementById('etat-aucun-resultat')


const recherche = document.getElementById('recherche')

export function search(parnom) {
    recherche.addEventListener('input', ()=> {
        const mot = recherche.value.toLowerCase().trim()
    
        let resolt = parnom.filter(cl => {
            const nom = cl.nom.toLowerCase();
    
            return nom.includes(mot)
        })
    
        list.innerHTML = ""
          for (let i = 0; i < resolt.length; i++) {
                ajouterClient(resolt[i])
            }

        
    })
    
}

search(cli)





