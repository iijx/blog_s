
const mongoose = require('mongoose');
const Remarkable = require('remarkable');
const hljs = require('highlight.js');
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

const controller = {
    _create: async (blog) => {
        let { title, content, tag = '', subtags = [], createdTime, updatedTime, view = 0, html = '' } = blog;
        const ArticleModel = mongoose.model('Article');

        if (html === '') {
            // html = converter.makeHtml(blog.content);
            html = md.render(blog.content);
            console.log('content', content)
            console.log('html', html)
        }
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
        let article = await ArticleModel.findById({ _id: id});
        return article;
    },
    _getArticleByTag: async(tag) => {
        const ArticleModel = mongoose.model('Article');
        let articles = await ArticleModel.find({ tag });
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
        } if (query.tagId) {
            let articles = await self._getArticleByTag(query.tagId);
            console.log('query', query)
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
        const TagModel = mongoose.model('Tag');
        let curTag = new TagModel({
            tagName: ''
        })
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