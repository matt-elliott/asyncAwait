CREATE DATABASE greatbay_db;

USE greatbay_db;

CREATE TABLE items(
  id SMALLINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price SMALLINT NOT NULL,
  type VARCHAR(50) NOT NULL
);

INSERT INTO items(name, price, type)
VALUSE('Macbook', 55000, 'computer');
