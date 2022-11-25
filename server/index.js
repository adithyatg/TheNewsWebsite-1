// import express from 'express'
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const newsApi = require('newsapi');
// const url = require('url');
require('dotenv').config({path:'./.env'});
const Axios = axios.create({
    baseURL: `${process.env.NEWS_API}`
  })


const app = express();
const PORT = process.env.PORT || 4100;
const mongo_uri = process.env.MONGO_URI;
const client = new MongoClient(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const saltRounds = 10;

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({ origin: "http://localhost:3000" }));

app.post('/login', async (req, res) => {
    // console.log(req.body);
    try {
        const db = client.db('Logins');
        const data = await db.collection('data').findOne({email:req.body.email})
        if(!data) throw new Error(`Email Id or Password is wrong`);
        else {
            // console.log(data);
            const result = await bcrypt.compare(req.body.passwd, data.passwd)
            // req.body = JSON.parse(req.body)
            // console.log(req.body.user, '/', req.body.passwd);
            // res.send({token:req.body.user})
            res.send({token:result})
            res.end()
        }

    } catch(err) {
        console.log(err.toString());
    }
});

app.get('/head', async (req, res) => {


        const newsapi = new newsApi(process.env.API_KEY_1);
        // To query /v2/top-headlines
        // All options passed to topHeadlines are optional, but you need to include at least one of them
        newsapi.v2.topHeadlines({
        // sources: 'bbc-news,the-verge',
        // q: 'bitcoin',
        category: req.query.category,
        language: 'en',
        country: req.query.country,
        page: req.query.page,
        pageSize: 20,
        }).then(response => {
        // console.log(response);
            res.send(response)
        });
    // const url = process.env.NEWS_API
    // console.log(req.query.category);
    // // try {
    //     let body = "https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business"
    //     // let body = await Axios.get(`top-headlines?category=${req.query.category}&country=${req.query.country}&apiKey=${process.env.API_KEY_1}&page=${req.query.page + req.query.value}&pageSize=20`)
    //     // if(body.status === 'error') {
    //     //     body = await Axios.get(`${url}top-headlines?category=${req.query.category}&country=${req.query.country}&apiKey=${process.env.API_KEY_2}&page=${req.query.page + req.query.value}&pageSize=20`)
    //     // }
    //     res.send(body)
    // // } catch (err) {
    // //     console.log(err.toString());
    // //     res.send({error:"error"})
    // // }
})

app.post('/signup', async (req, res) => {

    bcrypt.hash(req.body.passwd, saltRounds)
    .then(hash => {
            const credentials = {
            user: req.body?.user,
            passwd: hash
        }
        return credentials;
    })
    .then(credentials => {
        const db = client.db('Logins');
        // console.log("L");
        db.collection('data').insertOne(credentials)
        .catch(err => console.log(err.toString()))
        // console.log(data);
        // req.body = JSON.parse(req.body)
        // console.log(req.body.user, '/', req.body.passwd);
        // res.send({token:req.body.user})
        // res.send({token:data.passwd === credentials.passwd})
        res.end()
    })
    .catch(err => { 
        throw new Error(err.toString());
    })
})


app.listen(PORT, () => 
    console.log(`Server running at port ${PORT}`));
