const express = require("express")
const multer = require("multer")
const router  = express.Router()
const {mkdtemp, writeFile} = require("fs/promises")
const path = require("path")
const os = require("os")

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const tempDir = await mkdtemp(path.join(os.tmpdir(), 'judge-'))
        cb(null, tempDir)
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.').pop()
        cb(null, `${file.fieldname}.${extension}`)
    }
})
  
const upload = multer({ storage: storage }).fields([
    {
        name : 'source',
        maxCount : 1
    },
    {
        name : 'input',
        maxCount : 1
    }
])

const allowedLanguages = {
    "c++": {
        extension: "cpp"
    },
    "python": {
        extension: "py"
    }
}

router.post("/api/judge", upload, async function(req, res) {

    if (!(req.body.language in allowedLanguages)) 
        return res.status(400).send({status: "FAILURE", message: "Language not available."})

    if (!req.files['source'] || !req.files['input']) {
        return res.status(400).send({status: "FAILURE", message: "Source(text/file) and Input(text/file) not given."})
    }

    sourceFile = req.files['source'][0]
    inputFile = req.files['input'][0]
    const Executor = require(`../executors/${req.body.language}`)
    const executor = new Executor(sourceFile.path, inputFile.path, req.body.timeLimit, req.body.memoryLimit, req.body.language)
    const result = await executor.run()

    res.send(result)
})

module.exports = router