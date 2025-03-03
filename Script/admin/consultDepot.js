
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
    cas.addEventListener('click', () => window.location.href = 'filtrage_depot.html')

    cas.addEventListener('mouseenter', () => {
        cas.style.backgroundColor = '#9BACD8';
        cas.style.border = "3px solid #111144";
        cas.style.padding = "5px";
        cas.style.borderRadius = "15px";

        cas.querySelectorAll("p").forEach((p) => p.style.color = "#F4F1EC");
    })

    cas.addEventListener('mouseleave', () => {
        cas.style.backgroundColor = '#F4F1EC';
        cas.style.border = "0px";
        cas.style.padding = "0px";
        cas.style.borderRadius = "0px";

        cas.querySelectorAll("p").forEach((p) => p.style.color = "black");
    })
})

let articleWrapper = document.querySelector(".consult-wrapper article");

const xhr = new XMLHttpRequest()
xhr.open('GET', 'https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/traitementPhoto.php', true)
xhr.onreadystatechange = () => {
    if (xhr.status === 200 && xhr.readyState === 4) {
        let res = JSON.parse(xhr.response)
        if (res.status === "success") {
            console.log(res)
            res.message.forEach(cas => handleCasCiblesHTML(cas));

            stockerCibleSelectionne()
        } else handleError(res)
    }
}
xhr.send()

const handleCasCiblesHTML = ({ cible, photo, user, nomPhoto, idPhoto }) => {
    let casConsult = `
        <section class="cas-consult-wrapper flex-center flex-col" id="photo-propose-${idPhoto}">
            <article class="flex-row flex-center">
                <img src="${photo}" alt="Photo du Jeu" class="cible petite-cible"/>
                <p> -> </p>
                <img src="${cible}" alt="Cible Depose" class="cible petite-cible"/>
            </article>
            <article class="flex-start flex-col">
                <p class="pseudo-consult-wrapper texte" style="font-weight:600;">Pseudo :
                    <span class="pseudo-consult-val" style="font-weight: 100; margin-left: 10px;">${user}</span>
                </p>

                <p class="cible-consult-wrapper texte" style="font-weight:600;">Cible :
                    <span class="cible-consult-val" style="font-weight: 100; margin-left: 10px;">${nomPhoto}</span>
                </p>

            </article>

            <article class="cas-consult-img-wrapper" style="display:none;">
                <img class="accept-img img-btn" src="../../Images/verifier.png" alt="Valider Photo Button"/>
                <img class="decline-img img-btn" src="../../Images/cancel-black.png" alt="Refuser Photo Button"/>
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
    let allCasConsultWrappers = document.querySelectorAll('.cas-consult-wrapper');
    allCasConsultWrappers.forEach(async (cas) => {
        let acceptBtn = cas.querySelector(".accept-img");
        let declineBtn = cas.querySelector(".decline-img");
        let imgBtnWrapper = cas.querySelector(".cas-consult-img-wrapper");

        cas.addEventListener("mouseenter", () => imgBtnWrapper.style.display = "flex");
        cas.addEventListener("mouseleave", () => {
            imgBtnWrapper.style.display = "none";
            let messTag = cas.querySelector(".mess");
            if (messTag) messTag.style.display = "none"
            window.location.href = "consultation_depot.html"
        });

        declineBtn.addEventListener('mouseenter', (event) => event.target.src = "../../Images/cancel-white.png")
        declineBtn.addEventListener('mouseleave', (event) => event.target.src = "../../Images/cancel-black.png")

        resForm = new FormData();
        resForm.append("idPhoto", cas.id.substring(14));

        handleDecisionPhoto(acceptBtn, "addPhotoValide")
        handleDecisionPhoto(declineBtn, "removePhotoValide")

        function showMessage(bc, mess){
            let messTag = cas.querySelector(".mess")
            if(!messTag){
                let newBlock = `
                    <p class="texte poppin-police mess" style="color: #F4F1EC; background-color: ${bc}; padding: 10px 30px; border-radius: 7px; font-weight:600;"> 
                        ${mess} 
                    </p>
                `
                cas.insertAdjacentHTML("beforeend", newBlock)
            }else messTag.textContent = mess
        }
    
        function handleDecisionPhoto (btn, action){
            btn.addEventListener('click', () => {
                try{
                    ( async () => {
                        let addPhReq = await fetch(`https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/${action}.php`, {
                            header : "Content-Type : application/json",
                            method : "POST",
                            body : resForm
                        })
    
                        if (!addPhReq.ok) throw new Error("Erreur de connexion au service");
                        let addPhReqJSON = await addPhReq.json();
                        if (addPhReqJSON.status === "error") throw new Error("Validation n'a pas pu aboutir");
                        showMessage("#ff9358", addPhReqJSON.status)
                    })();
                } catch (error){ showMessage("#443b75", error) }
            });
        }
    })
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