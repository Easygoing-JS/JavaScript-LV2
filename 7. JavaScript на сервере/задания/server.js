const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(express.static('.'));
app.use(bodyParser.json()); // Указываем, что содержимое - JSON

app.get('/catalogData', (req, res) => {
    fs.readFile('goods.json', 'utf8', (err, data) => {
        res.send(data);
    });
});

app.post('/addToCart', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{"result": 0}');
        } else {
            const cart = JSON.parse(data);
            const item = req.body;
            cart.push(item);
            fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            });
        }
    });
});

app.post('/removeFromCart', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{"result": 0}');
        } else {
            const cart = JSON.parse(data);
            const item = req.body;

            const index = cart.findIndex(cartItem => (cartItem.id == item.id));
            if (index != -1) {
                cart.splice(index, 1);
                fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                    if (err) {
                        res.send('{"result": 0}');
                    } else {
                        res.send('{"result": 1}');
                    }
                });
            }
            else {
                res.send('{"result": 2}');
            }
        }
    });
});

app.get('/cartData', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        res.send(data);
    });
});

app.listen(3000, function() {
    console.log('server is running on port 3000!');
});

