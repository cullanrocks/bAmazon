let prettyLines = "===============================================================================";
let connection = require("./validation.js");
let inquirer = require("inquirer");
let columnify = require('columnify');
let Cryptr = require('cryptr');
let cryptr = new Cryptr('myTotalySecretKey');
let itemsInStock = 0;
let data;
let dataArray = [];
let validID = [];
let columns;
let newPurchaseID;
let purchaseQuantity;
let individualSales;
let newStock = 0;
let currentUser;
let departmentName;
let departmentSales;
let netGainNetLoss;

let thisSale;
let numbersAndLetters = 'abcdefghijklmnopqrstuvwxyz0123456789';

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
});

function startMenu() {
    inquirer.prompt([{
        type: "list",
        message: "Are you a new user or an existing user?",
        choices: ['New User', 'Existing User'],
        name: "userType"
    }]).then(function(user) {
        if (user.userType == "New User") {
            newUser();
        } else if (user.userType == "Existing User") {
            login();
        }
    })
}

function newUser() {
    inquirer.prompt([{
        type: "input",
        message: "Enter your email address.",
        name: "email"
    }, {
        type: "password",
        name: "password",
        message: "Choose a password"
    }, {
        type: "password",
        name: "confirm",
        message: "Confirm your password"
    }]).then(function(newUser) {
        if (newUser.password === newUser.confirm) {
            let salt = '';
            for(let i = 0; i < 32; i++){
                salt += numbersAndLetters[Math.floor(Math.random() * numbersAndLetters.length)];
            }
            connection.query("INSERT INTO users SET ?", {
                email: newUser.email,
                password: cryptr.encrypt(salt.concat(newUser.confirm)),
                salt: salt
            }, function(err, res){
                if (err) throw err;
                browseInventory()
            })
        } else {
            console.log("Password didn't match. Please try again.");
            newUser();
        }
    })
}

function login() {
    inquirer.prompt([{
        type: "input",
        message: "Enter your email address.",
        name: "email"
    }, {
        type: "password",
        name: "password",
        message: "Enter your password"
    }]).then(function(existingUser) {
        connection.query(`SELECT * FROM users WHERE email=?`, [existingUser.email], function(err, res){
            if(res[0].salt.concat(existingUser.password) === cryptr.decrypt(res[0].password)){
                console.log('Login Successful')
                browseInventory();
            } else {
                console.log("Password didn't match. Please try again.");
                login();
            }
        })
    })
}

function browseInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(`${prettyLines}\n INVENTORY:\n${prettyLines}`)
        dataArray = [];
        validID = [];
        generateTable(res)
        console.log(columns)
        purchaseItem()
    })
}

function generateTable(res) {
    for (var i = 0; i < res.length; i++) {
        itemsInStock = res.length;
        data = {
            item_id: res[i].item_id,
            product_name: res[i].product_name,
            department_name: res[i].department_name,
            price: `$${res[i].listing_price}`,
            stock_quantity: res[i].stock_quantity
        };
        dataArray.push(data);
        validID.push(data.item_id);
        columns = columnify(dataArray, {
            columns: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            columnSplitter: '__|__',
            paddingChr: '_'
        })
    }
}

function purchaseItem() {
    inquirer.prompt([{
        type: "input",
        name: "productID",
        message: "Type the ID of the product you'd like to purchase:",
        validate: function(value) {
            if (isNaN(value) === false && validID.indexOf(parseInt(value)) !== -1) {
                return true;
            }
            return false;
        }
    }, {
        type: "input",
        name: "quantity",
        message: "How many would you like to purchase?",
        validate: function(value) {
            // && parseInt(value) < itemsInStock && parseInt(value) > 0
            if (isNaN(value) === false && parseInt(value) > 0) {
                return true;
            }
            return false;
        }
    }]).then(function(purchase) {
        newPurchaseID = purchase.productID;
        purchaseQuantity = parseInt(purchase.quantity);
        checkInventory(newPurchaseID);
    })
}

function checkInventory(newPurchase) {
    connection.query(`SELECT * FROM products WHERE item_id=?`, [newPurchase], function(err, res) {
        // console.log(res)
        if (err) throw err;
        if (purchaseQuantity > res[0].stock_quantity) {
            console.log("I'm sorry, but you asked for more than we have in stock. Please try again.");
            purchaseItem();
        } else {
            let total = purchaseQuantity * res[0].listing_price
            console.log(`You purchased ${purchaseQuantity} ${res[0].product_name} for a total of $${total}.`);
            departmentName = res[0].department_name;
            sales(res[0].department_name, res[0].listing_price, purchaseQuantity);
            newStock = res[0].stock_quantity - purchaseQuantity;
            update(newPurchaseID, newStock);
        }
    })
}

function update(id, newStock) {
    connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [newStock, id],
        function(err, res) {
            if (err) console.log('error line 182: ' + err);
            browseInventory();
        })
}

function sales(departmentID, price, quantity) {
    thisSale = price * parseInt(quantity);
    connection.query('SELECT * FROM departments WHERE department_name = ?', [departmentID], function(err, res) {
        if (err) console.log('error line 190: ' + err)
        departmentSales = thisSale + res[0].total_sales;
        netGainNetLoss = res[0].overhead_costs + departmentSales;
        connection.query('UPDATE departments SET total_sales = ?, netgain_netloss = ? WHERE department_name = ?', [departmentSales, netGainNetLoss, departmentID], function(err, res) {
            if (err) console.log('error line 194: ' + err);
        })
    });
}

startMenu()
