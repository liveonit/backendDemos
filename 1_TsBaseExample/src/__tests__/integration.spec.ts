import { config } from '../config';
import request from 'supertest';

const API_URL = `http://localhost:${config.PORT}`;

describe('Get posts should work fine', () => {
  let post1: any;
  test('Get all posts should return posts', async () => {
    const response = await request(API_URL).get('/v1/post').send();
    expect(response.status).toEqual(200);
    expect(response.body.data.length).toBe(2);
    post1 = response.body.data[0];
  });

  test('Get post by id should return the post', async () => {
    const response = await request(API_URL).get(`/v1/post/${post1.id}`).send();
    expect(response.body.data).toEqual({
      id: post1.id,
      title: 'First Post',
      body: 'This is the first post',
    });
    expect(response.status).toEqual(200);
  });

  test('Get post with invalid id should return error 404', async () => {
    const response = await request(API_URL).get(`/v1/post/abcd`).send();
    expect(response.status).toEqual(404);
  });
});

describe('Create post should work fine', () => {
  let post3: any;
  test('Create post should return 200 and insert the post to the list', async () => {
    const response = await request(API_URL).post('/v1/post').send({
      title: 'Third post clase',
      body: 'This should be the third post',
    });
    expect(response.status).toEqual(200);
    expect(response.body.data.title).toBe('Third post clase');
    expect(response.body.data.body).toBe('This should be the third post');
    expect(response.body.data.id).toBeDefined();
    post3 = response.body.data;
  });

  test('Create post should return 400 invalid request', async () => {
    const response = await request(API_URL).post('/v1/post').send({
      body: 'This should be the third post',
    });
    expect(response.status).toEqual(400);
    expect(response.body.error.type).toEqual('BAD_REQUEST');
    expect(response.body.error.message).toEqual('Title is required');
    expect(response.body.error.code).toEqual(400);
  });
});

describe('Update post should work fine', () => {
  test('Update post should return 200 and update the post to the list', async () => {
    const getResponse = await request(API_URL).get('/v1/post').send();
    const post1 = getResponse.body.data[0];
    const response = await request(API_URL).put(`/v1/post/${post1.id}`).send({
      title: 'Updated First post clase',
    });
    expect(response.status).toEqual(200);
    expect(response.body.data.title).toBe('Updated First post clase');
    expect(response.body.data.body).toBe('This is the first post');
    expect(response.body.data.id).toBe(post1.id);
  });
  test('Update post should return 404 when invalid id', async () => {
    const response = await request(API_URL).put(`/v1/post/lakjsdlas`).send();
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe(404);
    expect(response.body.error.type).toBe('NOT_FOUND');
    expect(response.body.error.message).toBe('Post not found');
  });
});

describe('Delete post should work fine', () => {
  test('Delete post should return 200 and remove the post in the list', async () => {
    const getResponse1 = await request(API_URL).get('/v1/post').send();
    const response = await request(API_URL)
      .delete(`/v1/post/${getResponse1.body.data[2].id}`)
      .send();
    expect(response.status).toBe(200);
    const getResponse2 = await request(API_URL).get('/v1/post').send();
    expect(getResponse2.body.data.length).toBe(getResponse1.body.data.length -1);
  });
  test('Delete post should return 404 when invalid id', async () => {
    const response = await request(API_URL).put(`/v1/post/lakjsdlas`).send();
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe(404);
    expect(response.body.error.type).toBe('NOT_FOUND');
    expect(response.body.error.message).toBe('Post not found');
  });
});
