'use strict'
const models = require('../models')
const Restaurant = models.Restaurant

module.exports = {
  checkRestaurantOwnership: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.restaurantId)
      if (req.user.id === restaurant.userId) {
        return next()
      }
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    } catch (err) {
      return res.status(500).send(err)
    }
  },

  checkOnlyRestaurantInOwnershipPromoted: async (req, res, next) => {
    try {
      const promoted = req.body.isPromoted
      const restaurants = await Restaurant.findAll(
        {
          attributes: ['id', 'name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId', 'isPromoted'],
          where: { userId: req.user.id }
        })

      if (restaurants.every((e) => { return !e.isPromoted }) || !promoted) {
        return next()
      }

      return res.status(403).send('Another restaurant of your property is already promoted')
    } catch (err) {
      return res.status(500).send(err)
    }
  }
}
