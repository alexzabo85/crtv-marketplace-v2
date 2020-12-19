import React, { useState } from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
// import auth from './../auth/auth-helper'
// import { remove } from './api-product.js'

export default function ConfirmOrder(props) {

  return (<span>
    <Dialog open={true} onClose={props.handleRequestClose}>
      <DialogTitle>{"נא לאשר שליחת הזמנה "}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {/* {props.product.name} */}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleRequestClose} color="primary">
          ביטול
          </Button>
        <Button onClick={props.confirmFunction} color="primary" autoFocus="autoFocus">
          מאשר שליחה
          </Button>
      </DialogActions>
    </Dialog>
  </span >)

}
// DeleteProduct.propTypes = {
//   shopId: PropTypes.string.isRequired,
//   product: PropTypes.object.isRequired,
//   onRemove: PropTypes.func.isRequired
// }

