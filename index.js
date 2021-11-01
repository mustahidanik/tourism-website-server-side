const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wgu5d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('worldTour');
        const servicesCollection = database.collection('services');
        const myOrderCollection = database.collection('myorder');

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/myorder', async (req, res) => {
            const cursur = myOrderCollection.find({});
            const myorder = await cursur.toArray();
            res.send(myorder);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })


        app.post('/services', async (req, res) => {

            const service = req.body;
            console.log('hit the post api', service)

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })
        app.post('/myorder', async (req, res) => {

            const myOrder = req.body;

            const orderResult = await myOrderCollection.insertOne(myOrder);
            console.log(orderResult);
            res.json(orderResult)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("Running World Server");
});
app.listen(port, () => {
    console.log('Running world server on port', port);
})
//world tour ZHsZKUo4E5yo1oIS