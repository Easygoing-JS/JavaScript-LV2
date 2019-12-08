/** ЗАДАНИЕ:
 *  1. Добавьте пустые классы для корзины товаров и элемента корзины товаров.
    Продумайте, какие методы понадобятся для работы с этими сущностями.
 * 2. Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров.
 **/  

class GoodsItem {
    constructor(title = 'Без имени', price = '', photo = '') {
        this.title = title;
        this.price = price;
        this.photo = photo;
    }
    render() {
        return `<div class="goods-item">
                    <img class="card-photo" src="${this.photo}" alt="${this.title}" width="120" height="80">
                    <h3 class="card-title">${this.title}</h3>
                    <p class="card-price">$${this.price}</p>
                </div>`
    }
}

class GoodsList {
    constructor() {
        this.goods = []
    }
    fetchGoods() {
        this.goods = [
            { title: 'Shirt', price: 150, photo: 'img/bg_empty2.jpg' },
            { title: 'Socks', price: 50, photo: 'img/bg_empty2.jpg' },
            { title: 'Jacket', price: 350, photo: 'img/bg_empty2.jpg' },
            { title: 'Shoes', price: 250, photo: 'img/bg_empty2.jpg' },
        ];
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price, good.photo);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
    calcAllGoods() { // метод, определяющий суммарную стоимость всех товаров
        let totalSum = 0;
        this.goods.forEach((good) => {
            if (good.price !== undefined) {
                totalSum += good.price;
            }
        });
        let totalSumOutput = 'Сумма всех товаров: $' + totalSum;
        document.querySelector('.total-amount').innerHTML = totalSumOutput;
    }
}

// класс Корзины
class Cart { 
    constructor() {
        // в классе Корзины — массив с добавленными товарами
        this.addedGoods = [];
    }
    // добавление товара в Корзину
    addToCart() {}

    // удаление товара из Корзины
    deleteFromCart() {}

    // изменение количества товаро
    changeCount() {}

    // очистка содержимого Корзины
    clearCart() {}

    // подсчет стоимости и количества товаров в Корзине
    calcCart() {}

    /* проверка на наличие товаров в Корзине — 
    с активацией/деактивацией кнопки оформления заказа */
    isOrder() {}

    // рендеринг содержимого Корзины
    render() {}

    // открывание Корзины
    openCart() {}
}

// класс Элемента корзины
class CartItem {
    // надо полагать, тут будут те же параметры, что и в списке;
    constructor(title, price, photo, link) {
        this.title = title;
        this.price = price;
        this.photo = photo;
        this.link = link; // будет добавлено что-то вроде ссылки или id (?)
    }
    // рендеринг Элемента корзины
    render() {}

    // эффект добавления Элемента в Корзину
    // (?) не уверен, что этот метод для этого класса
    movingToCart() {}
}

const list = new GoodsList();
list.fetchGoods();

document.addEventListener('DOMContentLoaded', () => {
    list.render();
    list.calcAllGoods();
});