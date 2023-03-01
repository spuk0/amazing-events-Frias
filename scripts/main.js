const searchFilter = document.getElementById("searchBar");
searchFilter.addEventListener("submit", search);


function search(event){
    let cardText = "";
    event.preventDefault();
    dataFromSearch = {
        Category : (() => {
            let arrayCategories = [];
            let categories = event.target.querySelectorAll("input[type=checkbox]");
            for(let i=0; i < categories.length; i++){
                if(categories[i].checked){
                    arrayCategories.push(categories[i].value);
                }
            }
            return arrayCategories;
        })()
    },
    checkbox = {
        ApplySearchCheckbox: ( () => {
            if(dataFromSearch.Category.length == 0){
                addCards();
                alert("Please select a category or type a search");
            }else {
                objEvent.events.forEach(event => {
                    dataFromSearch.Category.forEach(selectedCategory => {
                        if(event.category === selectedCategory){
                            cardText += `<div class="card cardMain" style="width: 15rem;">
                                            <img src="${event.image}" class="card-img-top eventImg" alt="${event.name}">
                                            <div class="card-body">
                                                <h5 class="card-title">${event.name}</h5>
                                                <p class="card-text">${event.date}</p>
                                                <p class="card-text">${event.description}</p>
                                                <div class="d-flex justify-content-between align-items-end">
                                                    <h6 class="cardPrice">$${event.price}</h6>
                                                    <a href="./pages/details.html" class="btn btn-primary btn-showMore">Show more</a>
                                                </div>
                                            </div>
                                        </div>`
                        }
                    })
                });
            
                const cardsContainer = document.getElementById("cards");
                cardsContainer.innerHTML = cardText;   
            }
        })()
    };
    checkbox.ApplySearchCheckbox;  
}

function createCards(){
    let cardText = "";
    for (const event of objEvent.events ){
        cardText += `<div class="card cardMain" style="width: 15rem;">
                        <img src="${event.image}" class="card-img-top eventImg" alt="${event.name}">
                            <div class="card-body">
                                <h5 class="card-title">${event.name}</h5>
                                <p class="card-text">${event.date}</p>
                                <p class="card-text">${event.description}</p>
                                <div class="d-flex justify-content-between align-items-end">
                                    <h6 class="cardPrice">$${event.price}</h6>
                                    <a href="./pages/details.html" class="btn btn-primary btn-showMore">Show more</a>
                                </div>
                            </div>
                    </div>`
    }
    return cardText;
}

function addCards(){
    const cardsContainer = document.getElementById("cards");
    cardsContainer.innerHTML = createCards();
}

addCards();






