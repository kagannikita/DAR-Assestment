import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Category from '../models/category';
import Cards from '../models/card';
import { MulterRequest } from '../interfaces/MulterRequest';

const cloudinary = require('../config/cloudinary');

const getCategories = (req: Request, res: Response, next: NextFunction) => {
  Category.find()
    .exec()
    .then((results) => res.status(200).json({
      categories: results,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

const retrieveCategory = async (req: Request, res: Response) => {
  Category.findById(req.params.id)
    .exec()
    .then((results) => res.status(200).json({
      category: results,
    }))
    .catch((error) => res.status(500).json({
      message: error.message,
      error,
    }));
};

const createCategories = async (req: Request, res: Response) => {
  try {
    const result = await cloudinary.uploader.upload(req.file?.path);
    const category = new Category({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: result.secure_url,
      image_id: result.public_id,
    });
    await category.save();
    res.status(201).json({ category: result });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};
const updateCategory = async (req: Request, res: Response) => {
  try {
    let category = await Category.findById(req.params.id);
    await cloudinary.uploader.destroy(category.image_id);
    let image;
    console.log(req.file);
    if (req.file) {
      image = await cloudinary.uploader.upload(req.file?.path);
    }
    const data = {
      name: req.body.name || category.name,
      image: image?.secure_url || category.image,
      image_id: image?.public_url || category.image_id,
    };
    console.log(data);
    category = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(category);
  } catch (error) {
    console.log(error);
  }
};

const deleteCategory = async (req: MulterRequest, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    const cards = await Cards.find({ category: req.params.id });
    cards.map(async (card) => {
      await cloudinary.uploader.destroy(card.image_id);
      await card.remove();
    });
    await cloudinary.uploader.destroy(category.image_id);
    await category.remove();
    res.status(204).json({ message: `${cards}` });
  } catch (error) {
    console.log(error);
  }
};

export default {
  getCategories, createCategories, updateCategory, deleteCategory, retrieveCategory,
};
