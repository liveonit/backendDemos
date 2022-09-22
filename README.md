<h1 align="center">
  <br>
  <img src="./docs/images/backend-img.webp" alt="Backend Demos" width="200">
  <br>
  Backend Demos
  <br>
</h1>


<style type="text/css" rel="stylesheet">
 #container {
  text-align: justify;
 }
 #container > img {
  width: 100px; /*Declare your value. Can be in relative units.*/
  display: inline-block;
  vertical-align: top;

  /*IE fix.*/
  *display: inline;
  zoom: 1;
}
 #container:after {
  content: "";
  width: 100%;
  display: inline-block;
}
</style>

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

<div id="container">
  <img src="./docs/images/docker-circle.png" alt="Made with Angular" title="Angular"/>
  <img src="./docs/images/mysql-circular.png" alt="Developed using Browsersync" title="Browsersync"/>
  <img src="./docs/images/redis.png" alt="Developed using Browsersync" title="Browsersync"/>
  <img src="./docs/images/nodejs-circular.png" alt="Developed using Browsersync" title="Browsersync"/>
  <img src="./docs/images/restful-api-circle.png" alt="Made with Bootstrap" title="Bootstrap"/>
  <img src="./docs/images/graphql.png" alt="Made with Bootstrap" title="Bootstrap"/>
</div>
