import { productData } from "./productdata.js";
const productsContainer = document.querySelector(".products");
const cartList = document.querySelector(".cart-list");
const cartTotalPrice = document.querySelector(".cart-total-price");
const navCartNum = document.querySelector(".nav__cart-num");
let cart = [];
class Products {
    getProduct() {
        return productData;
    }
}
class UI {
    displayProduct(products) {
        let productItems = "";
        products.forEach((item) => {
            productItems += `
            <div class="products-item">
            <div class="products-item__img">
                <img src="${item.image}" alt="${item.title}" />
            </div>
            <div class="products-item__text">
                <div class="products-item__entry">
                    <div class="products-item__entry-title">${item.title}</div>
                    <div class="products-item__entry-price">${item.price} $</div>

                </div>
                <button class="btn btn--primary" data-id="${item.id}">add to cart</button>
            </div>
        </div>`;
        });
        productsContainer.innerHTML = productItems;
    }
    getAddToCartBtn() {
        const addToCartBtn = document.querySelectorAll(".products-item__text .btn");
        const buttons = [...addToCartBtn];
        buttons.forEach((btn) => {
            let id = btn.dataset.id;
            cart = Storage.getCart();
            // the product id exist in cart or not //
            let isInCart = cart.find((cItem) => cItem.id == id);
            if (isInCart) {
                btn.innerText = "in Cart";
                btn.disabled = "true";
            }
            btn.addEventListener("click", (e) => {
                e.target.innerText = "in Cart";
                e.target.disabled = "true";

                let addedProduct = Storage.getProduct(id);
                cart = [...cart, {...addedProduct, quantity: 1 }];

                Storage.saveCart(cart);
                this.displayCart();
                this.setCartNum();
            });
        });
    }
    displayCart() {
        cart = Storage.getCart();
        let cartItems = "";
        let totalPrice = 0;
        cart.forEach((CItem) => {
            cartItems += `<li class="cart-item">
            <div class="cart-item__img">
                <img src="${CItem.image}" alt="${CItem.title}" />
            </div>
            <div class="cart-item__text">
                <h4>${CItem.title}</h4>
                <span>${CItem.price} $</span>
            </div>
            <div class="cart-item__counter">
                <button class="btn increament-btn" data-id="${CItem.id}"><i class="fa-solid fa-angle-up"></i></button>
                <span>${CItem.quantity}</span>
                <button class="btn decreament-btn" data-id="${CItem.id}"><i class="fa-solid fa-angle-down"></i></button>            
            </div>

            <button class="btn clear-item" data-id="${CItem.id}"><i class="fa-solid fa-trash" > </i></button>
        </li>`;
            totalPrice += CItem.quantity * CItem.price;
        });
        cartList.innerHTML = cartItems;
        cartTotalPrice.innerText = totalPrice.toFixed(2) + " $";
        const clearCartBtn = document.querySelector(
            ".modal__footer .btn--secondary"
        );
        const removeCartItemBtn = document.querySelectorAll(
            ".cart-item .clear-item"
        );
        clearCartBtn.addEventListener("click", () => {
            cart.forEach((cItem) => {
                let id = cItem.id;
                this.clearCartItem(id);
            });
            closeModal();
        });
        removeCartItemBtn.forEach((rBtn) => {
            rBtn.addEventListener("click", () => {
                let id = rBtn.dataset.id;
                this.clearCartItem(id);
            });
        });
        //increament and decreament cart item
        const increamentBtn = document.querySelectorAll(
            ".cart-item .increament-btn"
        );
        const decreamentBtn = document.querySelectorAll(
            ".cart-item .decreament-btn"
        );
        increamentBtn.forEach((iBtn) => {
            iBtn.addEventListener("click", () => {
                let id = iBtn.dataset.id;
                cart.forEach((cItem) => {
                    if (cItem.id == id) cItem.quantity++;
                });
                Storage.saveCart(cart);
                this.displayCart();
                this.setCartNum();
            });
        });
        decreamentBtn.forEach((iBtn) => {
            iBtn.addEventListener("click", () => {
                let id = iBtn.dataset.id;
                cart.forEach((cItem) => {
                    if (cItem.id == id) {
                        if (cItem.quantity > 1) cItem.quantity--;
                        else if ((cItem.quantity = 1)) this.clearCartItem(id);
                    }
                });
                Storage.saveCart(cart);
                this.displayCart();
                this.setCartNum();
            });
        });
    }
    setCartNum() {
        cart = Storage.getCart();
        let cartNum = cart.reduce((acc, curr) => {
            return (acc += curr.quantity);
        }, 0);
        navCartNum.innerText = parseInt(cartNum);
    }
    clearCartItem(id) {
        cart = Storage.getCart();
        cart = cart.filter((cItem) => {
            return cItem.id != id;
        });
        //change "in cart" to " add to cart"
        const itemsBtn = [...document.querySelectorAll(".products-item .btn")];
        let removedItemBtn = itemsBtn.find((btn) => btn.dataset.id == id);
        removedItemBtn.innerText = "add to cart";

        Storage.saveCart(cart);
        this.displayCart();
        this.setCartNum();
    }
}
class Storage {
    static saveProduct(productItems) {
        localStorage.setItem("products", JSON.stringify(productItems));
    }
    static getProduct(id) {
        const _products = JSON.parse(localStorage.getItem("products"));
        return _products.find((p) => p.id == id);
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem("cart") ?
            JSON.parse(localStorage.getItem("cart")) :
            [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const ProductsData = products.getProduct();
    const storage = new Storage();
    Storage.saveProduct(ProductsData);
    const ui = new UI();
    ui.displayProduct(ProductsData);
    ui.displayCart();
    ui.getAddToCartBtn();
    ui.setCartNum();
});

const cartIcon = document.querySelector(".nav__cart");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".modal__close-btn");

cartIcon.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);

function openModal() {
    backdrop.style.display = "block";
    modal.style.display = "flex";
}

function closeModal() {
    backdrop.style.display = "";
    modal.style.display = "";
}