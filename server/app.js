const express = require('express')
const cors = require('cors')
const path = require('path')
const homeRouter = require('./routes/home')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/home', homeRouter)
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
