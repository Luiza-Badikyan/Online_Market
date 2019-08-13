const ObjectId = require('mongoose').Types.ObjectId;
const Watches= require('../models/Watches');
const Categories = require('./../models/Categories');
const Products = require('./../models/Products');

module.exports.getAll = async function (req, res) {
    try {
        // const products = await Products.find({
        //     category: new ObjectId("5d495ae6ce4a43044f6177f3")
        // }).populate('category');

        // const categories = await Categories.find();
        const products = await Products.find();
        res.status(200).json(products);

        // const watches = await Watches.find({});
        // res.status(200).json(watches);
    } catch (e) {
        console.log(e);
    }
};

module.exports.getByCategory = async function (req, res) {
    try {
        // const products = await Products.find({
        //     category: new ObjectId("5d495ae6ce4a43044f6177f3")
        // }).populate('category');

        const categories = await Categories.find();
        // const products = await Products.find();
        res.status(200).json(categories);

        // const watches = await Watches.find({});
        // res.status(200).json(watches);
    } catch (e) {
        console.log(e);
    }
};

module.exports.getById = async function (req, res) {
    try {
        const watch = await Watches.findById(req.params.id);
        res.status(200).json(watch);
    } catch (e) {
        console.log(e);
    }
};

module.exports.deleteOne = async function (req, res) {
    try {
        await Products.deleteOne({title: req.params.title});
        res.status(200).json({
            message: 'Product deleted'
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports.create = async function (req, res) {
    try {
        const product = new Products({
            title: req.body.title,
            slug: req.body.slug,
            image: req.body.image,
            description: req.body.description,
            category: req.body.category
        });
        await product.save();
        res.status(201).json({
            message: 'Products is created'
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports.update = async function (req, res) {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            throw new Error('Product not found');
        }

        product.title = req.body.title;
            product.slug = req.body.slug;
            product.image = req.body.image;
            product.description = req.body.description;
            product.category = req.body.category;

        await product.save();

        res.status(200).json(product);
    } catch (e) {
        console.log(e);
        res.status(404).json({
            success: false,
            message: e.message
        });
    }
};