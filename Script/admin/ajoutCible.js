
// AFFICHAGE DE MENU LISTE 
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

// AJOUT DE PHOTO

let ajoutPhotoFrame= document.querySelector(".ajout-photo-frame")
let selFile = ajoutPhotoFrame.querySelector("input")
let fileNameTag = ajoutPhotoFrame.querySelector(".file-name em")

ajoutPhotoFrame.addEventListener('click', () => {
    selFile.click()
})

ajoutPhotoFrame.addEventListener('mouseenter', () => ajoutPhotoFrame.style.cursor = "pointer")
ajoutPhotoFrame.addEventListener('mouseleave', () => ajoutPhotoFrame.style.cursor = "default")

selFile.addEventListener('change', (event) => {
    
    let selectedFile = event.target.files[0]
    selectedFile && (fileNameTag.textContent = selectedFile.name)
})

// AJOUT D'INDICE 
let inputIndiceWrapper = document.querySelector(".input-indice-wrapper")
let addIndiceBtn = inputIndiceWrapper.querySelector("img")

let indiceList = document.querySelector(".ajout-indices-wrapper ol")
addIndiceBtn.addEventListener('click', () => {
    let indiceVal = inputIndiceWrapper.querySelector("input").value
    if (indiceVal && indiceVal !== "") {
        let newIndice = `
            <li class="texte"> ${indiceVal} </li>
        `
        indiceList.insertAdjacentHTML("beforeend",newIndice)

        document.querySelector(".input-indice-wrapper input").value = ""
    }
})


// INTERACTION AVEC L'API addHunt
let formAjoutCible = document.querySelector(".ajout-main form")

let submitCibleBtn = document.querySelector(".ajout-cible-btn")
formAjoutCible.addEventListener('submit', async (event) => {
    event.preventDefault()

    ajoutCiblePost(event)
    resList.style.display = "flex"
})

// let idAdmin = localStorage(idAdmin)
resList = document.querySelector(".ajout-main ol.res-mes")
const handleRes = ({ message }, colour) => {
    let mes = resList.querySelector("p")
    if (!mes) {
        mes = document.createElement("p")

        mes.style.textAlign = "center"
        mes.style.padding = "2px 5px"
        mes.style.color = "#F4F1EC"
        
        resList.appendChild(mes)
    }

    mes.style.backgroundColor = colour
    mes.textContent = message
}

const ajoutCiblePost = (event) => {
    const formEventTarget = event.target
    formData = new FormData(formEventTarget)

    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/addHunt.php', true)
    xhr.onreadystatechange = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let res = JSON.parse(xhr.responseText)
            res.status === "Image téléchargée et données insérées avec succès" ? handleRes(res, "#F98513") : handleRes(res, "#111144")
        }
    }
    xhr.send(formData)
};
document.querySelector(".profile-icon-wrapper").addEventListener("click", ()=>{
    function checkSession() {
        const admin = localStorage.getItem("idadmin");
        const lastActive = localStorage.getItem('lastActive');
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes d'inactivité
        
        // Vérifie si un identifiant est présent (utilisateur ou administrateur)
        if (!user && !admin) {
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