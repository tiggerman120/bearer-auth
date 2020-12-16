// this is where my signin stuff goes
const base64 = require('base-64');
const User = require('../models/user-model');

module.exports = async (req, res, next) => {

  /*
    req.headers.authorization is : "Basic sdkjdsljd="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */

 let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
 let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
 let decodedString = base64.decode(encodedString); // "username:password"
 let [username, password] = decodedString.split(':'); // username, password

 /*
   Now that we finally have username and password, let's see if it's valid
   1. Find the user in the database by username
   2. Compare the plaintext password we now have against the encrypted password in the db
      - bcrypt does this by re-encrypting the plaintext password and comparing THAT
   3. Either we're valid or we throw an error
 */
 try {
   req.user = await User.authenticateBasic(username, password);
  //  const user = await Users.findOne({ username: username })
  //  const valid = await bcrypt.compare(password, user.password);
  //  if (valid) {
  //    res.status(200).json(user);
  //  }
  //  else {
  //    throw new Error('Invalid User')
  //  }
 } catch (error) { res.status(403).send("Invalid Login"); }

 next();
}