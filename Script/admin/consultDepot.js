
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

let casList = document.querySelectorAll(".cas-consult-wrapper")

casList.forEach((cas) => {
    cas.addEventListener('click', () => {
        window.location.href = 'filtrage_depot.html'
    })

    cas.addEventListener('mouseenter', () => {
        cas.style.backgroundColor = '#9BACD8';
        cas.style.border = "3px solid #111144";
        cas.style.padding = "5px";
        cas.style.borderRadius = "15px";

        cas.querySelectorAll("p").forEach((p) => {
            p.style.color = "#F4F1EC"
        })
    })

    cas.addEventListener('mouseleave', () => {
        cas.style.backgroundColor = '#F4F1EC';
        cas.style.border = "0px";
        cas.style.padding = "0px";
        cas.style.borderRadius = "0px";

        cas.querySelectorAll("p").forEach((p) => {
            p.style.color = "black"
        })
    })
})

let articleWrapper = document.querySelector(".consult-wrapper article")

const xhr = new XMLHttpRequest()
xhr.open('GET', 'https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/signalerCible.php', true)
xhr.onreadystatechange = () => {
    if (xhr.status === 200 && xhr.readyState === 4) {
        let res = JSON.parse(xhr.response)
        if (res.status === "success") {
            console.log(res)
            res.message.forEach(cas => handleCasCiblesHTML(cas))

            stockerCibleSelectionne()
        } else {
            handleError(res)
        }
    }
}
xhr.send()

const handleCasCiblesHTML = ({ cible, src, motif, user, nomCible }) => {
    let casConsult = `
        <section class="cas-consult-wrapper">
            <article class="flex-row flex-center">
                <img src="data:image/jpeg;base64,${src}" alt="" srcset="">
                <p> -> </p>
                <img src="data:image/jpeg;base64,${cible}" alt="" srcset="">
            </article>
            <article class="flex-start flex-col">
                <p class="pseudo-consult-wrapper" style="font-weight:600;">Pseudo :
                    <span class="pseudo-consult-val" style="font-weight: 100; margin-left: 10px;">${user}</span>
                </p>

                <p class="cible-consult-wrapper" style="font-weight:600;">Cible :
                    <span class="cible-consult-val" style="font-weight: 100; margin-left: 10px;">${nomCible}</span>
                </p>

                <p class="statut-consult-wrapper" style="font-weight:600;">Statut :
                    <span class="statut-consult-wrapper style="font-weight: 100; margin-left: 10px;">${motif}</span>
                </p>
            </article>
        </section>
    `;
    articleWrapper.insertAdjacentHTML("beforeend", casConsult);
}

const handleError = ({status, message}) => {
    let consultMain = document.querySelector('main')

    let messTag = `
        <p style="color: #F4F1EC; background-color: #111144; padding: 30px;">
            ${status} : ${message}
        </p>
    `
    consultMain.insertAdjacentHTML("beforebegin", messTag)
}

// SELECTIONNE UN DEPOT A FILTRER
const stockerCibleSelectionne = () => {
    let allCasConsultWrappers = document.querySelectorAll('.cas-consult-wrapper')
    allCasConsultWrappers.forEach(async (cas, pos) => {

        cas.addEventListener('click', () => {
            localStorage.setItem('cible-selectionne', pos)
        })
    })

    console.log(localStorage.getItem('cible-selectionne'))
}

document.querySelector(".petitbohomme").addEventListener("click", ()=>{
    
    
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