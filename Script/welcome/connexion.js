// Gestion du menu d�roulant
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

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#form-con");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        console.log("?? Donn�es envoy�es :", Object.fromEntries(formData)); // V�rifier les donn�es envoy�es

        try {
            console.log("?? Envoi de la requ�te � :", form.action);

            const response = await fetch(form.action, {
                method: form.method,
                body: formData
            });

            console.log("? R�ponse HTTP re�ue :", response);

            if (!response.ok) {
                throw new Error(`? Erreur serveur : ${response.status}`);
            }

            const result = await response.json();
            console.log("?? R�ponse JSON :", result);

            if (result.status === "success") {
                localStorage.setItem("iduser", result.id);
                localStorage.setItem("pseudo", result.pseudo);
                localStorage.setItem("lastActive", new Date().getTime());

                if (result.message === "Utilisateur") {
                    console.log("?? Redirection utilisateur...");
                    window.location.href = "../../Pages/user/profil.html";
                } else if (result.message === "Administrateur") {
                    console.log("?? Redirection administrateur...");
                    window.location.href = "../../Pages/admin/profil.html";
                }
            } else {
                console.warn("?? Erreur de connexion :", result.message);
                alert(result.message || "Nom ou mot de passe incorrect");
            }
        } catch (error) {
            console.log("?? Erreur d�tect�e :", error);
            alert("Une erreur est survenue. Veuillez r�essayer.",error);
        }
    });
});
