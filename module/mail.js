/**
 *
 * Run:
 *
 */
 const mailjet = require('node-mailjet').apiConnect(
    "1e5b8de75d3ffef341bfcb30f876bfb0" ,
    "7e705eb5d2f315a8751acd13316a786f"
  )
 module.exports =  function(email,username,otp,cb)
{

 
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'Ankushfake2681@gmail.com',
          Name: 'Ankush Joon',
        },
        To: [
          {
            Email: email,
            Name: username,
          },
        ],
        Subject: 'Shopify Signup',
        TextPart: 'Greeting From Shopify',
        HTMLPart:
        `<html>
        <head>
          <style>
            div
            {
              text-align : center;
              width : 60vh;
            }
            h3
            {
              font-size : 32px;
              text-align : center;
            }
            </style>
          </head>
          <body>
            <div>
      <h1>Welcome to shopify ${username}</h1>
      <p>Your one time OTP for Account registration is </p>
      <h3>${otp}</h3>
      <p>Verify Your Email After logging into shopify Website.</p>
      </div>
            </body>
            </html>`,
      },
    ],
  })
  request
    .then(result => {
      console.log(result.body)
      cb("ddd",request.body);
    })
    .catch(err => {
      console.log(err.statusCode)
      cb(null,request.body);
    })

}

//module.exports = emailsend;