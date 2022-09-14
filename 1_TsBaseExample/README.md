# Ejemplo básico de API REST

## Requisitos para el desarrollo

Para desarrollar en este repositorio es necesario tener instalado [Nodejs >= 16.x](https://nodejs.org/en/download/) y estando en este directorio ejecutar `npm run install`, con esto se instalarán todos los paquetes y dependencias necesarias.

## Configuración inicial

Para correr este proyecto es necesario contar con el archivo `.env` en la raíz de este directorio, del cual la aplicación leerá las variables de entorno, para eso puede copiar directamente el archivo `.env.example` a un archivo `.env`, luego de esto puede setear sus propias configuraciones.

---
**NOTA**

Debe tener en cuenta al configurar el puerto en el que va a estar expuesta la API, que no colisione con algún otro servicio corriendo en su computadora, de lo contrario generara conflicto que dependiendo el OS, puede que la API directamente muestre un error
o genere conflicto al intentar la confección

---

## Correr el Proyecto

### Levantar el Ambiente

Para correr el proyecto en development contamos con dos posibles formas de hacerlo, la primera es usando `Node.js` y dentro de este directorio ejecutar `npm run install` y luego `npm run dev` para correrlo.

La otra forma es utilizando docker, para lo que el requerimiento va a ser tener instalado [Docker engine](https://docs.docker.com/engine/install/) en `Linux` o [Docker desktop](https://docs.docker.com/desktop/install/mac-install/) en `MacOS` y `Windows`

Si se quiere correr en `Docker` estando en este directorio, ejecutar

```bash
docker compose up -d
```

---
**TIP**

Si el proyecto se corre con docker, se puede ejecutar

```bash
docker compose logs api # para ver los logs de su api
docker compose logs -f api # para seguir los logs de la api en tiempo real
```

---

### Bajar el Ambiente

Para bajar el entorno si se corrió con Node, en la terminal que se esté corriendo presionar `CTRL + C` o `CTRL + D`. En caso de correrse con docker compose, estando en este directorio, ejecutar

```bash
docker compose down
```

## Testear el Proyecto

Una vez que tenemos corriendo el proyecto en nuestro entorno local, el mismo estará accesible bajo la URL `http://localhost:<your_port>` donde `your_port` tiene por defecto en `.env.example` el valor `3000`. Para probar el proyecto puede usar `Postman` o cualquier aplicación o CLI que permita hacer requests HTTP. En este caso y como Postman es una de las más utilizadas, se deja en este proyecto el archivo `API Rest.postman_collection.json` el cual se puede importar directamente de postman  y con mínimos cambios (el puerto y los IDs en las request específicas como actualizar o eliminar) puede probar el backend listando, creando, actualizando y eliminando recursos.
A continuación se muestra como importar la colección en `Postman`

![Guía de como importar una coleccion en Postman](docs/images/import_collection_postman.gif)
