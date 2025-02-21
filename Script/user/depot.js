// MENU //
let menuWrapper = document.querySelector(".menu-wrapper");
let menuList = document.querySelector(".menu-list");
let menuBtn = document.querySelector(".menu-btn");

menuBtn.addEventListener('click', () => {
    let currentDisplay = window.getComputedStyle(menuList).display;

    if (currentDisplay === "none") {
        menuList.style.display = "flex";
        menuBtn.classList.add("open");
        menuWrapper.style.margin = "10px 0 0 10px";
        menuWrapper.style.backgroundColor = "white";
    } else {
        menuWrapper.style.backgroundColor = "#F4F1EC";
        menuList.style.display = "none";
        menuWrapper.style.margin = "0";
        menuBtn.classList.remove("open");
    }
});

// Pour l'ajout de photo
let ajoutPhoto = document.querySelector(".upload-button");
let selFile = document.querySelector("#file-upload");
let fileName = document.querySelector(".file-name em");
let submitBtn = document.querySelector(".good-btn");
let formContainer = document.querySelector(".form-container");

ajoutPhoto.addEventListener('click', () => {
    selFile.click(); // Pour ouvrir le sélecteur de fichiers
});

ajoutPhoto.addEventListener('mouseenter', () => ajoutPhoto.style.cursor = "pointer");
ajoutPhoto.addEventListener('mouseleave', () => ajoutPhoto.style.cursor = "default");

selFile.addEventListener('change', (event) => {
    let selectedFile = event.target.files[0];
    if (selectedFile) {
        fileName.textContent = selectedFile.name;
    }
});


// Récupération des données stockées dans localStorage
const cibleData = localStorage.getItem("selectedImage");

// Vérification que cibleData existe et est valide
if (cibleData) {
    const laCible = JSON.parse(cibleData); // Transformation en objet JSON

    if (laCible && laCible.data && laCible.nom) {
        const imageContainer = document.querySelector(".affiche-photo");

        // Créer l'élément <img>
        const img = document.createElement("img");
        img.src = laCible.data; // URL de l'image
        img.alt = laCible.nom; // Texte alternatif
        img.classList.add("gros-cible");
        img.style.borderRadius = "15px";
        img.style.border = "2px solid #111144";

        // Ajouter l'image au conteneur
        imageContainer.appendChild(img);

        // Affichage des indices
        document.querySelector('.indice').addEventListener("click", () => {
            const indiceSpec = laCible.indice;
            const indiceCible = document.querySelector('.indice-text'); // Correction ici

            if (indiceCible) {
                indiceCible.style.display = 'block';
                indiceCible.textContent = `Indice : ${indiceSpec}`;
            } else {
                console.error("Élément .indice-text introuvable !");
            }
        });
    } else {
        console.error("Les données de la cible sont invalides !");
    }
} else {
    console.error("Aucune image sélectionnée !");
}

// Soumission du formulaire
submitBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    let selectedFile = selFile.files[0]; // Récupère le fichier sélectionné

    if (!cibleData) {
        alert("Erreur : aucune cible sélectionnée.");
        return;
    }

    let laCible = JSON.parse(cibleData);
    let idcible = laCible.idCible; // Récupère l'id de la cible
    let idUser = localStorage.getItem("iduser"); // Récupère l'id de l'utilisateur depuis localStorage

    // Vérification des données
    if (!selectedFile) {
        alert("Veuillez sélectionner une image.");
        return;
    }
    if (!idUser || !idcible) {
        alert("Erreur : utilisateur ou cible introuvable.");
        return;
    }

    // Création de l'objet FormData pour envoyer les données
    let formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("idUser", idUser);
    formData.append("idCible", idcible);

    // Envoi des données à l'API PHP
    fetch("https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/addPhoto.php", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "OK") {
            alert("Dépôt de la photo pris en compte !");
            setTimeout(() => {
                window.location.href = "../welcome/jeu.html"; // Redirection après 3 seconde
            }, 3000);
        } else {
            alert("Erreur : " + data.message);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la soumission :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    });
});
let bonhomme = document.querySelector('.profile-icon-wrapper');
if (bonhomme) {
    bonhomme.addEventListener('click', () => {
        const utilisateur = localStorage.getItem('iduser');
        const administrateur = localStorage.getItem('idadmin');

        if (!utilisateur && !administrateur) {
            alert("Connectez-vous pour accéder à votre profil.");
            window.location.href = "../../Pages/welcome/connexion.html";
        } else if (utilisateur) {
            window.location.href = "../../Pages/user/profil.html";
        } else {
            window.location.href = "../../Pages/admin/profil.html";
        }
    });
}