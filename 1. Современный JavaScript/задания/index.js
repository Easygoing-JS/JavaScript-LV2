/*
2. Добавьте значения по умолчанию для аргументов функции.
Как можно упростить или сократить запись функций? */

const goods = [{
        photo: 'img/bg_empty2.jpg',
        title: 'Shirt',
        price: 150
    },
    {
        photo: 'img/bg_empty2.jpg',
        title: 'Socks',
        price: 50
    },
    {
        photo: 'img/bg_empty2.jpg',
        title: 'Jacket',
        price: 350
    },
    {
        photo: 'img/bg_empty2.jpg',
        title: 'Shoes',
        price: 250
    },

];

// вполне можно обойтись без return и фигурных скобок
const renderGoodsItem = (title = 'Shirt', price = 150, photo = 'img/bg_empty2.jpg') =>
    `<div class="goods-item">
        <img class="card-photo" src="${photo}" alt="${title}" width="120" height="80">
        <h3 class="card-title">${title}</h3>
        <p class="card-price">$${price}</p>
    </div>`;

// преобразование массива [goodsList] в строку — запятая в тексте;
// метод .join('') решит проблему: разделитель — пустая строка
const renderGoodsList = (list = goods) => {
    const goodsList = list.map(item => renderGoodsItem(item.title, item.price, item.photo));
    document.querySelector('.goods-list').innerHTML = goodsList.join('');
};

document.addEventListener('DOMContentLoaded', () => {
    renderGoodsList(); // вызов функции без параметров — значение аргумента по умолчанию
});