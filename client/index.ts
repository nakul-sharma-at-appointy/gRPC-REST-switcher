import API from "./class";

async function run() {
  const api = new API("gRPC");
  const john = await api.createUser({
    name: "Hello",
    age: 10,
    id: 10,
    status: "active",
  });

  console.log(`\nCreated user`, john);

  const user = await api.getUser(1);
  console.log(user);

  const users = await api.getAllUsers();
  console.log(`\nListing all ${users ? users?.length : ""} users`);
  console.log(users);
}

run();
