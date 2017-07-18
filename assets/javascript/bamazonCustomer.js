var prettyLines = "===============================================================================";
var connection = require("./validation.js");
var inquirer = require("inquirer");
var columnify = require('columnify');
var Cryptr = require('cryptr');
var cryptr = new Cryptr('myTotalySecretKey');
var itemsInStock = 0;
var data;
var dataArray = [];
var validID = [];
var columns;
var newPurchaseID;
var purchaseQuantity;
var individualSales;
var newStock = 0;
var currentUser;
var departmentName;
var departmentSales;
var thisSale;
var numbersAndLetters = 'abcdefghijklmnopqrstuvwxyz0123456789';

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
            wholesale_price: `$${res[i].wholesale_price}`,
            listing_price: `$${res[i].listing_price}`,
            stock_quantity: res[i].stock_quantity
        };
        dataArray.push(data);
        validID.push(data.item_id);
        columns = columnify(dataArray, {
            columns: ['item_id', 'product_name', 'department_name', 'wholesale_price', 'listing_price', 'stock_quantity'],
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
            console.log(`You purchased ${purchaseQuantity} ${res[0].product_name}`);
            departmentName = res[0].department_name;
            sales(res[0].price, purchaseQuantity, res[0].department_name);
            newStock = res[0].stock_quantity - purchaseQuantity;
            update(newStock, newPurchaseID);
        }
    })
}

function update(newStock, id) {
    connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [newStock, id],
        function(err, res) {
            if (err) console.log('error line 173: ' + err);
        })
    browseInventory();
}

function sales(price, quantity, departmentID) {
    thisSale = price * parseInt(quantity);
    connection.query('SELECT * FROM departments WHERE department_name=?', [departmentID], function(err, res) {
        if (err) console.log('error line 182: ' + err)
        departmentSales = thisSale + res[0].total_sales;
        connection.query('UPDATE departments SET total_sales=? WHERE department_name=?', [departmentSales, departmentID], function(err, res) {
            if (err) console.log('error line 186: ' + err);
        })
    });
}

startMenu()