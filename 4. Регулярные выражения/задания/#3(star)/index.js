function validateForm() {
    let regexp_name = /^[a-zа-яё]+$/gi,
        regexp_email = /^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/,
        regexp_phone = /^\+\d{1,3}\s?\(\d{3}\)\s?\d{3}(-\d{2}){2}$/,
        regexp_message = /[a-zа-яё0-9]/;

    let name = document.getElementsByName('name')[0].value,
        email = document.getElementsByName('email')[0].value,
        phone = document.getElementsByName('phone')[0].value,
        message = document.getElementsByName('message')[0].value;

    // Проверяем имя
    nameCheck();
    // Проверяем телефон
    phoneCheck();
    // Проверяем email
    emailCheck();
    // Проверяем сообщение
    messageCheck();

    function messageCheck() {
        if (regexp_message.test(message)) {
            document.getElementById('message').className = 'done_val';
        } else {
            document.getElementById('message').className = 'error_val';
        }
    }

    function emailCheck() {
        if (regexp_email.test(email)) {
            document.getElementById('email').className = 'done_val';
        } else {
            document.getElementById('email').className = 'error_val';
        }
    }

    function phoneCheck() {
        if (regexp_phone.test(phone)) {
            document.getElementById('phone').className = 'done_val';
        } else {
            document.getElementById('phone').className = 'error_val';
        }
    }

    function nameCheck() {
        if (regexp_name.test(name)) {
            document.getElementById('name').className = 'done_val';
        } else {
            document.getElementById('name').className = 'error_val';
        }
    }
}

document.querySelector('.button').addEventListener('click', e => {
    e.preventDefault();
    validateForm();
});