const express = require("express")
const app = express()
const HOST = '0.0.0.0'
const PORT = 3000

//for handling POST requests
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (req,res) => {
    res.send("Hello from code-runner.")
})

const judgeRoutes = require("./routes/judge")
app.use(judgeRoutes)

app.listen(PORT, HOST, () => {
    console.log(`Server is running at port: ${PORT}`)
})

