import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { User, UserRequest } from "../../proto/users_pb";
import { client } from "../utils";
import { noop } from "../utils";

interface UserProps {
  id: number;
  name: string;
  age: number;
  status: string;
}

export const gRPC = {
  async getUser(id: number) {
    return new Promise<User>((resolve, reject) => {
      const request = new UserRequest();
      request.setId(id);

      client.getUser(request, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    }).then((res) => res.toObject());
  },

  async createUser(props: UserProps) {
    const john = new User();
    john.setName(props.name);
    john.setAge(props.age);
    john.setId(props.id);
    john.setStatus(props.status);
    const stream = client.createUser(noop);
    // for (const user of users) {
    stream.write(john);
    // }
    stream.end();

    return john.toObject();
  },

  async getAllUsers() {
    return new Promise<User[]>((resolve, reject) => {
      const stream = client.getUsers(new Empty());
      const users: User[] = [];
      stream.on("data", (user) => users.push(user));
      stream.on("error", reject);
      stream.on("end", () => resolve(users));
    }).then((res) => res.map((user) => user.toObject()));
  },
};
