var prettyLines = "===============================================================================";
var connection = require("./validation.js");
var inquirer = require("inquirer");
var columnify = require('columnify');
var itemsInStock = 0;
var data;
var dataArray = [];
var validID = [];
var columns;
var newPurchaseID;
var purchaseQuantity;
var newStock = 0;
var departmentName;
var departmentSales;
var totalSales;
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
});

function browseInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(`${prettyLines}\n INVENTORY:\n${prettyLines}`)
        dataArray = [];
        validID = [];
        for (var i = 0; i < res.length; i++) {
            validID.push(res[i].item_id)
            itemsInStock = res.length;
            data = {
                item_id: res[i].item_id,
                product_name: res[i].product_name,
                department_name: res[i].department_name,
                price: `$${res[i].price}`,
                stock_quantity: res[i].stock_quantity
            };
            dataArray.push(data);
            columns = columnify(dataArray, {
                columns: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
                columnSplitter: ' | ',
                paddingChr: '.'
            })
        }
        console.log(columns)
        purchaseItem()
    })
}

function purchaseItem() {
    inquirer.prompt([{
        type: "input",
        name: "productID",
        message: "Type the ID of the product you'd like to purchase:",
        validate: function(value) {
            // console.log(validID.indexOf(parseInt(value)))
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
    connection.query(`SELECT * FROM products WHERE item_id=?`, [newPurchaseID], function(err, res) {
        if (err) throw err;
        if (purchaseQuantity > res[0].stock_quantity) {
            console.log("I'm sorry, but you asked for more than we have in stock. Please try again.");
            purchaseItem();
        } else {
            console.log("Purchase success!");
            departmentName = res[0].department_name;
            sales(res[0].price, purchaseQuantity, res[0].department_name);
            newStock = res[0].stock_quantity - purchaseQuantity;
            update(newStock, newPurchaseID);
        }
    })
}

function update(stock, id) {
    connection.query('UPDATE products SET ? WHERE ?', [{
            stock_quantity: stock
        }, {
            item_id: id
        }]),
        function(err, res) {
            if (err) throw err;
        }
        // console.log("Inventory updated");
    browseInventory();
}

function sales(price, quantity, departmentID) {
    totalSales = price * parseInt(quantity);
    connection.query('SELECT * FROM departments WHERE department_name=?', [departmentID], function(err, res) {
        if (err) throw err;
        departmentSales = totalSales + res[0].total_sales;
        connection.query('UPDATE departments SET total_sales=? WHERE department_name=?', [departmentSales, departmentID], function(err, res) {
            if (err) throw err;
        })
    });
}

browseInventory()