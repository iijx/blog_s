
const mongoose = require('mongoose');
const Remarkable = require('remarkable');
const hljs = require('highlight.js');
const { TagTypes } = require('../config');

var md = new Remarkable({
    xhtmlOut: true,
    breaks: true,
    typographer:  true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) {}
        }
    
        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {}
    
        return ''; // use external default escaping
      }
});

var defaultTag = ''; // 用于创建文章时，未知tag, 则默认的tag（ 这里时tag为“其他”）

const controller = {
    _create: async (blog) => {
        let { title, content, tag = '', subtags = [], createdTime, updatedTime, view = 0, html = '' } = blog;
        const ArticleModel = mongoose.model('Article');
        
        if (html === '') {
            html = md.render(blog.content);
        }
        if (tag === '') {
            if (defaultTag === '' ) {
                const TagModel = mongoose.model('Tag')
                defaultTag = await TagModel.findOne({ type: TagTypes.REMAIN })
            }
            tag = defaultTag.id;
        }
        console.log('tag', tag)
        let curBlog = new ArticleModel({
            title,
            content,
            tag,
            subtags,
            createdTime,
            updatedTime,
            view,
            html,
        })
        await curBlog.save();
        return Promise.resolve(true);
    },
    _getArticleById: async(id) => {
        const ArticleModel = mongoose.model('Article');
        let article = await ArticleModel.findById(id);
        return Promise.resolve(article);
    },
    _getArticleByTag: async(tag) => {
        const ArticleModel = mongoose.model('Article');
        const TagModel = mongoose.model('Tag');
        let cur_tag = await TagModel.findById(tag);
        let articles = [];
        if (cur_tag.type === TagTypes.ALL) {
            articles = await ArticleModel.find();
        } else {
            articles = await ArticleModel.find({ tag });
        }
        return articles;
    },
    get: async (ctx, next) => {
        const ArticleModel = mongoose.model('Article');
        let query = ctx.query;
        // 找出单篇文章
        if (query && query.id) {
            let article = await self._getArticleById(query.id)
            ctx.body = {
                success: true,
                result: article
            }
        } else if (query.tagId) {
            let articles = await self._getArticleByTag(query.tagId);
            ctx.body = {
                success: true,
                result: articles,
            }
        }
        else {
            let articles = await ArticleModel.find();
            ctx.body = {
                success: true,
                result: articles,
            }
        }
    },
    create: async (ctx, next) => {
        const ArticleModel = mongoose.model('Article');
        
    },
    update: async(ctx, next) => {
        const ArticleModel = mongoose.model('Article');
        let { id, tag, subtags } = ctx.request.body;
        let update = {
            tag: tag,
            subtags: subtags
        }
        console.log(id, tag, subtags);
        const result = await ArticleModel.findByIdAndUpdate(id, update, { new: true });
        console.log('result', result);
        ctx.body = {
            success: true,
            result: result,
        }
    },
    delete: async(ctx, next) => {
        const ArticleModel = mongoose.model('Article');
        let { id = ''} = ctx.query;
        if (id) {
            await ArticleModel.findOneAndRemove({ _id: id });
            ctx.body = {
                success: true,
                result: {},
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
const self = controller;

module.exports = controller;