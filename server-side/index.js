require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors")

const app = express();

let corsOption = {
  origin: "http://localhost:8080"
}
app.use(cors(corsOption))
app.use(express.urlencoded({ extended: true }));

require('./src/routes/login')(app);
require('./src/routes/register')(app);
require('./src/routes/dashboard')(app);

app.use(express.json());

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});