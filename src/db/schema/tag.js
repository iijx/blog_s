

let mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { TagTypes } = require('../../config');

const TagSchema = new Schema({
    tag: {
        unique: true,
        required: true,
        type: String,
    },
    subtags: {
        type: [String],
        default: []
    },
    type: {
        type: String,
        required: true,
        default: TagTypes.NORMAL,
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
