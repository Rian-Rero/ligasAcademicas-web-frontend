import { createRequire } from 'node:module';

const backendPackageUrl = new URL(
  '../../../ligasAcademicas-backend/package.json',
  import.meta.url,
);
const backendRequire = createRequire(backendPackageUrl);
const mongoose = backendRequire('mongoose');
const { MongoMemoryServer } = backendRequire('mongodb-memory-server');

const port = Number(process.env.PORT || 3334);
const mongod = await MongoMemoryServer.create();
await mongoose.connect(mongod.getUri());

const backendAppUrl = new URL('./src/app.js', backendPackageUrl);
const { default: app } = await import(backendAppUrl.href);

const server = await new Promise((resolve, reject) => {
  const connection = app.listen(port, () => resolve(connection));
  connection.once('error', reject);
});

async function shutdown() {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await mongoose.disconnect();
  await mongod.stop();
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
