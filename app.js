const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");


const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    console.log(req.body);
    let firstName = req.body.fname;
    let lastName = req.body.lname;
    let email = req.body.email;

    const url = "https://us14.api.mailchimp.com/3.0/lists/c632576ccf"
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const options = {
        method: "POST",
        auth: "tvg:9fd4c741da3980f89187ee398771c6b1-us14"
    };
    
    const request=https.request(url,options,(response)=>{
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })  
    })
    request.write(jsonData);
    request.end();
})

app.post("/failure",(req,res)=>{
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up at port 3000");
})

// API key
// 9fd4c741da3980f89187ee398771c6b1-us14

// The unique list ID(Audience ID)
// c632576ccf