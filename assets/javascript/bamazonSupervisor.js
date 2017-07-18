var prettyLines = "========================================================================================";
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
        name: "sales"
    }]).then(function(newDepartment) {
        connection.query("INSERT INTO departments SET ?", {
            department_name: newDepartment.department.toLowerCase(),
            overhead_costs: parseFloat(newDepartment.overhead * -1).toFixed(2),
            total_sales: parseFloat(newDepartment.sales),
            netgain_netloss: ((-1 * parseFloat(newDepartment.overhead)) + parseFloat(newDepartment.sales)),
        }, function(err, res) {
            if (err) throw err;
            salesReport();
        })
    })
}

function salesReport() {
    connection.query('SELECT * FROM departments', function(err, res) {
        if (err) throw err;
        console.log(`${prettyLines}\n====================================== SALES REPORT ====================================\n${prettyLines}`);
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
            overhead_costs: `$${res[i].overhead_costs.toFixed(2)}`,
            total_sales: `$${res[i].total_sales.toFixed(2)}`,
            netgain_netloss: `$${res[i].netgain_netloss.toFixed(2)}`,
        };
        dataArray.push(data);
        columns = columnify(dataArray, {
            columns: ['department_id', 'department_name', 'overhead_costs', 'total_sales', 'netgain_netloss'],
            columnSplitter: '__|__',
            paddingChr: '_'
        })
    }    
}
