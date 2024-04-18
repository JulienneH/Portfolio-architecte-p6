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
            log.classList.add('Log');
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
    return Works;
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
        workElement.id = `work_${work.id}`;


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

////////filtres pour trier par catégorie /////////////
//récupérer les catégories depuis le backend

async function fetchCategories() {

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

//////////////modale///////////////////

//variables pour la modale 

const modale = document.getElementById("modale");
const buttonModal = document.querySelector(".buttonModal");
const titleModal = document.querySelector(".modal_title");
const firstPage = document.querySelector(".first_page");
const secondPage = document.querySelector(".second_page");
const body = document.body;
//ouverture de la modale

function openModale() {

    modale.classList.remove("hidden");
    displayWorksInModal();
    console.log("modale ouverte");
    body.classList.add("backgroundGrey");


}
// fermeture de la modale

function closeModale() {
    modale.classList.add("hidden");
    body.classList.remove("backgroundGrey");

}

//ecouteur evenement fermeture modale
document.addEventListener('click', function (event) {
    if (!modale.contains(event.target)) {
        closeModale();
    }
});

//ecouteur evenement clic sur modifier 

const modifyButton = document.querySelector(".modify");
modifyButton.addEventListener('click', function modifyButtonClick(event) {
    openModale();
    event.stopPropagation();
})

//fermer la modale avec la croix

modale.addEventListener('click', (event) => {
    if (event.target.classList.contains('cross')) {
        modale.classList.add("hidden");
        body.classList.remove("backgroundGrey");
    }
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
    arrayworks.forEach(function createModalWork(work) {

        const modalWork = document.createElement("figure");
        modalWork.id = `modal_work_${work.id}`;
        displayWorks.classList.add("styleWorksModal");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-regular", "fa-trash-can", "delete_logo");
        deleteIcon.dataset.workId = work.id;
        deleteIcon.addEventListener("click", deleteWork);
        modalWork.appendChild(deleteIcon);
        modalWork.appendChild(imageElement);
        displayWorks.appendChild(modalWork);

    });
    modalWorks.appendChild(displayWorks);
}

//seconde page modale

buttonModal.addEventListener('click', function () {
    firstPage.classList.add("hidden");
    secondPage.classList.remove("hidden");
    const arrowPrevious = document.querySelector(".arrow_previous");
    arrowPrevious.addEventListener('click', function () {
        // Supprimer la secondPage de la modalWorks
        secondPage.classList.add("hidden");
        firstPage.classList.remove("hidden");


    });
    //Ajouter le fichier selectionné dans le rectangle de la 2nd page de la modale
    const rectangle = document.querySelector(".rectangle");
    imageFormat = document.querySelector(".image_format");
    const imageInput = document.getElementById('image');
    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const imageUrl = reader.result;
                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                imageElement.classList.add('modal_image');
                imageFormat.innerHTML = '';
                rectangle.appendChild(imageElement);
            };
            reader.readAsDataURL(file);
        }
    });
    ;


    secondPage.appendChild(arrowPrevious);
    modale.appendChild(secondPage);


})
document.addEventListener("DOMContentLoaded", function () {
    const modalCategorie = document.getElementById("categorie");
    let selectedCategorie = document.getElementById("selectedCategory");
    console.log(selectedCategorie);
    //remplir le menu déroulant

    fetchCategories().then(categories => {
        categories.forEach(category => {
            let option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            modalCategorie.appendChild(option);
        });
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


});
//suppression des travaux depuis la modale 
function deleteWork(event) {

    if (localStorage.getItem('token')) {
        const trash = event.currentTarget;
        const id = trash.dataset.workId;
        const suppr = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        };
        fetch(`http://localhost:5678/api/works/${id}`, suppr)
            .then((response) => {
                if (!response.ok) {
                    console.log("le delete n'a pas fonctionné");
                } else {
                    console.log("le delete a fonctionné");
                    const workElement = document.getElementById(`work_${id}`);
                    if (workElement) {
                        workElement.remove();
                    }
                    else {
                        console.log("élement de travail non trouvé");
                    }
                    const modalWorkElement = document.getElementById(`modal_work_${id}`);
                    if (modalWorkElement) {
                        modalWorkElement.remove();

                        // Mettre à jour Works en supprimant le travail avec l'ID correspondant
                        Works = Works.filter((work) => (work.id !== id));

                    } else {
                        console.error("travail non trouvé dans la modale");
                    }
                }
            })
    } else {
        console.log("pas de token donc la supression a échoué")
    }
}
// Mettre à jour la variable Works après la suppression du travail
/*console.log(Works, id);
Works = Works.filter((work) => {

    console.log(work, id, work.id !== id);
    return work.id !== id;
});
//Works.splice(Works.find((work) => work.id === id), 1);
console.log(Works);*/

/////envoi d'un nouveau projet au backend /////////
//récupération des données fournies par l'utilisateur

const buttonValidate = document.getElementById("buttonValidate");

buttonValidate.addEventListener("click", async function () {
    const titre = document.getElementById('title').value;
    const category = document.getElementById('categorie').value;
    const image = document.getElementById('image').files[0];

    // validation des données saisies par l'utilisateur
    if (!dataValidator(titre, category, image)) {


        return;
    }
    buttonValidate.classList.remove('grey');
    buttonValidate.classList.add('green');


    const formData = new FormData();

    formData.append('title', titre);
    formData.append('category', category);
    formData.append('image', image);

    console.log(titre, category, image);
    //envoi d'un nouveau projet vers le backend//
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log("La requête a fonctionné", responseData);
            createWorkElement(responseData);
            createWorkElementInModal(responseData);
            Works.add(responseData);

        } else {
            console.error('Erreur lors de l\'envoi des données:');
        }
    } catch (error) {
        console.error('Erreur lors de la requête vers API:', error);
    }
});

function createWorkElement(workData) {

    const gallery = document.querySelector(".gallery")
    const workElement = document.createElement("figure");
    workElement.id = `work_${workData.id}`;
    const imageElement = document.createElement('img');
    imageElement.src = workData.imageUrl;
    const titleElement = document.createElement('figcaption');
    titleElement.innerHTML = workData.title;
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
    gallery.appendChild(workElement);
    const worksContainer = document.getElementById("worksContainer");
    worksContainer.appendChild(gallery);


}


function createWorkElementInModal(workData) {

    const worksModal = document.querySelector(".styleWorksModal");

    const modalWork = document.createElement("figure");
    modalWork.id = `work_${workData.id}`;

    const imageElement = document.createElement('img');
    imageElement.src = workData.imageUrl;
    modalWork.appendChild(imageElement);


    worksModal.appendChild(modalWork);

    document.getElementById("modalWorks").appendChild(worksModal);
}


function dataValidator(titre, category, image) {
    if (!titre.trim()) {
        alert("Veuillez entrer le titre de votre projet")
        return false;

    }
    if (!category.trim()) {
        alert(" Veuillez séletionner une catégorie de projet");
        return false;
    }
    if (!image) {
        alert("Veuillez sélectionner une image");
        return false;
    }


    return true;

}