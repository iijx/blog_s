

let mongoose = require('mongoose');

const Schema = mongoose.Schema;


const TagSchema = new Schema({
    tag: {
        unique: true,
        required: true,
        type: String,
    },
    subtags: {
        type: [Schema.Types.String],
        default: []
    },
    meta: {
        created: {
            type: Date,
            default: Date.now(),
        },
        updated: {
            type: Date,
            default: Date.now(),
        }
    }
})

mongoose.model('Tag', TagSchema);
