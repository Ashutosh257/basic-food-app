import { menuArray as menuItems} from "./data.js";

const menuEl = document.querySelector('#menu')
const orderEl = document.querySelector('#order')
const paymentModalEl = document.querySelector('#payment-modal')
const orderStatusEl = document.querySelector('#order-status')
const paymentForm = document.querySelector('#payment-form')
const ratingEl = document.querySelector('#rating')


const orderListEl = document.querySelector("#order-list")
const totalAmountEl = document.querySelector("#total-amount")


let orderItems = []

const menu = menuItems.map((item) => {
    const {id, name, ingredients, price, emoji} = item;
    return `
    <div class="menu-item" id="${id}">
        <div class="menu-content">
            <div class="menu-item-image" id="menu-item-image"> ${emoji} </div>
            <div class="menu-item-details">
                <h3 class="menu-item-name" id="item-${id}">${name}</h3>
                <p class="menu-item-ingredients" >${ingredients}</p>
                <p class="menu-item-price" id="menu-item-price">$${price}</p>
            </div>
        </div>
        <button class="add-btn" id="add-btn-${id}" data-item="${id}">+</button>
    </div>
    `
}).join('')

const renderOrders = () => {
    const orderList = orderItems.map((item) => {
        return `
            <div class="item">
                <div class="item-content">
                    <h3>${item.name} X ${item.quantity}</h3>
                    <button class="remove-btn" id="remove-btn-${item.id}" data-remove="${item.id}">
                        remove
                    </button>
                </div>
                <div class="item-price">
                $ <span>${item.price * item.quantity}</span>
                </div>
            </div> 
        `
    }).join("")
    orderListEl.innerHTML = orderList
    totalAmountEl.textContent = `$ ${orderItems
        .reduce((total, currentItem) => total + (currentItem.price * currentItem.quantity), 0)}`
}

const addItem = (foodMenuId) => {
    menuItems.forEach(item => {
        if(foodMenuId === item.id && orderItems.filter(order => order.id === foodMenuId).length === 0){
            let newOrder = {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
            }
            orderItems.push(newOrder)

        }else if(foodMenuId === item.id && orderItems.filter(order => order.id === foodMenuId).length === 1){
            orderItems.forEach(order => {
                if(order.id === foodMenuId && order.quantity){
                    order.quantity++
                }
            })
        }
    })
    renderOrders()
}

const removeItem = (foodMenuId) => {

    orderItems = orderItems.filter( (order, index) => {
        
        if(order.id === foodMenuId ){
            if(order.quantity !== 1){
                order.quantity--
                return true
            }
            else{
                return false
            }
        }else{
            return true
        }
        
    })

    renderOrders()
}

const renderRatingStars = (rating) => {
    let ratingStars = ""
    for(let i = 1; i <= 5; i++){
        if(i <= rating){
            ratingStars += `<i class="fa-solid fa-star star-checked" data-rating="${i}"></i>`
        }else{
            ratingStars += `<i class="fa-solid fa-star star-unchecked" data-rating="${i}"></i>`
        }
    }
    ratingStars += `<span> <span class="rating-number"> ${rating}.0 </span> / 5.0 </span>`
    ratingEl.innerHTML = ratingStars
}


document.addEventListener('click', (e) => {

    if(e.target.dataset.item){
        orderEl.classList.remove("hide")
        const foodId =  Number(e.target.dataset.item)
        addItem(foodId)
    }else if(e.target.dataset.remove){
        const foodId =  Number(e.target.dataset.remove)
        removeItem(foodId)
        orderItems.length ? "" : orderEl.classList.add("hide")
    }else if(e.target.id === "complete-order-btn"){
        paymentModalEl.classList.remove("hide")
    }else if(e.target.dataset.rating){
        const userRating = Number(e.target.dataset.rating)
        renderRatingStars(userRating)   
    }
    

})


paymentForm.addEventListener("submit",  (e) => {
    e.preventDefault()

    const form = new FormData(e.target)
    document.querySelector("#user-name-order-status").textContent = form.get('username') + "!"
    document.querySelector("#price-paid-text").textContent = "Total amount paid: "
        
    menuItems.map(item => {
        document.querySelector(`#add-btn-${item.id}`).classList.add("hide")
    })
    orderItems.map(item => {
        document.querySelector(`#remove-btn-${item.id}`).classList.add("hide")
    })

    document.querySelector("#complete-order-btn").classList.add("hide")
    paymentModalEl.classList.add("hide")
    orderStatusEl.classList.remove("hide")


})

renderRatingStars(0)

menuEl.innerHTML = menu;

