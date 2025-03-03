
document.addEventListener("DOMContentLoaded", function () {
    const user = localStorage.getItem("iduser");
    const admin = localStorage.getItem("idadmin");

       localStorage.clear();

    // Restaurer les identifiants utilisateur et admin
    if (user) localStorage.setItem("iduser", user);
    if (admin) localStorage.setItem("idadmin", admin);

});

document.addEventListener("DOMContentLoaded", function () {
    const user = localStorage.getItem("iduser");
    const admin = localStorage.getItem("idadmin");

    // Cacher les boutons "Connexion" et "Inscription" si l'utilisateur est connect�
    if (user || admin) {
        let connexionBtn = document.querySelector("nav .menu-list li:nth-child(1)");
        let inscriptionBtn = document.querySelector("nav .menu-list li:nth-child(2)");

        if (connexionBtn) connexionBtn.style.display = "none";
        if (inscriptionBtn) inscriptionBtn.style.display = "none";
    }
});


window.addEventListener("beforeunload", function () {
    localStorage.clear(); // Vide tout le localStorage � la fermeture de l'onglet
});
// Gestion du bouton "Choisissez votre piste!"
const choixPisteBtn = document.getElementById('choixPiste');
if (choixPisteBtn) {
    choixPisteBtn.addEventListener("click", function () {
        console.log("clicked");
        const user = localStorage.getItem("iduser");
        const admin = localStorage.getItem("idadmin");

        if (!user && !admin) {
            alert("Vous devez être connecté pour accéder à cette page.");
            window.location.href = "Pages/welcome/connexion.html"; // Redirige vers connexion
        } else if(user) {
            window.location.href = "Pages/welcome/jeu.html"; // Redirige vers le profil utilisateur
        }else{
            window.location.href = "Pages/admin/profil.html";
        }
    })
}else{
    console.error("choixPiste Not available")
};

// Gestion du menu déroulant
let menuWrapper = document.querySelector(".menu-wrapper");
let menuList = document.querySelector(".menu-list");
let menuBtn = document.querySelector(".menu-btn");

console.log(menuBtn);
console.log(menuList);
console.log(menuWrapper);

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        if (menuList.style.display === "none") {
            menuList.style.display = "flex";
            menuBtn.classList.add("open");
            menuWrapper.classList.add("menu-wrapper");
            menuWrapper.style.margin = "10px 0 0 10px";
            menuWrapper.style.backgroundColor = "white";
        } else if (menuList.style.display === "flex") {
            menuWrapper.style.backgroundColor = "#F4F1EC";
            menuList.style.display = "none";
            menuWrapper.style.margin = "0";
            menuBtn.classList.remove("open");
        }
    });
}

// Gestion de la connexion rapide
let bonhomme = document.querySelector('.profile-icon-wrapper');
if (bonhomme) {
    bonhomme.addEventListener('click', () => {
        const utilisateur = localStorage.getItem('iduser');
        const administrateur = localStorage.getItem('idadmin');

        if (!utilisateur && !administrateur) {
            alert("Connectez-vous pour accéder à votre profil.");
            window.location.href = "Pages/welcome/connexion.html";
        } else if (utilisateur) {
            window.location.href = "Pages/user/profil.html";
        } else {
            window.location.href = "Pages/admin/profil.html";
        }
    });
}

// Vérification de session et redirection en cas d'inactivité
function checkSession() {
    const user = localStorage.getItem("iduser");
    const admin = localStorage.getItem("idadmin");
    const lastActive = localStorage.getItem('lastActive');
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes d'inactivité

    if (!user && !admin) {
        alert("Vous devez être connecté pour accéder à cette page.");
        window.location.href = "Pages/welcome/connexion.html";  // Redirige vers la page de connexion
    } else if (lastActive && new Date().getTime() - lastActive > sessionTimeout) {
        alert("Votre session a expiré, veuillez vous reconnecter.");
        window.location.href = "Pages/welcome/connexion.html";  // Redirige vers la page de connexion
    } else {
        // Si la session est encore valide, mettre à jour le dernier moment d'activité
        localStorage.setItem('lastActive', new Date().getTime());
    }
}

// Met à jour l'activité utilisateur pour éviter la déconnexion
document.addEventListener("click", () => {
    localStorage.setItem('lastActive', new Date().getTime());
});
document.addEventListener("mousemove", () => {
    localStorage.setItem('lastActive', new Date().getTime());
});
document.addEventListener("keydown", () => {
    localStorage.setItem('lastActive', new Date().getTime());
});

const xs = new XMLHttpRequest();
xs.open("GET", "https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/getHunt.php?dispo=1");

xs.onreadystatechange = () => {
    if (xs.readyState === 4 && xs.status === 200) {
        try {
            const rep = JSON.parse(xs.responseText);
            console.log(rep);

            if (rep && Array.isArray(rep.message)) {
                let photos = rep.message;
                const photoaffiche = document.querySelector(".imagedumois");

                if (!photoaffiche) {
                    console.error("Le conteneur .imagedumois n'existe pas.");
                    return;
                }

                // Mélange aléatoire des images
                photos = photos.sort(() => 0.5 - Math.random());

                // Sélection de 2 images (ou moins si moins de 2 disponibles)
                const selectedPhotos = photos.slice(0, 2);

                selectedPhotos.forEach(photo => {
                    const col = document.createElement("div");
                    col.classList.add("col-md-6", "col-sm-12", "d-flex", "justify-content-center", "mb-3");

                    const img = document.createElement("img");
                    img.src = photo.data;
                    img.id = photo.idCible;
                    img.alt = photo.nom;
                    img.classList.add("img-fluid", "rounded", "shadow", "image-hover");
                    img.style.cursor = "pointer";

                    col.appendChild(img);
                    photoaffiche.appendChild(col);
                });
            } else {
                console.log("Le champ 'message' n'est pas un tableau !");
            }
        } catch (error) {
            console.error("Erreur lors du parsing JSON :", error);
        }
    }
};

xs.send();
