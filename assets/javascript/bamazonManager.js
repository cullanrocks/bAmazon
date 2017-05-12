var prettyLines = "===============================================================================";
var connection = require("./validation.js");
var inquirer = require("inquirer");
var columnify = require('columnify');

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
});

menu()

function menu() {
    inquirer.prompt([{
        type: "list",
        name: "menu",
        message: "Welcome, Mr. Manager. Please select an option:",
        choices: ["View Inventory", "View Low Inventory", "Restock Inventory", "Add New Product"],
    }]).then(function(response) {
        switch (response.menu) {
            case "View Inventory":
                // console.log("view products")
                viewInventory();
                break;
            case "View Low Inventory":
                // console.log("view low")
                viewLow();
                break;
            case "Restock Inventory":
                // console.log("add products")
                restock();
                break;
            case "Add New Product":
                // console.log("add new")
                addNew();
                break;
        }
    })
}

function viewInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(`${prettyLines}\n FULL INVENTORY:\n${prettyLines}`)
        dataArray = [];
        generateTable(res);
        console.log(columns)
        console.log(prettyLines)
        menu();
    })
}

function generateTable(res) {
    for (var i = 0; i < res.length; i++) {
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
}

function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
        if (err) throw err;
        console.log(`${prettyLines}\n LOW INVENTORY:\n${prettyLines}`);
        dataArray = [];
        generateTable(res);
        console.log(columns);
        console.log(prettyLines);
        menu();
    })
}

function restock() {
    inquirer.prompt([{
        type: "input",
        name: "productID",
        message: "Type the ID of the product you'd like to restock:",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }, {
        type: "input",
        name: "quantity",
        message: "How many would you like to order for restock?",
        validate: function(value) {
            if (isNaN(value) === false && parseInt(value) > 0) {
                return true;
            }
            return false;
        }
    }]).then(function(purchase) {
        // newPurchaseID = purchase.productID;
        // purchaseQuantity = purchase.quantity;
        connection.query(`SELECT * FROM products WHERE item_id=?`, [purchase.productID], function(err, res) {
            newStock = parseInt(res[0].stock_quantity) + parseInt(purchase.quantity);
            console.log(newStock)
            update(newStock, purchase.productID);
        })
    })
}

function addNew() {
    inquirer.prompt([{
        type: "input",
        message: "What product would you like to add to the inventory?",
        name: "product"
    }, {
        type: "input",
        message: "What department is this new product in?",
        name: "department"
    }, {
        type: "input",
        message: "How much does this product cost?",
        name: "price"
    }, {
        type: "input",
        message: "How many of these items would you like to add to stock?",
        name: "quantity"
    }]).then(function(newItem) {

        connection.query("INSERT INTO products SET ?", {
            product_name: newItem.product,
            department_name: newItem.department,
            price: newItem.price,
            stock_quantity: newItem.quantity
        }, function(err, res) {
            viewInventory();
        })
    })
}

function update(stock, id) {
	connection.query('UPDATE products SET ? WHERE ?', [{
        stock_quantity: stock
    }, {
        item_id: id
    }]), function(err, res){
		if (err) throw err;
    }
    console.log("Inventory updated");
    viewInventory();
}

