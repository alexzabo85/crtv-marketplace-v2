import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { Link } from 'react-router-dom'
import ViewIcon from '@material-ui/icons/Visibility'
import Icon from '@material-ui/core/Icon'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
import AddToCart from './../cart/AddToCart'
import UpdateCart from './../cart/UpdateCart'
// import Card, { CardContent, CardMedia, CardActions } from 'material-ui/Card'
import cart from '../cart/cart-helper.js'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    paddingBottom: 24,
    backgroundColor: '#80808024'
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: '1.1em'
  },
  viewButton: {
    verticalAlign: 'middle'
  },
  card: {
    // width: '100%',
    // display: 'inline-flex',
    width: 'auto',
    margin: '24px 0px',
    // padding: '16px 40px 60px 40px',
    backgroundColor: '#80808017'
  },
  cart: {
    width: '100%',
    display: 'inline-flex'
  },
  details: {
    display: 'inline-block',
    width: "100%"
  },
  content: {
    flex: '1 0 auto',
    padding: '16px 8px 0px'
  },
  cover: {
    width: 150,// '65%',
    height: 100,
    margin: '8px'
  },
  controls: {
    // marginTop: '8px'
    right: '8px'
  },
  date: {
    color: 'rgba(0, 0, 0, 0.4)'
  },
  icon: {
    verticalAlign: 'sub'
  },
  iconButton: {
    width: '28px',
    height: '28px'
  },
  productTitle: {
    // fontSize: '1.5rem',
    marginBottom: '5px'
  },
  subheading: {
    color: 'rgba(88, 114, 128, 0.67)'
  },
  actions: {
    float: 'left',
    marginRight: '6px'
  },
  price: {
    display: 'inline',
    lineHeight: '3',
    paddingLeft: '8px',
    color: theme.palette.text.secondary
  },
  addCart: {
    // float: 'right',
    width: 50,
    height: 50,
    padding: '10px 12px',
    borderRadius: '0.25em',
    backgroundColor: '#5f7c8b',
    // zIndex: 2500
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: 12,
    width: 50,
    fontSize: 'inherit',
  },
  removeButton: {
    fontSize: '0.8em',
    marginBottom: '8px'
  }
}))

export default function Suggestions(props) {
  const classes = useStyles()
  const handleChange = index => event => { }
  const removeItem = index => event => { }
  return (
    // <Paper className={classes.root} elevation={4}>
    <Card className={classes.card}>
      <span>
        {props.products.map((item, i) => {
          const idx = cart.findById(item._id)
          const el = { quantity: idx >= 0 ? cart.getCart()[idx].quantity : 0 };
          // console.log('[SG55]' + el.quantity)
          return (
            <span key={i} >
              <Card className={classes.cart}>
                <CardMedia
                  className={classes.cover}
                  image={'/api/product/image/' + item._id}
                  title={item.name}
                />
                <div className={classes.details}>
                  <CardContent className={classes.content}>
                    <Typography
                      variant="h6"
                      component="h6"
                      className={classes.productTitle}
                      color="primary"
                    >{item.name}
                    </Typography>
                  </CardContent>

                </div>
                <CardActions className={classes.actions} >
                  <div className={classes.controls}>
                    <UpdateCart
                      cartStyle={classes.addCart}
                      item={item}
                    />
                    {/* <AddToCart
                      cartStyle={classes.addCart}
                      item={item}
                    /> */}
                  </div>
                </CardActions>
              </Card>
              <Divider />
            </span>
          )
        })}
      </span>
    </Card >
  )
}

Suggestions.propTypes = {
  products: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
}
