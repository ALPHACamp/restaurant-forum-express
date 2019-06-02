const db = require('../../models')
const Category = db.Category

let categoryController = {
 getCategories: (req, res) => {
  return Category.findAll().then(categories => {
    if (req.params.id) {
      Category.findByPk(req.params.id)
      .then((category) => {
        return res.json({categories: categories, category: category})
      })
    } else {
      return res.json({categories: categories})
    }
  })
 },

 postCategory: (req, res) => {
  if(!req.body.name){
    return res.json({ status: 'error', message: "name didn't exist"})
  } else {
    return Category.create({
      name: req.body.name
    })
    .then((category) => {
      res.json({ status: 'success', message: '', category: category })
    })
  }
 },

 putCategory: (req, res) => {
  if(!req.body.name){
    return res.json({ status: 'error', message: "name didn't exist"})
  } else {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.update(req.body)
        .then((category) => {
          res.json({ status: 'success', message: ''})
        })
      })
  }
 },

 deleteCategory: (req, res) => {
  return Category.findByPk(req.params.id)
    .then((category) => {
      category.destroy()
        .then((category) => {
          res.json({ status: 'success', message: ''})
        })
    })
 }
}

module.exports = categoryController