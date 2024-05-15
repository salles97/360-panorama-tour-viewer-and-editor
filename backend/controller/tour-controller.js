const { Tour } = require('../utils/mongoose-utils');


exports.getAllTours = (req, res) => {
  Tour.find({})
    // .populate('user') // Popula o campo de usuário
    .populate('panoramas') // Popula o campo de panoramas
    .exec((err, tours) => {
      if (err) {
        console.error(err);
        // TODO enviar resposta de erro
        return;
      }
      console.log({ tours: tours });
      // res.json({ tours: tours });

      res.status(200).json({ tours: tours });
    });
};

exports.createTour = (req, res) => {
  const newTour = new Tour({
    name: req.body.name,
    user: req.body.userId,
    panoramas: req.body.panoramas
  });

  newTour.save((err, tour) => {
    if (err) {
      console.error(err);
      // TODO enviar resposta de erro
      return;
    }
    res.status(200).json({ tour });
  });
};

exports.getTourById = (req, res) => {
  Tour.findById({ _id: req.params.tourId })
    // .populate('user') // Popula o campo de usuário
    .populate('panoramas') // Popula o campo de panoramas
    .exec((err, tour) => {
      if (err) {
        console.error(err);
        // TODO enviar resposta de erro
        return;
      }
      res.status(200).json({ tour });
    });
};

// exports.updateTour = (req, res) => {
//   Tour.findByIdAndUpdate(req.params.tourId, req.body, { new: true }, (err, tour) => {
//     if (err) {
//       console.error(err);
//       // TODO enviar resposta de erro
//       return;
//     }
//     res.status(200).json({ tour });
//   });
// };

exports.updateTour = (req, res) => {
  const data = req.body;
  console.log(req.body)
  Tour.findById({ _id: data._id }, (err, tour) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err });
      // TODO enviar resposta de erro
      return;
    }
    console.log(data);

    // Remova dados que não podem ser alterados via esta solicitação
    delete data._id;
    delete data._user;
    delete data.hotspots;

    for (const key in data) {
      tour[key] = data[key];
    }

    tour.save((err, updatedTour) => {
      if (err) {
        console.error(err);
        // TODO enviar resposta de erro
        return;
      }
      res.send({ tour: updatedTour });
    });
  });
};

exports.deleteTour = (req, res) => {
  Tour.deleteOne({ _id: req.params.tourId }, (err) => {
    if (err) {
      console.error(err);
      // TODO enviar resposta de erro
      res.send({ deleted: false });
      return;
    } else {
      res.status(200).json({ message: 'Tour deletado com sucesso' });
    }
  });
};
