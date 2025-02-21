const acceptation= document.querySelector('.acceptation');
const refus = document.querySelector('.refus');

acceptation.addEventListener('click', ()=>{
    const user = localStorage.getItem("iduser");
    const admin = localStorage.getItem("idadmin");
    if(user || admin && localStorage.length>0){
        localStorage.clear;
        alert("Vous vous êtes bien déconnectés");
        window.location.href = "../../Pages/welcome/connexion.html";
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
