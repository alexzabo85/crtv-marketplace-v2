import React, { useState, useEffect } from 'react'
// import Card from '@material-ui/core/Card'
// import CardActions from '@material-ui/core/CardActions'
// import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/auth-helper'
import { Redirect } from 'react-router-dom'
import { signin } from './api-auth.js'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import {
  Card,
  CardContent,
  CardMedia,
  CardActions
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'

import shop from '../shop/shop-helper.js'
import * as shopApi from '../shop/api-shop'


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  bizCardRoot: {
    // display: 'flex',
    // justifyContent: 'center',
    // maxWidth: 600,
    // padding: 100,
    // margin: '100'
    // maxHeight: 300,

  },
  bizCardDetails: {
    // display: 'flex',
    // flexDirection: 'column',
  },
  bizCardContent: {
    flex: '1 0 auto',
  },
  bizCover: {
    width: 100,
  },
  imgItem: {
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    width: 100,
  },
  container: {
    display: 'grid',
    margin: '30'
  },
}))

let shopDetails;

export default function Signin(props) {
  const classes = useStyles()
  const [values, setValues] = useState({
    accountNumber: '',
    password: '',
    error: '',
    redirectToReferrer: false
  })

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    // console.log('wellcome to useEffect: ' + shopDetails)

    shopDetails = shop.get()

    // console.log('shopDetails: ' + JSON.stringify(shopDetails))

    if (!shopDetails) {
      shopApi.list(signal).then((data) => {
        if (!data || data.error) throw `Error call shopApi.list: ${data}`
        shopDetails = { ...data[0] }
        shop.update({ ...shopDetails })
        // await new Promise((resFunc, rejFunc) => { shop.update({ ...shopDetails }, resFunc) }) // cart.emptyCart()
        return true;
      })
        .catch((err) => { console.log(err) })
    } else {
    }
    return function cleanup() {
      abortController.abort()
    }
  }, [])

  const clickSubmit = () => {
    const user = {
      accountNumber: values.accountNumber || undefined,
      password: values.password || undefined
    }

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '', redirectToReferrer: true })
        })
      }
    })
  }

  const handleChange = name => event => setValues({ ...values, [name]: event.target.value })

  const { from } = props.location.state || { from: { pathname: '/' } }

  const { redirectToReferrer } = values
  if (redirectToReferrer) {
    alert(from.pathname)
    return (<Redirect to={from} />)
  }



  return (
    <div className={classes.root}>

      <Grid container className={classes.container} justify="center" spacing={2}>
        <Grid item >
          <span variant="outlined">
            <img className={classes.img} src={"/api/shops/logo/5fd5f478bcc7941b24292a7d"} />
          </span>
        </Grid>
        <Grid item >
          <Card className={classes.card} elevation={4}>
            <CardContent>
              <Typography variant="h5" className={classes.title}>
                כניסה
          </Typography>
              {/* <TextField id="email" type="email" label="דואר אלקטרוני" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal" /><br /> */}
              <TextField id="accountNumber" label="חשבון" className={classes.textField} value={values.accountNumber} onChange={handleChange('accountNumber')} margin="normal" /><br />
              <TextField id="password" type="password" label="סיסמה" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal" />
              <br /> {
                values.error && (<Typography component="p" color="error">
                  <Icon color="error" className={classes.error}>error</Icon>
                  {values.error}
                </Typography>)
              }
            </CardContent>
            <CardActions>
              <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>שלח</Button>
            </CardActions>
            <Typography >
              <Link to="/signup">
                <Button >
                  הירשם כאן
            </Button>
              </Link>

            </Typography>
          </Card>
        </Grid >
      </Grid >
    </div>
  )
}


