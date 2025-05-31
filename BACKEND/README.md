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

