# Promise
#前端/ES6/Promise#

- - - -

### 异步编程下的两种模型

异步编程下的两种模型，第一种是事件模型
```Javascript
Button.onclick = function() {
	console.log('clicked');
}
```

第二种是回调模型
```javascript
ReadFile('example.txt', function(err, contents) {
	if( err ) {
		throw err;
	}
	console.log(contents);
})
```

### Promise 应运而生
Promise 相当于异步操作的占位符，让一个异步操作返回一个 Promise
```javascript
let promise = readFil('example.txt');
```

Promise 有个很大的好处：**控制反转**。以前回掉模式中，我们提供一个回掉函数给异步操作，异步操作的完成后会**调用**我们传递的回掉函数，请注意：调用权在那个异步操作中，换句话说，我们开发者只需提供回掉函数，这里就存在一个 **信任问题**。异步操作成功后会不会调用？会调用几次？会不会提前调用？会不会延时调用？ 也就是控制权，不再我们手中，我们能且只能完全信任。 而如果使用Promsie, 异步操作仅仅返回一个 Promise, 而 promise 决议后怎么调用这个权利，完全在我们的掌控之中（ 可以认为是 Promise 官方标准规范了这个信任问题）。

### 构造一个 promise
```javascript
new Promise( ( resolve, reject ) => { ... } )
```

参数是一个函数（称之为 executor 函数），一个接受 resolve 和 reject 两个参数的函数。executor 函数在 Promise 构造函数执行时同步执行，被传递 resolve 和 reject 函数（executor 函数在 Promise 构造函数返回新建对象前被调用）。resolve 和 reject 函数被调用时，分别将 promise 的状态改为 fulfilled（完成）或 rejected（失败）。executor 内部通常会执行一些异步操作，一旦完成，可以调用 resolve 函数来将 promise 状态改成 fulfilled，或者在发生错误时将它的状态改为 rejected。
如果在executor函数中抛出一个错误，那么该promise 状态为rejected。executor函数的返回值被忽略。

**创建未完成的 Promise:**
```javascript
let fs = require('fs');

function readFile( filename ) {
    return new Promise( ( resolve, reject ) => {
        fs.readFile( filename, { encoding: 'utf8'}, ( err, contents ) => {
            if( err ) {
				  reject( err );
				  return;
			  }
			  // 成功读取文件
            resolve( contents );
        })
    })
}
let promise = readFile('example.txt');
promise.then( contents => console.log( contents ), err => console.log(err.message) );
```

**创建已完成的 Promise**
```JavaScript
let promise = Promise.resolve(42);
let promise = Promise.reject(42);
```

**then 与 catch**
```javascript
let promise = readFile('example.txt');
promise.then( res => log(res), rej => log(rej) ); //同时监听'完成'与‘拒绝’
promise.then( res => log(res) , null ); // 监听'完成'
promise.then( null, rej => log(rej) ); // 等同于 promise.catch( rej => log(rej) );
```

如果执行器内部发生错误，会直接使得 `promise` 变为 `reject` 状态；
```javascript
let promise = new Promise( (resolve, reject) => {
	throw new Error('some error is happend');
}).catch( err => log(err));
```


### 扩展
单个 `promise`, 并不能表达两个或更多并行发生的异步事件，这是一个异步流程控制的问题。因此会有一些拓展方法辅助。

**Promise.all( iterable )**
该方法接受一个参数并返回一个Promise，该参数是一个含多个受监视的 Promise 的可迭代对象（如：一个数组），而返回的 Promise 只有当 iterable 对象里所有的 Promise 对象都成功时才会触发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。该promise对象在触发成功状态以后，会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，顺序跟iterable的顺序保持一致；如果这个新的promise对象触发了失败状态，它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。Promise.all方法常被用于处理多个promise对象的状态集合。

**Promise.race( iterable )**
当iterable参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数调用父promise绑定的相应句柄，并返回该promise对象。 
