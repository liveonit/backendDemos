import request from 'supertest';

const API_URL = `${process.env.DOMAIN}:${process.env.API_PORT}/${process.env.API_ENDPOINT}`;

describe('🏦 api tests', () => {
  describe('test auth middleware 🔐', () => {
    test('no authentication should respond 401', async () => {
      const res = await request(API_URL).get('/healthz').send();
      expect(res.status).toEqual(401);
    });

    test('bad authentication should respond 401', async () => {
      const res = await request(API_URL).get('/healthz').auth('usuario', '123456').send();
      expect(res.status).toEqual(401);
    });

    test('the admin user should have been created', async () => {
      const res = await request(API_URL).get('/healthz').auth('admin', '123456').send();
      expect(res.status).toEqual(200);
    });
  });

  describe('the api must be healthy and has documentation endpoint 🚑', () => {
    test('the api must be healthy', async () => {
      const res = await request(API_URL).get('/healthz').auth('admin', '123456').send();

      expect(res.status).toEqual(200);
      expect(res.text).toEqual('Everything is fine!!!');
    });

    test('the api documentation endpoint should respond with a redirect to swagger', async () => {
      const res = await request(API_URL).get('/docs').auth('admin', '123456').send();
      expect(res.status).toEqual(301);
    });
  });

  describe('user endpoint tests 👩‍👨‍', () => {
    const user = {
      username: Math.round(Math.random() * 100000000).toString(),
    };
    let userId;

    const newUsername = Math.round(Math.random() * 100000000).toString();
    test('create user should work fine', async () => {
      const res = await request(API_URL).post('/user').auth('admin', '123456').send(user);
      userId = res.body.id;
      expect(res.status).toEqual(201);
    });

    test('get user should work fine', async () => {
      const res = await request(API_URL).get(`/user/${userId}`).auth('admin', '123456').send();
      expect(res.body.username).toEqual(user.username);
    });

    test('get all users should work fine', async () => {
      const res = await request(API_URL).get(`/user`).auth('admin', '123456').send();
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body.find((u) => u.username === 'admin')).toBeDefined();
      expect(res.body.find((u) => u.username === user.username)).toBeDefined();
    });

    test('update user should work fine', async () => {
      let res = await request(API_URL).put(`/user/${userId}`).auth('admin', '123456').send({
        username: newUsername,
      });
      expect(res.status).toEqual(200);

      res = await request(API_URL).get(`/user/${userId}`).auth('admin', '123456').send();
      expect(res.body.username).toEqual(newUsername);
    });

    test('delete user should work fine', async () => {
      let res = await request(API_URL).delete(`/user/${userId}`).auth('admin', '123456').send();
      expect(res.status).toEqual(200);

      res = await request(API_URL).get(`/user/${userId}`).auth('admin', '123456').send();
      expect(res.status).toEqual(404);
    });
  });

  describe('account endpoint tests 💼', () => {
    let userId;
    const user = {
      username: Math.round(Math.random() * 100000000).toString(),
    };

    let accountId;
    const account = {
      currency: 'usd',
      amount: 200,
      ownerUserId: 0,
    };
    const newAmount = 500;

    beforeAll(async () => {
      const res = await request(API_URL).post('/user').auth('admin', '123456').send(user);
      userId = res.body.id;
      account.ownerUserId = userId;
    });

    afterAll(async () => {
      await request(API_URL).delete(`/user/${userId}`).auth('admin', '123456').send();
    });

    test('create account should work fine', async () => {
      const res = await request(API_URL).post('/account').auth('admin', '123456').send(account);
      accountId = res.body.id;
      expect(res.status).toEqual(201);
    });

    test('get account should work fine', async () => {
      const res = await request(API_URL)
        .get(`/account/${accountId}`)
        .auth('admin', '123456')
        .send();
      expect(res.body.currency).toEqual(account.currency);
      expect(res.body.amount).toEqual(account.amount);
    });

    test('get all accounts should work fine', async () => {
      const res = await request(API_URL).get(`/account`).auth('admin', '123456').send();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body.find((a) => a.ownerUserId === userId)).toBeDefined();
    });

    test('update account should work fine', async () => {
      let res = await request(API_URL).put(`/account/${accountId}`).auth('admin', '123456').send({
        amount: newAmount,
      });
      expect(res.status).toEqual(200);

      res = await request(API_URL).get(`/account/${accountId}`).auth('admin', '123456').send();
      expect(res.body.amount).toEqual(newAmount);
    });

    test('delete account should work fine', async () => {
      let res = await request(API_URL)
        .delete(`/account/${accountId}`)
        .auth('admin', '123456')
        .send();
      expect(res.status).toEqual(200);

      res = await request(API_URL).get(`/account/${accountId}`).auth('admin', '123456').send();
      expect(res.status).toEqual(404);
    });
  });

  describe('test transfer and transactions endpoints 💸🤑', () => {
    const users = [];
    let accounts = [];

    beforeAll(async () => {
      for (let i = 1; i <= 3; i++) {
        users.push({ id: -1, username: Math.round(Math.random() * 100000000).toString() });
      }
      accounts = [
        {
          userRef: 0,
          id: -1,
          currency: 'usd',
          amount: 500,
        },
        {
          userRef: 0,
          id: -1,
          currency: 'uyu',
          amount: 10000,
        },
        {
          userRef: 1,
          id: -1,
          currency: 'eur',
          amount: 1000,
        },
        {
          userRef: 2,
          id: -1,
          currency: 'uyu',
          amount: 5000,
        },
      ];
      const createdUsers = await Promise.all(
        users.map(
          async (u) =>
            await request(API_URL)
              .post('/user')
              .auth('admin', '123456')
              .send({ username: u.username }),
        ),
      );

      createdUsers.forEach((u, i) => (users[i].id = u.body.id));

      const createdAccounts = await Promise.all(
        accounts.map(
          async (account) =>
            await request(API_URL).post('/account').auth('admin', '123456').send({
              currency: account.currency,
              amount: account.amount,
              ownerUserId: users[account.userRef].id,
            }),
        ),
      );
      createdAccounts.forEach((a, i) => (accounts[i].id = a.body.id));
    });

    afterAll(async () => {
      await Promise.all(
        users.map(
          async (u) =>
            await request(API_URL).delete(`/user/${u.id}`).auth('admin', '123456').send(),
        ),
      );
    });

    describe('transfer endpoint tests 💸', () => {
      test("user can't transfer from an account he doesn't own", async () => {
        const res = await request(API_URL).post(`/transfer`).auth('admin', '123456').send({
          accountFrom: accounts[0].id,
          accountTo: accounts[1].id,
          amount: 1,
        });
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          type: 'data error',
          error: 'user can only make transfers from his own accounts',
        });
      });

      test('user transfers correctly to another own account, free of charge', async () => {
        const AMOUNT_TO_TRANFER = 15;
        const res = await request(API_URL)
          .post(`/transfer`)
          .auth(users[0].username, '123456')
          .send({
            accountFrom: accounts[0].id,
            accountTo: accounts[1].id,
            amount: AMOUNT_TO_TRANFER,
            description: 'transfer to own account',
          });
        expect(res.status).toBe(200);
        const newAccountsState = (
          await request(API_URL).get(`/account`).auth(users[0].username, '123456').send()
        ).body;
        const exchanges = (
          await request(API_URL).get(`/exchange`).auth(users[0].username, '123456').send()
        ).body;
        accounts[0].amount -= AMOUNT_TO_TRANFER;
        accounts[1].amount += AMOUNT_TO_TRANFER * exchanges[exchanges.length - 1].uyu;
        expect(newAccountsState.find((a) => a.id === accounts[0].id).amount).toEqual(
          accounts[0].amount,
        );
        expect(newAccountsState.find((a) => a.id === accounts[1].id).amount.toPrecision(1)).toEqual(
          accounts[1].amount.toPrecision(1),
        );
      });

      test('user correctly transfers to a third party account, with cost', async () => {
        const AMOUNT_TO_TRANFER = 35;
        const res = await request(API_URL)
          .post(`/transfer`)
          .auth(users[0].username, '123456')
          .send({
            accountFrom: accounts[0].id,
            accountTo: accounts[2].id,
            amount: AMOUNT_TO_TRANFER,
            description: 'transfer to third party account',
          });
        expect(res.status).toBe(200);

        const newAccountsState = (
          await request(API_URL).get(`/account`).auth(users[0].username, '123456').send()
        ).body;
        const exchanges = (
          await request(API_URL).get(`/exchange`).auth(users[0].username, '123456').send()
        ).body;
        accounts[0].amount -= AMOUNT_TO_TRANFER + AMOUNT_TO_TRANFER * 0.01;
        accounts[2].amount += AMOUNT_TO_TRANFER * exchanges[exchanges.length - 1].eur;
        expect(newAccountsState.find((a) => a.id === accounts[0].id).amount.toPrecision(1)).toEqual(
          accounts[0].amount.toPrecision(1),
        );
        expect(newAccountsState.find((a) => a.id === accounts[2].id).amount.toPrecision(1)).toEqual(
          accounts[2].amount.toPrecision(1),
        );
      });

      test('user correctly transfers to a third party account, with cost, from `uyu` to `eur`', async () => {
        const AMOUNT_TO_TRANFER = 100;
        const res = await request(API_URL)
          .post(`/transfer`)
          .auth(users[2].username, '123456')
          .send({
            accountFrom: accounts[3].id,
            accountTo: accounts[2].id,
            amount: AMOUNT_TO_TRANFER,
          });
        expect(res.status).toBe(200);

        const newAccountsState = (
          await request(API_URL).get(`/account`).auth('admin', '123456').send()
        ).body;
        const exchanges = (await request(API_URL).get(`/exchange`).auth('admin', '123456').send())
          .body;
        accounts[3].amount -= AMOUNT_TO_TRANFER + AMOUNT_TO_TRANFER * 0.01;
        accounts[2].amount +=
          AMOUNT_TO_TRANFER *
          (1 / exchanges[exchanges.length - 1].uyu) *
          exchanges[exchanges.length - 1].eur;
        expect(newAccountsState.find((a) => a.id === accounts[3].id).amount.toPrecision(1)).toEqual(
          accounts[3].amount.toPrecision(1),
        );
        expect(newAccountsState.find((a) => a.id === accounts[2].id).amount.toPrecision(1)).toEqual(
          accounts[2].amount.toPrecision(1),
        );
      });

      test("user can't transfer, insufficient funds", async () => {
        const res = await request(API_URL)
          .post(`/transfer`)
          .auth(users[0].username, '123456')
          .send({
            accountFrom: accounts[0].id,
            accountTo: accounts[1].id,
            amount: 1000000,
          });
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({ type: 'data error', error: 'insufficient funds' });
      });
    });

    describe('transactions endpoint tests 🤑', () => {
      test('get transactions, user without any account', async () => {
        const res = await request(API_URL).get(`/transactions`).auth('admin', '123456').send();
        expect(res.status).toEqual(200);
        expect(res.body).toEqual([]);
      });

      test('get transactions, user 0, all accounts', async () => {
        const res = await request(API_URL)
          .get(`/transactions`)
          .auth(users[0].username, '123456')
          .send();
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(2);
        expect(
          res.body.find((t) => t.accountFrom === accounts[0].id && t.accountTo === accounts[1].id)
            .amount,
        ).toEqual(15);
        expect(
          res.body.find((t) => t.accountFrom === accounts[0].id && t.accountTo === accounts[2].id)
            .amount,
        ).toEqual(35);
        expect(
          res.body.find((t) => t.accountFrom === accounts[0].id && t.accountTo === accounts[1].id)
            .description,
        ).toEqual('transfer to own account');
        expect(
          res.body.find((t) => t.accountFrom === accounts[0].id && t.accountTo === accounts[2].id)
            .description,
        ).toEqual('transfer to third party account');
      });

      test('get transactions, user 0, specific accounts with `SourceAccountID` params', async () => {
        const res = await request(API_URL)
          .get(`/transactions`)
          .auth(users[0].username, '123456')
          .send({
            SourceAccountID: accounts[1].id,
          });
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(1);
        expect(
          res.body.find((t) => t.accountFrom === accounts[0].id && t.accountTo === accounts[1].id)
            .amount,
        ).toEqual(15);
        expect(
          res.body.find((t) => t.accountFrom === accounts[0].id && t.accountTo === accounts[2].id),
        ).toBeUndefined();
      });

      test('get transactions, user 0, between dates', async () => {
        const res = await request(API_URL)
          .get(`/transactions`)
          .auth(users[0].username, '123456')
          .send({
            From: new Date(),
            TO: new Date(),
          });
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(0);
      });

      test('get transactions, user 0, in last 10 seconds', async () => {
        const res = await request(API_URL)
          .get(`/transactions`)
          .auth(users[0].username, '123456')
          .send({
            From: new Date(Date.now() - 10000),
            TO: new Date(),
          });
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(2);
      });
    });
  });
});
