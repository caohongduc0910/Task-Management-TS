import express, { Express } from "express" 
import {connect} from './config/database'
import dotenv from "dotenv"
import bodyParser from 'body-parser'
import route from "./api/v1/routes/index.route"

//express init
const app: Express = express()
//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//env config
dotenv.config()
//DB connection
connect()
//Routing
route(app)

const port: string | number = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})