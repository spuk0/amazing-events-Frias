/*=================Constantes-variables=================*/
const cardsContainer = document.getElementById("cards");
const checkboxesFilter = document.getElementById("searchBar");
const searchWriteSpace = document.getElementById("search-write-space");
const checkboxesContainer = document.getElementById("checkboxContainer");
const bodyPage = document.querySelector("body");
//const errorContainer = document.getElementById("errorMessage");
let htmlCards = "";

/*=================Eventos con referencias a funciones=================*/
bodyPage.addEventListener("load", getData()); //Al cargar la pagina genera las cartas.
/*--Funcion asincrona donde se consumen los datos de una API para rellenar los datos de las cards.--*/
async function getData(){
    try{
        let objEvent;
        await fetch("https://mindhub-xj03.onrender.com/api/amazing")
        .then(response=>response.json())
        .then(json=>objEvent = json)
        allCardsPastEvents(objEvent);
        mainFunction(objEvent);
    } catch {
        console.log("Error al leer la API");
    }
}


/*=================Funciones asignadas a eventos=================*/

/*--Es para agregar cards al contenedor de cards
        @param htmlCode - representa el codigo html que debe ir como parametro.
--*/
function addCards(htmlCode){
    cardsContainer.innerHTML = htmlCode; //agrega el string como contenido del cardsContainer
}

/*--Escribe y agrega las cards segun su fecha, eventos pasados.--*/
function allCardsPastEvents(objEvent){
    const currentMonth= objEvent.currentDate[5] + objEvent.currentDate[6];
    const currentDay = objEvent.currentDate[8] + objEvent.currentDate[9];
    const currentYear = objEvent.currentDate[0] + objEvent.currentDate[1] + objEvent.currentDate[2] + objEvent.currentDate[3];
    const currentDate = new Date(currentYear, currentMonth, currentDay); //Con las constantes anteriores fijo la fecha dada en la base de datos.
    /*Variables para guardar las fechas de los eventos*/
    let day = "";
    let month = "";
    let year = "";
    for (const event of objEvent.events ){ //Por cada evento asignamos fechas
        month += event.date[5] + event.date[6];
        day += event.date[8] + event.date[9];
        year += event.date[0] + event.date[1] + event.date[2] + event.date[3];

        var eventDate = new Date(year, month, day); //Asignacion de fecha del eveto.
        if(currentDate > eventDate) { //Solo eventos pasados construiran el codigo html de la card.
            htmlCards += `<div id="${event._id}" class="card cardMain">
            <img src="${event.image}" class="card-img-top eventImg" alt="${event.name}">
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text card-date">${event.date}</p>
                    <p class="card-text">${event.description}</p>
                    <div class="card-footer d-flex justify-content-between align-items-end">
                        <h6 class="card-price">$${event.price}</h6>
                        <a href="../pages/details.html?id=${event._id}" class="btn btn-primary btn-custom">Show more</a>
                    </div>
                </div>
        </div>`
        }
        month = "";
        day = "";
        year = "";
    }
    addCards(htmlCards); //agrego el string.
}

/*=================Funciones asignadas a eventos=================*/
/*--Realiza una busqueda del texto insertado en el input
    @param event - representa el evento al cual esta funcion esta siendo referenciada.
--*/
function searchText(objEvent){
    console.log(objEvent);
    searchWriteSpace.addEventListener("keyup", (event)=>{
        let writedText = event.target.value.toLowerCase().trim(); //Guarda en la variable lo que se este insertando en el input, y aplica metodos string.
        let countCards = 0;
        let countFiltered = 0;
        objEvent.events.forEach(event => {
            const selectedCard = document.getElementById(event._id); //Carta elegida segun ID.
            let nameEvent = event.name.toLowerCase(); //Guarda el nombre del evento de la base de datos y lo convierte a minusculas.
            if(selectedCard != null){
                if(!selectedCard.classList.contains("filterCheckboxSearch")){
                    if(nameEvent.startsWith(writedText)){ //Si el evento coincide con lo escrito en el input, quita la clase filter.
                        selectedCard.classList.remove("filterInputSearch"); 
                    }else{
                        selectedCard.classList.add("filterInputSearch"); //Agregamos la clase filtro que quita la carta de la vista de la pantalla.
                        countFiltered++;
                    }
                }else{
                    countFiltered++;
                }
                countCards++;
            }
        });
        errorMessage(countFiltered, countCards, writedText);
    });
    
}

function mainFunction(data){
    let objEvent = data;
    searchText(objEvent);
    checkboxFilter(objEvent);
    categoryList(objEvent);
}


/*--Realiza una busqueda segun los checkboxes seleccionados.
    @param event - representa el evento al cual esta funcion esta siendo referenciada.
--*/
function checkboxFilter(objEvent){
    checkboxesFilter.addEventListener("submit", (event) => {
        event.preventDefault(); //Para que no recargue la pagina al presionar el submit.
        dataFromSearch = {
            category : (() => {
                let arrayCategories = [];
                let categories = event.target.querySelectorAll("input[type=checkbox]"); //Referencia a todos los input de type checkbox
                console.log(categories);
                for(let i=0; i < categories.length; i++){
                    if(categories[i].checked){ //Si esta checked entonces realiza la accion
                        arrayCategories.push(categories[i].value); //La accion es llenar el array con el nombre de la categoria.
                    }
                }
                return arrayCategories; //Retorna el array de categorias que esten seleccionadas.
            })(),
            
        },
        checkbox = {
            applySearchCheckbox: ( () => {
                let countCards=0;
                let countFiltered=0;
                if(dataFromSearch.category.length == 0){ //Si al presionar submit no hay ninguna categoria seleccionada emite una alerta.
                    
                }else {
                    objEvent.events.forEach(event => { //Recorre los eventos de la base de datos.
                        const selectedCard = document.getElementById(event._id); //A cada evento le asigna una referencia por ID.
                        if(selectedCard != null){
                            selectedCard.classList.add("filterCheckboxSearch"); //A cada evento le agrega la clase.
                            countCards++;
                            if(selectedCard.classList.contains("filterInputSearch")){
                                countFiltered++;
                            }else{
                                dataFromSearch.category.forEach(selectedCategory => { //Recorre el array de categorias que esten seleccionadas.
                                    if(event.category === selectedCategory){ //Si la categoria seleccionada coincide con la del evento, le quita la clase.
                                        selectedCard.classList.remove("filterCheckboxSearch");
                                    }else{
                                        countFiltered++;
                                    }
                                });
                            }
                        }
                    });
                    errorMessage(countFiltered, countCards, "checkbox unfound");
                }
            })()
        };
    });
    checkboxesContainer.addEventListener("change", (event) => { //Al percibirse cambios ejecuta el siguiente bloque de codigo.
        let nums = [];
        let categories = event.currentTarget.querySelectorAll("input[type=checkbox]");
        for(let i=0; i < categories.length; i++){ 
            if(categories[i].checked){
                nums.push(1); //Completa un array por cada check.
            } 
        }
        if(nums.length == 0){ //Si se quita el check de todos los checkboxes se quita la clase filterCheckBoxSearch.
            objEvent.events.forEach(event => {
                const selectedCard = document.getElementById(event._id);
                selectedCard.classList.remove("filterCheckboxSearch");
                selectedCard.classList.remove("filterInputSearch");
            });
        }
    });
}

function categoryList(objEvent){
    let categories = [];
    objEvent.events.forEach(item => {
        if (!categories.some((category) => category == item.category)) {
            categories.push(item.category);
        }
    })
    return categories;
}

/*--Muestra un error si no se encuentra una busqueda--*/
function errorMessage(countFiltered, countCards, writedText){
    if(countCards == countFiltered){
        document.getElementById("errorMessage").classList.add("errorMessage-background");
        document.getElementById("errorMessage").innerHTML =`<h2 style="color: var(--colorLogo); font-weight: bold;">ERROR</h2>
                                                            <img src="../assets/AmazingNotFound.png" width="320px">
                                                            <h4 style="font-weight:bold;">${writedText} not found</h4>`
    }else{
        document.getElementById("errorMessage").innerHTML = "";
    }
}