// code main 
// lors de l'appelle du fonction sauvegarder()
// il faut appeler la fonction sauvegarder lors du fonction modifier 

// const erreur = document.getElementById("erreur-stockage");
// const result = sauvegarder(data)!
// if (result){
//     erreur.classList.add("hidden");
//  } else {
//     erreur.classList.remove("hidden");
//     erreur.textContent = "Attention: Impossible de sauvegarder les données. Vos modifications risquent de ne pas etre sauvegarder!";
// }

// lors de l'appelle du fonction charger()

// const erreur = document.getElementById("erreur-stockage");
// const resultat = charger();
// const data = resultat.data;
// if (resultat.erreur){
//     erreur.classList.remove("hidden");
//     erreur.textContent = "Impossible de lire les données!"
// }

// data.clients.push(ajouterclient);
// data.operations.push(ajouteroperation);
// sauvegarder(data);


export function sauvegarder(data){
    try {
        const données =JSON.stringify(data);
        localStorage.setItem("karni:v1", données);
        return true;
    } catch (error) {
        return false;
    } 
}



export function charger(){
    let données;

    try {
        données = localStorage.getItem("karni:v1");
        if (données === null){
            return {
                data: {
                app: "karni",
                version: 1,
                clients: [], 
                operations: []
            },
            erreur1:false
        }}
        const donnéesobject = JSON.parse(données);
        if( 
            donnéesobject.app === "karni" && 
            donnéesobject.version === 1 && 
            Array.isArray(donnéesobject.clients) && 
            Array.isArray(donnéesobject.operations)
        )
        {
        return {
            data: donnéesobject,
            erreur1: false
        };
        } else {
            throw new Error("Données invalides");
        }
    } catch (error) {
        try {
            localStorage.setItem("karni:sauvegarde-illisible", données)
        } catch (error) {
            
        }
    
        return {
            data:{
            app: "karni",
            version: 1,
            clients: [], 
            operations: []
        },
        erreur1: true
    }}
}


// export function afficher(data){
//     const donnees = localStorage.getItem("karni:v1");
//     const data = donnees.clients;
//     const liste = document.querySelector("#liste-clients");
//     const modele = document.querySelector("#modele-client");
//     liste.innerHTML = "";
//     clients.forEach(client => {
        
//     });



// }
