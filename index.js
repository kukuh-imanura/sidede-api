import express from 'express';
import cors from 'cors';

import routes from './api/routes/routes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
  res.send('Welcome to SIDEDE API');
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
