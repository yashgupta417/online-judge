const util = require('util')
const exec = util.promisify(require('child_process').exec)
const {readFile} = require("fs/promises")
const path = require("path")
const Status = require("../utils/status")

class BaseExecutor {
    
    constructor(sourceFile, inputFile, timeLimit, memoryLimit, language) {
        this.sourceFile = sourceFile
        this.inputFile = inputFile
        this.memoryLimit = memoryLimit
        this.timeLimit = timeLimit
        this.language = language
    }

    async run() {

    }

    extractStat(result, stat) {
        for (let row of result.split('\n')){
            if (row.includes(`${stat}=`)) {
               return row.split('=')[1] 
            }
        }
        return -1
    }

    generateStatus(stdout) {

    }

    cleanOutput(output) {
        return output.split('\n').slice(6).join('\n')
    }
}

module.exports = BaseExecutor