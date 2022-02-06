require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('isomorphic-fetch');

const PORT = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/verifyCaptcha', async (req, res) => {
    const response_key = req.body['g-recaptcha-response'];
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA_SECRET_KEY}&response=${response_key}`;
    const responseData = await fetch(url, {
        method: 'POST',
    });
    const google_response = await responseData.json();
    if (google_response.success) {
        // console.log(google_response);
        res.json({
            success: true,
            msg: 'Captcha verified successfully!'
        });
    } else {
        // console.log(google_response);
        res.json({
            success: false,
            msg: 'Captcha verification failed!'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});