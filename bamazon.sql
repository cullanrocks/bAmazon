-- CREATE DATABASE Bamazon;
-- USE Bamazon;
-- 
-- CREATE TABLE products (
-- 	   item INTEGER NOT NULL AUTO_INCREMENT,
--     product_name VARCHAR(100) NOT NULL,
--     department_name VARCHAR(100) NOT NULL,
--     price DECIMAL (7, 2) NOT NULL, 
--     stock_quantity INTEGER(10) NOT NULL,
--     PRIMARY KEY (item)
-- );
-- 
-- CREATE TABLE departments (
-- 	department_id INTEGER NOT NULL AUTO_INCREMENT,
--     department_name VARCHAR(100) NOT NULL,
--     overhead_costs DECIMAL (7, 2) NOT NULL, 
--     total_sales DECIMAL (7, 2) NOT NULL,
--     PRIMARY KEY (department_id)
-- );
-- 

-- SELECT * FROM products;
-- SELECT * FROM departments;

-- INSERT INTO departments (department_name, overhead_costs, total_sales) VALUES ("accessories", 5000, 9000);
-- INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Plumbus", "Accessories", 14.99, 10);
-- INSERT INTO departments (department_name, overhead_costs, total_sales) VALUES ("accessories", 5000, 9000);
-- INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Plumbus", "Accessories", 14.99, 10);



