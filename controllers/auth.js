const Users = require('../models/Users');
const Roles = require('../models/Roles');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

// register
module.exports.register = async function(req, res) {
    const candidate = await Users.findOne({email: req.body.email});
    if (candidate) {
        res.status(409).json({
            message: 'This email is already registated'
        })
    } else {
        try {
            const salt = bcrypt.genSaltSync(10);
            const password = req.body.password;
            const role  = await Roles.findOne({
                name: 'user'
            });
            if(!role) return res.status(500).end();
            const user = new Users({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: bcrypt.hashSync(password, salt),
                role: role._id
            });

            await user.save(); // registration
            res.status(200).json(user);
        } catch (e) {
            console.log(e);
        }
    }
};

// login
module.exports.login = async function(req, res) {
    console.log(req.body.email);
    console.log(req.body.password);

    const candidate = await Users.findOne({email: req.body.email});

    if (candidate) {
        const password = bcrypt.compareSync(req.body.password, candidate.password);
        console.log(password);
        if (password) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60*60});

            res.status(200).json({
                token: `Bearer ${token}`
            });
            // res.localStorage.setItem('id_token', token);
        } else {
            res.status(401).json({
                message: 'Password error'
            })
        }
    } else {
        res.status(404).json({
            message: 'Not found'
        })
    }
};

// Get Users
module.exports.getUsers = async function (req, res) {
    try {
        // const products = await Products.find({
        //     category: new ObjectId("5d495ae6ce4a43044f6177f3")
        // }).populate('category');

        // const categories = await Categories.find();
        const users = await Users.find();
        res.status(200).json(users);

        // const watches = await Watches.find({});
        // res.status(200).json(watches);
    } catch (e) {
        console.log(e);
    }
};