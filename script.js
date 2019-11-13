const qs = el => document.querySelector(el)
const qsa = el => document.querySelectorAll(el)

let modalQt = 1
let cart = []
let modalKey = 0

// Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true)

    pizzaItem.setAttribute('data-key', index)

    // add as imagens das pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img

    // add nome, descrição e preços das pizzas
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

    // abrindo o modal para adicionar no carrinho
    pizzaItem.querySelector('a').addEventListener('click', e => {
        e.preventDefault()

        qs('.pizzaInfo--size.selected').classList.remove('selected')

        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        
        modalQt = 1
        modalKey = key

        // preechendo o modal
        qs('.pizzaBig img').src = pizzaJson[key].img
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        
        qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        qs('.pizzaInfo--qt').innerHTML = modalQt

        qs('.pizzaWindowArea').style.opacity = 0
        qs('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => qs('.pizzaWindowArea').style.opacity = 1, 200)
    })

    // add as pizzas na tela
    qs('.pizza-area').append(pizzaItem)
})

// Eventos do MODAL
const closeModal = _ => {
    qs('.pizzaWindowArea').style.opacity = 0
    setTimeout(() => qs('.pizzaWindowArea').style.display = 'none', 500)
}

qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item => item.addEventListener('click', closeModal))

qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) modalQt--
    
    qs('.pizzaInfo--qt').innerHTML = modalQt
})

qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++
    qs('.pizzaInfo--qt').innerHTML = modalQt
})

qsa('.pizzaInfo--size').forEach(size => {
    size.addEventListener('click', _ => {
        qs('.pizzaInfo--size.selected').classList.remove('selected')

        size.classList.add('selected')
    })
})

// add a pizza ao carrinho
qs('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = Number(qs('.pizzaInfo--size.selected').getAttribute('data-key'))
    
    let identifier = `${pizzaJson[modalKey].id}@${size}`

    let key = cart.findIndex(item => item.identifier === identifier)

    if(key > -1) {
        cart[key].qt += modalQt
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        })
    }

    updateCart()
    closeModal()
})

qs('.menu-openner').addEventListener('click', _ => {
    if(cart.length > 0)
        qs('aside').style.left = '0'
})

qs('.menu-closer').addEventListener('click', _ => {
    qs('aside').style.left = '100vw'
})

const updateCart = () => {
    qs('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0) {
        qs('aside').classList.add('show')

        qs('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        cart.map(i => {
            let pizzaItem = pizzaJson.find(item => item.id === i.id)

            subtotal += pizzaItem.price * i.qt

            let cartItem = qs('.models .cart--item').cloneNode(true)

            let pizzaSizeName

            switch (i.size) {
                case 0:
                    pizzaSizeName = 'P'
                    break
                case 1:
                    pizzaSizeName = 'M'
                    break
                case 2:
                    pizzaSizeName = 'G'
                    break
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = i.qt

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', _ => {
                if(i.qt > 1) {
                    i.qt--
                } else {
                    cart.splice(i, 1)
                }
                updateCart()
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', _ => {
                i.qt++
                updateCart()
            })

            qs('.cart').append(cartItem)
        })

        desconto = subtotal * 0.1
        total = subtotal - desconto

        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else {
        qs('aside').classList.remove('show')
        qs('aside').style.left = '100vw'
    }
}