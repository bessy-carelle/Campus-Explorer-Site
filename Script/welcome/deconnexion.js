const acceptation= document.querySelector('.acceptation');
const refus = document.querySelector('.refus');

acceptation.addEventListener('click', ()=>{
    const user = localStorage.getItem("iduser");
    const admin = localStorage.getItem("idadmin");
    if(user || admin && localStorage.length>0){
        // Marquer que l'utilisateur vient de la page de déconnexion
        sessionStorage.setItem("fromLogout", "true");
        //Suppression immédiate de toutes les données de l'utilisateur! 
        localStorage.clear;

        //Redirection vers la page index.html
        window.location.href = "../../index.html";
    }
});

refus.addEventListener('click', ()=>{
    const user = localStorage.getItem("iduser");
    const admin = localStorage.getItem("idadmin");
    if(user){
        window.location.href = "../../Pages/user/profil.html";
    }else if(admin){
        window.location.href = "../../Pages/admin/profil.html";
    }
});
