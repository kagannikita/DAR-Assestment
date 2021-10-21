import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Statistics from '../models/statistics';
import { MulterRequest } from '../interfaces/MulterRequest';

const getStatistics = (req: Request, res: Response, next: NextFunction) => {
  Statistics.find()
    .populate('card')
    .populate({
      path: 'card',
      populate: {
        path: 'category',
      },
    })
    .exec()
    .then((results) => res.status(200).json({
      statistics: results,
      count: results.length,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};
const retrieveStatistics = async (req: Request, res: Response) => {
  Statistics.findById(req.params.id)
    .populate('card')
    .populate({
      path: 'card',
      populate: {
        path: 'category',
      },
    })
    .exec()
    .then((results) => res.status(200).json({
      statistic: results,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

const sortStatistics = async (req: Request, res: Response) => {
  const field = req.query?.field;
  Statistics.find()
    .sort(field)
    .populate('card')
    .populate({
      path: 'card',
      populate: {
        path: 'category',

      },
    })
    .exec()
    .then((results) => res.status(200).json({
      statistics: results,
      count: results.length,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

const createStatistics = async (req: Request, res: Response) => {
  const statistic = new Statistics({
    _id: new mongoose.Types.ObjectId(),
    clicks: req.body.clicks,
    correct: req.body.correct,
    wrong: req.body.wrong,
    card: req.body.card,
  });
  return statistic
    .save()
    .then((result) => res.status(201).json({
      statistic: result,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

const updateStatistics = async (req: MulterRequest, res: Response) => {
  try {
    let statistic = await Statistics.findById(req.params.id);
    const data = {
      clicks: req.body.clicks || statistic.clicks,
      correct: req.body.correct || statistic.correct,
      wrong: req.body.wrong || statistic.wrong,
      card: req.body.card || statistic.card,
    };
    statistic = await Statistics.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(statistic);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteStatistic = async (req: MulterRequest, res: Response) => {
  try {
    const statistic = await Statistics.findById(req.params.id);
    await statistic.remove();
    res.status(204).json({ message: 'Delete Complete!' });
  } catch (error) {
    console.log(error);
  }
};

export default {
  getStatistics,
  createStatistics,
  updateStatistics,
  deleteStatistic,
  sortStatistics,
  retrieveStatistics,
};
