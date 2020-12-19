import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import AddCartIcon from '@material-ui/icons/AddShoppingCart'
import DisabledCartIcon from '@material-ui/icons/RemoveShoppingCart'
import cart from './cart-helper.js'
import { Redirect } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box';

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
  },
  box: {
    display: 'flex',
    // width: 50,
    // height: 50,
    // margin: '5px',
    // padding: '10px',
    // borderRadius: '0.25em',
    // backgroundColor: '#5f7c8b',
    // zIndex: 2500
  },
  textField: {
    display: 'flex',
    // width: 50,
    // height: 50,
    margin: '5px',
    padding: '10px',
    // borderRadius: '0.25em',
    // backgroundColor: '#5f7c8b',
    // zIndex: 2500
  }
}))

export default function UpdateCart(props) {
  const classes = useStyles()
  let redirect = false;

  const [index, setIndex] = useState(cart.findById(props.item._id)) //in cart index
  const [quantity, setQuantity] = useState(props.q)

  const handleChange = event => {
    // const cartIndex = cart.findById(props.item._id)
    const cartIndex = index
    console.log('[UC88]cartIndex: ' + cartIndex + ' value: ' + event.target.value)

    if (event.target.value === '0' && cartIndex >= 0) {
      cart.removeItem(cartIndex)
      // setIndex(-1)
      // setQuant(0)
    } else if (event.target.value > 0 && cartIndex >= 0) {
      cart.updateCart(cartIndex, event.target.value)
      setIndex(cartIndex)
    } else if (event.target.value && cartIndex < 0) {
      cart.addItem({ ...props.item, quantity: event.target.value }, () => {
        const cartIndex = cart.findById(props.item._id)
        setIndex(cartIndex)
      })
    }
    console.log('[UC65] onBlur/' + cartIndex)
    redirect = true
  }

  if (redirect) {
    // return (<Redirect to={'/'} />)
  }
  return (
    // <span>{
    <Box className={classes.box}>
      <TextField
        className={classes.textField}
        // id="standard-basic"
        defaultValue={cart.getCart()[index] && cart.getCart()[index].quantity || 0}
        // onChange={() => console.count('[UC65] onChange/' + index)}
        // onChange={handleChange}
        onBlur={handleChange}
        type="number"
        margin="normal"
        inputProps={{
          // value: qq,
          min: 0
        }}
      />
      {/* <TextField
        className={classes.textField}
        // id="standard-basic"
        // value={console.count(`[UC70]${cart.findById(props.item._id)}/${cart.getCart.length}`)}
        // onChange={() => console.count('[UC65] onChange/' + index)}
        // onChange={handleChange}
        onBlur={handleChange}
        type="number"
        margin="normal"
        inputProps={{
          // value: qq,
          min: 0
        }}
      /> */}
    </Box>
    // null && (index == -1) ? (
    // <IconButton color="secondary" dense="dense" onClick={addToCart}>
    //   <AddCartIcon
    //     className={classes.iconButton} />
    // </IconButton>
    // ) : (
    // <IconButton color="secondary" dense="dense" onClick={removeFromCart}>
    //   <DisabledCartIcon className={classes.iconButtonActive} />
    // </IconButton>
    //   )
    // }</span>
  )
}

UpdateCart.propTypes = {
  item: PropTypes.object.isRequired,
  cartStyle: PropTypes.string
}