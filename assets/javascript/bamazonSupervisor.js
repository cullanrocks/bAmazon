var prettyLines = "================================================================================";
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
        message: "Welcome, Mr. Supervisor Please select an option:",
        choices: ["View Sales Report", "Create a new department"],
    }]).then(function(response) {
        switch (response.menu) {
            case "View Sales Report":
                salesReport();
                break;
            case "Create a new department":
                createDepartment();
                break;
        }
    })
}

// function generateTable(res) {
//     for (var i = 0; i < res.length; i++) {
//         itemsInStock = res.length;
//         data = {
//             item_id: res[i].item_id,
//             product_name: res[i].product_name,
//             department_name: res[i].department_name,
//             wholesale_price: `$${res[i].wholesale_price}`,
//             listing_price: `${res[i].listing_price}`,
//             stock_quantity: res[i].stock_quantity
//         };
//         dataArray.push(data);
//         columns = columnify(dataArray, {
//             columns: ['item_id', 'product_name', 'department_name', 'wholesale_price', 'listing_price', 'stock_quantity'],
//             columnSplitter: '__|__',
//             paddingChr: '_'
//         })
//     }
// }

function createDepartment() {
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the department you like to add?",
        name: "department"
    }, {
        type: "input",
        message: "What are the overhead costs for this department?",
        name: "overhead"
    }, {
        type: "input",
        message: "How much sales does this department have?",
        name: "sales",
        validate: function(value) {
            // && parseInt(value) < itemsInStock && parseInt(value) > 0 
            if (isNaN(value) === false && value > 0) {
                return true;
            }
            return false;
        }
    }]).then(function(newDepartment) {

        connection.query("INSERT INTO departments SET ?", {
            department_name: newDepartment.department.toLowerCase(),
            overhead_costs: newDepartment.overhead,
            total_sales: newDepartment.sales,
        }, function(err, res) {
            salesReport();
        })
    })
}

function salesReport(res) {
    connection.query('SELECT * FROM departments', function(err, res) {
        if (err) throw err;
        console.log(`${prettyLines}\n=================================== SALES REPORT ===============================\n${prettyLines}`);
        dataArray = [];
        generateSales(res);
        console.log(columns)
        console.log(prettyLines)
        menu();
    })
}

function generateSales(res) {
    for (var i = 0; i < res.length; i++) {
        itemsInStock = res.length;
        data = {
            department_id: res[i].department_id,
            department_name: res[i].department_name,
            overhead_costs: `$${res[i].overhead_costs}`,
            total_sales: `$${res[i].total_sales}`,
            total_profit: '$' + (res[i].total_sales - res[i].overhead_costs).toFixed(2),
        };
        dataArray.push(data);
        columns = columnify(dataArray, {
            columns: ['department_id', 'department_name', 'overhead_costs', 'total_sales', 'total_profit'],
            columnSplitter: '__|__',
            paddingChr: '_'
        })
    }
}
