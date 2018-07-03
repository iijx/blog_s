

let mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    html: {
        type: String,
        default: '',
    },
    createdTime: {
        type: Date,
        default: new Date()
    },
    updatedTime: {
        type: Date,
        default: new Date()
    },
    tag: {
        type: String,
        default: '',
    },
    subTag: {
        type: [String],
        default: [],
    },
    view: {
        type: Number,
        default: 0,
    },
    isShow: {
        type: Boolean,
        default: false,
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

mongoose.model('Article', ArticleSchema);
