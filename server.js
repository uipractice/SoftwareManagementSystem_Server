const express = require('express'),
  app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const log = console.log;
const softwareInfoRouter = require('./routes/softwareInfo');
const authenticationRouter=require('./routes/auth.routes');
const userManagementRouter=require('./routes/userManagement.routes');
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('Succss');
});

const port = process.env.PORT || 5000;
app.listen(port, () => log(`Server running on port: ${port}`));


const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () =>
  log('MongoDB Connection established successfully')
);

app.use('/softwareInfo', softwareInfoRouter);
app.use('/auth',authenticationRouter);
app.use('/users',userManagementRouter)
