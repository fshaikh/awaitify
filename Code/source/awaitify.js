module.exports = (function(){
    /**
     * Orchestrates the asynchronous flows defined in the passed generator function.
     * @param {*generator function} generator - Generator function to be orchestrated
     * @returns {Promise} - Promise
     */
    function awaitify(generator){
        return new Promise((resolve,reject)=>{
            // Start interacting with the passed in generator by invoking next. This will resume execution
                // of the generator function till "yield" is encountered.
                // Capture the value since output of a generator function is an iterator
                // {value : <Promise> | <object> , done: false}
            process(()=>generator.next());

            function process(resume){
                let next = null,promise = null;
                 // Start interacting with the passed in generator by invoking next. This will resume execution
                // of the generator function till "yield" is encountered.
                // Capture the value since output of a generator function is an iterator
                // {value : <Promise> | <object> , done: false}
                try{
                    next = resume();
                }catch(e){
                    // reject the outer promise so that the calling code catch the errors
                    reject(e);
                    return;
                }
                
                promise = next.value;

                 // If we are done iterating the generator, return to avoid stack overflow
                 if(next.done){
                   // resolve the outer promise so that the calling code can know when the entire
                   // aync flow wrapped in the generator function has completed
                   resolve(promise);
                   return;
                }

                // This is a fail-safe code when yield is used with a non-promise return value. for eg: yield true
                // In cases when yield returns a Promise, we check if the returned value is a Promise by using
                // instanceof. If it is, we simply return the promise else we create a new Promise object
                // using Promise.resolve(). This auto resolves a promise and returns a new Promise object
                promise = (promise instanceof Promise) ? promise: Promise.resolve(promise);

                // register for then/catch events
                // then will be invoked when the promise is resolved. 
                // catch will be invoked when the promise is rejected
                promise
                .then((result)=>{
                    // Call the function again to handle next async flow
                    process(() => generator.next(result));
                })
                .catch((reason)=>{
                      // throw the error into the generator. If the generator function is wrapped in try/catch block
                      // the promise rejection reason can be captured
                   process(() => generator.throw(reason)); 
                 });
            }     
        }); 
    }

    return {
        awaitify : awaitify
    };
})();