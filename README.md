# bAmazon

##bAmazon is a fully functioning online consumer shopping application complete with manager and supervisor functions.

###Inscrutions
1) To start, please open and run the bamazon.sql in your SQL application. 

2) The script will create a database with two tables, each table containing one row. 

3) That's okay though, because you can respectively add more departments and inventory through the supervisor and manager applications. 

4) Open the validation.js file in Sublime. Change the parameters to match your localhost settings (host, port, user, & password). The database name should be untouched.

5) Next, use your terminal to navigate to the directory which contains the javascript files and launch bamazonSupervisor.js to add new departments to the store. You will need to input the name of the department, your overhead costs for the department, and your total sales for the department. You should automatically see the new department created once you go to view sales report.

6) Afterwards, launch the bamazonManager.js file in terminal. Here you can add new products to your store. First enter what product you would like to add, what department the product is in (it is important to make sure this department exists by creating it through the bamazonSupervisor.js application as explained above, or else your will not be able to get sales reports), the quantity of the product you would like to add, and finally, indicate how much that product costs.

7) Run the bamazonCustomer.js, to select a product. Then enter how many you'd like to buy.

8) Run the bamazonManager script to check for low inventory, and then restock your inventory. 

9) Run the bamazonSupervisor script to View Sales Reports for each of the departments.

####Extra

the bamazoncustomer2 script was working on getting a user log in, but is not yet complete. 
