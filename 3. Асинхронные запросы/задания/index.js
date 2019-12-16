const API_URL =
    "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

// Переделать в ДЗ
let getRequest = url => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    reject("Error");
                } else {
                    resolve(xhr.responseText);
                }
            }
        };
        xhr.send();
    });
};

getRequest(`${API_URL}/catalogData.json`)
    .then(result => console.log(JSON.parse(result)))
    .catch(error => `Error: ${error}`);

class CartItem {
    constructor(good, photo = "img/bg_empty2.jpg") {
        this.id = good.id_product;
        this.title = good.product_name;
        this.price = good.price;
        this.photo = photo;
    }

    render() {
        return `<div class="goods-item" data-id="${this.id}">
                <img class="card-photo" src="${this.photo}" alt="${this.title}" width="120" height="80">
                    <h3 class="card-title">${this.title}</h3>
                    <p class="card-price">$${this.price}</p>
                    <button class="buy-btn" data-id="${this.id}">В корзину</button>
                </div>`;
    }
}

class GoodsList {
    constructor(container = ".goods-list") {
        this.container = container;
        this.goods = [];
        this.allGoods = [];
        this._getGoods().then(data => {
            this.goods = [...data];
            this._render();
        });
    }

    _getGoods() {
        return fetch(`${API_URL}/catalogData.json`)
            .then(result => result.json())
            .catch(error => {
                console.log("Error: ", error);
            });
    }

    _render() {
        const block = document.querySelector(this.container);

        for (let good of this.goods) {
            const goodObject = new CartItem(good);
            this.allGoods.push(goodObject);
            block.insertAdjacentHTML("beforeend", goodObject.render());
        }
    }
}

class Cart {
    constructor() {
        this.goods = [];
        this.total = 0;
        this._renderCart();
    }

    _incGood(good) {
        let index = this.goods.findIndex(
            element => element[0].id_product === good.id_product
        );

        if (index === -1) {
            this.goods.push([good, 1]);
        } else {
            this.goods[index][1]++;
        }
        this._renderCart();
    }

    _decGood(good) {
        let index = this.goods.findIndex(
            element => element[0].id_product === good.id_product
        );
        if (this.goods[index][1] === 1) {
            this._clean(good);
        } else {
            this.goods[index][1]--;
        }
        this._renderCart();
    }

    _clean(good) {
        this.goods.splice(
            this.goods.findIndex(
                element => element[0].id_product === good.id_product
            ),
            1
        );
        this._renderCart();
    }

    _calcTotal() {
        this.total = 0;
        this.goods.forEach(element => {
            this.total += element[0].price * element[1];
        });
        return this.total;
    }

    _renderCart() {
        let cartBlock = document.querySelector(".cart-list");
        cartBlock.innerHTML = "";
        if (this.goods.length != 0) {
            cartBlock.innerHTML += `В корзине: <hr>`;
            let htmlStr = "";
            for (let i = 0; i < this.goods.length; i++) {
                htmlStr += `<div class="cart-item"><div class="cart-item_desc"><p>${
          this.goods[i][0].product_name
        }: ${this.goods[i][0].price * this.goods[i][1]}
          </p></div><div class="cart-item-btnblock"><button class="inc-btn" data-id="${
            this.goods[i][0].id_product
          }">+</button><button class="dec-btn" data-id="${
          this.goods[i][0].id_product
        }">-</button><button class="clean-btn" data-id="${
          this.goods[i][0].id_product
        }">x</button></div></div>`;
            }
            cartBlock.innerHTML += htmlStr;
            cartBlock.innerHTML += `<hr> Итоговая сумма: ${this._calcTotal()}`;
        } else cartBlock.innerHTML += `Корзина пуста</p>`;
    }
}

class Listeners {
    constructor(list, cart) {
        this.allGoods = document.querySelector(".goods-list");
        this.cartBtn = document.querySelector(".cart-button");
        this.cartBody = document.querySelector(".cart-list");
        this.list = list;
        this.cart = cart;
        this._init();
    }

    _init() {
        this._listenerForCartBody();
        this._listenerForCartItems();
        this._listenerForGoods();
    }

    _listenerForCartBody() {
        this.cartBtn.addEventListener("click", () => {
            document.querySelector(".cart-list").classList.toggle("invisible");
        });
    }

    _listenerForGoods() {
        this.allGoods.addEventListener("click", evt => {
            if (evt.target.classList.contains("buy-btn")) {
                this.list.goods.forEach(element => {
                    if (element.id_product === +evt.target.dataset["id"]) {
                        this.cart._incGood(element);
                    }
                });
            }
        });
    }

    _listenerForCartItems() {
        this.cartBody.addEventListener("click", evt => {
            if (evt.target.classList.contains("inc-btn")) {
                this.list.goods.forEach(element => {
                    if (element.id_product === +evt.target.dataset["id"]) {
                        this.cart._incGood(element);
                    }
                });
            } else if (evt.target.classList.contains("dec-btn")) {
                this.list.goods.forEach(element => {
                    if (element.id_product === +evt.target.dataset["id"]) {
                        this.cart._decGood(element);
                    }
                });
            } else if (evt.target.classList.contains("clean-btn")) {
                this.list.goods.forEach(element => {
                    if (element.id_product === +evt.target.dataset["id"]) {
                        this.cart._clean(element);
                    }
                });
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const list = new GoodsList();
    let cart = new Cart();
    let listeners = new Listeners(list, cart);
});






// ================================================
// ================================================
// ================================================
// const API_URL =
//     "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

// // Переделать в ДЗ
// let getRequest = url => {
//     return new Promise((resolve, reject) => {
//         let xhr = new XMLHttpRequest();
//         xhr.open("GET", url, true);
//         xhr.onreadystatechange = () => {
//             if (xhr.readyState === 4) {
//                 if (xhr.status !== 200) {
//                     reject("Error");
//                 } else {
//                     resolve(xhr.responseText);
//                 }
//             }
//         };
//         xhr.send();
//     });
// };

// getRequest(`${API_URL}/catalogData.json`)
//     .then(result => console.log(JSON.parse(result)))
//     .catch(error => `Error: ${error}`);

// class CartItem {
//     constructor(good, photo = "img/bg_empty2.jpg") {
//         this.id = good.id_product;
//         this.title = good.product_name;
//         this.price = good.price;
//         this.photo = photo;
//     }

//     render() {
//         return `<div class="product-item" data-id="${this.id}">
//                 <img src="${this.photo}" alt="${this.title}">
//                 <div class="desc">
//                     <h3>${this.title}</h3>
//                     <p>${this.price} \u20bd</p>
//                     <button class="buy-btn" data-id="${this.id}">Купить</button>
//                 </div>
//             </div>`;
//     }
// }

// class GoodsList {
//     constructor(container = ".goods-list") {
//         this.container = container;
//         this.goods = [];
//         this.allGoods = [];
//         this._getGoods().then(data => {
//             this.goods = [...data];
//             this._render();
//         });
//     }

//     _getGoods() {
//         return fetch(`${API_URL}/catalogData.json`)
//             .then(result => result.json())
//             .catch(error => {
//                 console.log("Error: ", error);
//             });
//     }

//     _render() {
//         const block = document.querySelector(this.container);

//         for (let good of this.goods) {
//             const goodObject = new CartItem(good);
//             this.allGoods.push(goodObject);
//             block.insertAdjacentHTML("beforeend", goodObject.render());
//         }
//     }
// }

// class Cart {
//     constructor() {
//         this.goods = [];
//         this.total = 0;
//         this._renderCart();
//     }

//     _incGood(good) {
//         let index = this.goods.findIndex(
//             element => element[0].id_product === good.id_product
//         );

//         if (index === -1) {
//             this.goods.push([good, 1]);
//         } else {
//             this.goods[index][1]++;
//         }
//         this._renderCart();
//     }

//     _decGood(good) {
//         let index = this.goods.findIndex(
//             element => element[0].id_product === good.id_product
//         );
//         if (this.goods[index][1] === 1) {
//             this._clean(good);
//         } else {
//             this.goods[index][1]--;
//         }
//         this._renderCart();
//     }

//     _clean(good) {
//         this.goods.splice(
//             this.goods.findIndex(
//                 element => element[0].id_product === good.id_product
//             ),
//             1
//         );
//         this._renderCart();
//     }

//     _calcTotal() {
//         this.total = 0;
//         this.goods.forEach(element => {
//             this.total += element[0].price * element[1];
//         });
//         return this.total;
//     }

//     _renderCart() {
//         let cartBlock = document.querySelector(".cart-block");
//         cartBlock.innerHTML = "";
//         if (this.goods.length != 0) {
//             cartBlock.innerHTML += `Ваши покупки: <hr>`;
//             let htmlStr = "";
//             for (let i = 0; i < this.goods.length; i++) {
//                 htmlStr += `<div class="cart-item"><div class="cart-item_desc"><p>${
//           this.goods[i][0].product_name
//         }: ${this.goods[i][0].price * this.goods[i][1]}
//           </p></div><div class="cart-item-btnblock"><button class="inc-btn" data-id="${
//             this.goods[i][0].id_product
//           }">+</button><button class="dec-btn" data-id="${
//           this.goods[i][0].id_product
//         }">-</button><button class="clean-btn" data-id="${
//           this.goods[i][0].id_product
//         }">x</button></div></div>`;
//             }
//             cartBlock.innerHTML += htmlStr;
//             cartBlock.innerHTML += `<hr> Итоговая сумма: ${this._calcTotal()}`;
//         } else cartBlock.innerHTML += `<p>Ваша корзина пуста :(</p>`;
//     }
// }

// class Listeners { 
//     constructor(list, cart) {
//         this.allGoods = document.querySelector(".goods-list");
//         this.cartBtn = document.querySelector(".cart-button");
//         this.cartBody = document.querySelector(".cart-block");
//         this.list = list;
//         this.cart = cart;
//         this._init();
//     }

//     _init() {
//         this._listenerForCartBody();
//         this._listenerForCartItems();
//         this._listenerForGoods();
//     }

//     _listenerForCartBody() {
//         this.cartBtn.addEventListener("click", () => {
//             document.querySelector(".cart-block").classList.toggle("invisible");
//         });
//     }

//     _listenerForGoods() {
//         this.allGoods.addEventListener("click", evt => {
//             if (evt.target.classList.contains("buy-btn")) {
//                 this.list.goods.forEach(element => {
//                     if (element.id_product === +evt.target.dataset["id"]) {
//                         this.cart._incGood(element);
//                     }
//                 });
//             }
//         });
//     }

//     _listenerForCartItems() {
//         this.cartBody.addEventListener("click", evt => {
//             if (evt.target.classList.contains("inc-btn")) {
//                 this.list.goods.forEach(element => {
//                     if (element.id_product === +evt.target.dataset["id"]) {
//                         this.cart._incGood(element);
//                     }
//                 });
//             } else if (evt.target.classList.contains("dec-btn")) {
//                 this.list.goods.forEach(element => {
//                     if (element.id_product === +evt.target.dataset["id"]) {
//                         this.cart._decGood(element);
//                     }
//                 });
//             } else if (evt.target.classList.contains("clean-btn")) {
//                 this.list.goods.forEach(element => {
//                     if (element.id_product === +evt.target.dataset["id"]) {
//                         this.cart._clean(element);
//                     }
//                 });
//             }
//         });
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const list = new GoodsList();
//     let cart = new Cart();
//     let listeners = new Listeners(list, cart);
// });

// ==================================================
// ==================================================
// ==================================================
// ==================================================













































// **************************************************************************************
// **************************************************************************************

// class GoodsItem {
//     constructor(title = 'Без имени', price = '', photo = '') {
//         this.title = title;
//         this.price = price;
//         this.photo = photo;
//     }
//     render() {
//         return `<div class="goods-item">
//                     <img class="card-photo" src="${this.photo}" alt="${this.title}" width="120" height="80">
//                     <h3 class="card-title">${this.title}</h3>
//                     <p class="card-price">$${this.price}</p>
//                 </div>`
//     }
// }

// class GoodsList {
//     constructor() {
//         this.goods = [];
//     }

//     fetchGoods() {
//         this.goods = [{
//                 title: 'Shirt',
//                 price: 150,
//                 photo: 'img/bg_empty2.jpg'
//             },
//             {
//                 title: 'Socks',
//                 price: 50,
//                 photo: 'img/bg_empty2.jpg'
//             },
//             {
//                 title: 'Jacket',
//                 price: 350,
//                 photo: 'img/bg_empty2.jpg'
//             },
//             {
//                 title: 'Shoes',
//                 price: 250,
//                 photo: 'img/bg_empty2.jpg'
//             },
//         ];
//     }

//     totalPrice() {
//         return this.goods.reduce((accum, item) => {
//             if (item.price) accum += item.price;
//             return accum;
//         }, 0);
//     }

//     render() {
//         let listHtml = '';
//         this.goods.forEach(good => {
//             const goodItem = new GoodsItem(good.title, good.price, good.photo);
//             listHtml += goodItem.render();
//         });
//         document.querySelector('.goods-list').innerHTML = listHtml;
//     }
// }

// class Cart extends GoodsList {
//     constructor(props) {
//         super(props);
//     }
//     clean() {}
//     incGood() {}
//     decGood() {}
// }

// class CartItem extends GoodsItem {
//     constructor(props) {
//         super(props);
//     }
//     delete() {}
// }

// const list = new GoodsList();
// list.fetchGoods();

// document.addEventListener('DOMContentLoaded', () => {
//     list.render();
//     console.log(`Общая сумма товаров: ${list.totalPrice()}.`);
// });