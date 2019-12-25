const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const app = new Vue({
  el: '#app',
  data: {
    goods: [],
    filteredGoods: [],
    cart: [],
    searchLine: '',
    photo: "img/bg_empty2.jpg",
    isVisibleCart: false
  },

  computed: {
    calcTotalPrice() {
      return this.cart.reduce((total, el) => total += el.price * el.quantity, 0);
    },

    calcTotalQuantity() {
      return this.cart.reduce((total, el) => total += el.quantity, 0);
    }
  },

  methods: {
    makeGETRequest(url) {
      return new Promise((resolve, reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
          xhr = new window.XMLHttpRequest();
        } else {
          xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
        }

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const body = JSON.parse(xhr.responseText);
              resolve(body)
            } else {
              reject(xhr.responseText);
            }
          }
        };
        xhr.onerror = function (err) {
          reject(err);
        };

        xhr.open('GET', url);
        xhr.send();
      });
    },

    filterGoods() {
      const regexp = new RegExp(this.searchLine, 'i');
      this.filteredGoods = this.goods.filter((good) => regexp.test(good.product_name));
    },

    cleanForm() {
      this.searchLine = '';
    },

    toggleCartVisibility() {
      this.isVisibleCart = !this.isVisibleCart;
    },

    incGood(good) {
      let goodIndex = this.cart.findIndex(el => el.id_product === good.id_product);

      if (goodIndex != -1) {
        this.cart[goodIndex].quantity++;
      } else { // добавление товара кнопкой Купить
        let cartItem = Object.assign({}, good);
        Vue.set(cartItem, 'quantity', 1);
        this.cart.push(cartItem);
      }
    },

    decGood(good) {
      let goodIndex = this.cart.findIndex(el => el.id_product === good.id_product);

      if (goodIndex != -1) {
        if (this.cart[goodIndex].quantity > 1) {
          this.cart[goodIndex].quantity--;
        } else {
          this.cleanGood(good);
        }
      }
    },

    cleanGood(good) {
      let goodIndex = this.cart.findIndex(el => el.id_product === good.id_product);

      if (goodIndex != -1) this.cart.splice(goodIndex, 1);
    }
  },

  async mounted() {
    try {
      this.goods = await this.makeGETRequest(`${API_URL}/catalogData.json`);
      this.filteredGoods = [...this.goods];
    } catch (e) {
      console.log(e);
    }
  },
})





// ******************************* //
// ******************************* //

// const API_URL =
//   "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";


// let getRequest = (url) => {
//   return new Promise((resolve, reject) => {
//     let xhr = new XMLHttpRequest();
//     xhr.open("GET", url, true);
//     xhr.onreadystatechange = () => {
//       if (xhr.readyState === 4) {
//         if (xhr.status !== 200) {
//           reject("Error");
//         } else {
//           resolve(xhr.responseText);
//         }
//       }
//     };
//     xhr.send();
//   });
// };

// getRequest(`${API_URL}/catalogData.json`)
//   .then(result => console.log(JSON.parse(result)))
//   .catch(error => `Error: ${error}`);

// class CartItem {
//   constructor(good, photo = "img/bg_empty2.jpg") {
//     this.id = good.id_product;
//     this.title = good.product_name;
//     this.price = good.price;
//     this.photo = photo;
//   }

//   render() {
//     return `<div class="goods-item" data-id="${this.id}">
//               <img class="card-photo" src="${this.photo}" alt="${this.title}" width="120" height="80">
//               <h3 class="card-title">${this.title}</h3>
//               <p class="card-price">$${this.price}</p>
//               <button class="buy-button" data-id="${this.id}">В корзину</button>
//             </div>`;
//   }
// }

// class GoodsList {
//   constructor(container = ".goods-list") {
//     this.container = container;
//     this.goods = [];
//     this.allGoods = [];
//     this._getGoods().then(data => {
//       this.goods = [...data];
//       this._render();
//     });
//   }

//   _getGoods() {
//     return fetch(`${API_URL}/catalogData.json`)
//       .then(result => result.json())
//       .catch(error => {
//         console.log("Error: ", error);
//       });
//   }

//   _render() {
//     const block = document.querySelector(this.container);

//     for (let good of this.goods) {
//       const goodObject = new CartItem(good);
//       this.allGoods.push(goodObject);
//       block.insertAdjacentHTML("beforeend", goodObject.render());
//     }
//   }
// }

// class Cart {
//   constructor() {
//     this.goods = [];
//     this.total = 0;
//     this._renderCart();
//   }

// _incGood(good) {
//   let index = this.goods.findIndex(
//     element => element[0].id_product === good.id_product
//   );

//   if (index === -1) {
//     this.goods.push([good, 1]);
//   } else {
//     this.goods[index][1]++;
//   }
//   this._renderCart();
// }

// _decGood(good) {
//   let index = this.goods.findIndex(
//     element => element[0].id_product === good.id_product
//   );
//   if (this.goods[index][1] === 1) {
//     this._clean(good);
//   } else {
//     this.goods[index][1]--;
//   }
//   this._renderCart();
// }

// _clean(good) {
//   this.goods.splice(
//     this.goods.findIndex(
//       element => element[0].id_product === good.id_product
//     ),
//     1
//   );
//   this._renderCart();
// }

//   _calcTotal() {
//     this.total = 0;
//     this.goods.forEach(element => {
//       this.total += element[0].price * element[1];
//     });
//     return this.total;
//   }

//   _renderCart() {
//     let cartBlock = document.querySelector(".cart-list");
//     cartBlock.innerHTML = "";
//     if (this.goods.length != 0) {
//       cartBlock.innerHTML += `<span class="cartHeadline">В корзине:</span>`;
//       let htmlStr = "";
//       for (let i = 0; i < this.goods.length; i++) {
//         htmlStr += `<div class="cart-item">
//  <div class="cart-item_desc">
//  <p>${this.goods[i][0].product_name}: ${this.goods[i][0].price * this.goods[i][1]}</p>
//  </div>
//                       <div class="cart-item-buttonblock">
//                         <button class="inc-button" data-id="${this.goods[i][0].id_product}">&#9650;</button>
//                         <button class="dec-button" data-id="${this.goods[i][0].id_product}">&#9660;</button>
//                         <button class="clean-button" data-id="${this.goods[i][0].id_product}">&#8855;</button>
//                       </div>
//                     </div>`;
//       }
//       cartBlock.innerHTML += htmlStr;
//       cartBlock.innerHTML += `Итоговая сумма: ${this._calcTotal()}`;
//     } else cartBlock.innerHTML += `Корзина пуста</p>`;
//   }
// }

// class Listeners {
//   constructor(list, cart) {
//     this.allGoods = document.querySelector(".goods-list");
//     this.cartbutton = document.querySelector(".cart-button");
//     this.cartBody = document.querySelector(".cart-list");
//     this.list = list;
//     this.cart = cart;
//     this._init();
//   }

//   _init() {
//     this._listenerForCartBody();
//     this._listenerForCartItems();
//     this._listenerForGoods();
//   }

//   _listenerForCartBody() {
//     this.cartbutton.addEventListener("click", () => {
//       document.querySelector(".cart-list").classList.toggle("invisible");
//     });
//   }

//   _listenerForGoods() {
//     this.allGoods.addEventListener("click", evt => {
//       if (evt.target.classList.contains("buy-button")) {
//         this.list.goods.forEach(element => {
//           if (element.id_product === +evt.target.dataset["id"]) {
//             this.cart._incGood(element);
//           }
//         });
//       }
//     });
//   }

//   _listenerForCartItems() {
//     this.cartBody.addEventListener("click", evt => {
//       if (evt.target.classList.contains("inc-button")) {
//         this.list.goods.forEach(element => {
//           if (element.id_product === +evt.target.dataset["id"]) {
//             this.cart._incGood(element);
//           }
//         });
//       } else if (evt.target.classList.contains("dec-button")) {
//         this.list.goods.forEach(element => {
//           if (element.id_product === +evt.target.dataset["id"]) {
//             this.cart._decGood(element);
//           }
//         });
//       } else if (evt.target.classList.contains("clean-button")) {
//         this.list.goods.forEach(element => {
//           if (element.id_product === +evt.target.dataset["id"]) {
//             this.cart._clean(element);
//           }
//         });
//       }
//     });
//   }
// }

// document.addEventListener('DOMContentLoaded', () => {
//   const list = new GoodsList();
//   let cart = new Cart();
//   let listeners = new Listeners(list, cart);
// });