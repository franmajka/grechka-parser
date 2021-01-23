import express from "express";

const PORT = process.env.PORT || 8000;
const app = express();

app.get('/', (req, res) => {
  res.end('<h1>Hello world</h1>');
})

app.listen(PORT, () => {
  console.log('Server has been started...')
})
