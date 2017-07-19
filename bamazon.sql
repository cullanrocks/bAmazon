-- CREATE DATABASE Bamazon;
USE Bamazon;
-- 
-- CREATE TABLE products (
-- 	   item_id INTEGER NOT NULL AUTO_INCREMENT,
--     product_name VARCHAR(100) NOT NULL,
--     department_name VARCHAR(100) NOT NULL,
--     wholesale_price DECIMAL (11, 2) NOT NULL, 
-- 	listing_price DECIMAL (11, 2) NOT NULL,
--     stock_quantity INTEGER(11) NOT NULL,
--     PRIMARY KEY (item_id)
-- );

-- CREATE TABLE departments (
-- 		department_id INTEGER NOT NULL AUTO_INCREMENT,
--     	department_name VARCHAR(100) NOT NULL,
--     	overhead_costs DECIMAL (11, 2) NOT NULL, 
--     	total_sales DECIMAL (11, 2) NOT NULL,
-- 		netgain_netloss DECIMAL (11, 2),
--     PRIMARY KEY (department_id)
-- );

-- CREATE TABLE users (
-- 		user_id INTEGER NOT NULL AUTO_INCREMENT,
--     	email VARCHAR(100) NOT NULL,
--     	password VARCHAR(100) NOT NULL,
-- 		salt VARCHAR(100) NOT NULL,
-- 		purchases JSON,
-- 		total_purchases DECIMAL(11, 2),
--		is_manager BOOLEAN DEFAULT false,
--		is_supervisor BOOLEAN DEFAULT false,
--     	PRIMARY KEY (user_id)
-- );
-- 
-- 
-- 
-- 
SELECT * FROM products;
-- SELECT * FROM users;
-- SELECT * FROM departments;
-- SLEECT * FROM individual_sales;

-- INSERT INTO departments (department_name, overhead_costs, total_sales) VALUES ("accessories", 4999.99, 8999.99);
-- INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Plumbus", "Accessories", 14.99, 10);
-- INSERT INTO departments (department_name, overhead_costs, total_sales) VALUES ("electronics", 6879.99, 11234.56);
-- INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Plumbus", "Accessories", 14.99, 10);



