import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import AddCartIcon from '@material-ui/icons/AddShoppingCart'
import DisabledCartIcon from '@material-ui/icons/RemoveShoppingCart'
import cart from './cart-helper.js'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  iconButton: {
    width: 50,
    height: 50,
    padding: '10px 12px',
    borderRadius: '0.25em',
    // backgroundColor: '#5f7c8b',
    // color: '#b2ff59',
    backgroundColor: '#4a10a3',
  },
  iconButtonActive: {
    width: 50,
    height: 50,
    padding: '10px 12px',
    borderRadius: '0.25em',
    backgroundColor: '#5f7c8b',
    // color: '#7f7563',
    // backgroundColor: '#b2ff59',
  },
  addCart: {
    // float: 'right',
    width: 50,
    height: 50,
    padding: '10px 12px',
    borderRadius: '0.25em',
    backgroundColor: '#5f7c8b',
    // zIndex: 2500
  }
}))

export default function AddToCart(props) {
  const classes = useStyles()
  const redirect = false;
  const [index, setIndex] = useState(cart.findById(props.item._id))

  useEffect(() => {
    setIndex(cart.findById(props.item._id))
    // console.log('[01]index:' + index)
  }, [])

  const addToCart = () => {
    // alert('[02]index:' + index)
    if (+index >= 0) {
      cart.increasQuantity(index)
      // setRedirect({ redirect: true })
      setIndex(index)
    }
    else {
      cart.addItem(props.item,
        () => {
          const index = cart.findById(props.item._id)
          setIndex(index)
          // setRedirect({ redirect: true })
        }
      )
    }
    redirect = true;
  }

  const removeFromCart = () => {
    // alert('[03]index:' + index)
    cart.removeItem(index)
    setIndex(-1)
    redirect = true;

  }

  if (redirect) {
    return (<Redirect to={'/'} />)
  }
  return (
    <span>{
      (index == -1) ? (
        <IconButton color="secondary" dense="dense" onClick={addToCart}>
          <AddCartIcon
            className={classes.iconButton} />
        </IconButton>
      ) : (
          <IconButton color="secondary" dense="dense" onClick={removeFromCart}>
            <DisabledCartIcon className={classes.iconButtonActive} />
          </IconButton>
        )
    }</span>
  )
}

AddToCart.propTypes = {
  item: PropTypes.object.isRequired,
  cartStyle: PropTypes.string
}