document.addEventListener('DOMContentLoaded', function () {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const msgError = document.querySelector(".login p");
    const submit = document.getElementById("submit");

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

    submit.addEventListener('click', async (e) => {
        e.preventDefault();
        valueEmail = email.value;
        valuePassword = password.value;

        try {
            const response = await fetchUserFromApi();
            const login = await response.json();

            if (login.token) {
                localStorage.setItem('token', login.token);
                window.location.href = "index.html";

            } else {
                console.error("Token introuvable");
                msgError.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la requête :", error);
            localStorage.removeItem('token');
        }

    });

});
