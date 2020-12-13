const productListHelper = {
  // const count = 0
  // itemTotal() {
  //   if (typeof window !== "undefined") {
  //     if (localStorage.getItem('cart')) {
  //       return JSON.parse(localStorage.getItem('cart')).length
  //     }
  //   }
  //   return 0
  // },
  // addItem(item, cb) {
  //   let cart = []
  //   if (typeof window !== "undefined") {
  //     if (localStorage.getItem('cart')) {
  //       cart = JSON.parse(localStorage.getItem('cart'))
  //     }
  //     cart.push({
  //       product: item,
  //       quantity: 1,
  //       shop: item.shop._id
  //     })
  //     localStorage.setItem('cart', JSON.stringify(cart))
  //     cb()
  //   }
  // },
  // updateCart(itemIndex, quantity) {
  //   let cart = []
  //   if (typeof window !== "undefined") {
  //     if (localStorage.getItem('cart')) {
  //       cart = JSON.parse(localStorage.getItem('cart'))
  //     }
  //     cart[itemIndex].quantity = quantity
  //     localStorage.setItem('cart', JSON.stringify(cart))
  //   }
  // },
  // getproductList() {
  //   if (typeof window !== "undefined") {
  //     if (localStorage.getItem('cart')) {
  //       return JSON.parse(localStorage.getItem('cart'))
  //     }
  //   }
  //   return []
  // },
  count: 0,
  addProduct(item, cb) {
    if (typeof window !== "undefined") {
      if (localStorage.getItem('products')) {
        items = JSON.parse(localStorage.getItem('products'));
      }
      items.push(item);
      localStorage.setItem('products', JSON.stringify(items));
      cb();
    }
  },

  initList(items, cb) {
    if (typeof window !== "undefined") {
      // if (localStorage.getItem('products')) {
      //   items = JSON.parse(localStorage.getItem('products'));
      // }
      // items.push(item);
      localStorage.setItem('products', JSON.stringify(items));
      cb();
    }
  },


  getList() {
    if (typeof window !== "undefined") {
      if (localStorage.getItem('products')) {
        return JSON.parse(localStorage.getItem('products'))
      }
    }
    return []
  },
  // removeItem(itemIndex) {
  //   let cart = []
  //   if (typeof window !== "undefined") {
  //     if (localStorage.getItem('cart')) {
  //       cart = JSON.parse(localStorage.getItem('cart'))
  //     }
  //     cart.splice(itemIndex, 1)
  //     localStorage.setItem('cart', JSON.stringify(cart))
  //   }
  //   return cart
  // },
  emptyProductList(cb) {
    if (typeof window !== "undefined") {
      localStorage.removeItem('products')
      cb()
    }
  }
}

export default productListHelper
