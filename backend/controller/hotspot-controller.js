const { Panorama } = require('../utils/mongoose-utils');

exports.createHotspot = (req, res) => {
	Panorama.findById(req.body.panoramaId, (err, panorama) => {
		if (err || !panorama) {
			console.error(err);
			// TODO enviar resposta de erro
			return;
		}

		const newHotspot = req.body.hotspot;
		panorama.hotspots.push(newHotspot);

		panorama.save((err, updatedPanorama) => {
			if (err) {
				console.error(err);
				// TODO enviar resposta de erro
				return;
			}
			res.status(200).json({ hotspot: newHotspot });
		});
	});
};

exports.updateHotspot = (req, res) => {
	let data = req.body.hotspot;
	Panorama.findOne({ "hotspots._id": data._id }, (err, panoramaDocument) => {
		if (err || !panoramaDocument) {
			console.error("Didnt found hotspot document", err, panoramaDocument);
			// TODO send error response
			return;
		}

		let hotspotDocument = panoramaDocument.hotspots.id(data._id);

		if (!hotspotDocument) {
			// TODO send error response
			return;
		}

		// remove data that isnt allowed to be changed via this post request
		delete data._id;
		delete data.id;

		for (let key in data) {
			hotspotDocument[key] = data[key];
		}

		panoramaDocument.save((err, updatedPanorama) => {
			if (err) {
				console.error(err);
				// TODO send error response
				return;
			}
			res.send({ hotspot: updatedPanorama.hotspots.id(hotspotDocument._id) });
		});
	});
};


exports.deleteHotspot = (req, res) => {
	Panorama.findOne({ "hotspots._id": req.body._id }, (err, panoramaDocument) => {
		if (err || !panoramaDocument) {
			console.error("Didnt found hotspot document", err, panoramaDocument);
			// TODO send error response
			return;
		}

		let hotspotDocument = panoramaDocument.hotspots.id(req.body._id);

		if (!hotspotDocument) {
			// TODO send error response
			return;
		}

		hotspotDocument.remove();

		panoramaDocument.save((err, updatedPanorama) => {
			if (err) {
				console.error(err);
				res.send({ deleted: false });
				return;
			}
			res.send({ deleted: true, _id: req.body._id });
		});
	});
};