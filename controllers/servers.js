import Product from '../models/Product.js';

export const getBuckweatData = async (req, res) => {
  res.json(await Product.find({}).lean());
};
