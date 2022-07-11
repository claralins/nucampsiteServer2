const express = require("express");
const cors = require("./cors");
const authenticate = require("../authenticate");
const Favorite = require("../models/favorites");

const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorites) => {
      if (favorites) {
        if (!favorites.campsites.includes(req.body)) {
          favorites.campsites.push(req.body);
        }
      } else {
        Favorite.create({ campsites: req.body }).save();
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.json(favorites);
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (Req, res, next) => {
    res.statusCode = 403;
    res.end("This operation is not supported");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id }).then((favorites) => {
      res.statusCode = 200;
      if (favorites) {
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      } else {
        res.setHeader("Content-Type", "text/plain");
        res.end("You do not have any favorites do delete.");
      }
    });
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("This operation is not supported");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorites) => {
      if (favorites) {
        if (!favorites.campsites.includes(req.params.campsiteId)) {
          favorites.campsites.push(req.params.campsiteId);
        } else {
          res.end("That campsite is already in the list of favorites!");
        }
      } else {
        Favorite.create({ campsites: req.body });
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.json(favorites);
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("This operation is not supported");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorites) => {
      if (favorites) {
        //delete the campsite in the URL parameter req.params.campsiteId from its campsites array.
        res.statusCode = 200;
        res.setHeadeR("Content-Type", "application/json");
        res.json(favorites);
      } else {
        res.setHeader("Content-Type", "text/plain");
        res.end("There are no favorites to delete.");
      }
    });
  });

module.exports = favoriteRouter;
