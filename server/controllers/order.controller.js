import { Order, CartItem } from '../models/order.model'
import errorHandler from './../helpers/dbErrorHandler'
import axios from 'axios'
import crypto from 'crypto'


const sendOrder = async (req, res) => {

  /**
   * 
   * create new order db(or get exsiting?)
   * calculate documentId 
   * set the serial number (derived from _id in db)
   * create new order object (manager api)
   * send to manager
   * set status true in order db
   * 
   */
  // console.log('[OC.2] sendOrder: ')
  let order;
  let result;
  try {
    // req.body.order.user = req.profile
    order = new Order({
      products: [req.body.order],
      customer_name: 'req.profile' + Date().toString(),
      serial: 0,
      status: '',
      header: {},
      body: {}
    })
    result = await order.save()

    const hexId = parseInt(result._id.toHexString().slice(-4), 16)

    // console.log('[OC.8] hexId: ', hexId)
    result = await Order.findById(result._id).exec()

    // console.log('[OC.7]  result.serial: ', result.serial)
    result.serial = hexId;

    // console.log('[OC.7]  result.serial: ', result.serial)

    const data = {
      "header": {
        "documentId": 2030, "docNo": 2001, "accountId": 1234, "accountName": "accountName", "address": "address", "city": "city", "contact": "contact", "phone1": "054-4444444", "phone2": "055-4443332", "phone3": null, "phone4": null, "subjectId": 0, "agentId": 0, "agentName": "agentName", "notes": "notes", "storeNo": 1, "asmac": null, "provisionDate": null, "returnDate": null, "systemStatus": 0, "status": null, "subTotal": 100, "discount": 10, "totalBeforeVat": 90, "vat": 10, "total": 100, "paid": 30, "createdDate": null, "updatedDate": null
      },
      "body": [{
        "lineNo": 0, "itemId": "item1", "itemName": "itemName", "barcode": "barcode", "auxcode": "auxcode", "color": "color", "notes": "notes", "provisionDate": null, "length": 10, "width": 10, "thickness": 0, "weight": 1.2, "packType": null, "packsInLot": null, "unitsInPack": null, "quantity": 0, "unitPriceBeforeVAT": 0, "unitPrice": 0, "discount": 0, "salePriceBeforeVAT": 0
      }]
    };
    data.header.documentId = hexId
    data.body = [req.body.order]
    null && JSON.stringify({
      "header": {
        "documentId": req.body.header.documentId,
        "docNo": 2001, "accountId": 1234, "accountName": "accountName", "address": "address", "city": "city", "contact": "contact", "phone1": "054-4444444", "phone2": "055-4443332", "phone3": null, "phone4": null, "subjectId": 0, "agentId": 0, "agentName": "agentName", "notes": "notes", "storeNo": 1, "asmac": null, "provisionDate": null, "returnDate": null, "systemStatus": 0, "status": null, "subTotal": 100, "discount": 10, "totalBeforeVat": 90, "vat": 10, "total": 100, "paid": 30, "createdDate": null, "updatedDate": null
      },
      "body": [{
        "itemId": "item1",
        "itemName": "itemName",
        "lineNo": 0, "barcode": "barcode", "auxcode": "auxcode", "color": "color", "notes": "notes", "provisionDate": null, "length": 10, "width": 10, "thickness": 0, "weight": 1.2, "packType": null, "packsInLot": null, "unitsInPack": null, "quantity": 0, "unitPriceBeforeVAT": 0, "unitPrice": 0, "discount": 0, "salePriceBeforeVAT": 0
      }]
    });
    var config = {
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
        // result.serial = data.header.documentId
        // await result.save()
        // Order.findById(result._id)
        // Order.findByIdAndUpdate(result._id, { serial: data.header.documentId }).exec()
        res.status(200).json({
          db: result._id,
          serial: result.serial,
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
