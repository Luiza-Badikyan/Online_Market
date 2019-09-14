const Users = require('../models/Users');
const Roles = require('../models/Roles');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const nodemailer = require('nodemailer');
const moment = require('moment');
const crypto = require("crypto");




// register
module.exports.register = async function(req, res) {
    const candidate = await Users.findOne({email: req.body.email});
    if (candidate) {
        res.status(409).json({
            message: 'This email is already registered'
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
                resetPasswordToken: null,
                resetPasswordExpires: null,
                basket: [],
                image: null,
                date: null,
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

    const candidate = await Users.findOne({email: req.body.email}).populate('role');
    console.log(candidate);
    if (candidate) {
        const password = bcrypt.compareSync(req.body.password, candidate.password);
        console.log(password);
        if (password) {
            const token = jwt.sign({
                /////////////////////////////////

                firstName: candidate.firstName,
                lastName: candidate.lastName,
                basket: candidate.basket,

                //////////////////////////////////
                email: candidate.email,
                userId: candidate._id,
                role: candidate.role.name
            }, keys.jwt, {expiresIn: 60*60*24});

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

// Users Information Update
module.exports.addInformation = async function (req, res, next) {
    console.log('aaaaaaaaaaaaaaaaaaa');
    try {
        const user = await Users.findById(req.params.id);
        console.log(req.params.id);
        console.log(user);
        if (!user) {
            throw new Error('User is not found');
        }

        const image = (req.file) ?
            `${req.protocol}://${req.headers.host}/uploads/${req.file.filename}` : null;

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.date = req.body.date;

        if (image) {
            user.image = image;
        }

        await  user.save();
        res.status(200).json(user);

    } catch (e) {
        console.log(e);
        res.status(404).json({
            success: false,
            message: e.message
        })
    }
}

// User Password Update
module.exports.updatePassword = async function (req, res, next) {
   try {
        const body = req.body;
        const user = await Users.findById(body.user_id);
        if (!user) {
            throw new Error('User is not found');
        }
        const password = bcrypt.compareSync(body.password, user.password);
       
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const newPassword = body.newPassword;
            user.password = bcrypt.hashSync(newPassword, salt);
            await user.save(); // update password
            res.status(200).json(user);
        } else {
            res.status(400).json({
                message: 'Your password is incorrect'
            })
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

// Reset Password
module.exports.resetPassword = async function (req, res, next) {
    try {
        const user = await Users.findOne({email: req.body.email});
        console.log(user);
        if (!user) {
            throw new Error('User is not found');
        }

        const token = crypto.randomBytes(20).toString('hex');
        console.log(token);

        const url = 'http://localhost:4200/reset_password/link?token='+token+'&email='+req.body.email;
        console.log(url);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = moment().add(1, 'days');

        user.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "youremail@gmail.com",
                pass: "your_password"
            }
        });
        const mailOptions = {
            from: 'youremail@gmail.com',
            to: 'youremail@gmail.com',
            subject: 'Link to reset password',
            text: `Please follow this link to reset your password...
            ${url}
            If you did not request this, please ignore this email and your password will remain unchanged.`
        };

        try {
            await transporter.sendMail(mailOptions, function (err, res) {
                console.log('res',res);
                console.log('err',err);
            });
        } catch (e) {
            console.log('e.message', e.message);
            res.status(400).json({
                success: false,
                message: e.message
            })
        }


    } catch (e) {
        console.log(e);
        res.status(400).json({
            success: false,
            message: e.message
        })
    }

}

// Check Token
module.exports.checkToken = async function (req, res, next) {
    try {
        const user = await Users.findOne({email: req.params.email});
        if (!user) {
            throw new Error('User is not found');
        } else {
            const now = moment();
            if (user.resetPasswordToken === req.params.token && moment(user.resetPasswordExpires).isAfter(now)) {
                res.status(200).json(user);
            } else {
                console.log(now);
                res.status(400).json({
                    success: false,
                    message: e.message
                })
            }
        }
    } catch (e) {
        console.log('catch', e);
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
}

// Change Password
module.exports.changePasswordToken = async function (req, res, next) {
    try {

        const user = await Users.findOne({email: req.params.email});
        const now = moment();

        if (!user) {
            throw new Error('User is not found');
        } else {
            if (user.resetPasswordToken !== req.params.token || !moment(user.resetPasswordExpires).isAfter(now)) {
                 console.log('Your reset password expires time is over');
            } else {
                if (req.body.newPassword !== req.body.confirmPassword) {
                    console.log(req.body.newPassword);
                    console.log(req.body.confirmPassword);
                    console.log('Your password and confirmPassword must be the same. Pleas, try again');
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const password = req.body.newPassword;
                    user.password = bcrypt.hashSync(password, salt);
                    user.resetPasswordToken = null;
                    user.resetPasswordExpires = null;
                    await user.save();
                    res.status(200).json({
                        success: true,
                        message: 'Your password is changed'
                    })
                }
            }
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
}