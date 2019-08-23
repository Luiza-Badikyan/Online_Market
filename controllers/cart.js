const Product = require('../models/Products');
const Users = require('../models/Users');


module.exports = {

    async store(req, res, next) {

        let user = await Users.findById(req.user._id);

        // TODO: cart logic
        // ....

        const product = await Product.findById(req.body.product);
        console.log(product._id);
        console.log(req.body.product);
        console.log(product, '1111111111111111111111111111111111111111111');
        console.log(req.body);
        let existingItem;
        user.cart.forEach(a => {
           if (a.product == req.body.product){
               existingItem = a
           }
        });
        console.log('---------------------------', existingItem);
        if (existingItem) {
            console.log("true");
            console.log(existingItem);
            console.log(existingItem.quantity);
            existingItem.quantity += 1;
            user.save();
            return res.status(409).json({
                message: 'This product is already used'
            });
        } else {
            console.log("else");
            try {

                let carts = user.cart;
                carts.push(req.body);
                user.cart = carts;
                await user.save();
                return res.json({
                    cart: user.cart,
                    message: 'Product is saved'
                })
            } catch (e) {
                console.log('errrrrrr ',e);
                res.status(400).json({
                    message: 'Product is not add in the cart'
                })
            }
            console.log('asdsfjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjisajdi');
        }

    }

};