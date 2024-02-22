async function APIFactory(apiType: string) {
  let path = `./apis/${apiType}.ts`;
  const getAPIMethods = await import(path);

  const api = getAPIMethods[apiType];
  return api;
}

async function run() {
  const apiType = "REST";
  const api = await APIFactory(apiType);

  const john = await api.createUser({
    name: "Andy",
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
