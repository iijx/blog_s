const fs = require('fs');
const path = require('path');
const util = require('util');
const fs_readdir = util.promisify(fs.readdir);
const fs_readFile = util.promisify(fs.readFile);
const articleController = require('../controller/articleController');
const { ArticleDir } = require('../config');

const bodyDivideRegrep = /\n[-\s]*\n/;

/**
 * 
 * @param {*} file
 * 
 * return {
 *      tag,
 *      content,
 *      createTime,
 *      updateTime,
 * } 
 */
async function filehandle( file ) {
    let filepath = path.resolve(ArticleDir.unhandled, file);
    let content = await fs_readFile(filepath, 'utf8');
    const title = content.match(/^.*\n/)[0].replace(/#/, '').trim();
    let divideIndex = content.search(bodyDivideRegrep);
    if (divideIndex !== -1) {
         content = content.slice(divideIndex);
         content = content.replace(bodyDivideRegrep, (match, p, offset, str) => {
             divideIndex = offset;
             return ''
         });
    }
    const info = fs.lstatSync(filepath);
    const obj = {
        title,
        createTime: info.birthtime,
        updateTime: info.mtime,
        content,
    }

    // fs.unlinkSync(filepath);
    fs.rename(filepath, path.resolve(ArticleDir.handled, file), function (err) {
        if (err) throw err;
        console.log('renamed complete');
    });
    await articleController._create(obj);
    return Promise.resolve(obj);
}
async function handler( dir ) {
    const files = await fs_readdir( dir );
    
    for( const item of files ) {
        let result = await filehandle(item);
        
    }
}


module.exports = {
    _handler: async function() {
        await handler(ArticleDir.unhandled);
    }
}