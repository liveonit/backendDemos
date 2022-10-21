<h1 align="center">
  <br>
  <img src="./docs/images/backend-img.webp" alt="Backend Demos" width="200">
  <br>
  Backend Demos
  <br>
</h1>

Este repositorio cuenta con 3 backend APIs que corren en el entorno de `NodeJS`, cada una de las cuales utiliza diferentes frameworks y diferente grado de profundidad.

## Build status

| API NAME           | Development Build                                                                                             | Production Build                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1_TsBaseExample    | ![Build status](https://github.com/liveonit/backendDemos/actions/workflows/1_TsBaseExample_dev.yml/badge.svg) | ![Build status](https://github.com/liveonit/backendDemos/actions/workflows/1_TsBaseExample_prod.yml/badge.svg) |
| 2_TsRestExample    | ![Build status](https://github.com/liveonit/backendDemos/actions/workflows/2_TsRestExample_dev.yml/badge.svg) | ![Build status](https://github.com/liveonit/backendDemos/actions/workflows/2_TsRestExample_prod.yml/badge.svg) |
| 3_TsGraphQLExample | Not tested yet                                                                                                | Not tested yet                                                                                                 |

## Content

1. [Ejemplo básico con typescript y sin base de datos](./1_TsBaseExample/README.md)
2. [Ejemplo de una API rest completa con acceso a Redis para manejar las sesiones y MySql para la permanencia](./2_TsRestExample/README.md)
3. [Ejemplo de una API GraphQL completa con acceso a Redis para manejar las sesiones y MySql para la permanencia](./3_TsGraqhQLExample/REAMDE.md)

## Build With

<div id="container" style="text-align: justify; width: 100%; display: inline-block;">
  <img src="./docs/images/docker-circle.png" style="width: 100px; display: inline-block; vertical-align: top;" alt="Made with Docker" title="Docker"/>
  <img src="./docs/images/mysql-circular.png" style="width: 100px; display: inline-block; vertical-align: top;" alt="Persisted data using MySQL" title="MySQL"/>
  <img src="./docs/images/redis.png" style="width: 100px; display: inline-block; vertical-align: top;" alt="Cached data using redis" title="Redis"/>
  <img src="./docs/images/nodejs-circular.png" style="width: 100px; display: inline-block; vertical-align: top;" alt="Developed using NodeJs" title="NodeJs"/>
  <img src="./docs/images/restful-api-circle.png" style="width: 100px; display: inline-block; vertical-align: top;" alt="Examples using Rest" title="Restful"/>
  <img src="./docs/images/graphql.png" style="width: 100px; display: inline-block; vertical-align: top;" alt="Examples using GraphQL" title="GraphQL"/>
</div>
