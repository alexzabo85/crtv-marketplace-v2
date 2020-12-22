import { Order, CartItem } from '../models/order.model'
import User from '../models/user.model'
import errorHandler from './../helpers/dbErrorHandler'
import axios from 'axios'
import crypto from 'crypto'


const sendOrder = async (req, res) => {

  let user;
  let order;
  let result;
  const data = {
    "header": {
      // "documentId": 2030,
      // "docNo": 2001,
      // "accountId": 1234,
      // "accountName": "accountName",
      // "address": "address",
      // "city": "city",
      // "contact": "contact",
      // "phone1": "054-4444444",
      // "phone2": "055-4443332",
      // "phone3": null,
      // "phone4": null,
      // "subjectId": 0,
      // "agentId": 0,
      // "agentName": "agentName",
      // "notes": "notes",
      // "storeNo": 1,
      // "asmac": null,
      // "provisionDate": null,
      // "returnDate": null,
      // "systemStatus": 0,
      // "status": null,
      // "subTotal": 100,
      // "discount": 10,
      // "totalBeforeVat": 90,
      // "vat": 10,
      // "total": 100,
      // "paid": 30,
      // "createdDate": null,
      // "updatedDate": null
    },
    "body": [{
      // "lineNo": 0,
      // "itemId": "item1",
      // "itemName": "itemName",
      // "barcode": "barcode",
      // "auxcode": "auxcode",
      // "color": "color",
      // "notes": "notes",
      // "provisionDate": null,
      // "length": 10,
      // "width": 10,
      // "thickness": 0,
      // "weight": 1.2,
      // "packType": null,
      // "packsInLot": null,
      // "unitsInPack": null,
      // "quantity": 0,
      // "unitPriceBeforeVAT": 0,
      // "unitPrice": 0,
      // "discount": 0,
      // "salePriceBeforeVAT": 0
    }]
  };

  data.body = req.body.order.map(item => ({
    itemId: item.product.description, // TODO: change 'description' to itemId in product model
    itemName: item.product.name,
    quantity: item.quantity
  }))

  try {
    user = await User.findById(req.auth._id).lean() //.exec()
  }
  catch (err) {
    return res.status(400).json({ err })
  }

  try {
    // req.body.order.user = req.profile
    order = new Order({
      products: data.body,
      customer_name: user.name,
      documentId: 0,
      status: '',
      header: {},
      body: {}
    })
    result = await order.save()

    const hexId = parseInt(result._id.toHexString().slice(-8), 16)

    // console.log('[OC.8] hexId: ', hexId)
    result = await Order.findById(result._id).exec()

    // console.log('[OC.7]  result.documentId: ', result.documentId)
    result.documentId = hexId;

    // console.log('[OC.7]  result.documentId: ', result.documentId)


    data.header.accountId = user.accountNumber // TODO: get the accountId from user profile field
    data.header.documentId = hexId
    data.header.accountName = user.accountName

    // data.body = [req.body.order]


    const config = {
      method: 'post',
      url: 'http://62.90.195.19:59312/order',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJicm9rZXJOYW1lIjoiQnJva2VyXzIwODQyMzM2OF9RQSIsInJvbGUiOiJCcm9rZXIifQ.J6DAc-doWTdwHvc5ym28V5bUi87uLP6d6ecNFtsrk2M'
      },
      data: JSON.stringify(data)
    };

    axios(config)
      .then(async (response) => {
        // const v = JSON.stringify(response.data)
        // console.log('manager: ', v);
        // console.log('[OC.5] response.data: ', response.data)
        result.status = '' + response.data;
        result = await result.save()
        // console.log('[OC.5] result._id, data.header.documentId: ', result._id, data.header.documentId)
        // order.header = data.header
        // order.body = data.body
        // result.documentId = data.header.documentId
        // await result.save()
        // Order.findById(result._id)
        // Order.findByIdAndUpdate(result._id, { documentId: data.header.documentId }).exec()
        res.status(200).json({
          db: result._id,
          documentId: result.documentId,
          status: response.data
        })
      })
      .catch(function (error) {
        // result.status = '' + response.data;
        // result = await result.save()

        console.log('error.message: ' + error.message);
        return res.status(400).json(error)
      });


  }
  catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
  // req.body.header.documentId = result._id;
  // const newBody = { ...req.body };
  // console.log('axios hello', req.body)
  // res.status(200).json({ mgs: "ok" })
  // var data = JSON.stringify({ "header": { "documentId": req.body.header.documentId, "docNo": 2001, "accountId": 1234, "accountName": "accountName", "address": "address", "city": "city", "contact": "contact", "phone1": "054-4444444", "phone2": "055-4443332", "phone3": null, "phone4": null, "subjectId": 0, "agentId": 0, "agentName": "agentName", "notes": "notes", "storeNo": 1, "asmac": null, "provisionDate": null, "returnDate": null, "systemStatus": 0, "status": null, "subTotal": 100, "discount": 10, "totalBeforeVat": 90, "vat": 10, "total": 100, "paid": 30, "createdDate": null, "updatedDate": null }, "body": [{ "lineNo": 0, "itemId": "item1", "itemName": "itemName", "barcode": "barcode", "auxcode": "auxcode", "color": "color", "notes": "notes", "provisionDate": null, "length": 10, "width": 10, "thickness": 0, "weight": 1.2, "packType": null, "packsInLot": null, "unitsInPack": null, "quantity": 0, "unitPriceBeforeVAT": 0, "unitPrice": 0, "discount": 0, "salePriceBeforeVAT": 0 }] });

}

const create = async (req, res) => {
  try {
    // let sendOrderResult = await sendOrder(req, res);
    req.body.order.user = req.profile
    let order = new Order(req.body.order)
    let result = await order.save()
    // console.log('[OC.1]result._id: ', result)
    res.status(200).json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByShop = async (req, res) => {
  try {
    let orders = await Order.find({ "products.shop": req.shop._id })
      .populate({ path: 'products.product', select: '_id name price' })
      .sort('-created')
      .exec()
    res.json(orders)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let order = await Order.updateOne({ 'products._id': req.body.cartItemId }, {
      'products.$.status': req.body.status
    })
    res.json(order)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const getStatusValues = (req, res) => {
  res.json(CartItem.schema.path('status').enumValues)
}

const orderByID = async (req, res, next, id) => {
  try {
    let order = await Order.findById(id).populate('products.product', 'name price').populate('products.shop', 'name').exec()
    if (!order)
      return res.status('400').json({
        error: "Order not found"
      })
    req.order = order
    next()
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByUser = async (req, res) => {
  try {
    let orders = await Order.find({ "user": req.profile._id })
      .sort('-created')
      .exec()
    res.json(orders)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const read = (req, res) => {
  return res.json(req.order)
}

export default {
  create,
  sendOrder,
  listByShop,
  update,
  getStatusValues,
  orderByID,
  listByUser,
  read
}
