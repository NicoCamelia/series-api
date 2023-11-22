const express = require('express');
const seriesRouter = express.Router();
const seriesController = require('../controllers/seriesController');

seriesRouter.get('/', seriesController.getSeries);

seriesRouter.get('/:id', seriesController.getSeriesById);

seriesRouter.post('/', seriesController.addSeries);

seriesRouter.delete('/:id', seriesController.deleteSeries);

module.exports = seriesRouter;