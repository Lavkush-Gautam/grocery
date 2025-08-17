import Product from "../models/product.js";
import cloudinary from '../config/cloudinary.js';
import connectCloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files;
        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let res = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return res.secure_url;
            })
        )
        await Product.create({ ...productData, image: imageUrl });
        return res.status(201).json({ success: true, message: 'Product added' })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Internal server error' })

    }

}

export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      success: true,
      message: 'Products listed successfully',
      data: products
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const productById = async (req, res) => {
    try {
        const { id } = req.body;
        const products = await Product.find(id);
        return res.status(200).json({ success: true, message: 'Product Listed successfully' })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Internal server error' })

    }

}

export const ChangeStock = async (req, res) => {
   
    try {
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id, { inStock });
        return res.status(200).json({ success: true, message: 'stock updated successfully' })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
    
}

