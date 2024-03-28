document.addEventListener('DOMContentLoaded', function () {
    //variables globales
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const msgError = document.querySelector(".login p");
    const submit = document.getElementById("submit");

    // requête API avec méthode POST

    function fetchUserFromApi() {
        return fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                "email": valueEmail,
                "password": valuePassword,

            })
        })
    }
    // événement au clic sur le bouton

    submit.addEventListener('click', async (e) => {
        e.preventDefault();
        valueEmail = email.value;
        valuePassword = password.value;

        try {
            const response = await fetchUserFromApi();
            const login = await response.json();

            if (login.token) {
                localStorage.setItem('connexionReussie', 'true');
                window.location.href = "index.html";

            } else {
                console.error("Token introuvable");
                msgError.innerHTML = "Identifiant ou mot de passe incorrect";
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la requête :", error);
            localStorage.removeItem('token');
        }
        let token = localStorage.getItem('token');
        console.log("connecté");


    });

});
