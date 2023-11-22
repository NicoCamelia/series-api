const SeriesModel = require('../models/seriesModel');

const getSeries = async (req, res) => {
  try {
    const series = await SeriesModel.getSeries();
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las series' });
  }
};

const getSeriesById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const serie = await SeriesModel.getSeriesById(id);
    if (serie) {
      res.json(serie);
    } else {
      res.status(404).json({ message: 'Serie no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la serie por ID' });
  }
};

const addSeries = async (req, res) => {
  const serie = req.body;
  try {
    const result = await SeriesModel.addSeries(serie);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la serie' });
  }
};

const deleteSeries = async (req, res) => {
  const id = parseInt(req.params.id);
  const serie = await SeriesModel.getSeriesById(id);
  if (serie) {
    try {
      await SeriesModel.deleteSeries(id);
      res.json(serie);
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la serie' });
    }
  } else {
    res.status(404).json({ message: 'Serie no encontrada' });
  }
};

module.exports = {
  getSeries,
  getSeriesById,
  addSeries,
  deleteSeries,
};