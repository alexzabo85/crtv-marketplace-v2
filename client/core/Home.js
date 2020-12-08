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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  }
}))
// shop.list()
// auth.isAuthenticated().user._id

export default function Home() {
  const classes = useStyles()
  const [suggestionTitle, setSuggestionTitle] = useState("רשימת מוצרים")
  const [categories, setCategories] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [shopId, setShopId] = useState('')
  // let shop = {}
  // let shopId = "";

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    shopApi.list(signal).then((data) => {
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
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  // useEffect(() => {
  //   const abortController = new AbortController()
  //   const signal = abortController.signal
  //   listCategories(signal).then((data) => {
  //     if (data.error) {
  //       console.log(data.error)
  //     } else {
  //       setCategories(data)
  //     }
  //   })
  //   return function cleanup() {
  //     abortController.abort()
  //   }
  // }, [])

  return (
    <div className={classes.root}>
      <img
        align="center"
        src={"/api/shops/logo/" + shopId} width="56%"
      />

      <Grid container spacing={2}>
        {/* <Grid item xs={8} sm={8}>
          <Search categories={categories} />
          <Categories categories={categories} />
        </Grid> */}
        <Grid item xs={12}>
          <Suggestions products={suggestions} title={suggestionTitle} />
        </Grid>
      </Grid>
    </div>
  )
}


