const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { sendToTangle, buildTag, alterTag } = require('../MaMa/Functions.js');
const {actOnCallForProposal, actOnProposal, actOnAcceptProposal} = require('../MaMa/client.js');



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


app.post('/cfp', (req, res) => {
      
    actOnCallForProposal(req.body)

  res.send({
    message: JSON.stringify(req.body),
  });
});



app.post('/proposal', (req, res) => {
      
  actOnProposal(req.body)

  res.send({
    message: JSON.stringify(req.body),
  });
});


app.post('/acceptProposal', (req, res) => {
  console.log('ACCEPT PROPOSAL');
  actOnAcceptProposal(req.body)
  console.log(req.body);
  res.send({
    message: JSON.stringify(req.body),
  });
});

app.post('/rejectProposal', (req, res) => {
  console.log(req.body);
  res.send({
    message: JSON.stringify(req.body),
  });
});

app.post('/informConfirm', (req, res) => {
  console.log(req.body);
  res.send({
    message: JSON.stringify(req.body),
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
