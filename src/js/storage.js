const erreur = document.getElementById("erreur-stockage");


export function sauvegarder(data){
    try {
        const données =JSON.stringify(data);
        localStorage.setItem("karni:v1", données);
        return true;
    } catch (error) {
        return false;
    } 
}

const result = sauvegarder(data)
if (result === false){
    erreur.classList.remove("hidden");
    erreur.textContent = "Attention: Impossible de sauvegarder les données. Vos modifications risquent de ne pas etre sauvegarder!";
}




export function charger(){
    const données =  localStorage.getItem("karni:v1");
    if (données === null){
        return  {
        clients: [], 
        operations: []
        };
    }
    try {
        const donnéesobject = JSON.parse(données);
        if( 
            donnéesobject.app === "karni" && 
            donnéesobject.version === 1 && 
            Array.isArray(donnéesobject.clients) && 
            Array.isArray(donnéesobject.operations)
        )
        {
        return donnéesobject;
        } else {
            localStorage.setItem("karni:sauvegarde-illisible", données)
            return {
                clients: [],
                operations: []
            };
        }
    } catch (error) {
        localStorage.setItem("karni:sauvegarde-illisible", données)
    
        return  {
            clients: [], 
            operations: []
        };
    }  
}


