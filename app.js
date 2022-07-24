import { productData } from "./productdata.js";
const productsContainer = document.querySelector(".products");
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
            const id = btn.dataset.id;
            cart = Storage.getCart();
            // the product id exist in cart or not//
            let isInCart = cart.find((p) => p.id === parseInt(id));
            if (isInCart) {
                btn.innerText = "in Cart";
                btn.disabled = "true";
            }
            btn.addEventListener("click", (e) => {
                let id = e.target.dataset.id;
                e.target.innerText = "in Cart";
                e.target.disabled = "true";

                let addedProduct = Storage.getProduct(id);

                cart = [...cart, {...addedProduct, quantity: 1 }];

                Storage.saveCart(cart);
            });
        });
    }
}
class Storage {
    static saveProduct(productItems) {
        localStorage.setItem("products", JSON.stringify(productItems));
    }
    static getProduct(id) {
        let _products = JSON.parse(localStorage.getItem("products"));
        return _products.find((p) => p.id === parseInt(id));
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
    const ui = new UI();
    ui.displayProduct(ProductsData);
    ui.getAddToCartBtn();
    const storage = new Storage();
    Storage.saveProduct(ProductsData);
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