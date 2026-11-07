const fichier = document.getElementById("import-fichier");
const btnimport = document.getElementById("importer");

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
        let data;
        const contenu = event.target.result;
        try {
            data = JSON.parse(contenu);
        } catch (error) {
            console.log("fichier invalide!!");
            return;
        }
            const erreur = [];
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
                console.log(erreur.slice(0, 10));
                return;
            }
            console.error("fichier valide");
            return;     
    }

    reader.readAsText(file);
})




