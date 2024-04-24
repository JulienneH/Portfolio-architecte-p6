///changer la mise en page de index.html quand l'utilisateur est connecté 
function layoutUpdate() {

    if (localStorage.getItem('token')) {
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
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}
// utiliser un cache pour éviter un 2nd appel à l'api
async function getWorks() {
    if (!Works) {

        Works = await fetchWorksFromApi();
    }
    return Works;
}


//affichage des travaux dans le DOM 
async function displayWorks() {

    const displayWorks = document.createElement("div");
    const arrayworks = await getWorks();
    arrayworks.forEach((work) => {
        const workElement = document.createElement("figure");
        displayWorks.classList.add("gallery");
        workElement.id = `work_${work.id}`;
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        workElement.appendChild(imageElement);
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = work.title;
        workElement.appendChild(titleElement);
        displayWorks.appendChild(workElement);

    });

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

// bouton "tout"
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
    const works = await getWorks();
    works.forEach(work => {
        if (work.categoryId === category.id) {
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
    document.getElementById("worksContainer").innerHTML = "";
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
    body.classList.add("backgroundGrey");
}

// fermeture de la modale

function closeModale() {
    modale.classList.add("hidden");
    body.classList.remove("backgroundGrey");

}

document.addEventListener('click', function (event) {
    if (!modale.contains(event.target)) {
        closeModale();
    }
});

const modifyButton = document.querySelector(".modify");
modifyButton.addEventListener('click', function modifyButtonClick(event) {
    openModale();
    event.stopPropagation();
})

//fermer la modale avec la croix

modale.addEventListener('click', (event) => {
    if (event.target.classList.contains('cross')) {
        closeModale();
    }
});


// affichage des travaux dans la modale
const modalWorks = document.getElementById("modalWorks");
async function displayWorksInModal() {
    if (modalWorks.children.length > 0) {
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
        const deleteIcon = createDeleteIcon(work.id);
        modalWork.appendChild(deleteIcon);
        modalWork.appendChild(imageElement);
        displayWorks.appendChild(modalWork);
    });
    modalWorks.appendChild(displayWorks);
}
function createDeleteIcon(workId) {
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-regular", "fa-trash-can", "delete_logo");
    deleteIcon.dataset.workId = workId;
    deleteIcon.addEventListener("click", deleteWork);
    return deleteIcon;
}
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
                        Works = Works.filter((work) => (work.id != id));

                    } else {
                        console.error("travail non trouvé dans la modale");
                    }
                }
            })
    } else {
        console.log("pas de token donc la supression a échoué")
    }
}


//seconde page modale
buttonModal.addEventListener('click', function () {
    firstPage.classList.add("hidden");
    secondPage.classList.remove("hidden");
    const arrowPrevious = document.querySelector(".arrow_previous");
    arrowPrevious.addEventListener('click', function () {
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
    secondPage.appendChild(arrowPrevious);
    modale.appendChild(secondPage);
})
// création du menu déroulant et des boutons pour les catégories

document.addEventListener("DOMContentLoaded", function () {
    const modalCategorie = document.getElementById("categorie");
    let selectedCategorie = document.getElementById("selectedCategory");
    console.log(selectedCategorie);
    fetchCategories().then(categories => {
        categories.forEach(category => {
            let option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            modalCategorie.appendChild(option);
        });
        createAllWorksButton();
        categories.forEach(categorie => {
            const button = document.createElement("button");
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


/////envoi d'un nouveau projet au backend /////////

const buttonValidate = document.getElementById("buttonValidate");
let titre, category, image;

//mise à jour des variables globales avec les valeurs saisies par l'utilisateur
function updateFormValues() {
    titre = document.getElementById('title').value;
    category = document.getElementById('categorie').value;
    image = document.getElementById('image').files[0];
}
// vérifier si le formulaire est rempli
function checkFormValidity() {
    updateFormValues();

    if (dataValidator(titre, category, image)) {
        buttonValidate.classList.remove('grey');
        buttonValidate.classList.add('green');
    } else {
        buttonValidate.classList.remove('green');
        buttonValidate.classList.add('grey');
    }
}

// Fonction pour valider les données du formulaire
function dataValidator(titre, category, image) {
    if (!titre.trim()) {
        return false;
    }
    if (!category.trim()) {
        return false;
    }
    if (!image) {
        return false;
    }
    return true;
}

// Écouter les événements de changement sur les champs du formulaire
document.getElementById('title').addEventListener("change", checkFormValidity);
document.getElementById('categorie').addEventListener("change", checkFormValidity);
document.getElementById('image').addEventListener("change", checkFormValidity);

buttonValidate.addEventListener("click", async function () {
    updateFormValues();

    // Validation des données saisies par l'utilisateur
    if (!dataValidator(titre, category, image)) {

        if (!titre.trim()) {
            alert("Veuillez entrer le titre de votre projet");
        }
        if (!category.trim()) {
            alert("Veuillez sélectionner une catégorie de projet");
        }
        if (!image) {
            alert("Veuillez sélectionner une image");
        }
        return;
    }

    const formData = new FormData();
    formData.append('title', titre);
    formData.append('category', category);
    formData.append('image', image);

    // Envoi d'un nouveau projet vers le backend
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
            alert("Projet ajouté");
        } else {
            console.error('Erreur lors de l\'envoi des données:', response.statusText);
        }
    } catch (error) {
        console.error('Erreur lors de la requête vers API:', error);
    }
});


function createWorkElement(workData) {

    const gallery = document.querySelector(".gallery");
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

    const worksInModal = document.querySelector(".styleWorksModal");
    const modalWork = document.createElement("figure");
    modalWork.id = `modal_work_${workData.id}`;
    const imageElement = document.createElement('img');
    imageElement.src = workData.imageUrl;
    const deleteIcon = createDeleteIcon(workData.id);
    modalWork.appendChild(deleteIcon);
    modalWork.appendChild(imageElement);
    worksInModal.appendChild(modalWork);
    Works.push(workData);


}

