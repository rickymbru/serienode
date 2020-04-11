const mongoose = require('mongoose');

mongoose
.connect(process.env.MONGO_URI, {
useUnifiedTopology: true,
useNewUrlParser: true,
useCreateIndex: true,
useFindAndModify: false,
})
//.then(() => console.log('DB Connected!'))
.catch(err => {
console.log("DB Connection Error:", err);
});

mongoose.Promise = global.Promise;

module.exports = mongoose;