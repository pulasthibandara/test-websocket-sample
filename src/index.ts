import Server from './Server';

const server = new Server();
server.register()
  .catch((err) => {
    console.log(err);
  });
