import path from 'path';
import express from 'express';
import mongoose from 'mongoose';

import router from './routes/servers.js';
import Product from './models/Product.js';
import {getDataAboutBuckwheat} from './parser/parser.js';

const __dirname = path.resolve();

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
const app = express();

app.use(express.static(path.resolve(__dirname, 'static')));
app.use(router);

async function start() {
  try {
    await mongoose.connect(MONGO_URL, {});

    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`);
    });

    setInterval(async () => {
      const parsedData = await getDataAboutBuckwheat();
      await Product.deleteMany({});

      for (let product of parsedData) {
        product = new Product(product);
        await product.save();
      };
    }, 4 * 60 * 60 * 1000);

  } catch (err) {
    console.log(err);
  }
}

start();
