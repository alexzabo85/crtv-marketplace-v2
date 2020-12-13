import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Suggestions from './../product/Suggestions'
import { listLatest, listCategories } from './../product/api-product.js'
import Search from './../product/Search'
import Categories from './../product/Categories'
import auth from '../auth/auth-helper'
import * as shopApi from '../shop/api-shop'
import * as productApi from '../product/api-product'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import productListHelper from '../product/product-helper.js'
import { Card, CardContent, CardMedia } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  bizLogo: theme.mixins.gutters({
    padding: theme.spacing(1),
    paddingBottom: 24,
    margin: '8px',
    backgroundColor: '#80808024'
  }),
  bizCardRoot: {
    display: 'flex',

  },
  bizCardDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  bizCardContent: {
    flex: '1 0 auto',
  },
  bizCover: {
    width: 151,
  },
}))
// shop.list()
// auth.isAuthenticated().user._id

let count = 0;
let productList = [];
let shopId = '';
let shopDetails;

export default function Home() {
  const classes = useStyles()
  const [suggestionTitle, setSuggestionTitle] = useState("רשימת מוצרים")
  const [categories, setCategories] = useState([])
  const [suggestions, setSuggestions] = useState([])
  // const [shopId, setShopId] = useState('')

  // let shop = {}
  // let shopId = "";

  useEffect(() => {
    /**
     * new functin is generated and called on each router entery.
     * cntLocal will never increase its value
     */
    // console.log("call: Home useEffect")
    const abortController = new AbortController()
    const signal = abortController.signal
    let shopIdLocal = ''
    let cntLocal = 0

    // alert(count++)
    // alert(`productList.length=${productList.length}`);
    console.log('home', 'useEffect: ' + cntLocal++);

    if (!productList.length) {
      console.log('calling db for list');
      shopApi.list(signal)
        .then((data) => {
          if (!data || data.error) {
            throw `Error call shopApi.list: ${data}`
          }
          shopId = data[0]._id;
          shopDetails = data[0]
          // shopIdLocal = data[0]._id;
          // setShopId(shopIdLocal)
          return true;
        })
        .then(() => {
          // alert(shopId)
          // console.count('home');
          return productApi.listByShop({ shopId: shopId }, signal);
        })
        .then((receivedProductsList) => {
          // alert(shopId)
          // console.count('home');
          productList = [...receivedProductsList]
          setSuggestions(productList)

          // console.dir(receivedProductsList[0])

        })
        .catch((err) => { console.log(err) })
    } else {
      setSuggestions(productList)
    }

    null && shopApi.list(signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        const shopIdLocal = data[0]._id;
        setShopId('' + shopIdLocal)
        productApi.listByShop({ shopId: shopIdLocal }, signal).then((productsList) => {
          if (productsList.error) {
            console.log(productsList.error)
          } else {
            setSuggestions(productsList)
          }
        })
      }
    }).catch((err) => { alert(err) })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <div className={classes.root}>
      { suggestions && suggestions.length ? (
        <Grid container justify="center" spacing={2}>
          {/* <Grid item xs={8} sm={8}>
          <Search categories={categories} />
          <Categories categories={categories} />
        </Grid> */}
          <Grid item xs={6} >
            {null && <Card className={classes.bizLogo} elevation={4}>
              <img
                align="center"
                src={"/api/shops/logo/" + shopId}
                width="150px"
              />
            </Card>}

            <Card className={classes.bizCardRoot}>
              <CardMedia
                className={classes.bizCover}
                image={"/api/shops/logo/" + shopId}
                // image="/static/images/cards/live-from-space.jpg"
                // src={"/api/shops/logo/" + shopId}
                title="Shop Logo"
              />
              <div className={classes.bizCardDetails}>
                <CardContent className={classes.bizCardContent}>
                  <Typography component="h5" variant="h5">
                    {shopDetails.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {shopDetails.address}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {shopDetails.phone}
                  </Typography>
                </CardContent>
              </div>

            </Card>
          </Grid>
          <Grid item xs={12} sm={11}>
            <Suggestions products={suggestions} title={suggestionTitle} />
          </Grid>
        </Grid>
      ) : (
          <Paper className={classes.bizLogo} elevation={4}>
            <Typography variant="subtitle1" component="h3" color="primary"> טוען נתונים...</Typography>
          </Paper>
        )
      }
    </div>
  )
}


