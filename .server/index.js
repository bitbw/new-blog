const express = require('express')
const app = express()
const port = 8666
const path = require('path')
app.use('/', express.static(path.join(__dirname, '../build')))

app.listen(port, (e) => {
  if (!e) console.log(`Example app listening on http://localhost:8666`)
})
