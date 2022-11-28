// import express from 'express'
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const newsApi = require('newsapi');
const NewsAPI = require('newsapi');
// const url = require('url');
require('dotenv').config({path:'./.env'});



const app = express();
const PORT = process.env.PORT || 4100;
const mongo_uri = process.env.MONGO_URI;
const saltRounds = 12;

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({ origin: "http://localhost:3000" }));

app.post('/login', async (req, res, next) => {
    // console.log(req.body);
    try {
        const client = new MongoClient(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        const db = client.db('Project');
        const data = req.body.user === '' ? 
                    await db.collection('logins').findOne({email:req.body.email})
                    : await db.collection('logins').findOne({user:req.body.user})
        // console.log(data);
        if(!data) next( new Error("ID or Password is wrong"))
        else {
            // console.log(data);
            const result = await bcrypt.compare(req.body.passwd, data.passwd)
            if(!result) next( new Error("ID or Password is wrong"))
            // req.body = JSON.parse(req.body)
            // console.log(req.body.user, '/', req.body.passwd);
            // res.send({token:req.body.user})
            else {
                res.send({
                    token : result,
                    userid: data._id,
                    error:false
                    // userid: data.user.slice(data.user.length / 2) + data._id.slice.toString().slice(0,data._id.slice.toString().length / 2)
                })
            }
            res.end()
        }
        client.close()
    } catch(err) {
        next(err);
    }
});

app.post('/signup', (req, res, next) => {
    const client = new MongoClient(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    bcrypt.hash(req.body.passwd, saltRounds)
    .then(hash => {
            const credentials = {
            user: req.body?.user,
            passwd: hash,
            email:req.body?.email
        }
        return credentials;
    })
    .then(async credentials => {
        const db = client.db('Project');
        // console.log("L");
        const result = await db.collection('logins').findOne({email:credentials.email})
        if(result) {
            next(new Error('Email already exists'))
        }
        else if( await db.collection('logins').findOne({user:credentials.user})) {
            next(new Error('User already exists'))
        }
        else {
            db.collection('logins').insertOne(credentials)
            .catch(err => console.log(err.toString()))
            // console.log(data);
            // req.body = JSON.parse(req.body)
            // console.log(req.body.user, '/', req.body.passwd);
            // res.send({token:req.body.user})
            // res.send({token:data.passwd === credentials.passwd})
            res.end({
                error:false
            }.toString())
        }
        client.close()
    })
    .catch(err => { 
        // console.log(err.toString());
        next(err)
    })
})

app.post('/save', async (req, res, next) => {
    try {
        console.log("L")

        const client = new MongoClient(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        const db = client.db('Project')
        const body = {
            title:req.body.title,
            url_image:req.body.url_image,
            url:req.body.url,
            description:req.body.description,
            content:req.body.content
        }
        const user = await db.collection('logins').findOne({_id:ObjectId(req.body.user)})
        // console.log(req.body.user);
        // console.log(user);
        const response = await db.collection('data').updateOne(
            {user: user?.user},
            { $push: { data : body } },
            { upsert: true}
        )
        // console.log(response);
        if(!response.acknowledged) next(new Error("Could not update"))
        else 
            res.send({
                error: false,
                message: "Updated"
            }).end()
        client.close()
    } catch(err) {
        console.log(err.toString());
        next(err)
    }
})

app.get('/head', async (req, res, next) => {
    
    try {

        const newsapi = new newsApi(process.env.API_KEY_2);
        // To query /v2/top-headlines
        // All options passed to topHeadlines are optional, but you need to include at least one of them
        newsapi.v2.topHeadlines({
        // sources: 'bbc-news,the-verge',
        // q: 'bitcoin',
        category: req.query.category,
        // language: 'en',
        country: req.query.country,
        page: req.query.page,
        pageSize: 20,
        }).then(response => {
            let body = {
                error:false,
                body:response
            }
        // console.log(response);
            res.send(body)
            res.end()
        });
    } catch(err) {
        next(err);
    }
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

app.get('/everything', async (req, res, next) => {
       
    try {
        const newsapi = new NewsAPI(process.env.API_KEY_2);
        // console.log(req.query.query);
        const body = await newsapi.v2.everything({
                q:req.query.query,
                page: req.query.page,
                pageSize: 20,
            })
        let response = {
            error:false,
            body:body
        }
        res.send(response)
        res.end()
    } catch(err) {
        next(err);
    }
})

app.get('/memes', async (req, res, next) => {
    try {
        const url = process.env.COMIC_URL
        const api = process.env.COMIC_API_2
        const result = `${url}?api-key=${api}&number=10&offset=${req.query.page}`
        console.log(result);
        // const body = await axios.get(result)
        const body = await axios.get(`${url}?api-key=${api}&number=10&offset=${req.query.page}`)
        // const body = await axios.get('https://api.humorapi.com/memes/search?api-key=e1b16e2f50c040408d39d6a371b31395&number=10&offset=2')
        console.log(body);
        res.send(body.data.toString()).end()
    } catch(err) {
        next(err)
    }
})

app.get('/sources', async (req, res, next) => {
    try {
        const newsapi = new NewsAPI(process.env.API_KEY_2);
        console.log(req.query.query);
        console.log(req.query.sources);
        const body = await newsapi.v2.everything({
                q:req.query.query,
                sources:req.query.sources === '' ? 'bbc-news' : req.query.sources,
                page: req.query.page,
                pageSize: 20,
            })
        let response = {
            error:false,
            body:body
        }
        res.send(response)
        res.end()
    } catch(err) {
        next(err);
    }
})

app.use((err, req, res, next) => {
    // console.error(err.stack)
    res.send({error:err.toString(),token:false}).end()
})

app.listen(PORT, () => 
    console.log(`Server running at port ${PORT}`));
