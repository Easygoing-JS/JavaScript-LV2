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

    clearForm() {
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