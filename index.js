import express from "express";
import path from 'path';

import router from './routes/servers.js'

const __dirname = path.resolve();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.static(path.resolve(__dirname, 'static')));
app.use(router);

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}...`);
})
