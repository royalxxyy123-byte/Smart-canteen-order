CREATE DATABASE IF NOT EXISTS smart_canteen;

USE smart_canteen;

CREATE TABLE orders (

    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    total DECIMAL(10,2) NOT NULL,

    status VARCHAR(30) DEFAULT 'Pending',

    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
