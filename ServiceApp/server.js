const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Set up a whitelist and check against it:
const whitelist = ['http://localhost', 'http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getTest', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/postTest', (req, res) => {
  console.log(req.body);
  res.send({
    message: `I received your POST request. This is what you sent me: ${JSON.stringify(req.body)}`,
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
