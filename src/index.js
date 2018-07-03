
// 导入环境变量
require('dotenv').config();


const DB = require('./db');
const Koa =  require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router');
const task_addArticle = require('./task.js/addArticle');

;(async () => {
    await DB.connect();
    await DB.initSchema();
    task_addArticle._handler();
    
})()

const App = new Koa();


App
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());


App.listen(process.env.APP_PORT);