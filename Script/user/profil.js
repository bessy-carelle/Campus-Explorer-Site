//menu
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


// Recuperation de l'ID de l'utilisateur
const userID = localStorage.getItem ('iduser');
if (!userID) {
    // Afficher un message invitant à se connecter si aucun utilisateur n'est connecté
    document.getElementById('infoUser').textContent = "Veuillez vous connecter pour voir votre profil.";
}else {
    const pseudo = localStorage.getItem('pseudo');
    document.getElementById('nomUtilisateur').textContent = pseudo;

}


// Fonction pour calculer le score en fonction des photos validées
function calculerScore(photos) {
    if (!Array.isArray(photos)) {
        console.error("Données invalides pour le calcul du score.");
        return;
    }

    const score = photos.length; 

    // Mise à jour de l'affichage du score dans la page
    const badgeElement = document.querySelector(".badge");
    if (badgeElement) {
        badgeElement.textContent = `${score}`;
    }

    console.log(`Score de l'utilisateur : ${score}`);
}
// appel de la fonction
// calculerScore(data.message);

// Ajout des niveaux après le calcul du score
function ajouterNiveau() {
    const badgeElt = document.querySelector(".niveau");
    const scoreElt = document.querySelector(".score");

    if (!scoreElt || !badgeElt) {
        console.error("Pas de score pour toi pour l'instant!");
        return;
    }

    const score = parseInt(scoreElt.textContent) || 0; // Récupérer le score affiché

    let niveau = "Débutant";
    if (score >= 20) niveau = "Légende ";
    else if (score >= 15) niveau = "Maître";
    else if (score >= 8) niveau = "Expert ";
    else if (score >= 3) niveau = "Apprenti";

    // Ajout du niveau à côté du score
    badgeElt.innerHTML = niveau;
}
// Exécuter la fonction
ajouterNiveau();


// Récuperation cible déjà effectué
if (userID){
fetch(`https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/getPhotoV.php?idUser=${userID}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const ciblesContainer = document.querySelector('.form-container');

                if (data.message && Array.isArray(data.message)) {
                    calculerScore(data.message); // ✅ Appel après récupération des données
                } else {
                    console.error("Les données récupérées ne sont pas valides :", data.message);
                }

                // Parcourir chaque photo récupérée
                data.message.forEach(photo=> {
                    const { idPhoto, idCible, nomPhoto, idUser, datePublication,data: imageData} = photo;
                     //article pour chaque cible
                    const article = document.createElement('article');
                    article.classList.add('flex-center', 'flex-col');
 
                     // Ajout image
                    const img = document.createElement('img');
                    img.src = `data:image/jpeg;base64,${imageData}`;
                    img.alt = nomPhoto;
                    img.classList.add('gros-cible');
                    article.appendChild(img);

                    //nom cible
                    const nameCible = document.createElement('p');
                    nameCible.classList.add('texte', 'flex-center');
                    nameCible.textContent = nomPhoto;
                    article.appendChild(nameCible);

                    //ajouter toutes les cibles à la page
                    ciblesContainer.appendChild(article);
                });    
            } else {
                console.error("Erreur de récupération des cibles :", data.message);
            }
        })
        .catch(error => console.error("Erreur lors de la requête :", error));
} else {
    console.log("Utilisateur non connecté, impossible de récupérer les cibles.");
};