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


// Vérification de l'email en temps réel
document.addEventListener("DOMContentLoaded", function () {
    let emailInput = document.getElementById("email");
    let emailLabel = document.getElementById("emailLabel");

    if (emailInput && emailLabel) {
        emailInput.addEventListener("input", function () {
            let email = emailInput.value.trim();
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(email)) {
                emailLabel.textContent = "✅ Email valide";
                emailLabel.style.color = "green";
            } else {
                emailLabel.textContent = "❌ Email invalide";
                emailLabel.style.color = "red";
            }
        });
    } else {
        console.error("L'input email ou son label est introuvable dans le DOM.");
    }
});

// Gestion du formulaire d'inscription
const form = document.getElementById("form-inscr");

if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        fetch(form.action, {
            method: form.method,
            body: formData,
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
                    alert(data.message);
                    window.location.href = "../Pages/user/profil.html";
                } else {
                    alert(data.message || "Erreur lors de l'inscription.");
                }
            })
            .catch((error) => {
                console.error("Erreur:", error);
                alert("Une erreur est survenue. Veuillez réessayer.");
            });
    });
} else {
    console.error("Le formulaire d'inscription n'existe pas dans le DOM.");
}
