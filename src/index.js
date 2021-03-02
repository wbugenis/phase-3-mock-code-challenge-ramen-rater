// write your code here
const menu = document.querySelector("div#ramen-menu")
const detail = document.querySelector("div#ramen-detail")
const form = document.querySelector("form#ramen-rating")
const url = "http://localhost:3000/ramens"
const newForm = document.querySelector("form#new-ramen")
const deleteBtn = form.querySelector("button#deletebutton")

function getRamenMenu(){
    fetch(url)
    .then(response => response.json())
    .then(ramens => {
        ramens.forEach(ramen => addRamenToMenu(ramen))
        addMenuListener()
        showRamenDetail(ramens[0])
    })
}

function addRamenToMenu(ramen) {
    const div = document.createElement('div')
    div.dataset.id = ramen.id
    div.innerHTML = `<img src=${ramen.image} alt=${ramen.name}>`
    menu.append(div)
}

function showRamenDetail(ramen){
    detail.querySelector("img.detail-image").src = ramen.image
    detail.querySelector("h2.name").textContent = ramen.name
    detail.querySelector("h3.restaurant").textContent = ramen.restaurant
    form.querySelector("input#rating").value = ramen.rating
    form.querySelector("textarea#comment").value = ramen.comment
    form.dataset.id = ramen.id
}

function addMenuListener(){
    menu.addEventListener('click', event => {
        if(event.target.matches('img')){
            const id = event.target.parentElement.dataset.id
            fetch(`${url}/${id}`)
            .then(response => response.json())
            .then(ramen => showRamenDetail(ramen))
        }
    })

    form.addEventListener('submit', event => {
        event.preventDefault()
        const id = event.target.dataset.id
        fetch(`${url}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify({rating:event.target.rating.value, comment:event.target.comment.value})
        })
        .then(response => response.json())
        .then(ramen => showRamenDetail(ramen))
    })

    newForm.addEventListener('submit', event => {
        event.preventDefault()
        const newRamen = {name: event.target.name.value, restaurant: event.target.restaurant.value,
                            image: event.target.image.value, comment: event.target.newcomment.value,
                            rating: event.target.rating.value}
        fetch(url, 
            {method: 'POST', 
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify(newRamen)  
        })   
        .then(response => response.json())
        .then(newRamen => addRamenToMenu(newRamen))
        newForm.reset()
    })

    deleteBtn.addEventListener('click', event => {
        // event.preventDefault()
        const id = event.target.parentElement.dataset.id
        fetch(`${url}/${id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(() => {
            menu.innerHTML = ""
            getRamenMenu()
        })
    })

}

getRamenMenu()