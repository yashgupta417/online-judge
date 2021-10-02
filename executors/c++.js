const util = require('util')
const exec = util.promisify(require('child_process').exec)
const {mkdtemp, readFile} = require("fs/promises")
const path = require("path")
const Status = require("../utils/status")

class Executor {
    
    constructor(sourceFile, inputFile, timeLimit, memoryLimit, language) {
        this.sourceFile = sourceFile
        this.inputFile = inputFile
        this.memoryLimit = memoryLimit
        this.timeLimit = timeLimit
        this.language = language
    }

    async run() {
        const baseDir = path.dirname(this.sourceFile)
        const params = `${this.sourceFile} ${this.inputFile} ${baseDir} ${this.timeLimit} ${this.memoryLimit}`

        const { stdout, stderr } = await exec(`./scripts/${this.language}.sh ${params}`)
        console.log(stdout)
        console.log(stderr)
        if (stdout.includes("COMPILATION_ERROR")) {
            return  {
                status: Status.COMPILATION_ERROR,
                output: stderr,
                memory: "-1",
                time: "-1"
            }
        }
        const output = await readFile(path.join(baseDir, "output.log"),{encoding: "utf8"})
        console.log(output)
        return {
            status: this.generateStatus(stdout),
            output: this.cleanOutput(output),
            memory: this.extractStat(stdout, "memory"),
            time: this.extractStat(stdout, "cputime")
        }
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
        const statusMap = {
            "memory" : "MEMORY_LIMIT_EXCEEDED",
            "cputime" : "TIME_LIMIT_EXCEEDED"
        }

        if (this.extractStat(stdout, "returnvalue") != 0 ) {
            if (stdout.includes("terminationreason")) {
                return statusMap[this.extractStat(stdout, "terminationreason")]
            } else {
                return "RUNTIME_ERROR"
            }
        }

        return "SUCCESS"
    }

    cleanOutput(output) {
        return output.split('\n').slice(6).join('\n')
    }
}

module.exports = Executor