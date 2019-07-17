require('dotenv').config();
const mysql = require('mysql');
const colors = require('colors');
const inquirer = require('inquirer');
let items;

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DB
});

async function connectToDB() {
  try {
    let response = await connection.connect();
  } catch(error) {
    console.log(
      colors.bgRed.white.bold(error)
    )
  }
}

function postToDB(itemData) {
  console.log(`Ok! Lets add that new item!`);

  let query = connection.query(
    'INSERT INTO items SET ?',
    itemData,
    function (err, res) {
      if (err) console.log(err);
      console.log(res.affectedRows + 'inserted');
      connection.end();
    }
  );
}

function getData() {
  let queryString = `SELECT * FROM items`;

  connection.query(
    queryString,
    function (err, res) {
      if (err) throw err;
      items = res;
      connection.end();
    }
  );
}

function addNewItem() {
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of your item?',
      name: 'name'
    },
    {
      type: 'input',
      message: 'What is the price of your item?',
      name: 'price'
    },
    {
      type: 'input',
      message: 'What is the type of thing is your item?',
      name: 'type'
    },
  ])
  .then(function (res) {
    postToDB(res);
  });
}

function bidder(items) {
  let itemsArray = [];
  items.forEach(function (item) {
    let itemOjbect = {
      id: item.id,
      name: item.name,
      price: item.price,
      type: item.type
    };

    itemsArray.push(itemOjbect);
  });
  console.log(itemsArray);
  inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Which item would you like to bid on?',
      name: 'bidOn',
      choices: itemsArray
    }
  ])
  .then(function (res) {
    console.log(res.bidOn);
  })
}

function bidPrompt() {
  inquirer.prompt([
    {
      type: 'input',
      message: 'What kind of item would you like?',
      name: 'itemType'
    }
  ])
    .then(function (res) {
      getData(res.itemType);
    });
}

(function () {
  connectToDB();
  getData();

  inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Would you like to add an item or bid on an item?',
      name: 'postOrBid',
      choices: [
        {
          name: 'Add New Item',
        },
        {
          name: 'Bid on Existing Item'
        }
      ]
    },
  ])
  .then(function (res) {
    let answer = res.postOrBid[0];

    switch (answer) {
      case 'Add New Item':
        addNewItem();
        break;
      case 'Bid on Existing Item':
        bidPrompt();
        break;
    }
  })
})();