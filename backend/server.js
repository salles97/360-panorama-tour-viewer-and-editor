const express = require('express');
const app = express();
const cors = require('cors');

const ENV = require('./constants');

const { populateEmptyDatabase } = require('./utils/mongoose-utils');
populateEmptyDatabase(); // DEVELOPMENT


let UserRouter = require('./routes/user-router');
let PanoramaRouter = require('./routes/panorama-router');
let HotspotRouter = require('./routes/hotspot-router');
let TourRouter = require('./routes/tour-router'); // Importe as rotas do tour

const PanoramaController = require('./controller/panorama-controller');
const TourController = require('./controller/tour-controller');


// Use favicon, json body-parser and optionally cors middleware
var favicon = require('serve-favicon');
app.use(favicon(ENV.FAVICON_PATH));
app.use(express.json({ limit: '100mb' })); // increase limit if larger panoramas are being uploaded
app.use(cors()); // enables cors for all routes



// ROUTES

app.use('/', express.static(ENV.STATIC_FILES)); // serve frontend files statically
app.use('/list-tour', express.static(ENV.TOUR_DIRECTORY)); // serve frontend files statically
app.use('/cubemaps/', express.static(ENV.PANORAMA_DIRECTORY)); // serve panorama pictures
app.use('/cmd/', express.static(ENV.CMD_BUILDING_OUTLINES_DIRECTORY)); // serve building outlines

app.use('/panorama', PanoramaRouter);
app.use('/hotspot', HotspotRouter);
app.use('/user', UserRouter);
app.use('/api', TourRouter); // Use as rotas do Tour
// app.get('/tour', TourController.getAllTours); // adds new panorama image

// app.get('/tour', (req, res) => {
//   // Lógica para buscar os dados dos tours no banco de dados ou em outro local
//   const tours = TourController.getAllTours // Obtenha os dados dos tours
//   console.log(tours)
//   // Envie os dados como JSON
//   res.status(200).send(tours);
// });

// app.post('/tour', TourController.createTour);
// /data is deprecated: use /panoramas/ instead
app.get('/data', PanoramaController.getAllPanoramas);
app.get('/panoramas', PanoramaController.getAllPanoramas);
// app.get('/api/tours',
//   TourController.getAllTours
// );

// // Middleware condicional para decidir como lidar com a solicitação com base no parâmetro de consulta "id"
// app.use('/panorama', (req, res, next) => {
//   // Verifique se o parâmetro de consulta "id" está presente na URL
//   if (req.query.id) {
//     // Se "id" estiver presente, encaminhe a solicitação para a lógica que lida com dados filtrados
//     next(); // Encaminhar para a próxima rota
//   } else {
//     // Se "id" não estiver presente, continue servindo os arquivos estáticos
//     express.static(ENV.STATIC_FILES)(req, res, next);
//   }
// });


// SWAGGER API

const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// RUN SERVER

app.listen(ENV.EXPRESS_PORT, () => console.log(`Panorama app listening on port ${ENV.EXPRESS_PORT}!`));
