import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { Box, Card, CardContent, CardMedia } from '@material-ui/core'
import CartIcon from '@material-ui/icons/ShoppingCart'
import Fab from '@material-ui/core/Fab';
import * as shopApi from '../shop/api-shop'
import * as productApi from '../product/api-product'
import shop from '../shop/shop-helper.js'
import Suggestions from './../product/Suggestions'
// import Button from '@material-ui/core/Button'
// import productListHelper from '../product/product-helper.js'
// import Search from './../product/Search'
// import Categories from './../product/Categories'
// import auth from '../auth/auth-helper'
// import { listLatest, listCategories } from './../product/api-product.js'

const useStyles = makeStyles(theme => ({
  root: {
    // flexGrow: 1,
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
    // display: 'flex',
    // flexDirection: 'column',
  },
  bizCardContent: {
    flex: '1 0 auto',
  },
  bizCover: {
    width: 151,
  },
  fab: {
    margin: 0,
    top: 'auto',
    left: 'auto',
    bottom: 20,
    right: 20,
    position: 'fixed'
  }
}))

let productList = [];
let shopDetails;

export default function Home() {
  const classes = useStyles()
  const [suggestionTitle, setSuggestionTitle] = useState("רשימת מוצרים")
  const [categories, setCategories] = useState([])
  const [suggestions, setSuggestions] = useState([])
  // const [shopDetails, setShopDetails] = useState({}) //note: this will not work
  // let shopDetails; //note: this will not work

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    if (!suggestions.length) {
      shopApi.list(signal).then((data) => {
        if (!data || data.error) {
          throw `Error call shopApi.list: ${data}`
        }
        shopDetails = { ...data[0] }
        shop.update({ ...shopDetails })
        // await new Promise((resFunc, rejFunc) => { shop.update({ ...shopDetails }, resFunc) }) // cart.emptyCart()
        return true;
      })
        .then(() => {
          return productApi.listByShop({ shopId: shopDetails._id }, signal);
        })
        .then((receivedProductsList) => {
          productList = [...receivedProductsList]
          setSuggestions(productList)
        })
        .catch((err) => { console.log(err) })
    } else {
    }
    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <div className={classes.root}>
      <Fab className={classes.fab} href='/cart'>
        <CartIcon />
      </Fab>
      { //console.log('productList.length:' + JSON.stringify(productList.length)) &&
        // console.log('suggestions.length:' + JSON.stringify(suggestions.length)) &&
        suggestions && suggestions.length ? (
          <Grid container justify="center" spacing={2}>
            {/* <Grid item xs={8} sm={8}>
          <Search categories={categories} />
          <Categories categories={categories} />
        </Grid> */}
            <Grid item xs={12} sm={10} md={6}>
              <Card className={classes.bizCardRoot}>
                <CardMedia
                  className={classes.bizCover}
                  image={"/api/shops/logo/" + shopDetails._id}
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
        ) : (<Paper className={classes.bizLogo} elevation={4}>
          <Typography variant="subtitle1" component="h3" color="primary"> טוען נתונים...</Typography>
        </Paper>)
      }
    </div >
  )
}


