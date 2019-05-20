const db = require('../../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '955ea6fa229b9c1'

const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt")
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const bcrypt = require('bcrypt-nodejs')
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = 'tasmanianDevil'


let userController = {

  signUp: (req, res) => {
    if(req.body.passwordCheck !== req.body.password){
      return res.json({ status: 'error', message: '兩次密碼輸入不同！'})
    } else {
      User.findOne({where: {email: req.body.email}}).then(user => {
        if(user){
          return res.json({ status: 'error', message: '信箱重複！'})
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: '成功註冊帳號！'})
          })  
        }
      })    
    }
  },

  signIn: (req, res) => {
    let username = req.body.email;
    let password = req.body.password;
    // usually this would be a database call:    
    User.findOne({where: {email: username}}).then(user => {
      if(!user) return res.status(401).json({status: 'error', message:"no such user found"});
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({status: 'error', message:"passwords did not match"});
      }
      var payload = {id: user.id};
      var token = jwt.sign(payload, jwtOptions.secretOrKey);
      return res.json({status: 'success', message: "ok", token: token, user: {
          id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
        }
      });
    })
  },
 
  getUser: (req, res) => {
    if(!req.params.id) req.params.id = req.user.id
    return User.findByPk(req.params.id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Comment, include: Restaurant }
      ]
    }).then(user => {
      const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)
      return res.json({ profile: user, isFollowed: isFollowed })
    })
  },

  putUser: (req, res) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      return res.json({ status: 'error', message: ''})
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: img.data.link,
            })
            .then((user) => {
              res.json({ status: 'success', message: ''})
            })
          })
      })
    }
    else
      return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name
            })
            .then((user) => {
              res.json({ status: 'success', message: ''})
            })
          })
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
     .then((restaurant) => {
       return res.json({ status: 'success', message: ''})
     })
   },
   
   removeFavorite: (req, res) => {
    return Favorite.findOne({where: {
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }})
      .then((favorite) => {
        favorite.destroy()
         .then((restaurant) => {
           return res.json({ status: 'success', message: ''})
         })
      })
   },

   addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
     .then((restaurant) => {
       return res.json({ status: 'success', message: ''})
     })
   },
   
   removeLike: (req, res) => {
    return Like.findOne({where: {
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }})
      .then((like) => {
        like.destroy()
         .then((restaurant) => {
           return res.json({ status: 'success', message: ''})
         })
      })
   },

   getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' },
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
      }))
      users = users.sort((a,b) => b.FollowerCount - a.FollowerCount)
      return res.json({ users: users})
    })
   },

   addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
     .then((followship) => {
       return res.json({ status: 'success', message: ''})
     })
   },
   
   removeFollowing: (req, res) => {
    return Followship.findOne({where: {
      followerId: req.user.id,
      followingId: req.params.userId
    }})
      .then((followship) => {
        followship.destroy()
         .then((followship) => {
           return res.json({ status: 'success', message: ''})
         })
      })
   }
}

module.exports = userController