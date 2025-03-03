let menuWrapper = document.querySelector(".menu-wrapper");
let menuList = document.querySelector(".menu-list")
let menuBtn = document.querySelector(".menu-btn");

menuBtn.addEventListener('click', () => {
    if (menuList.style.display === "none") {
        menuList.style.display = "flex"

        menuBtn.classList.add("open")

        menuWrapper.classList.add("menu-wrapper")
        menuWrapper.style.margin = "10px 0 0 10px"

        menuWrapper.style.backgroundColor = "white"
    } else if (menuList.style.display === "flex") {
        menuWrapper.style.backgroundColor = "#F4F1EC"

        menuList.style.display = "none"
        menuWrapper.style.margin = "0"

        menuBtn.classList.remove("open")
    }
});


(async () => {
    try {
        const req = await fetch(`https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/getHunt.php`);
        if (!req.ok) throw new Error("Req not Ok");
        const reqJSON = await req.json();
        console.log(reqJSON);
        reqJSON.message.forEach(photo => handlePhotosHTML(photo));
    } catch (error) { console.error(error) }
})();

function handlePhotosHTML({dispo, nom , data, idCible}){
    let photoDispoWrapper = document.querySelector(".photos-dispo-photos-wrapper");
    let className = dispo === "1" ? 'photo-dispo' : '' 
    let blockHTML = `
        <article id="photo-${idCible}" class="${className} photo-wrapper flex-col flex-center">
            <img class="cible gros-cible" src ="${data}" alt="">
            <p class="label"> ${nom} </p>
        </article>
    `

    photoDispoWrapper.insertAdjacentHTML("beforeend", blockHTML)

    let thisPhoto = document.querySelector(`#photo-${idCible}`)
    thisPhoto.addEventListener('click', function (){
        if (!this.classList.contains("dispo-one")) this.classList.toggle("clicked");
    })
}


let ajoutPdJBtn = document.querySelector('.env-pdj-btn');
ajoutPdJBtn.addEventListener('click', handleAjoutPdJ);

function handleAjoutPdJ(){
    let pdjTags = document.querySelectorAll('.clicked')
    pdjTags.forEach(async (tag) => {

        let cibleForm = new FormData();
        cibleForm.append("idCible", tag.id.substring(6))

        try{
            let req = await fetch(`https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/setDispo.php`, {
                method : "POST",
                headers : {'Content-Type' : 'application/json'},
                body : cibleForm
            });
            if (!req.ok) throw new Error ("Erreur lors de l'envoi de la requete")
            let reqJSON = await req.json();
            if (reqJSON.status == "error") throw new Error("Error lors de la connexion ")
            else if (reqJSON.message == "echec de la modification") throw new Error("Erreur de modification");
            addMess(reqJSON.message, "#DAD1C8", "#111144")
        } catch (error){
            addMess(error, "#111144b5", "white")
        } finally{
            tag.classList.toggle('clicked')
        }
    })
}

function addMess(mess, bgColour, fgColour){
    let messWrapper = document.querySelector(".photos-dispo-wrapper")
    let mes = messWrapper.querySelector(".mess-wrapper")
    if (mes) mes.querySelector("p").textContent = mess;
    else{
        let newBlock = `
            <article class="flex-center mess-wrapper" style="background-color : ${bgColour}; color : ${fgColour};">
                <p>${mess}</p>
            </article>
        `
        messWrapper.insertAdjacentHTML("beforeend", newBlock)
    }
}

document.querySelector(".profile-icon-wrapper").addEventListener("click", ()=>{
    function checkSession() {
        const admin = localStorage.getItem("idadmin");
        const lastActive = localStorage.getItem('lastActive');
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes d'inactivité
        
        // Vérifie si un identifiant est présent (utilisateur ou administrateur)
        if (!admin) {
            alert("Vous devez être connecté pour accéder à cette page.");
            window.location.href = "../../Pages/welcome/connexion.html";  // Redirige vers la page de connexion
        } else if (lastActive && new Date().getTime() - lastActive > sessionTimeout) {
            // Si la session a expiré (inactivité trop longue)
            alert("Votre session a expiré, veuillez vous reconnecter.");
            window.location.href = "../../Pages/welcome/connexion.html";  // Redirige vers la page de connexion
        }else if(admin){
            window.location.href="../../Pages/admin/profil.html"
        }else {
            // Si la session est encore valide, mettre à jour le dernier moment d'activité
            localStorage.setItem('lastActive', new Date().getTime());
        }
    }
    
    // Appel de la fonction de vérification de la session
    checkSession(); 
});