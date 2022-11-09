import { config } from '../config';
import { GraphQLClient } from 'graphql-request';
import { parseJwt } from '../utils/helpers/parseJwt';
import * as queries from './queries';

export const API_URL = `http://localhost:${config.API_PORT}/graphql`;

const client = new GraphQLClient(API_URL);

describe('All tests', () => {
  beforeAll(async () => {
    const { login } = await client.request(queries.login, {
      username: "admin",
      password: "4dm1nP4ss"
    });
    await client.request(queries.clearDb, undefined, {
      authorization: `Bearer ${login.accessToken}`,
    });
  });

  test('Login debe fallar con credenciales incorrectas', (doneCb) => {
    console.log("en login");
    client
      .request(queries.login, {
        username: 'admin',
        password: 'wrongPassword',
      })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.response.errors[0].message).toEqual('Invalid Credentials');
        doneCb();
      });
  });

  test('Login autentica correctamente', async () => {
    const result = await client.request(queries.login, {
      username: 'admin',
      password: '4dm1nP4ss',
    });
    expect(result.login.id).toBeDefined();
    expect(result.login.accessToken).toBeDefined();
    const user: any = parseJwt(result.login.accessToken);
    expect(user.roles.filter((r: any) => r.name === 'admin')).toHaveLength(1);
  });
});

describe('Test insert data', () => {
  let headers: any = {};

  beforeAll(async () => {
    const { login } = await client.request(queries.login, {
      username: 'admin',
      password: '4dm1nP4ss',
    });
    headers = {
      authorization: `Bearer ${login.accessToken}`,
    };
  });

  test("Get my profile should work fine with authorization", async () => {
    const result = await client.request(queries.getMyProfile, undefined, headers)
    console.log(result)
  })
});
