let menuWrapper = document.querySelector(".menu-wrapper");
let menuList = document.querySelector(".menu-list");
let menuBtn = document.querySelector(".menu-btn");

menuBtn.addEventListener("click", () => {
    if (getComputedStyle(menuList).display === "none") {
        menuList.style.display = "flex";
        menuBtn.classList.add("open");
        menuWrapper.classList.add("menu-wrapper");
        menuWrapper.style.margin = "10px 0 0 10px";
        menuWrapper.style.backgroundColor = "white";
    } else {
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
        try {
            const rep = JSON.parse(xs.responseText);
            console.log(rep);

            if (rep && Array.isArray(rep.message)) {
                const photos = rep.message;
                const photoaffiche = document.querySelector(".link-depot");
                if (!photoaffiche) {
                    console.error("Le conteneur .link-depot n'existe pas.");
                    return;
                }

                photos.forEach(photo => {
                    const col = document.createElement("div");
                    col.classList.add("col-md-6", "col-sm-12", "d-flex", "justify-content-center", "mb-3");
                    
                    const img = document.createElement("img");
                    img.src = photo.data;
                    img.id = photo.idCible;
                    img.alt = photo.nom;
                    img.classList.add("img-fluid", "rounded", "shadow", "image-hover");
                    img.style.cursor = "pointer";
                    
                    img.addEventListener("click", () => {
                        localStorage.setItem("selectedImage", JSON.stringify(photo));
                        window.location.href = "../../Pages/user/depot.html";
                    });
                    
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

document.querySelector(".profile-icon-wrapper").addEventListener("click", () => {
    function checkSession() {
        const user = localStorage.getItem("iduser");
        const admin = localStorage.getItem("idadmin");
        const lastActive = localStorage.getItem("lastActive");
        const sessionTimeout = 30 * 60 * 1000; 
        
        if (!user && !admin) {
            alert("Vous devez être connecté pour accéder à cette page.");
            window.location.href = "../../Pages/welcome/connexion.html";
        } else if (lastActive && new Date().getTime() - lastActive > sessionTimeout) {
            alert("Votre session a expiré, veuillez vous reconnecter.");
            window.location.href = "../../Pages/welcome/connexion.html";
        } else if (admin) {
            window.location.href = "../../Pages/admin/profil.html";
        } else {
            localStorage.setItem("lastActive", new Date().getTime());
        }
    }
    
    checkSession();
});
