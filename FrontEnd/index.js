//fonction pour récupérer les works depuis le backend
// et pour retourner la réponse sous format json

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works"); //GET par défaut
    const works = await response.json();
    return works;
}
getWorks();

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

    // Ajout des works dans la section avec l'id portfolio dans le DOM 
    document.getElementById("portfolio").appendChild(displayWorks);
}

displayWorks();
//récupérer les catégories depuis le backend

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    console.log(categories);
    return categories;
}


getCategories().then(categories => {// une fois que getCategorie a reussi à récupérer les catégorie du backend
    categories.forEach(categorie => {
        const button = document.createElement("button"); // je créé un bouton pour chaque catégorie
        button.textContent = categorie.name;
        button.classList.add("button");
        buttonContainer.appendChild(button);
        button.addEventListener("click", () => {
            displayCategories(categorie);
        }
        )
    });
});

async function displayCategories(category) {
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
    document.getElementById("portfolio").innerHTML = "";

    // j'ajoute les travaux au dom 
    document.getElementById("portfolio").appendChild(displayCategories);
}








/*
const buttonContainer = document.getElementById("buttonContainer");
const buttonNames = ["Tous", "Objets", "Appartements", "Hotel & restaurants"];

buttonNames.forEach(buttonName => {
    const button = document.createElement("button");
    button.textContent = buttonName;
    button.classList.add("button");
    buttonContainer.appendChild(button);
})
*/










/*const buttonContainer = document.getElementById("buttonContainer");
const buttonAll = document.createElement("button");
buttonAll.textContent = "Tous";
buttonAll.classList.add("button");
const buttonObjects = document.createElement("button");
buttonObjects.textContent = "Objets";
buttonObjects.classList.add("button");
const buttonApartments = document.createElement("button");
buttonApartments.textContent = "Appartements";
buttonApartments.classList.add("button");
const buttonRestaurant = document.createElement("button");
buttonRestaurant.textContent = "Hotels & restaurants";
buttonRestaurant.classList.add("button");




buttonContainer.appendChild(buttonAll);
buttonContainer.appendChild(buttonObjects);
buttonContainer.appendChild(buttonApartments);
buttonContainer.appendChild(buttonRestaurant);*/


