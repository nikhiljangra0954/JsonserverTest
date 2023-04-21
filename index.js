const jsonServer = require('json-server')
const cors = require('cors')
const path = require('path')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(cors())
server.use(jsonServer.bodyParser)
server.use(middlewares)
server.use(router)
// Register a new user
server.post('/users/register', (req, res) => {
const { email, password } = req.body
if (!email || !password) {
res.status(400).json({ error: 'Email and password are required' })
return
}
// const salt = bcrypt.genSaltSync(10)
// const hash = bcrypt.hashSync(password, salt)
const user = {username, email, password }
router.db.get('users').push(user).write()
res.status(200).json({ message: 'User registered successfully' })
})

// Login an existing user and get JWT token
server.post('/users/login', (req, res) => {
const { email, password } = req.body
if (!email || !password) {
res.status(400).json({ error: 'Email and password are required' })
return
}
const user = router.db.get('users').find({ email }).value()
console.log(user)
if (!user) {
res.status(401).json({ error: 'Invalid email or password' })
return
}
// const match = bcrypt.compareSync(password, user.password)
// console.log(match)
// if (!match) {
// res.status(401).json({ error: 'Invalid email or password' })
// return
// }
const token = jwt.sign({ email }, 'secret')
res.status(200).json({ message: 'User authenticated successfully', token })
})

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
const authHeader = req.headers.authorization
if (!authHeader) {
res.status(401).json({ error: 'Authorization header is missing' })
return
}
const token = authHeader.split(' ')[1]
try {
const decoded = jwt.verify(token, 'secret')
req.user = decoded
next()
} catch (err) {
res.status(401).json({ error: 'Invalid token' })
return
}
}
const PORT = 8000

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
})
