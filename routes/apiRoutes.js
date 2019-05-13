const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController.js')
const restController = require('../controllers/api/restController.js')
const categoryController = require('../controllers/api/categoryController.js')
const commentController = require('../controllers/api/commentController.js')
const userController = require('../controllers/api/userController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  console.log(req.user)
  if (req.user) {
    return next()
  }
  else {
    return res.json({ status: 'error', message: 'permission denied', })
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied', })
  }
  else {
    return res.json({ status: 'error',  message: 'permission denied',})
  }
}

// {
//   Authorization: Bearer Token
// }
router.get('/', passport.authenticate('jwt', {session: false}), authenticated, (req, res) => res.json({message: 'hello world', user: req.user}))

router.get('/restaurants', passport.authenticate('jwt', {session: false}), authenticated, restController.getRestaurants)
router.get('/restaurants/top', passport.authenticate('jwt', {session: false}), authenticated, restController.getTopRestaurants)
router.get('/restaurants/feeds', passport.authenticate('jwt', {session: false}), authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', passport.authenticate('jwt', {session: false}), authenticated, restController.getDashboard)
router.get('/restaurants/:id', passport.authenticate('jwt', {session: false}), authenticated, restController.getRestaurant)

router.get('/users/top', passport.authenticate('jwt', {session: false}), authenticated, userController.getTopUser)
router.get('/users/:id', passport.authenticate('jwt', {session: false}), authenticated, userController.getUser)
// form-data {
//   image: ...
// }
router.put('/users/:id', passport.authenticate('jwt', {session: false}), authenticated, upload.single('image'), userController.putUser)

router.post('/comments', passport.authenticate('jwt', {session: false}), authenticated, commentController.postComment)
router.delete('/comments/:id', passport.authenticate('jwt', {session: false}), authenticatedAdmin, commentController.deleteComment)

router.post('/following/:userId', passport.authenticate('jwt', {session: false}), authenticated, userController.addFollowing)
router.delete('/following/:userId', passport.authenticate('jwt', {session: false}), authenticated, userController.removeFollowing)

router.post('/favorite/:restaurantId', passport.authenticate('jwt', {session: false}), authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', passport.authenticate('jwt', {session: false}), authenticated, userController.removeFavorite)

router.get('/admin', passport.authenticate('jwt', {session: false}), authenticatedAdmin, (req, res) => res.json({message: 'hello world', user: req.user}))
router.get('/admin/restaurants', passport.authenticate('jwt', {session: false}), authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/:id', passport.authenticate('jwt', {session: false}), authenticatedAdmin, adminController.getRestaurant)
router.post('/admin/restaurants', passport.authenticate('jwt', {session: false}), authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', passport.authenticate('jwt', {session: false}), authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', passport.authenticate('jwt', {session: false}), authenticatedAdmin, adminController.deleteRestaurant)

router.get('/admin/categories', passport.authenticate('jwt', {session: false}), authenticatedAdmin, categoryController.getCategories)
router.get('/admin/categories/:id', passport.authenticate('jwt', {session: false}), authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', passport.authenticate('jwt', {session: false}), authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', passport.authenticate('jwt', {session: false}), authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', passport.authenticate('jwt', {session: false}), authenticatedAdmin, categoryController.deleteCategory)

// {
//     "email": "API_TEST",
//     "password": "API_TEST",
// }
// {
//     "status": "success",
//     "message": "ok",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNTU3NzM0MTQ5fQ.rFA7lrhX8NrjDgFKkKF14G9bstjSJiyP_m2g833xnBU"
// }
router.post('/signin', userController.signIn)
// {
//     "name": "API_TEST",
//     "email": "API_TEST",
//     "password": "API_TEST",
//     "passwordCheck": "API_TEST"
// }
// {
//     "status": "success",
//     "message": "成功註冊帳號！"
// }
router.post('/signup', userController.signUp)

module.exports = router;

