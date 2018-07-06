const mongoose = require('mongoose');
const { TagTypes } = require('../config.js');

module.exports = async function(){

    const TagModel = mongoose.model('Tag');
    const type_ALL = await TagModel.findOne({ type: TagTypes.ALL });
    const type_REMAIN = await TagModel.findOne({ type: TagTypes.REMAIN});
    if (!type_ALL) {
        let result = new TagModel({
            tag: '全部',
            type: TagTypes.ALL,
        })
        await result.save();
    } else {
        console.log('had type_all')
    }
    
    if (!type_REMAIN) {
        let result = new TagModel({
            tag: '其他',
            type: TagTypes.REMAIN,
        })
        await result.save();
    } else {
        console.log('had type_remain')
    }

}