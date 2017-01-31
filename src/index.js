'use strict'
require('dotenv').config({silent: true})

const Twitter = require('twitter')
const express = require('express')
const knex = require('knex')
const dbConfig = require('../knexfile')

const app = express()
app.use(require('morgan')('short'))

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})
const db = knex(dbConfig)

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3322

const buildUrl = ({ user, id }) => `http://twitter.com/${user.screen_name}/status/${id}`

function parseTweets(lastTweet = null) {
  let q = '@ddebow'
  let attrs = {
    q,
    result_type: 'recent',
  }

  if (lastTweet) {
    attrs = Object.assign(
      attrs,
      { since_id: lastTweet }
    )
  }

  client.get(`search/tweets`, attrs, (err, { statuses }) => {
    if (err) console.log(err)

    statuses.forEach(tweet => {
      let url = buildUrl(tweet)
      db('urls').insert({
        username: tweet.user.screen_name,
        url: url
      })
    })
  })

  // Wait 30 mins and try again
  setTimeout(parseTweets.bind(this, lastTweet), 1000 * 60 * 15)
}

app.get('/tweets', (req, res) => {
  db('urls')
    .select()
    .then((data) => {
      console.log(data)
      res.send({ data })
    })
    .catch(e => console.error(e))
})

app.listen(PORT, function(err) {
  if (err) return err

  console.log('⚡  RUNNING AT localhost:' + PORT)
  parseTweets()
})
