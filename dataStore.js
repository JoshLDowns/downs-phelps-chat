    const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

class DataStore {
    constructor(dbUrl, dbName, dbCollection) {
        this.dbUrl = dbUrl;
        this.dbName = dbName;
        this.dbCollection = dbCollection;
        this.dbClient = null
    }

    async client() {
        // check if the client exists and is connected
        if (this.dbClient && this.dbClient.isConnected()) {
            //if connected, use connection
            return this.dbClient;
        } else {
            console.log(`Connecting to ${this.dbUrl}...`);
            //otherwise set a new connection, and store it as a property of the object
            this.dbClient = await MongoClient.connect(this.dbUrl, {
                useNewUrlParser: true, useUnifiedTopology: true
            });
            console.log('Connected to database.');
            //return that established connection back out
            return this.dbClient;
        }
    }
    //builds requested collection for reference
    async collection() {
        const client = await this.client();
        const database = client.db(this.dbName);
        const collection = database.collection(this.dbCollection);
        return collection;
    }
    //returns an array of all items in collection
    async getAll() {
        let items = [];
        let collection = await this.collection();
        await collection.find({}).forEach((item) => {items.push(item)});
        return items;
    }
    //returns a specific item based on id
    async getOne(id) {
        let collection = await this.collection();
        let item = collection.findOne({_id: ObjectId(id)});
        return item;
    }
    //inserts a new item to the collection
    async insert(obj) {
        let collection = await this.collection();
        console.log('Inserting item...')
        await collection.insertOne(obj);
        return console.log('Item successfully added to database')
    }
    //deletes an item from the collection based on id
    async delete(id) {
        let collection = await this.collection();
        await collection.deleteOne({_id: ObjectId(id)});
        return console.log('Item successfully deleted')
    }
    //updates an item in the collection based on id and an update object
    async update(id, obj) {
        let collection = await this.collection();
        await collection.updateOne({_id: ObjectId(id)}, {$set:obj})
        return console.log('Item successfully updated')
    }
    async insertMany(doc){
        let collection = await this.collection();
        console.log('Inserting item...')
        await collection.insertMany(doc);
        return console.log('Items successfully added to database')
    }
}

module.exports= DataStore