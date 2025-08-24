import express from 'express';
import actorsRouter from './routers/actorsRoutes.js';
import productionRouter from './routers/productionRouters.js';
import collaboratorsRouter from './routers/collaborationRouters.js';
import cors from 'cors';

const app = express();
var port = parseInt(process.env.PORT, 10) || 3001;
const hostname = process.env.BACKEND_URL || '127.0.0.1';

app.use(express.static('dist')); // serve files in the static directory

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors());
app.use('/actors', actorsRouter);
app.use('/productions', productionRouter);
app.use('/collaborators', collaboratorsRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://${hostname}:${port}`);
});

// http.createServer(app).listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });