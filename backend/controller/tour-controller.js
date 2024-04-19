const { Tour } = require('../utils/mongoose-utils');


exports.getAllTours = (req, res) => {
  Tour.find({}, (err, tours) => {
    if (err) {
      console.error(err);
      // TODO enviar resposta de erro
      return;
    }
    res.send({ tours: tours });
  });
};

exports.createTour = (req, res) => {
  const newTour = new Tour({
    name: req.body.name,
    user: req.body.userId, // Assumindo que você está enviando o ID do usuário como userId no corpo da solicitação
    panoramas: req.body.panoramas // Assumindo que você está enviando uma lista de IDs de panoramas como panoramas no corpo da solicitação
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
  Tour.findById(req.params.tourId)
    .populate('user') // Popula o campo de usuário
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

// Implemente as outras funções CRUD para o Tour, como atualização e exclusão
