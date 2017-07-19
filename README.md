# bAmazon

bAmazon = a server side, node.js based application that is a full eCommerce product management system. Create departments, order &|| restock inventory, customer login with encrypted passwords with hash salts, track purchases & generate sales reports.

##Inscrutions

###1) To start, please open and run the bamazon.sql in your SQL application. 

###2) The script will create a database with three tables, on for Users, one for Products, and one for Departments. 

###3) Add departments and inventory items through the supervisor and manager applications. 

###4) Open the validation.js file in Sublime. Change the parameters to match those of your MySQL localhost settings (host, port, user, & password). The database name should be untouched.

###5) Next, use your terminal to navigate to the directory which contains the javascript files and launch bamazonSupervisor.js to add new departments to the store. You will need to input the name of the department, your overhead costs for the department and your total sales for the department, if any. The application will automatically calculate your net gain or net loss. You should automatically see the new department created once you go to view sales report.

###6) After creating a new database, launch the bamazonManager.js file in terminal. Here you can add new products to your store. First enter what product you would like to add, what department the product is in (it is important to make sure this department exists by creating it through the bamazonSupervisor.js application as explained above, or else your will not be able to get sales reports), the quantity of the product you would like to add, and finally, indicate how much that product costs.

###7) Run the bamazonCustomer.js, to select a product. Then enter how many you'd like to buy.

###8) Run the bamazonManager script to check for low inventory, and then restock your inventory. 

###9) Run the bamazonSupervisor script to View Sales Reports for each of the departments.


## Deployment


## Built With

* [React](https://facebook.github.io/react/) - The web framework used
* [Leafjs](http://leafletjs.com/) - JavaScript library used for mapping
* [Material Design Lite](https://getmdl.io/) - CSS framework
* [Propublica](https://www.propublica.org/datastore/apis) - API used for representatives' voting history
* [Passportjs](http://passportjs.org/docs) - User authentication middleware



## Authors

* **Cullan Shewfelt** - [cullanrocks](https://github.com/cullanrocks)
