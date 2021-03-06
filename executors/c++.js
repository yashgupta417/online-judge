const util = require('util')
const exec = util.promisify(require('child_process').exec)
const {readFile} = require("fs/promises")
const path = require("path")
const Status = require("../utils/status")
const BaseExecutor = require("./base")

class CppExecutor extends BaseExecutor {
    
    constructor(sourceFile, inputFile, timeLimit, memoryLimit) {
        super(sourceFile, inputFile, timeLimit, memoryLimit, "c++")
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

    generateStatus(stdout) {
        const statusMap = {
            "memory" : Status.MEMORY_LIMIT_EXCEEDED,
            "cputime" : Status.TIME_LIMIT_EXCEEDED
        }

        if (this.extractStat(stdout, "returnvalue") != 0 ) {
            if (stdout.includes("terminationreason")) {
                return statusMap[this.extractStat(stdout, "terminationreason")]
            } else {
                return Status.RUNTIME_ERROR
            }
        }

        return Status.SUCCESS
    }
}

module.exports = CppExecutor