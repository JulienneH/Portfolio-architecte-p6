
///changer la mise en page de index.html quand l'utilisateur est connecté 
function layoutUpdate() {

    if (localStorage.getItem('token')) {  // on vérifie si la connexion a réusssi
        console.log("Connexion réussie");
        const modify = document.querySelector(".modify");
        const button = document.getElementById("buttonContainer");
        const log = document.querySelector(".Log");
        const editMode = document.querySelector(".edit_mode");
        if (modify, button) {
            modify.classList.add('visible');
            button.classList.add('hidden');
            log.textContent = "Logout";
            editMode.classList.add('visible');

        } else {
            console.error("élément introuvable");
        }
    } else {
        console.log("Vous n'êtes pas connecté");
    }
};
document.addEventListener('DOMContentLoaded', layoutUpdate);

//logout function
const log = document.querySelector(".Log");

log.addEventListener('click', function logout() {
    localStorage.removeItem('token');
    location.reload();

});


//fonction pour récupérer les works depuis le backend
// et pour retourner la réponse sous format json
let Works;

async function fetchWorksFromApi() {
    const response = await fetch("http://localhost:5678/api/works"); //GET par défaut
    const works = await response.json();
    return works;
}
//Pour éviter de faire un second appel à l'API 
// on fait un appel à l'API seulement si Works est null
// sinon on récupère la réponse de fetchWorksFromApi
async function getWorks() {
    if (!Works) {
        Works = await fetchWorksFromApi();
    }
    return Works
}


//affichage des travaux dans le DOM 
async function displayWorks() {

    const displayWorks = document.createElement("div");

    // obtenir les travaux à afficher en appelant la fonction getWorks
    const arrayworks = await getWorks();

    //pour chaque travaux je créé une balise figure

    arrayworks.forEach((work) => {
        const workElement = document.createElement("figure");
        displayWorks.classList.add("gallery");


        // Créer un élément img pour chaque URL d'image 
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;

        // Ajout de l'élément image dans <figure> 
        workElement.appendChild(imageElement);

        // Ajout du titre dans <figure>
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = work.title;
        workElement.appendChild(titleElement);

        // Ajout de <figure> dans displayWorks donc ajout des works dans le conteneur
        displayWorks.appendChild(workElement);

    });

    // Ajout des works dans la section avec l'id worksContainer dans le DOM 
    document.getElementById("worksContainer").appendChild(displayWorks);

}



displayWorks();
//récupérer les catégories depuis le backend

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
}

function createAllWorksButton() {
    const buttonContainer = document.getElementById("buttonContainer");
    const allButton = document.createElement("button");
    allButton.textContent = "Tout";
    allButton.classList.add("button");
    buttonContainer.appendChild(allButton);

    allButton.addEventListener("click", () => {
        const worksContainer = document.getElementById("worksContainer");
        worksContainer.innerHTML = "";
        displayWorks();
    });
}


getCategories().then(categories => {// une fois que getCategorie a reussi à récupérer les catégorie du backend
    createAllWorksButton();
    categories.forEach(categorie => {
        const button = document.createElement("button"); // je créé un bouton pour chaque catégorie
        button.textContent = categorie.name;
        button.classList.add("button");
        buttonContainer.appendChild(button);
        button.addEventListener("click", () => {
            displayWorksByCategory(categorie);
        }
        )
    });

});


async function displayWorksByCategory(category) {
    const displayCategories = document.createElement("div");

    const works = await getWorks(); // je récupère les travaux associés à la catégorie

    works.forEach(work => {
        if (work.categoryId === category.id) { // je vérifie si le work appartient à la catégorie en comparant les id
            const workElement = document.createElement("figure");
            displayCategories.classList.add("gallery");

            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
            workElement.appendChild(imageElement);

            const titleElement = document.createElement("figcaption");
            titleElement.innerText = work.title;
            workElement.appendChild(titleElement);

            displayCategories.appendChild(workElement);

        }

    });


    // Supprime tous les travaux qui étaient affichés précédemment 
    document.getElementById("worksContainer").innerHTML = "";


    // j'ajoute les travaux au dom 
    document.getElementById("worksContainer").appendChild(displayCategories);

}

//ouverture de la modale 

const modale = document.getElementById("modale");

function openModale() {
    modale.classList.remove("hidden");
    displayWorksInModal();

}

// fermeture de la modale 

const cross = document.querySelector(".cross");
cross.addEventListener('click', () => {
    modale.classList.add("hidden");

});
// affichage des travaux dans la modale
const modalWorks = document.getElementById("modalWorks");

async function displayWorksInModal() {
    // Vérifier s'il y a déjà des travaux affichés
    if (modalWorks.children.length > 0) {
        // S'il y en a, les supprimer
        modalWorks.innerHTML = '';
    }

    const displayWorks = document.createElement("div");
    const arrayworks = await getWorks();
    arrayworks.forEach((work) => {
        const modalWork = document.createElement("figure");
        displayWorks.classList.add("styleWorksModal");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        modalWork.appendChild(imageElement);
        displayWorks.appendChild(modalWork);

    });
    modalWorks.appendChild(displayWorks);
}
