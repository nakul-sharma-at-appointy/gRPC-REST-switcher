import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { User, UserRequest } from "../proto/users_pb";
import { client } from "./utils";
import { noop } from "./utils";
import axios from "axios";

interface UserProps {
  id: number;
  name: string;
  age: number;
  status: string;
}

class API {
  private type: string;

  constructor(type: string) {
    this.type = type;
  }
  private async getUserFromgRPC(id: number) {
    return new Promise<User>((resolve, reject) => {
      const request = new UserRequest();
      request.setId(id);

      client.getUser(request, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });
  }
  private async getUserFromREST(id: number) {
    // Private method for getting user from REST
    console.log("Getting user from REST...");

    try {
      console.log("Here i am");
      const response = await axios.get(`http://localhost:3001/users/${id}`);

      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  }

  public async getUser(id: number) {
    // if (this.type === "gRPC") {
    //   return this.getUserFromgRPC(id).then((res) => {
    //     res.toString();

    //     return this.getUserFromgRPC(id).then((res) => res.toObject());
    //   });
    // } else {
    //   return this.getUserFromREST(id);
    // }
    switch (this.type) {
      case "gRPC":
        return this.getUserFromgRPC(id).then((res) => res.toObject());
      default:
        return this.getUserFromREST(id);
    }
  }

  private async createUserFromgRPC(props: UserProps) {
    const jim = new User();
    jim.setName(props.name);
    jim.setAge(props.age);
    jim.setId(props.id);
    jim.setStatus(props.status);
    const stream = client.createUser(noop);
    // for (const user of users) {
    stream.write(jim);
    // }
    stream.end();

    return jim;
  }

  private async createUserFromREST(props: UserProps) {
    const user = { ...props };
    console.log("Creating User from REST");
    try {
      const response = await axios.post("http://localhost:3001/users", user);
      console.log("Here I am", response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  public async createUser(props: UserProps) {
    // if (this.type === "gRPC") {
    //   return this.createUserFromgRPC(props).then((res) => res.toObject());
    // } else {
    //   return this.createUserFromREST(props);
    // }
    switch (this.type) {
      case "gRPC":
        return this.createUserFromgRPC(props).then((res) => res.toObject());
      default:
        return this.createUserFromREST(props);
    }
  }

  public async getAllUsers() {
    // if (this.type === "gRPC") {
    //   return this.getAllUsersFromgRPC().then((res) => {
    //     const convertedRes = res.map((user) => user.toObject());
    //     return convertedRes;
    //   });
    // } else {
    //   return this.getAllUsersFromREST();
    // }
    switch (this.type) {
      case "gRPC":
        return this.getAllUsersFromgRPC().then((res) =>
          res.map((user) => user.toObject())
        );
      default:
        return this.getAllUsersFromREST();
    }
  }

  private async getAllUsersFromgRPC() {
    return new Promise<User[]>((resolve, reject) => {
      const stream = client.getUsers(new Empty());
      const users: User[] = [];
      stream.on("data", (user) => users.push(user));
      stream.on("error", reject);
      stream.on("end", () => resolve(users));
    });
  }

  private async getAllUsersFromREST() {
    console.log("Getting All user from REST...");

    try {
      console.log("Here i am");
      const response = await axios.get(`http://localhost:3001/users/`);

      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  }
}

export default API;
