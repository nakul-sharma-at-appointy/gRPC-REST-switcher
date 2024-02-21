import { User } from "../proto/users_pb";
import fs from "fs";

// Function to convert JSON data to User objects
function jsonToUser(jsonData: any): User {
  const { id, name, age, status } = jsonData;
  const user = new User();
  user.setId(id);
  user.setName(name);
  user.setAge(age);
  user.setStatus(status);
  return user;
}

// Path to the JSON file
const JSON_FILE_PATH = "server/database.json";

// Function to load users from JSON file
function loadUsersFromFile(): User[] {
  let users: User[] = [];
  try {
    const jsonData = JSON.parse(fs.readFileSync(JSON_FILE_PATH, "utf-8"));
    users = jsonData.map(jsonToUser);
    console.log("Users loaded from JSON file:", users);
  } catch (error) {
    console.error("Error loading users from JSON file:", error);
  }
  return users;
}

export function writeUsersToFile(users: User[]): void {
  const usersData = users.map((user) => user.toObject());

  try {
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(usersData, null, 2));
    console.log("Users data written to JSON file.");
  } catch (error) {
    console.error("Error writing users data to JSON file:", error);
  }
}

// Load users from JSON file
export let users = loadUsersFromFile();

fs.watchFile(JSON_FILE_PATH, () => {
  console.log("JSON file changed, reloading users...");
  users = loadUsersFromFile();
});
