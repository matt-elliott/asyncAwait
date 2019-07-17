require('dotenv').config();
const mysql = require('mysql2/promise');
const colors = require('colors');
const inquirer = require('inquirer');
let items = [];

async function connectToDB() {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DB
  });

  let queryString = `SELECT * FROM items`;
  const [rows, fields] = await connection.execute(queryString);
  storeData(rows);
}

function storeData(data) {
  for(let i = 0; i < data.length; i++) {
    let currentItem = data[i];
    items.push(
      {
        id: currentItem.id,
        name: currentItem.name,
        price: currentItem.price,
        type: currentItem.type
      }
    );
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

async function askInitQuestion() {
  let answer = await inquirer.prompt([
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
  ]);
  console.log(answer.postOrBid[0]);

  switch (answer.postOrBid[0]) {
    case 'Add New Item':
      addNewItem();
      break;
    case 'Bid on Existing Item':
      bidPrompt();
      break;
  }
}

(async function () {
  await connectToDB();
  console.log(items);
  askInitQuestion();
})();