require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const authRouters = require('./routes/authRoutes');
const categoryRouters = require('./routes/categoriesRoutes')
const connectDB = require('./config/db')
const { config } = require('dotenv');

const app = express();
const PORT = config.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', productRoutes);
app.use('/api', authRouters);
app.use('/api', categoryRouters)
connectDB()

    .then(() => {
        app.listen(PORT || 3000, () => {
            console.log(`Server is running on 3000`);
        });
    })
    .catch((error) => {
        console.log("error" + error);
    });

    module.exports = app