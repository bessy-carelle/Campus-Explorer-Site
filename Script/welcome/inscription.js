// Gestion du menu deroulant
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

// Gestion du formulaire d'inscription
const form = document.getElementById("form-inscr");

if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        console.log(form.action);

        fetch("https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/addUser.php", {
            method: "POST",
            body: formData
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur réseau: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.message === "OK") {
                    alert("Compte crée avec succès");
                    window.location.href = "../welcome/connexion.html";
                } else {
                    alert(data.message || "Erreur lors de l'inscription.");
                }
            })
            .catch((error) => {
                console.log("Erreur:", error);
                alert("Une erreur est survenue. Veuillez réessayer.");
            });
    });
} else {
    console.error("Le formulaire d'inscription n'existe pas dans le DOM.");
}
