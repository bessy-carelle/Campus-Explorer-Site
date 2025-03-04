let ajoutPhoto = document.querySelector(".upload-button");
let selFile = ajoutPhoto.querySelector("#file-upload");
let fileName = ajoutPhoto.querySelector(".file-name em");
let submitBtn = document.querySelector(".good-btn");
let formContainer = document.querySelector(".form-container");


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

// Définir une variable pour stocker la photo
let photoData = null;
let photoName = null;

// Ouvrir le sélecteur de fichier lorsqu'on clique sur le bouton
ajoutPhoto.addEventListener('click', () => {
    selFile.click();
});

selFile.addEventListener('change', (event) => {
    let selectedFile = event.target.files[0];
    if (selectedFile) {
        fileName.textContent = selectedFile.name;
        const reader = new FileReader();
        reader.onload = function () {
            photoData = reader.result;
            photoName = selectedFile.name;
        };
        reader.readAsDataURL(selectedFile);
    }
});

// Récupérer et stocker le nom de la cible
let nomCibleInput = document.querySelector(".nom");
let nomCible = "";

nomCibleInput.addEventListener('input', (event) => {
    nomCible = event.target.value;
});


let indices = [];
let indiceStr = "";
// Limite maximale d'indices
const MAX_INDICES = 5;

// Sélecteurs
let inputIndiceWrapper = document.querySelector(".indicesCible");
let addIndiceBtn = inputIndiceWrapper.querySelector(".img-action");
let indiceInput = inputIndiceWrapper.querySelector(".indices");
let indiceList = document.querySelector(".ol-indicesPlus");

// Fonction pour ajouter un indice
addIndiceBtn.addEventListener('click', function() {
    let indiceVal = indiceInput.value;

    // Vérifier si l'indice n'est pas vide et si la limite d'indices n'est pas atteinte
    if (indiceVal && indices.length < MAX_INDICES) {
        // Ajouter l'indice au tableau
        indices.push(indiceVal);

        // Créer un nouvel élément <li> pour afficher l'indice
        let newIndice = document.createElement("li");
        newIndice.className = "texte";
        newIndice.textContent = `${indiceVal}`; // Afficher l'indice avec son numéro
        indiceList.appendChild(newIndice);

        // Réinitialiser le champ d'input
        indiceInput.value = "";

        // Si la limite est atteinte, désactiver le champ de saisie et cacher le bouton
        if (indices.length === MAX_INDICES) {
            alert("La limite d'indices est de 5; ça sera votre dernier indice.");
            indiceInput.disabled = true;  // Désactive le champ de saisie
            addIndiceBtn.style.display = "none"; // Cache le bouton
        }
    } else if (indices.length >= MAX_INDICES) {
        alert("Vous ne pouvez ajouter que 5 indices.");
    } else {
        alert("Veuillez entrer un indice valide.");
    }
});


const idUser = localStorage.getItem("iduser");

// Fonction pour envoyer les données au serveur
submitBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    // Vérifie que des indices ont été ajoutés
    if (indices.length === 0) {
        alert("Veuillez ajouter au moins un indice.");
        return;
    }

    if (!nomCible) {
        alert("Veuillez entrer le nom de la cible.");
        return;
    }

    if (!photoData) {
        alert("Veuillez télécharger une photo.");
        return;
    }

    for (i = 0; i <indices.length; i++) {
        indiceStr += i + indices[i] + "\n"
    }

    // Préparer les données à envoyer
    const formData = new FormData();
    formData.append("indice", JSON.stringify(indiceStr)); // Envoyer les indices sous forme de JSON
    formData.append("nom", nomCible);
    formData.append("image", photoData);
    formData.append("idUser",idUser);

    // Envoi de la requête POST
    fetch('https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/addHuntP.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert(data.message);
            setTimeout(() => {
                window.location.href = "../user/profil.html"; // Redirection après 3 secondes
            }, 3000);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        alert("Erreur lors de l'envoi des données: " + error);
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
        