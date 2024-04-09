const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public")); // To serve static files like CSS and images
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us22.api.mailchimp.com/3.0/lists/76707b92aa";
  const options = {
    method: "POST",
    auth: "aditya1:2e9ef9a60911c7b1918d3e958f473c45-us22",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      // res.send("Successfully subscribed");
      res.sendFile(__dirname + "/success.html");
    } else {
      // res.send("There was an error signing up, please try again later!!");
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData); // Send the JSON data
  request.end(); // End the request
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
//APIkey: 2e9ef9a60911c7b1918d3e958f473c45-us22
//Listid: 76707b92aa
