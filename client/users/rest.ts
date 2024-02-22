import axios from "axios";

interface UserProps {
  id: number;
  name: string;
  age: number;
  status: string;
}

export const REST = {
  async getUser(id: number) {
    console.log("Getting user from REST...");

    try {
      console.log("Here i am");
      const response = await axios.get(`http://localhost:3001/users/${id}`);

      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  },

  async createUser(props: UserProps) {
    const user = { ...props };
    console.log("Creating User from REST");
    try {
      const response = await axios.post("http://localhost:3001/users", user);
      console.log("Here I am", response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  },

  async getAllUsers() {
    console.log("Getting All user from REST...");

    try {
      console.log("Here i am");
      const response = await axios.get(`http://localhost:3001/users/`);

      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  },
};
