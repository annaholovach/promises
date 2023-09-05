//1

function promiseAll(arrayOfPromises) {
    return new Promise ((resolve, reject) => {
        if (arrayOfPromises.length === 0) {
            resolve([])
            return
        }

        const result = []
        let count = 0

        arrayOfPromises.forEach((promise, index) => {
            promise
                .then(value => {
                result[index] = value
                count++

                if (count === arrayOfPromises.length) {
                    resolve(result)
                }
            })
                .catch(err => {
                reject(err)
            })
        })
    })
}

const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

promiseAll(promises)
  .then(results => {
    console.log("All promises resolved:", results); // Expected: [1, 2, 3]
  })
  .catch(error => {
    console.error("At least one promise rejected:", error);
  });

//2

function promiseAllSettled (arrayOfPromises) {
    const result = []
    let count = 0

    return new Promise(resolve => {
        if (arrayOfPromises.length === 0) {
            resolve(result)
            return
        }

        arrayOfPromises.forEach((promise, index) => {
            promise
                .then(value => {
                    result[index] = {status: 'fulfilled', value}
                    count++

                    if (count === arrayOfPromises.length) {
                        resolve(result)
                    }
                })
                .catch(err => {
                    result[index] = {status: 'rejected', err}
                    count++

                    if (count === arrayOfPromises.length) {
                        resolve(result)
                    }
                })
        })   
    })
}

const promises2 = [
    Promise.resolve(1),
    Promise.reject("Error occurred"),
    Promise.resolve(3)
  ];
  
  promiseAllSettled(promises2)
    .then(results => {
      console.log("All promises settled:", results);
      // Expected: [{ status: 'fulfilled', value: 1 },
      //            { status: 'rejected', reason: 'Error occurred' },
      //            { status: 'fulfilled', value: 3 }]
    });
  
//3

function chainPromises (arrayOfFunctions) {
    return arrayOfFunctions.reduce((prev, curr) => {
        return prev.then(curr)
    }, Promise.resolve())
}

function asyncFunction1() {
    return Promise.resolve("Result from asyncFunction1");
}
  
function asyncFunction2(data) {
    return Promise.resolve(data + " - Result from asyncFunction2");
}
  
function asyncFunction3(data) {
    return Promise.resolve(data + " - Result from asyncFunction3");
}
  
const functionsArray = [asyncFunction1, asyncFunction2, asyncFunction3];
  
chainPromises(functionsArray)
    .then(result => {
      console.log("Chained promise result:", result);
      // Expected: "Result from asyncFunction1 - Result from asyncFunction2 - Result from asyncFunction3"
    })
    .catch(error => {
      console.error("Chained promise error:", error);
    });

//4

function promisify (f) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            function callback(err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }
            args.push(callback)
            f.call(this, ...args)
        })
    }
}

function callbackStyleFunction(value, callback) {
    setTimeout(() => {
      if (value > 0) {
        callback(null, value * 2);
      } else {
        callback("Invalid value", null);
      }
    }, 1000);
}
  
const promisedFunction = promisify(callbackStyleFunction);
  
promisedFunction(3)
    .then(result => {
      console.log("Promised function result:", result); // Expected: 6
    })
    .catch(error => {
      console.error("Promised function error:", error);
    });
  
  
