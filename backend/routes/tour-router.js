const TourController = require('../controller/tour-controller');

const checkAuth = require('../middleware/authentication');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const express = require('express');
const router = express.Router();

router.get('/', TourController.getAllTours)
router.post('/', TourController.createTour); // adds new panorama image
// router.put('/', (req, res, next) => checkAuth(req, res, next, ["admin"]), TourController.updateTour); // update an existing panorama image
router.delete('/:tourId', TourController.deleteTour); // delete a panorama image
router.get('/:tourId', TourController.getTourById)

module.exports = router;