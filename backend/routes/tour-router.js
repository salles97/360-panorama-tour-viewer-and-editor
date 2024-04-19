const TourController = require('../controller/tour-controller');

const checkAuth = require('../middleware/authentication');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const express = require('express');
const router = express.Router();

router.get('/tours', TourController.getAllTours)
router.post('/tours', (req, res, next) => checkAuth(req, res, next, ["admin"]), upload.array('cubemaptiles', 6), TourController.createTour); // adds new panorama image
// router.put('/', (req, res, next) => checkAuth(req, res, next, ["admin"]), TourController.updateTour); // update an existing panorama image
// router.delete('/', (req, res, next) => checkAuth(req, res, next, ["admin"]), TourController.deleteTour); // delete a panorama image


module.exports = router;