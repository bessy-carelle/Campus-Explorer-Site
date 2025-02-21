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

let pseudo = localStorage.getItem('pseudo');
document.querySelector(".admin-name").textContent = pseudo;

// FETCH LES CIBLES DU MARIADB

const xhr = new XMLHttpRequest()
xhr.open('GET', 'https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/getHunt.php', true)

xhr.onreadystatechange = () => {
    if (xhr.status === 200 && xhr.readyState === 4) {
        let res = JSON.parse(xhr.response)
        console.log(res)
        if (res.status === "success") {
            res.message.forEach(cible => handleCiblesHTML(cible));
        }
    }
}
xhr.send()



const handleCiblesHTML = ({ nom, data }) => {
    let ciblesDispoWrapper = document.querySelector(".cibles-dispo-photos-wrapper")

    const cibleTag = `
        <article class="cible-wrapper flex-center flex-col">
            <img class="cible gros-cible" src="${data}" alt="Photo Cible" srcset="">
            <p class="label">${nom}</p>
        </article>
    `
    ciblesDispoWrapper.insertAdjacentHTML("beforeend", cibleTag)
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