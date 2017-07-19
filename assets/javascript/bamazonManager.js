let prettyLines = "=====================================================================================================";
let connection = require("./validation.js");
let inquirer = require("inquirer");
let columnify = require('columnify');
let dataArray = [];
let validID = []

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
        choices: ["View Inventory", "View Low Inventory", "Restock Inventory", "Add New Product", 'Create a Sale/Change Prices', 'Return Product to Wholesale'],
    }]).then(function(response) {
        switch (response.menu) {
            case "View Inventory":
                viewInventory();
                break;
            case "View Low Inventory":
                viewLow();
                break;
            case "Restock Inventory":
                restock();
                break;
            case "Add New Product":
                addNew();
                break;
            case 'Create a Sale/Change Prices':
                changePrice();
                break;
            case 'Return Product to Wholesale':
                sellOff();
                break;
        }
    })
}

function viewInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err){
            console.log('Nothing In Inventory. Add products to inventory.');
            menu();
        } else {
        console.log(`${prettyLines}\n============================================ FULL INVENTORY =========================================\n${prettyLines}`)
        dataArray = [];
        // dataArray.push(console.log(res[0])
        generateTable(res);
        columns ? console.log(columns) && console.log(prettyLines) : console.log('Nothing In Inventory. Add products to inventory.');
        menu();
        }
    })
}

function generateTable(res) {
    for (let i = 0; i < res.length; i++) {
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
        // filling the validID array when we generate the table will help when we later need to check if any of our products are valid
        validID.push(res[i].item_id);
        columns = columnify(dataArray, {
            columns: ['item_id', 'product_name', 'department_name', 'wholesale_price', 'listing_price', 'stock_quantity'],
            columnSplitter: '__|__',
            paddingChr: '_'
        })
    }
    // console.log(validID)
}

function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity<=5", function(err, res) {
        if (err) throw err;
        console.log(`${prettyLines}\n============================================ LOW INVENTORY ==========================================\n${prettyLines}`);
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
        newPurchaseID = purchase.productID;
        purchaseQuantity = purchase.quantity;
        connection.query(`SELECT * FROM products WHERE item_id=?`, [newPurchaseID], function(err, res) {
            if (err) throw err;
            newStock = parseInt(res[0].stock_quantity) + parseInt(purchase.quantity);
            update(newPurchaseID, newStock, res[0].listing_price);
        })
    })
}

function changePrice() {
    inquirer.prompt([{
        type: "input",
        name: "productID",
        message: "Type the ID of the product you'd like to change the price of:",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }, {
        type: "input",
        name: "newPrice",
        message: "What would you like the new price of this item to be?",
        validate: function(value) {
            if (isNaN(value) === false && parseInt(value) > 0) {
                return true;
            }
            return false;
        }
    }]).then(function(purchase) {
        newPurchaseID = purchase.productID;
        console.log(purchase.newPrice)
        connection.query(`SELECT * FROM products WHERE item_id=?`, [purchase.productID], function(err, res) {
            update(newPurchaseID, res[0].stock_quantity, purchase.newPrice);
        })
    })
}

function addNew() {
    inquirer.prompt([{
        type: "input",
        message: "What product would you like to add to the inventory?",
        name: "product",
        validate: function(value) {
            if (isNaN(value) === true) {
                return true;
            }
            return false;
        }
    }, {
        type: "input",
        message: "What department is this new product in?",
        name: "department",
        validate: function(value) {
            if (isNaN(value) === true) {
                return true;
            }
            return false;
        }
    }, {
        type: "input",
        message: "What is the wholesale price of this product?",
        name: "wholesalePrice",
        validate: function(value) {
            if (isNaN(value) === false && value > 0) {
                return true;
            }
            return false;
        }
    },{
        type: "input",
        message: "How much is the price listed at?",
        name: "listingPrice",
        validate: function(value) {
            if (isNaN(value) === false && value > 0) {
                return true;
            }
            return false;
        }
    }, {
        type: "input",
        message: "How many of these items would you like to add to stock?",
        name: "quantity",
        validate: function(value) {
            // && parseInt(value) < itemsInStock && parseInt(value) > 0 
            if (isNaN(value) === false && value > 0) {
                return true;
            }
            return false;
        }
    }]).then(function(newItem) {
        connection.query('SELECT * FROM departments WHERE department_name=?', [newItem.department], function(err, res) {
            if (err) console.log('error line 213: ' + err);
            let overheadCosts = parseFloat(res[0].overhead_costs) - parseFloat(newItem.quantity * newItem.wholesalePrice);
            // console.log(newItem.wholsesalePrice)
            let netGainNetLoss = parseFloat(res[0].netgain_netloss + overheadCosts).toFixed(2);
            connection.query('UPDATE departments SET overhead_costs = ?, netgain_netloss = ? WHERE department_name = ?', [overheadCosts, netGainNetLoss, newItem.department.toLowerCase()], function(err, res) {
                if (err) console.log('error line 217: ' + err);
                console.log("Supervisor's Departments Sales Report Updated.")
        })
    });
        connection.query("INSERT INTO products SET ?", {
            product_name: newItem.product.toLowerCase(),
            department_name: newItem.department.toLowerCase(),
            listing_price: newItem.listingPrice,
            wholesale_price: newItem.wholesalePrice,
            stock_quantity: newItem.quantity
        }, function(err, res) {
            console.log(`${newItem.quantity} ${newItem.product} added to inventory listed at $${newItem.listingPrice}.`)
            viewInventory();
        })
    })
}

function update(id, stock, newPrice) {
    connection.query('UPDATE products SET ? WHERE ?', [{
            stock_quantity: stock,
            listing_price: newPrice
        }, {
            item_id: id
        }]),
        function(err, res) {
            if (err) throw err;
            console.log(`Inventory updated. Price of ${res[0].product_name} changed to ${res[0].listing_price}.`);
        }
    viewInventory();
}