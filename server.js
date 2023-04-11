const app = require('./app')

//-------------------------------------------
const mongoose = require("mongoose");

const PASSWORD = "RuTfwMzNOzdPF1E1";
const DB_NAME = "contacts_finding";

const DB_HOST = `mongodb+srv://Alexander:${PASSWORD}@cluster0.bfvvcci.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.set('strictQuery', true);   ///  ?

mongoose.connect(DB_HOST)
.then(()=> {
  app.listen(3000);
  console.log("Database connect success")
})
.catch(error => {
  console.log(error.message);
  process.exit(1);
});

//--------------------------------------------







//    RuTfwMzNOzdPF1E1