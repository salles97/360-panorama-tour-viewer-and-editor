const fs = require('fs-extra');
const path = require('path');

const ENV = require('../constants');
const { Panorama, Tour } = require('../utils/mongoose-utils'); // Importe o modelo de Tour

const { generateLevels } = require('../utils/cubemap-generator-utils');

exports.getPanoramasForTour = async (req, res) => {
	console.log('Entrou');
	try {
		const tourId = req.params.tourId;
		const panoramas = await Panorama.find({ tour: tourId }).populate('hotspots');
		res.send({ panoramas: panoramas });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

exports.getAllPanoramas = (req, res) => {
	Panorama.find({}, (err, panoramas) => {
		if (err) {
			console.error(err);
			// TODO enviar resposta de erro
			return;
		}
		res.send({ panoramas: panoramas });
	});
};

exports.createPanorama = (req, res) => {
	const tourId = "66265b3916ce5c3e0cd7b63e";
	if (!req.files) {
		res.status(400).json({ error: 'Please provide panorama cubemap image files' });
		return;
	}

	const panoramaDoc = new Panorama();

	generateLevels(
		panoramaDoc._id.toHexString(),
		req.files,
		parseInt(req.body.widthAndHeight),
		(cubemapLevels) => {
			panoramaDoc.cubemapLevels = cubemapLevels;
			panoramaDoc.name = req.body.originalImageFileName || "Unknown name";
			panoramaDoc.tour = req.body.tourId;
			panoramaDoc.save((err, panorama) => {
				if (err) {
					console.error(err);
					res.status(500).json({ error: 'Failed to save panorama' });
					return;
				}
				console.log("New panorama added!");
				console.log(panorama.tour);

				// Se houver um tour associado ao panorama, atualize o tour
				if (req.body.tourId) {
					Tour.findById(req.body.tourId, (err, tour) => {
						if (err) {
							console.error(err);
							res.status(500).json({ error: 'Failed to find tour' });
							return;
						}
						if (!tour) {
							res.status(404).json({ error: 'Tour not found' });
							return;
						}
						tour.panoramas.push(panorama._id);
						tour.save((err) => {
							if (err) {
								console.error(err);
								res.status(500).json({ error: 'Failed to update tour' });
								return;
							}
							console.log("New panorama added in Tour!");
							res.status(200).json({ panorama, tour });
						});
					});
				} else {
					console.log(req.body)
					res.status(200).json({ panorama });
				}
			});
		}
	);
};

// exports.createPanorama = (req, res) => {
// 	if (!req.files) {
// 		res.status(404).json({ error: 'Please provide panorama cubemap image files' });
// 		return;
// 	}

// 	const panoramaDoc = new Panorama();

// 	generateLevels(
// 		panoramaDoc._id.toHexString(),
// 		req.files,
// 		parseInt(req.body.widthAndHeight),
// 		(cubemapLevels) => {
// 			panoramaDoc.cubemapLevels = cubemapLevels;
// 			panoramaDoc.name = req.body.originalImageFileName || "Unknown name";

// 			panoramaDoc.save((err, panorama) => {
// 				if (err) {
// 					console.error(err);
// 					// TODO enviar resposta de erro
// 					return;
// 				}
// 				console.log("New panorama added!");

// 				// Se houver um tour associado ao panorama, atualize o tour
// 				if (req.body.tourId) {
// 					Tour.findByIdAndUpdate(req.body.tourId, { $push: { panoramas: panorama._id } }, (err) => {
// 						if (err) {
// 							console.error(err);
// 							// TODO enviar resposta de erro
// 							return;
// 						}
// 						res.status(200).json({ panorama });
// 					});
// 				} else {
// 					res.status(200).json({ panorama });
// 				}
// 			});
// 		}
// 	);
// };

exports.updatePanorama = (req, res) => {
	const data = req.body.panorama;

	Panorama.findById(data._id, (err, panorama) => {
		if (err) {
			console.error(err);
			// TODO enviar resposta de erro
			return;
		}

		// Remova dados que não podem ser alterados via esta solicitação
		delete data._id;
		delete data.id;
		delete data.hotspots;

		for (const key in data) {
			panorama[key] = data[key];
		}

		panorama.save((err, updatedPanorama) => {
			if (err) {
				console.error(err);
				// TODO enviar resposta de erro
				return;
			}
			res.send({ panorama: updatedPanorama });
		});
	});
};

exports.deletePanorama = (req, res) => {
	Panorama.deleteOne({ _id: req.body._id }, (err) => {
		if (err) {
			console.error(err);
			res.send({ deleted: false });
			return;
		}
		fs.remove(path.join(ENV.PANORAMA_DIRECTORY, req.body._id), (err) => {
			if (err) {
				console.error(err);
			}
			res.send({ deleted: true });
		});
	});
};


exports.getPanoramaById = (req, res) => {
	const panoramaId = req.params.panoramaId;

	Panorama.findById(panoramaId)
		.populate('hotspots') // Opcional: popula os hotspots relacionados ao panorama
		.exec((err, panorama) => {
			if (err) {
				console.error(err);
				// TODO: enviar resposta de erro
				return res.status(500).json({ error: 'Erro interno do servidor' });
			}
			if (!panorama) {
				// Panorama não encontrado
				return res.status(404).json({ error: 'Panorama não encontrado' });
			}
			// Panorama encontrado, envie como resposta
			return res.status(200).json({ panorama: panorama });
		});
};
