import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Cards from '../models/card';
import { MulterRequest } from '../interfaces/MulterRequest';

const cloudinary = require('../config/cloudinary');

const getCards = (req: Request, res: Response, next: NextFunction) => {
  Cards.find()
    .populate('category')
    .exec()
    .then((results) => res.status(200).json({
      cards: results,
      count: results.length,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

const retrieveCards = async (req: Request, res: Response) => {
  Cards.findById(req.params.id)
    .populate('category')
    .exec()
    .then((results) => res.status(200).json({
      card: results,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

const createCards = async (req: MulterRequest, res: Response) => {
  try {
    const image = await cloudinary.uploader.upload(req.files?.image[0].path);
    const audio = await cloudinary.uploader.upload(req.files?.audio[0].path, {
      resource_type: 'video',
    });
    const card = new Cards({
      _id: new mongoose.Types.ObjectId(),
      word: req.body.word,
      translation: req.body.translation,
      category: req.body.category,
      image: image.secure_url,
      image_id: image.public_id,
      audio: audio.secure_url,
      audio_id: audio.public_id,
    });
    return await card
      .save()
      .then((result) => res.status(201)
        .json({
          card: result,
        }))
      .catch((error) => {
        console.log(error);
        return res.status(500)
          .json({
            message: error.message,
            error,
          });
      });
  } catch (e) {
    console.log(e);
  }
};

const updateCards = async (req: MulterRequest, res: Response) => {
  try {
    console.log('id', req.params.id);
    let card = await Cards.findById(req.params.id);
    await cloudinary.uploader.destroy(card.image_id);
    await cloudinary.uploader.destroy(card.audio_id);
    let image;
    let audio;
    if (req.files) {
      image = await cloudinary.uploader.upload(req.files?.image[0].path);
      audio = await cloudinary.uploader.upload(req.files?.audio[0].path, {
        resource_type: 'video',
      });
    }
    const data = {
      word: req.body.word || card.word,
      translation: req.body.translation || card.translation,
      category: req.body.category || card.category,
      image: image?.secure_url || card.image,
      audio: audio?.secure_url || card.audio,
      image_id: image?.public_url || card.image_id,
      audio_id: audio?.public_url || card.audio_id,
    };
    card = await Cards.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(card);
  } catch (error) {
    console.log(error);
  }
};

const deleteCards = async (req: MulterRequest, res: Response) => {
  try {
    const card = await Cards.findById(req.params.id);
    await cloudinary.uploader.destroy(card.image_id);
    await cloudinary.uploader.destroy(card.audio_id);
    await card.remove();
    res.status(204).json({ message: 'Delete Complete!' });
  } catch (error) {
    console.log(error);
  }
};

export default {
  getCards, createCards, updateCards, deleteCards, retrieveCards,
};
