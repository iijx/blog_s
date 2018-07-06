

const Router = require('koa-router');
const mongoose = require('mongoose');

const tagController = require('../controller/tagController');
const articleController = require('../controller/articleController');



const router = new Router();

const prefix = '/blog/api';

// router.post(`${prefix}/login`, userController.login);
router.get(`${prefix}/`, async (ctx, next) => {
    ctx.body = {
        success: 'test'
    }
})
router.get(`${prefix}/tag`, tagController.get)
      .post(`${prefix}/tag`, tagController.create)
      .put(`${prefix}/tag`, tagController.update)
      .delete(`${prefix}/tag`, tagController.delete)

router.get(`${prefix}/article`, articleController.get)
      .post(`${prefix}/article`, articleController.create)
      .post(`${prefix}/article_update`, articleController.update)
      .delete(`${prefix}/article`, articleController.delete)

module.exports = router;
