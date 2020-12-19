const shop = {
  update(details) {
    let shopDetails = {}
    if (typeof window !== "undefined") {
      if (localStorage.getItem('shop')) {
        shopDetails = JSON.parse(localStorage.getItem('shop'))
      }
      shopDetails = { ...shopDetails, ...details }
      localStorage.setItem('shop', JSON.stringify(shopDetails))

    }
  },

  get() {
    if (typeof window !== "undefined") {
      if (localStorage.getItem('shop')) {
        return JSON.parse(localStorage.getItem('shop'))
      }
    }
    return {}
  },

  emptyCart(cb) {
    if (typeof window !== "undefined") {
      localStorage.removeItem('cart')
      cb()
    }
  },

}

export default shop
