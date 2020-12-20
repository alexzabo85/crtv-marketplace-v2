import Product from '../models/product.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import defaultImage from './../../client/assets/images/default.png'

const create = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Image could not be uploaded"
      })
    }
    let product = new Product(fields)
    product.shop = req.shop
    if (files.image) {
      product.image.data = fs.readFileSync(files.image.path)
      product.image.contentType = files.image.type
    }
    try {
      let result = await product.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const productByID = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id).populate('shop', '_id name').exec()
    if (!product)
      return res.status('400').json({
        error: "Product not found"
      })
    req.product = product
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve product"
    })
  }
}

const photo = (req, res, next) => {
  if (req.product.image.data) {
    res.set("Content-Type", req.product.image.contentType)
    return res.send(req.product.image.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultImage)
}

const read = (req, res) => {
  req.product.image = undefined
  return res.json(req.product)
}

const update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Photo could not be uploaded"
      })
    }
    let product = req.product
    product = extend(product, fields)
    product.updated = Date.now()
    if (files.image) {
      product.image.data = fs.readFileSync(files.image.path)
      product.image.contentType = files.image.type
    }
    try {
      let result = await product.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req, res) => {
  try {
    let product = req.product
    let deletedProduct = await product.remove()
    res.json(deletedProduct)

  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByShop = async (req, res) => {
  try {
    let products = await Product.find({ shop: req.shop._id }).select('name image price quantity').lean()
    // let products = await Product.find({shop: req.shop._id}).populate('shop', '_id name').select('-image')
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listLatest = async (req, res) => {
  try {
    let products = await Product.find({}).sort('-created').limit(5).populate('shop', '_id name').exec()
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listRelated = async (req, res) => {
  try {
    let products = await Product.find({ "_id": { "$ne": req.product }, "category": req.product.category }).limit(5).populate('shop', '_id name').exec()
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listCategories = async (req, res) => {
  try {
    let products = await Product.distinct('category', {})
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const list = async (req, res) => {
  const query = {}
  if (req.query.search)
    query.name = { '$regex': req.query.search, '$options': "i" }
  if (req.query.category && req.query.category != 'All')
    query.category = req.query.category
  try {
    let products = await Product.find(query).populate('shop', '_id name').select('-image').exec()
    res.json(products)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const decreaseQuantity = async (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      "updateOne": {
        "filter": { "_id": item.product._id },
        "update": { "$inc": { "quantity": -item.quantity } }
      }
    }
  })
  try {
    await Product.bulkWrite(bulkOps, {})
    next()
  } catch (err) {
    return res.status(400).json({
      error: "Could not update product"
    })
  }
}

const increaseQuantity = async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.product._id, { $inc: { "quantity": req.body.quantity } }, { new: true })
      .exec()
    next()
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const generateFromCsv = (req, res, next) => {
  // console.log('entered generateFromCsv')
  const str2 =
    `303,נענע מהדרין,18.00
  309,בזיליקום מהדרין,28.00
  304,נבטים יח,3.50
  305,סלרי יח,3.50
  307,עלי בייבי מהדרין,28.00
  308,עלי תרד מהדרין,28.00
  402,קולורבי,0.00
  905,בננה,0.00
  907,נקטרינה,0.00
  908,אפרסק,0.00
  990,משמש,0.00
  200,אבטיח,0.00
  606,פלפל חריף,0.00
  111,שרי צהוב,0.00
  112,שרי שוקולד - ליקופן,0.00
  113,כרוב לבן - מגש 6 ראשים,0.00
  114,כרוב לבן - קרטון גדול,0.00
  555,כרוב לבן מהדרין שלם,40.00
  556,כרוב אדום שלם מהדרין,48.00
  218,תפוח עץ זהוב,0.00
  318,פטריות תפזורת,21.00
  418,נענע מהדרין,18.00
  518,שמיר מהדרין,18.00
  330,שום מקולף,30.00
  333,סלרי יחידות,3.50
  228,קווי צהוב,28.00
  229,עלי בייבי מהדרין,28.00
  212,תפוז,0.00
  720,תפוח עץ סמיט,9.00
  721,תפוח עץ חרמון,9.00
  723,תפוח עץ זהוב,10.00
  68,אבטיח,0.00
  69,מלון כתום,0.00
  71,מלון צרפתי,0.00
  77s,דובדבנים,0.00
  728,אגס,13.50
  420,כרובית - קרטוון,0.00
  640,תפוא אדום - שק 18,75.00
  270,גזר ארוז,4.00
  130,חצילונים,0.00
  890,פרסה\לוף,0.00
  191,עגבניה,0.00
  101,מלפפון פרימיום,0.00
  100,מלפפון סוג א',0.00
  103,עגבניה חממה,0.00
  104,עגבניה לבישול,0.00
  105,עגבניה ייבוא,0.00
  106,עגבניה תמר,0.00
  107,עגבניית מגי,0.00
  108,שרי אשכולות,0.00
  109,שרי תמר,0.00
  110,שרי לובלו,0.00
  115,כרוב אדום - מגש,0.00
  116,כרוב אדום - קרטון גדול,0.00
  117,כרובית - קרטון,0.00
  118,צנון טרי,0.00
  119,קולורבי,0.00
  120,שומר,0.00
  201,מלון כתום,0.00
  202,מלון צרפתי,0.00
  203,אפרסק,0.00
  204,נקטרינה,0.00
  205,שזיף,0.00
  206,שזיף מיטלי,0.00
  207,משמש,0.00
  121,קישואים סוג א',0.00
  208,אבוקדו,0.00
  209,ענב ירוק,0.00
  210,ענב שחור,0.00
  211,שסק,0.00
  122,קישואים פרימיום,0.00
  123,סלק סוג א',0.00
  213,תפוז רשת,0.00
  134,גזר ארוז - פרימיום,0.00
  135,גזר ארוז - דוד משה,0.00
  214,קלמנטינה,0.00
  215,קווי,0.00
  216,תפוח עץ חרמון,0.00
  217,תפוח עץ סמיט,0.00
  219,פיינק ליידי,0.00
  220,לימון,0.00
  221,אגס,0.00
  300,פטרוזליה מהדרין,18.00
  301,כוסברה מהדרין,18.00
  302,שמיר מהדרין,18.00
  306,מיקרו אפונה,6.50
  310,כרוב לבן שלם מהדרין,40.00
  311,כרוב אדום שלם מהדרין,48.00
  312,כרוב לבן קצוץ מהדרין,8.00
  313,כרוב אדום קצוץ מהדרין,8.00
  314,בצל ירוק מהדרין,24.00
  315,חסה מהדרין,25.00
  316,פטריות א א,28.00
  317,פטריות א ת,26.00
  319,שום מקולף,34.00
  320,חסה קיסר,6.00
  321,חסה עגולה,35.00
  350,פטרוזליה יח,0.00
  351,כוסברה יח,0.00
  352,שמיר יח,0.00
  353,נענע יח,0.00
  354,בזיליקום,0.00
  355,חסה ערבית,0.00
  356,בצל ירוק,0.00
  357,צנונית יח,3.50
  124,סלק פרימיום,0.00
  125,סלק בוואקום - קרטון 12 יחידות,0.00
  222,בננה,0.00
  126,חציל חממה סוג א',0.00
  127,חציל חממה לשרפה,0.00
  128,חציל חממה פרימיום,0.00
  223,תירס מתוק ארוז,0.00
  129,חציל בלדי,5.00
  358,פטריות פורטובלו,0.00
  359,טימין,5.00
  224,אננס יחידות,0.00
  131,זוקיני ירוק,0.00
  225,תאנים,0.00
  132,זוקיני צהוב,0.00
  102,עגבניה אשכולות,0.00
  226,דובדבנים,0.00
  227,דובדבן צהוב,0.00
  360,גינגר,0.00
  365,גזר קצוץ מהדרין,0.00
  380,עירית,0.00
  285,מנגו,0.00
  386,חסה אייזברג,0.00
  286,ליצ'י ארוז,0.00
  289,רימון,0.00
  288,תמר צהוב,0.00
  287,פומלית,0.00
  290,אפרסמון,0.00
  322,רוקט מהדרין,0.00
  291,פטל,0.00
  292,תות שדה קרטון,0.00
  133,גזר שק - 10 קילו,0.00
  136,פלפל אדום  גדול מאוד,0.00
  137,פלפל אדום  גדול,0.00
  138,פלפל צהוב  גדול מאוד,0.00
  139,פלפל צהוב  גדול,0.00
  140,פלפל כתום,0.00
  141,פלפל חריף - ירוק,0.00
  142,פלפל חריף - אדום,0.00
  143,פלפל צילי אדום חריף,0.00
  144,פלפל שושקה אדום,0.00
  145,תפוא לבן - שק 18 קילו,0.00
  146,תפוא אדום - שק 18 קילו,0.00
  147,תפוא לבן ארוז,0.00
  148,תפוא אדום ארוז,0.00
  149,תפוא ארוז דוד משה לבן,0.00
  150,תפוא ארוז דוד משה גורמה,0.00
  151,תפוא דוד משה גורמה בייבי,0.00
  152,תפוא ארוז דוד משה אפיה,0.00
  153,תפוא ארוז דוד משה אדום,0.00
  154,תפוא פריזאן,0.00
  155,בצל ייבש,0.00
  156,בצל ייבש ענק,0.00
  157,בצל אדום,0.00
  158,בטטה  גדול,0.00
  159,בטטה  גדול מאוד,0.00
  160,שום שרוול ברשת - יחידות,0.00
  161,שום שרוול ברשת - קרטון,0.00
  162,דלעת,0.00
  163,פרסה\לוף,0.00
  164,תירס מתוק ארוז - צהוב,0.00
  165,תירס מתוק ארוז - לבן,0.00
  166,שום טרי,0.00
  167,פלפל ירוק,0.00
  99,עגבניה,0.00
  168,חציל בלאדי,0.00
  169,בצל לבן מקולף,0.00`;

  const arr = str2.split('\n')
  const myResult = arr.map(a => {
    const line = a.split(',')
    return {
      description: line[0],
      name: line[1],
      price: +line[2],
      quantity: 0,
      shop: req.body.shop._id,
    }
  })

  Product.insertMany(myResult).then(function () {
    console.log("Data inserted")  // Success 
  }).catch(function (error) {
    console.log(error)      // Failure 
  });

  res.json(myResult)

}



export default {
  generateFromCsv
  // create,
  // productByID,
  // photo,
  // defaultPhoto,
  // read,
  // update,
  // remove,
  // listByShop,
  // listLatest,
  // listRelated,
  // listCategories,
  // list,
  // decreaseQuantity,
  // increaseQuantity
}
