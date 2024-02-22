interface ApiAdapter {
  createUser(userData: any): Promise<any>;
  getUser(userId: number): Promise<any>;
  getAllUsers(): Promise<any[]>;
}

const apiAdapters: { [apiType: string]: ApiAdapter } = {};
async function APIAdapter(apiType: string) {
  const path = `./apis/${apiType}.ts`;
  const getAPIMethods = await import(path);
  const api = getAPIMethods[apiType];

  apiAdapters[apiType] = { ...api };

  return apiAdapters[apiType];
}

async function run() {
  const apiType = "gRPC";

  const api = await APIAdapter(apiType);

  const andy = await api.createUser({
    name: "Andy",
    age: 10,
    id: 10,
    status: "active",
  });

  console.log(`\nCreated user`, andy);

  const user = await api.getUser(1);
  console.log(user);

  const users = await api.getAllUsers();
  console.log(`\nListing all ${users ? users?.length : ""} users`);
  console.log(users);
}

run();
