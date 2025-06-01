**Install the dependencies:**

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root of the project and configure your environment
variables. An example `.env` file might look like this:

```
PORT=3000
```

### Running the Application

#### Start the server

Start the server by running:

```bash
npm start
```

The server will start and listen on the port defined in your `.env` file, or
default to port 3000 if not specified.


#### Database Setup

Cargar en MySQL Workbench el fichero ChefDeskBD.sql que se encuentra en la carpeta BACKEND.

Ejecutamos npm install en la consola , siempre dentro de la carpeta BACKEND , para instalar las dependencias
y despues ejecutamos el comando npm run dev para iniciar el servidor.


Creacion del FICHERO ENV

PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234/root o tu constraseña de mySQL
DB_NAME=restaurante
DB_PORT=3306

JWT_SECRET=Master25

#### Development mode

To start the server in development mode with `nodemon`, which will automatically
restart the server on file changes, run:

```bash
npm run dev
```

### Available Scripts

- **start**: Runs `node index.js` to start the server.
- **dev**: Runs `nodemon index.js` to start the server in development mode with
  automatic restarts on file changes.
- **generate**: Runs `express generate` to create any resource inside your
  project. The actions available are "model", "controller", "route", "all"
- **config**: Runs `express config` to config the date of your project.

