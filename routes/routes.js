const express = require('express');
const mongoose = require('mongoose');
var url = 'mongodb+srv://user:pass@cluster0-b22qb.mongodb.net/Games?retryWrites=true&w=majority';

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const GamesSchema = new Schema(
    {
        _id: Number,
        name: String,
        about: String,
        imageUrl: String
    },
);
const UserSchema = new Schema(
    {
        _id: ObjectId,
        name: String,
        email: String,
        username: String,
        password: String,
        roles: Array
    },
    {collection: "users"}
);
const Game = mongoose.model("Game", GamesSchema);
const User = mongoose.model("User", UserSchema);
const router = express.Router();

router.route("/").get(
    function (req, res) {
        var model = {
            title : "Games Site!",
            username : req.session.username,
            userId : req.session.userId,
            isAdmin : req.session.isAdmin
        }
        res.render("index", model);
    }
);

router.route("/games").get(
    async function (req, res) {
        var GamesFromDB = await Game.find();

        var model = {
            title: "Games List",
            games: GamesFromDB,
            username : req.session.username,
            userId : req.session.userId,
            isAdmin : req.session.isAdmin
        };
        console.log(req.session.isAdmin);
        res.render("gameList", model);
    }
);

router.route("/order").get(
    function (req, res) {
        var model = {
            title: "Game Order Page",
        };
        res.render("order", model);
    }
);

router.route("/order/:gameId").get(
    async function (req, res) {
        if(!req.session.username){
            res.redirect("/user/login");
        }else {
            var gameId = req.params.gameId;
            var game = await Game.findOne({_id:gameId});
            console.log(game);

            if (game) {
                var model = {
                    title: "Game Detail Page",
                    game: game,
                    username : req.session.username,
                    userId : req.session.userId,
                    isAdmin : req.session.isAdmin
                };
                res.render("order", model);
            } else {
                res.send("You done messed up! Could not find a weapon with id: " + gameId);
            }
        }
    }
);

router.route("/order").post(
    function (req, res) {
        var model = {
            title: "Game Detail Page",
            game: game,
            username : req.session.username,
            userId : req.session.userId,
            isAdmin : req.session.isAdmin
        };
        res.send("Order is now complete! Wait one to an infinite point in time for your game to arive!");
    }
);

module.exports = router;