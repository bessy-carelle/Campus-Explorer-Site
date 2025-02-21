let menuWrapper = document.querySelector(".menu-wrapper");
let menuList = document.querySelector(".menu-list");
let menuBtn = document.querySelector(".menu-btn");

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

const xs = new XMLHttpRequest();
xs.open("get", "https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/getHunt.php?dispo=1");

xs.onreadystatechange = () => {
    if (xs.readyState === 4 && xs.status === 200) {
        const rep = JSON.parse(xs.responseText);
        console.log(rep);

        const photos = rep.message;

        if (Array.isArray(photos)) {
            const photoaffiche = document.querySelector(".link-depot"); // S�lectionne le bon conteneur

            photos.forEach(photo => {
                // Creation du conteneur Bootstrap
                const col = document.createElement("div");
                col.classList.add("col-md-6", "col-sm-12", "d-flex", "justify-content-center", "mb-3");

                // Creation de l'image
                const img = document.createElement("img");
                img.src = photo.data;
                img.id = photo.idCible;
                img.alt = photo.nom;
                img.classList.add("img-fluid", "rounded", "shadow", "image-hover"); // Classes Bootstrap et effet hover
                img.style.cursor = "pointer";
		
                // Gestion du clic sur l'image
                img.addEventListener("click", () => {
                    localStorage.setItem("selectedImage", JSON.stringify(photo));
                    window.location.href = "../../Pages/user/depot.html";
                });

                // Ajout de l'image au conteneur Bootstrap
                col.appendChild(img);

                // Ajout du conteneur � la section
                photoaffiche.appendChild(col);
            });
        } else {
            console.log("Le champ 'message' n'est pas un tableau !");
        }
    }
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
