const userInput = parseInt(process.argv.splice(2)[0]);
const defaultPort = userInput || 8888;


console.log(userInput,defaultPort);