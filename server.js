const express = require("express")
const app = express()
const PORT = 3000


app.get("/", function(req,res){
    res.send("Hello from code-runner.")
})

app.listen(PORT, function(){
    console.log(`Server is running at port: ${PORT}`)
})

