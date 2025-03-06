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


// Fonction pour calculer le score en fonction des photos validées.
if (userID){
    fetch(`https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/getUser.php?idUser=${userID}`)
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const scoreElt = document.querySelector(".score");
            data.message.forEach (({score}) =>{
                scoreElt.textContent = score;
            });
            // Ajout des niveaux après le calcul du score
            (()  => {
                const badgeElt = document.querySelector(".niveau");
                if (!scoreElt) {
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
                badgeElt.textContent = niveau;
            })();

        }
    })
}
// Récuperation cible déjà effectué
if (userID){
    fetch(`https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/getPhotoV.php?idUser=${userID}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const photoVal= document.querySelector('.photoV');
                // Parcourir chaque photo récupérée
                data.message.forEach(({nomPhoto,data}) => {
                    //création balise article du html contenant les infos des bonnes photos déposées par l'utilisateur
                    const newBlock = `
                        <article class="flex-col flex-center">
                            <img src = '${data}' class="gros-cible cible" alt="${nomPhoto}">
                            <p class="flex-center texte">"${nomPhoto}"</p>
                        </article>
                    `
                    photoVal.insertAdjacentHTML("beforeend",newBlock);
                });    
            } else {
                console.error("Erreur de récupération des cibles :", data.message);
            }
        })
        .catch(error => console.error("Erreur lors de la requête :", error));
} else {
    console.log("Utilisateur non connecté, impossible de récupérer les cibles.");
};





  











