# awaitify
JavaScript library to express complex asynchronous code in a sequential, synchronous way

# Usage
```
var awaitify = require('./awaitify').awaitify;

// Express the async flow in a sequential, synchronous way
function* generator(){
        var contact = yield fetchContact();
        console.log(contact);
        var order = yield fetchOrder(contact);
        console.log(order); 
}

// Invoke the async flow using the HOF awaitify which coordinates the execution 
// Register when the entire async flow is resolved/rejected
awaitify(generator())
 .then((result)=>{
    console.log(`done with : ${result}`);
 })
 .catch((error)=>console.error(error));

// Dummy functions which return a Promise
function fetchContact(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('Furqan');
        },1000);
    });
}

function fetchOrder(contact){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve({id:'1234',quantity:10});
          // reject('timeout error');
        },1000);
    });
}

```
