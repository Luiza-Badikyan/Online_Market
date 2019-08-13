const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchSchema = new Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    text: {
        type: String
    }
});

module.exports = mongoose.model('watches', watchSchema);