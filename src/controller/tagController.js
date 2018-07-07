
const mongoose = require('mongoose');
const ENV = process.env;
const { TagTypes } = require('../config.js');

let AllTags = undefined;

async function findAllTags () {
    const TagModel = mongoose.model('Tag');
    AllTags = await TagModel.find();
    let all_index = AllTags.findIndex( item => item.type === TagTypes.ALL )
    let remain_index = AllTags.findIndex( item => item.type === TagTypes.REMAIN );
    
    AllTags = [AllTags[all_index], ...(AllTags.filter( item => item.type !== TagTypes.ALL && item.type !== TagTypes.REMAIN)), AllTags[remain_index]];
    return AllTags;
}
module.exports = {
    get: async (ctx, next) => {
        let tags = AllTags ? AllTags : await findAllTags();

        ctx.body = {
            success: true,
            result: tags
        }
    },
    create: async (ctx, next) => {
        const TagModel = mongoose.model('Tag');
        let { tag } = ctx.request.body;
        console.log(tag, typeof tag)
        const curTag = new TagModel({
            tag: tag,
        })
        try {
            await curTag.save();
            let result = await findAllTags();
            AllTags = result;
            ctx.body = {
                success: true,
                result: result,
            }
        } catch (error) {
            if (error) {
                ctx.body = {
                    success: false,
                    result: error,
                }
            }
        }


    },
    update: async(ctx, next) => {
        const TagModel = mongoose.model('Tag');
        let { id, subtags } = ctx.request.body;
        
        await TagModel.findOneAndUpdate({ _id: id }, { subtags }, { new: true });
        const result = await findAllTags()
        ctx.body = {
            success: true,
            result,
        }
        
    },
    delete: async(ctx, next) => {
        const TagModel = mongoose.model('Tag');
        let { id = ''} = ctx.query;
        if (id) {
            await TagModel.findOneAndRemove({ _id: id });
            let result = await findAllTags();
            ctx.body = {
                success: true,
                result: result,
            }
        } else {
            ctx.body = {
                success: false,
                result: {
                    msg: 'id 不存在'
                },
            }
        }
    }
}