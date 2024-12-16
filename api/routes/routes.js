import express from 'express';

import hakAkses from './HakAkses.js';

const app = express();

app.use('/hakakses', hakAkses);

export default app;
