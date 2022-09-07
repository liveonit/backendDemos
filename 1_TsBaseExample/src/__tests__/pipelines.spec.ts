import request from 'supertest';
import app from '../app';
// import { jest } from '@jest/globals';
import * as sqlite from 'sqlite';
import { PipelineOptions } from '../routers/pipelines';
import { omit } from '../utils/omit';


const fakePipelines = [
  { id: 1, uuid: Math.round(Math.random() * 100000000000).toString(), name: 'pipeline1', optionsId: 1 },
  { id: 2, uuid: Math.round(Math.random() * 100000000000).toString(), name: 'pipeline2', optionsId: 2 },
  { id: 3, uuid: Math.round(Math.random() * 100000000000).toString(), name: 'pipeline2', optionsId: 3 },
];

const fakeOptions: PipelineOptions[] = [1,2,3].map(i => ({
  ...fakePipelines[i - 1],
  id:	i,
  useRapidCompact: Math.round(Math.random()),
  useRomansCad:	Math.round(Math.random()),
  useJewelryModelPrep:	Math.round(Math.random()),
  skipSanitization:	Math.round(Math.random()),
  removeAnimations:	Math.round(Math.random()),
  constrainDecimationAtUVBoundaries:	Math.round(Math.random()),
  skipNormalBaking:	Math.round(Math.random()),
  skipAtlassing:	Math.round(Math.random()),
  skipExtraUVLayerRemoval:	Math.round(Math.random()),
  skipStrayUVFixing:	Math.round(Math.random()),
  skipUVUnoverlapping:	Math.round(Math.random()),
  preserveThinLayerHiddenSurfaces:	Math.round(Math.random()),
  ignoreParallelGeometry:	Math.round(Math.random()),
  keepImageFormats:	Math.round(Math.random()),
  allowObstructedGeometryRemoval:	Math.round(Math.random()),
  targetTextureDensity:	Math.round(Math.random()),
  convertOnly: Math.round(Math.random()),
  bakeSmallFeatures: Math.round(Math.random()),
  smoothUnbakeablePolys: Math.round(Math.random()),
  aggressiveAlphaRemoval: Math.round(Math.random()),
  forceUvUnwrap: Math.round(Math.random())
}));

describe('List Pipelines', () => {

  let mockResult: jest.SpyInstance;
  let mockAll: jest.Mock;
  let mockGet: jest.Mock;
  let mockClose: jest.Mock;
  beforeEach(() => {
    mockAll = jest.fn((query: sqlite.ISqlite.SqlType) => {
      if (query.toString().includes('WHERE name='))
        return fakePipelines.filter(p => query.toString().includes(p.name));
      return fakePipelines;
    })
    mockGet = jest.fn((query: sqlite.ISqlite.SqlType) => {
        if (query.toString().includes('INNER JOIN options as o ON p.optionsId=o.Id'))
          return fakeOptions.filter(p => query.toString().includes(p.uuid))[0];
        return fakePipelines.filter(p => query.toString().includes(p.uuid))[0];
    })
    mockClose = jest.fn();
    mockResult = jest.spyOn(sqlite, 'open').mockImplementation(async () => ({
      all: mockAll,
      get: mockGet,
      close: mockClose
    } as any));
  });

  afterEach(() => {
    mockAll.mockClear();
    mockClose.mockClear();
    mockResult.mockClear();
  });

  test('Get all pipelines should return pipelines', async () => {
    const response = await request(app).get('/pipelines').send();
    expect(response.body.success).toBeTruthy();
    expect(response.body.response.pipelines.length).toBe(3);
    expect(mockResult.mock.calls.length).toBe(1);
    expect(mockAll.mock.calls.length).toBe(1);
    expect(mockClose.mock.calls.length).toBe(1);
    expect(mockAll.mock.calls[0][0]).toBe('SELECT name, uuid FROM pipelines');
  });

  test('Get pipeline by `name` should return the pipeline', async () => {
    const response = await request(app).get(`/pipelines?pipelineName=${fakePipelines[0].name}`).send();
    expect(response.body.success).toBeTruthy();
    expect(response.body.response.pipeline.uuid).toBe(fakePipelines[0].uuid);
    expect(response.body.response.pipeline.name).toBe(fakePipelines[0].name);
    expect(mockResult.mock.calls.length).toBe(1);
    expect(mockAll.mock.calls.length).toBe(1);
    expect(mockClose.mock.calls.length).toBe(1);
    expect(mockAll.mock.calls[0][0]).toBe(`SELECT name, uuid FROM pipelines WHERE name='${fakePipelines[0].name}'`);
  });

  test('Get pipeline by `name` should not return results', async () => {
    const wrongPipelineName = 'wrongPipeline';
    const response = await request(app).get(`/pipelines?pipelineName=${wrongPipelineName}`).send();
    expect(response.body.success).toBeTruthy();
    expect(response.body.response.pipeline).toBeNull();
    expect(mockResult.mock.calls.length).toBe(1);
    expect(mockAll.mock.calls.length).toBe(1);
    expect(mockClose.mock.calls.length).toBe(1);
    expect(mockAll.mock.calls[0][0]).toBe(`SELECT name, uuid FROM pipelines WHERE name='${wrongPipelineName}'`);
  });

  test('Get pipeline by `id` should return the pipeline', async () => {
    const response = await request(app).get(`/pipelines/${fakePipelines[1].uuid}`).send();
    expect(response.body.success).toBeTruthy();
    expect(response.body.response.pipeline.uuid).toBe(fakePipelines[1].uuid);
    expect(response.body.response.pipeline.name).toBe(fakePipelines[1].name);
    expect(mockResult.mock.calls.length).toBe(1);
    expect(mockGet.mock.calls.length).toBe(1);
    expect(mockClose.mock.calls.length).toBe(1);
    expect(mockGet.mock.calls[0][0]).toBe(`SELECT name, uuid FROM pipelines WHERE uuid='${fakePipelines[1].uuid}'`);
  });

  test('Get pipeline by `id` should return null pipeline in response', async () => {
    const wrongUuid = 123456;
    const response = await request(app).get(`/pipelines/${wrongUuid}`).send();
    expect(response.body.success).toBeTruthy();
    expect(response.body.response.pipeline).toBeNull();
    expect(mockResult.mock.calls.length).toBe(1);
    expect(mockGet.mock.calls.length).toBe(1);
    expect(mockClose.mock.calls.length).toBe(1);
    expect(mockGet.mock.calls[0][0]).toBe(`SELECT name, uuid FROM pipelines WHERE uuid='${wrongUuid}'`);
  });

  test('Get pipeline options by `id` should return the pipeline with its options', async () => {
    const response = await request(app).get(`/pipelines/${fakePipelines[2].uuid}/options`).send();
    expect(response.body.success).toBeTruthy();
    expect(response.body.response.pipeline.uuid).toBe(fakePipelines[2].uuid);
    expect(response.body.response.pipeline.name).toBe(fakePipelines[2].name);
    expect(response.body.response.options).toEqual(omit(fakeOptions[2], ['uuid', 'name']));
    expect(mockResult.mock.calls.length).toBe(1);
    expect(mockGet.mock.calls.length).toBe(1);
    expect(mockClose.mock.calls.length).toBe(1);
    expect(mockGet.mock.calls[0][0]).toBe(
      `SELECT p.name, p.uuid, o.*
        FROM
            pipelines AS p
            INNER JOIN options as o ON p.optionsId=o.Id
        WHERE uuid='${fakePipelines[2].uuid}'`
    );
  });

  test('Get pipeline options by `id` should return `PIPELINE_NOT_FOUND` error and null values in response', async () => {
    const wrongUuid = 123456;
    const response = await request(app).get(`/pipelines/${wrongUuid}/options`).send();
    expect(response.body.success).toBeFalsy();
    expect(response.body.response.pipeline).toBeNull();
    expect(response.body.response.options).toBeNull();
    expect(response.body.errors).toEqual(['PIPELINE_NOT_FOUND']);
    expect(mockResult.mock.calls.length).toBe(1);
    expect(mockGet.mock.calls.length).toBe(1);
    expect(mockClose.mock.calls.length).toBe(1);
    expect(mockGet.mock.calls[0][0]).toBe(
      `SELECT p.name, p.uuid, o.*
        FROM
            pipelines AS p
            INNER JOIN options as o ON p.optionsId=o.Id
        WHERE uuid='${wrongUuid}'`
    );
  });
});
