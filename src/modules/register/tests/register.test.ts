import { request } from "graphql-request";

import { User } from "../../../entity/User";
import { startServer } from "../../../startServer";
import { AddressInfo } from "net";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const port = app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port.port}`;
});

const email = "tom@bob.com";
const password = "jalksdf";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}"){
    path
    message
  }
}
`;
describe("Register", () => {
  it("Succeeds If User creation Runs Without errors", async () => {
    const response = await request(getHost(), mutation);
    expect(response).toEqual({ register: null });
  });

  it("Succeeds if only one user has been added to the database", async () => {
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
  });

  it("Succeds if user has created valid credential columns", async () => {
    const users = await User.find({ where: { email } });
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it("Succeeds if user with same email cannot be created more than once", async () => {
    const response = await request(getHost(), mutation);
    const errors = response.register;
    expect(errors).toHaveLength(1);
    expect(errors[0].path).toEqual("email");
  });
});
