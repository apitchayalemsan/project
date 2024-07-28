const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const cors = require("cors");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/image', express.static('images'));

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my-project' // Use your actual database name
});

app.get('/', (req, res) => {
    res.send('Hello World by Express!!')
});

// Get all users
app.get('/user', (req, res) => {
    pool.query("SELECT * FROM user", function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

// Get a specific user by ID
app.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    pool.query("SELECT * FROM user WHERE user_id = ?", [userId], function (error, results, field) {
        if (error) throw error;
        res.json(results);
    });
});

// Add a new user
app.post('/add_user', (req, res) => {
    const input = req.body;
    pool.query("INSERT INTO user (user_id, user_name, user_pwd, first_name, last_name, houseNo, villageNo, tumbon, sub_area, province, role_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
        [
            input.user_id,
            input.user_name,
            input.user_pwd,
            input.first_name,
            input.last_name,
            input.houseNo,
            input.villageNo,
            input.tumbon,
            input.sub_area,
            input.province,
            input.role_id
        ], function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});

// Authentication request
app.post("/api/authen_request", (req, res) => {
    const sql = "SELECT * FROM user WHERE MD5(user_name) = ?";
    pool.query(sql, [req.body.username], (error, results) => {
        var response;
        if (error) {
            response = {
                result: false,
                message: error.message
            };
        } else {
            if (results.length) {
                var payload = { username: req.body.username };
                var secretKey = "MySecretKey";
                const authToken = jwt.sign(payload, secretKey);
                response = {
                    result: true,
                    data: {
                        auth_token: authToken
                    }
                };
            } else {
                response = {
                    result: false,
                    message: "Username ไม่ถูกต้อง"
                };
            }
        }
        res.json(response);
    });
});

// Access request
app.post("/api/access_request", (req, res) => {
    const authenSignature = req.body.auth_Signature;
    const authToken = req.body.auth_token;
    var decoded = jwt.verify(authToken, "MySecretKey");

    if (decoded) {
        const query = "SELECT a.user_id, a.user_name, a.first_name, a.last_name, a.role_id, b.role_name " +
            "FROM user a JOIN role b ON a.role_id = b.role_id WHERE MD5(CONCAT(user_name, '&', user_pwd))= ?";
        pool.query(query, [authenSignature], (error, results) => {
            var response;
            if (error) {
                response = {
                    result: false,
                    message: error.message
                };
            } else {
                if (results.length) {
                    var payload = {
                        user_id: results[0].user_id,
                        username: results[0].user_name,
                        first_name: results[0].first_name,
                        last_name: results[0].last_name,
                        role_id: results[0].role_id,
                        role_name: results[0].role_name
                    };
                    const accessToken = jwt.sign(payload, "MySecretKey");
                    response = { result: true, data: { access_token: accessToken, account_info: payload } };
                } else {
                    response = { result: false, message: "Username หรือ Password ไม่ถูกต้อง" };
                }
            }
            res.json(response);
        });
    }
});

// User login
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    pool.query("SELECT * FROM user WHERE user_name = ? AND user_pwd = MD5(?)", [username, password], function (error, results, fields) {
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        } else if (results.length) {
            res.json({
                result: true
            });
        } else {
            res.json({
                result: false,
                message: "ไม่พบ Username หรือ Password ไม่ถูกต้อง"
            });
        }
    });
});

// Save form data
app.post('/api/saveForm', (req, res) => {
    const { date, seller, price, weight, percentage, dryRubber, totalPrice } = req.body;
    const query = 'INSERT INTO history (date, seller, price, weight, percentage, dryRubber, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?)';
    pool.query(query, [date, seller, price, weight, percentage, dryRubber, totalPrice], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
            return;
        }
        res.status(200).send('Data inserted successfully');
    });
});

// Get form data
app.get('/api/getHistory', (req, res) => {
    const query = 'SELECT * FROM history';
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
            return;
        }
        res.status(200).json(results);
    });
});

//save ราคา

app.post('/api/savePrice', async (req, res) => {
    const { date, price } = req.body;

    try {
        await pool.query(
            'INSERT INTO price_history (date, price) VALUES ($1, $2)',
            [date, price]
        );
        res.status(201).send('Price saved successfully');
    } catch (error) {
        console.error('Error saving price:', error);
        res.status(500).send('Error saving price');
    }
});

app.get('/api/getPriceHistory', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM price_history ORDER BY date ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching price history:', error);
        res.status(500).send('Error fetching price history');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
