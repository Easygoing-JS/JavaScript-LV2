const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const cart = [];

// ПОИСК по списку товаров
Vue.component('search', {
  props: {
    searchLine: {
      type: String,
      required: false,
      default: '',
    }
  },

  template: `
        <form class="search-form" @submit.prevent>
        <input type="text" class="search-input" :value="searchLine" @input="updateSearchLine"/>
        <button class="clear-button" @click="clearForm">Очистить</button>
        </form> 
  `,

  methods: {
    updateSearchLine(val) {
      const value = val.target.value;
      this.$emit('update:searchLine', value);
    },

    clearForm() {
      this.$emit('update:searchLine', '');
    },
  }
});

// ЭЛЕМЕНТ <-- корзины
Vue.component('cart-item', {
  props: ['good'],
  methods: {
    incGood(good) {
      let goodIndex = cart.findIndex(el => el.id_product === good.id_product);

      if (goodIndex != -1) {
        cart[goodIndex].quantity++;
      } else { // добавление товара кнопкой Купить
        let cartItem = Object.assign({}, good);
        Vue.set(cartItem, 'quantity', 1);
        cart.push(cartItem);
      }
    },

    decGood(good) {
      let goodIndex = cart.findIndex(el => el.id_product === good.id_product);

      if (goodIndex != -1) {
        if (cart[goodIndex].quantity > 1) {
          cart[goodIndex].quantity--;
        } else {
          cleanGood(good);
        }
      }
    },

    cleanGood(good) {
      let goodIndex = cart.findIndex(el => el.id_product === good.id_product);

      if (goodIndex != -1) cart.splice(goodIndex, 1);
    }
  },

  template: `
    <div class="cart-item">
      <div class="cart-item_desc">
        <p>{{ good.product_name }} [x{{ good.quantity }}] : {{ good.price * good.quantity }} руб.</p>
      </div>
      <div class="cart-item-buttonblock">
        <button class="inc-button" @click="incGood(good)">&#10010;</button>
        <button class="dec-button" @click="decGood(good)">
          <span class="dec-style">&minus;</span>
        </button>
        <button class="clean-button" @click="cleanGood(good)">&#10006;</button>
      </div>
    </div>
  `
})

// КОРЗИНА
Vue.component('cart', {
  data: () => ({
    cart,
    isVisibleCart: false,
  }),

  computed: {
    calcTotalPrice() {
      return this.cart.reduce((total, el) => total += el.price * el.quantity, 0);
    },
    calcTotalQuantity() {
      return this.cart.reduce((total, el) => total += el.quantity, 0);
    },
  },

  methods: {
    toggleCartVisibility() {
      this.isVisibleCart = !this.isVisibleCart;
    },
  },

  template: `
    <div>
    <button class="cart-button" type="button" @click="toggleCartVisibility"> Корзина
      <span class="button-quantity">{{ calcTotalQuantity }}</span>
    </button>
    <div id="cart" class="cart-wrapper" v-if="isVisibleCart">
      <div class="cart-list filled" v-if="cart.length != 0">
        <span class="cart-header">В корзине:</span>
          <cart-item v-for="good of cart" 
                     :good="good"
                     :key="good.id_product">
          </cart-item>
        <span class="cart-bottom">Итоговая сумма: {{ calcTotalPrice }} руб.</span>
        <button class="checkout-button" disabled >Перейти к оформлению</button>
      </div>
      <div class="cart-list not-filled" v-else>
        В корзине пусто.
      </div>
    </div>
    </div>
  `
});

// ЭЛЕМЕНТ <-- списка товаров
Vue.component('goods-item', {
  props: {
    good: {
      type: Object,
    },
    photo: {
      default: 'img/bg_empty2.jpg',
    }
  },

  methods: {
    buyGood(good) {
      let goodIndex = cart.findIndex(el => el.id_product === good.id_product);

      if (goodIndex != -1) {
        cart[goodIndex].quantity++;
      } else { // добавление товара кнопкой Купить
        let cartItem = Object.assign({}, good);
        Vue.set(cartItem, 'quantity', 1);
        cart.push(cartItem);
      }
    },
  },

  template: `
    <div class="goods-item">
      <img :src="photo" :alt="good.product_name" class="card-photo" width="120" height="120">
      <h3 class="card-title">{{ good.product_name }}</h3>
      <p class="card-price">{{ good.price }} руб.</p>
      <button class="buy-button" @click="buyGood(good)">В корзину</button>
    </div>
  `,
});

// СПИСОК ТОВАРОВ
Vue.component('goods-list', {
  props: ['goods'],

  computed: {
    isGoodsEmpty() {
      return this.goods.length === 0;
    }
  },

  template: `
    <div class="goods-list" v-if="!isGoodsEmpty">
      <goods-item v-for="good in goods" 
                  :good="good" 
                  :key="good.id_product">
      </goods-item>
    </div>
    <div class="there-is-no-goods" v-else>Товары не найдены</div>
  `,
});

const app = new Vue({
  el: '#app',
  data: {
    goods: [],
    searchLine: '',
    error: '',
  },

  computed: {
    filteredGoods() {
      const searchValue = this.searchLine.replace(/[^а-яёa-z]/gis, '');
      const regexp = new RegExp(searchValue, 'i');
      return this.goods.filter((good) => regexp.test(good.product_name));
    },
    isSearchActive() {
      return this.searchLine.length > 0;
    },
  },

  methods: {
    setError(e) {
      this.error = e.message || e;
      setTimeout(() => {
        this.error = '';
      }, 3500);
    },

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
  },

  async mounted() {
    try {
      this.goods = await this.makeGETRequest(`${API_URL}/catalogData.json`);
    } catch (e) {
      this.setError('Товары не найдены');
      console.log(e);
    }
  },
})