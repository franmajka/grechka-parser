/* eslint-disable no-undef */
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';

import router from './routes/servers.js';
import Product from './models/Product.js';
import {getDataAboutBuckwheat} from './parser/parser.js';

const __dirname = path.resolve();

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
const UPDATE_DATA_INTERVAL_HRS = process.env.UPDATE_DATA_INTERVAL_HRS || 10 / 60;
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
      console.log('Updating data...');

      const parsedData = await getDataAboutBuckwheat();
      await Product.deleteMany({});

      for (let product of parsedData) {
        product = new Product(product);
        product.save();
      }
    }, UPDATE_DATA_INTERVAL_HRS * 60 * 60 * 1000);

  } catch (err) {
    console.log(err);
  }
}

start();
