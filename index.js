const express = require("express");
const path = require('path');
// const router = express.Router();
const bodyParser = require('body-parser');
const { google } = require("googleapis");

const app = express();
const port = 8080;

//This allows us to parse the incoming request body as JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// With this, we'll listen for the server on port 8080
// app.listen(port, () => console.log(`Listening on port ${port}`));

async function authSheets() {
    //Function for authentication object
    const auth = new google.auth.GoogleAuth({
      keyFile: "sheets-keys.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  
    //Create client instance for auth
    const authClient = await auth.getClient();
  
    //Instance of the Sheets API
    const sheets = google.sheets({ version: "v4", auth: authClient });
  
    return {
      auth,
      authClient,
      sheets,
    };
  }

    app.get('/', (req, res) => {
      res.sendFile('models/index.html', {
        root: path.join(__dirname, './')
      })
    })

    app.post("/", async (req, res) => {
    const { sheets } = await authSheets();
  
    // Read rows from spreadsheet
    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId: "19OqwkcpH9-rDs4mKIhhF5iwVzE-MsrHbkV8-_lPiaiY",
      range: "Sheet1",
    });
  
    // res.send(getRows.data);

    const ascEmaila = req.body.ascemail;
    const ascFNamea = req.body.ascFName;
    const ascLNamea = req.body.ascLName;
    console.log("Email: " + ascEmaila );
    console.log("First Name: " +  ascFNamea);
    console.log("Last Name: " +  ascLNamea);
      // Write rows to spreadsheet
    sheets.spreadsheets.values.append({
      spreadsheetId: "19OqwkcpH9-rDs4mKIhhF5iwVzE-MsrHbkV8-_lPiaiY",
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[ascEmaila, ascFNamea, ascLNamea]],
      },
    });
  // res.sendStatus(200);
    // res.end();
    res.sendFile('models/submitted.html', {
      root: path.join(__dirname, './')
    })
  });

