const db = require('../../models')
const Comment = db.Comment

let commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    }).then(comment => {
      res.json({ status: 'success', message: '', commentId: comment.id })
    })
  },

  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id).then(comment => {
      comment.destroy().then(comment => {
        res.json({ status: 'success', message: '' })
      })
    })
  }
}

module.exports = commentController
