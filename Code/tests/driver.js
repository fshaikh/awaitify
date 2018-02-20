// 1. Callback Style
// 2.Promise Style
// 3. async/await style using generators and promises

var awaitify = require('./awaitify').awaitify;
// Generator way - Always "yield promise".
// 2. Express the async flow in a sequential, synchronous way
function* generator(){
    // 4. Capture rejection errors in a try/catch way
   try{
        var contact = yield fetchContact();
        console.log(contact);
        var order = yield fetchOrder(contact);
        console.log(order);
        var pattern = yield fetchAnalytics(order);
        console.log(pattern);

        // // 3. Handling scenarios where the called function returns a non-promise
        const number = yield 5;
        console.log(number);

        return {contact : contact};//,order:order,pattern:pattern,number:number};
    }catch(e){
        console.error(e);
    } 
}

// 5. Catch asynchronous errors 
// 6. Get notified when the generator async flow is complete
// 7. Get notified when the generator async flow is complete with return values, if any
var pro = awaitify(generator())
pro
.then((result)=>{
    console.log(`done with : ${result}`);
})
.catch((error)=>console.error(error));

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

function fetchAnalytics(orderId){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('Likely to churn');
        },1000);
    });
}