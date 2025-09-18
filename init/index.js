const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL= "mongodb://127.0.0.1:27017/wonderlust";
main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err);
});

async function main(){
     await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
  await Listing.deleteMany({});

  const dataWithOwner = initdata.data.map((obj)=>({
    ...obj,
    owner:"68b9d0d9aaee1270b59bf117",
  }));

   await Listing.insertMany(dataWithOwner); 
  console.log("data was initialized");

}
initDB();

