const cors = require('cors')
  , errorHandler = require('error-handler')
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

//error handling (only necessary for dev environment)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is now listening on PORT ${PORT}`);
});