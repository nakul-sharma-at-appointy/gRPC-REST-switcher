const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Path to the JSON file
const JSON_FILE_PATH = "server/database.json";

function loadUsersFromFile() {
  let users;
  try {
    const jsonData = JSON.parse(fs.readFileSync(JSON_FILE_PATH, "utf-8"));
    users = jsonData
    console.log("Users loaded from JSON file:", users);
  } catch (error) {
    console.error("Error loading users from JSON file:", error);
  }
  return users;
}


// Load users from JSON file
let users = loadUsersFromFile();
// try {
//   users = JSON.parse(fs.readFileSync(JSON_FILE_PATH));
//   console.log("user hai", users)
// } catch (error) {
//   console.error('Error loading users from JSON file:', error);
// }

// Function to save users to JSON file
function saveUsersToFile(users) {
  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(users));
}

// let users = [

//   { id: 1, name: "Jay", age: 24, status: "Busy" },
//   { id: 2, name: "Nakul", age: 23, status: "Available" },
//   { id: 3, name: "Hassan", age: 22, status: "In a meeting" },
// ];

function createUser(user) {
  const newUser = { id: user.id, ...user };
  users.push(newUser);
  saveUsersToFile(users);
  return newUser;
}

function getUser(id) {
  
  return users.find((user) => user.id === id);
}

function getAllUsers() {
  return users;
}

// Create
app.post("/users", async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});

// Read
app.get("/users/:id", async (req, res) => {
  const user = await getUser(Number(req.params.id));
  // console.log(;)
  console.log(user);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});


//Get all users
app.get('/users', (_, res) => {
  const allUsers = getAllUsers();
  res.json(allUsers);
});

app.listen(3001, () => console.log("Server is running on port 3001"));

fs.watchFile(JSON_FILE_PATH, () => {
  console.log("JSON file changed, reloading users...");
  users = loadUsersFromFile();
});