const cors = require('cors')
  , errorHandler = require('errorhandler')
  , express = require('express')
  , morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.static('.'));

//body parsing
app.use(express.json());

//cors
app.use(cors());

//morgan
app.use(morgan('dev'));

//import and mount api router
const apiRouter = require('./api/api');
app.use('/api', apiRouter);

//error handling (only necessary for dev environment)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is now listening on PORT ${PORT}`);
});

module.exports = app;