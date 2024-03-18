async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}
getWorks();

//affichage des travaux dans le DOM 
async function displayWorks() {
    const displayWorks = document.createElement("div");

    // obtenir les travaux à afficher en appelant la fonction getWorks
    const arrayworks = await getWorks();

    arrayworks.forEach((work) => {
        const workElement = document.createElement("div");

        // Créer un élément img pour chaque URL d'image 
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;

        // Ajout de l'élément image au conteneur de nos travaux 
        workElement.appendChild(imageElement);

        // Ajout du titre 
        const titleElement = document.createElement("h3");
        titleElement.innerText = work.title;
        workElement.appendChild(titleElement);

        // Ajout des travaux à l'élément d'affichage 
        displayWorks.appendChild(workElement);
    });

    // Ajout de l'élément d'affichage au corps de la page
    document.body.appendChild(displayWorks);
}

displayWorks();
