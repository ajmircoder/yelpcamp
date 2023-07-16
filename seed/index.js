const Campground = require('../models/campground')
const mongooes = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongooes.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .then(() => {
        console.log("openn mongooesss on seed")
    }).catch((e) => {
        console.log(`oh no error ${e}`)
    })

    // const index1 = Math.floor(Math.random()* places.length);
    // const index2 = Math.floor(Math.random()* descriptors.length);
const sample = array => array[Math.floor(Math.random() * array.length)]
  
const seedDB = async () => {

    try {
        await Campground.deleteMany({})
        for (let i = 0; i < 50; i++) {
            const random = Math.floor(Math.random() * 1000);
            const camp = new Campground({

                price: random,
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel eos doloremque consectetur illum, mollitia suscipit autem aspernatur, delectus, optio quod quo! Asperiores nemo neque quos provident ratione ab, pariatur laborum!",
                location: `${cities[random].city}`,
                rank: `${cities[random].rank}`,
                state: `${cities[random].state}`,
                img: "https://source.unsplash.com/collection/483251",
                title: `${sample(descriptors)} ${sample(places)}`,
            })
            await camp.save();
        }
    } catch (e) {
        console.log(`oh nooooo errorrr in line 32 ${e}`)
    }

}
seedDB().then(() => {
    console.log('hahahahh')
}).catch((e) => {
    console.log(`error in line 39 ${e}`)
})