const express = require("express")
const multer = require("multer")
const router  = express.Router()
const {mkdtemp} = require("fs/promises")
const path = require("path")
const os = require("os")
const Executor = require("../utils/executor")

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

const allowedLanguages = [
    "cpp"
]

router.post("/api/judge", upload, async function(req, res) {
    sourceFile = req.files['source'][0]
    inputFile = req.files['input'][0]

    if (!allowedLanguages.includes(req.body.language)) 
        return res.status(400).send({status: "FAILURE", message: "Language not available."})

    const executor = new Executor(sourceFile.path, inputFile.path, req.body.timeLimit, req.body.memoryLimit, req.body.language)
    const result = await executor.run()

    res.send(result)
})

module.exports = router