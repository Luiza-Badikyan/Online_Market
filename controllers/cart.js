const Product = require('../models/Products');
const Users = require('../models/Users');


module.exports = {

    async store(req, res, next) {
        console.log('user: ', req.user);
        res.json(req.body);
        let user = await Users.findById(req.user._id);
        console.log(user);
        // console.log(user.cart);

        // TODO: cart logic
        // ....

        const product = await Product.findById(req.body.product);
        console.log(product);
        if (product._id === req.body.product) {
            // console.log(product);
            // this.user.product.quantity++;
            // res.status(409).json({
            //     message: 'This product is already used'
            // })
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        } else {
            try {
                const newProduct = new Product({
                    product: req.body.product,
                    quantity: req.body.quantity
                });
                await user.cart.push(newProduct);
                await  user.save();
                console.log('aaajdjskdhjkshdjkj');
                res.status(200).json({
                    cart: user.cart,
                    message: 'Product is saved'
                })
            } catch (e) {
                console.log(e);
                res.status(400).json({
                    message: 'Product is not add in the cart'
                })
            }
            console.log(user.cart);
            console.log('asdsfjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjisajdi');
        }

        // await user.save();
        // return res.json({cart: user.cart});
    }

};