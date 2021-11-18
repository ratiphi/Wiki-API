const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// Connect to local MongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});
const Article = mongoose.model("Article", articleSchema);

////////////////Requests Targetting All Articles///////////////////
app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

////////////////Requests Targetting A Specific Article///////////////////
app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    })
    .put((req, res) => {
        Article.replaceOne({
            title: req.params.articleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, (err) => {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send("Error updating article.");
                console.log(err);
            }
        });
    })
    .patch((req, res) => {
        Article.updateOne({
            title: req.params.articleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, (err) => {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send("Error updating article.");
                console.log(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteOne({
            title: req.params.articleTitle
        }, (err) => {
            if (!err) {
                res.send("Successfully deleted article.")
            } else {
                res.send("Error deleting article");
                console.log(err);
            }
        });
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});