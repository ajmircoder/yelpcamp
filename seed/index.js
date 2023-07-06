const Campground = require('../models/campground')
const mongooes = require('mongoose');
const cities = require('./cities')
const{ places, descriptors} = require('./seedHelpers')

mongooes.connect('mongodb://127.0.0.1:27017/yelpcamp')
.then(()=>{
    console.log("openn mongooesss on seed")
}).catch((e)=>{
    console.log(`oh no error ${e}`)
})

const sample = array => array[Math.floor(Math.random()* array.length)]

const seedDB = async ()=>{
    await Campground.deleteMany({})
   for(let i = 0; i < 50; i++){
    const random = Math.floor(Math.random()* 1000);
    const camp = new Campground({
        rank:`${cities[random].rank}`,
        location: `${cities[random].city}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        state: `${cities[random].state}`
       
    })
    await camp.save();
   }
}
seedDB().then(()=>{
    console.log('hahahahh')
})