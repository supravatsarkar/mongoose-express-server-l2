import mongoose from 'mongoose';
import app from './app/app';
import config from './app/config';

async function main() {
  try {
    await mongoose.connect(config.db_uri as string);
    console.log('DB connected..');
    app.listen(config.port, () => {
      console.log('App running on port', config.port);
    });
  } catch (error) {
    console.log('Main Error', error);
  }
}
main();
