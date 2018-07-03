
const mongoose = require('mongoose');
const ENV = process.env;

async function findAllTags () {
    const TagModel = mongoose.model('Tag');
    return await TagModel.find();
}
module.exports = {
    
    get: async (ctx, next) => {
        console.log('1');

        let tags = await findAllTags();

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