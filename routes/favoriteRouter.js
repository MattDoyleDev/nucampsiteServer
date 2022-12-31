const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            req.body.forEach(fav => {
                if(!favorite.campsites.includes(fav._id)) {
                    favorite.campsites.push(fav._id);
                }
            });
            favorite.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            Favorite.create({ user: req.user._id })
            .then(favorite => {
                req.body.forEach(fav => {
                    if(!favorite.campsites.includes(fav._id)) {
                        favorite.campsites.push(fav._id);
                    }
                });
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        }
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({user: req.user._id})
    .then(fave => {
        res.statusCode = 200;
        if(fave) {
            res.setHeader('Content-Type', 'text/json');
            res.json(fave);
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.')
        }
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorite/${req.params.campsiteId}`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id})
    .then((favorite) => {
        if (favorite) {
            if (!favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push(req.params.campsiteId);
                favorite.save()
                .then((favorite) => {
                    console.log("Favorite Created", favorite);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                })
                .catch(err => next(err));
            } else {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end("That campsite is already in the list of favorites");
            } 
        } else {
            Favorite.create({
                user: req.user._id,
                campsites: [req.params.campsiteId],
            })
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then((favorite) => {
        if (favorite) {
            favorite.campsites.splice(favorite.campsites.indexOf(req.params.campsiteId), 1);
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("That campsite has already been deleted from the list of favorites");
        }
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;









// const express = require('express');
// const Favorite = require('../models/favorite');
// const authenticate = require('../authenticate');
// const cors = require('./cors');

// const favoriteRouter = express.Router();

// favoriteRouter.route('/')
// .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
// .get(cors.cors, authenticate.verifyUser, (req, res, next) => {    
//     Favorite.find({ 
//         user: req.user._id 
//     })
//     .populate('user')
//     .populate('campsites')
//     .then(favorite => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(favorite);
//     })
//     .catch(err => next(err));
// })
// .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//     Favorite.findOne({
//         user: req.user._id 
//     })    
//     .then(favorite => {
//         if (favorite) {
//               req.body.forEach(campsiteFavorite => {
//                 if (!favorite.campsites.includes(campsiteFavorite._id)) {
//                     favorite.campsites.push(campsiteFavorite._id)
//                 }
//               });
//               favorite.save()
//               .then(favorite => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(favorite);
//             })
//         } else {
//             Favorite.create(favorite.campsites.push(req.body))
//             favorite.save()
//             .then(favorite => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(favorite);
//             })
//             .catch(err => next(err));
//         }
//         .catch(err => next(err));
//     })
//     .catch(err => next(err));
// })
// .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /favorite');
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favorite.findOneAndDelete({ user: req.user._id })
//     .then(favorite => {
//         res.statusCode = 200;
//         if (favorite) {
//             res.setHeader('Content-Type', 'application/json');
//             res.json(favorite);
//         } else {
//             res.setHeader('Content-Type', 'text/plain');
//             res.end('You do not have any favorites to delete.');
//         }
//     })
//     .catch(err => next(err));
// });

// favoriteRouter.route('/:campsiteId')
// .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
// .get(cors.cors, authenticate.verifyUser, (req, res) => {    
//     res.statusCode = 403;
//     res.end(`GET operation not suported on /favorite/${req.params.campsiteId}`);
// })
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favorite.findOne({user: req.user._id})
//     .then(favorite => {
//         if (favorite) {
//             if (!favorite.campsites.includes(req.params.campsiteId)) {
//                 favorite.campsites.push(req.params.campsiteId)
//                 favorite.save()
//                 .then(favorite => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(favorite);
//                 })
//                 .catch(err => next(err));
//             } else {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'text/plain');
//                 res.end('That campsite is already a favorite');
//             }
//         } else {
//             Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
//             .then(favorite => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(favorite);
//             })
//             .catch(err => next(err));
//         }
//     })
//     .catch(err => next(err));
// })
// .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
//     res.statusCode = 403;
//     res.end(`PUT operation not suported on /favorite/${req.params.campsiteId}`);
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
//     Favorite.findOne({user: req.user._id })
//     .then(favorite => {
//         if (favorite) {
//             const index = favorite.campsites.indexOf(req.params.campsiteId);
//             if (index >= 0) {
//                 favorite.campsites.splice(index, 1);
//             }
//             favorite.save()
//             .then(favorite => {
//                 console.log('Favorite campsite has been deleted.', favorite);
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(favorite);
//             }) .catch(err => next(err));
//         } else {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'text/plain');
//             res.end('You do not have any favorites to delete');
//         }
//     }).catch(err => next(err))
// });

// module.exports = favoriteRouter;

























//     if (favorite.campsites.includes(campsiteFavorite._id)) {
//         Favorite.findOneAndDelete({
//             user: req.user._id
//         })
//         .then(response => {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(Favorite);
//         })
//     } else {
//         res.statusCode = 404;
//         res.setHeader('Content-Type', 'test/plain')
//         res.end('You do not have any favorites to delete')
//     }
//     .catch(err => next(err));
// });

// favoriteRouter.route('/:campsiteId')
// .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
// .get(cors.cors, authenticate.verifyUser, (req, res) => {    
//     Favorite.findById(req.params.partnerId)
//     .then(favorite => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(favorite);
//     })
//     .catch(err => next(err));
// })
// .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
//     res.statusCode = 403;
//     res.end(`POST operation not supported on /favorites/${req.params.campsiteId}`);
// })
// .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
//     Favorite.findByIdAndUpdate(req.params.campsiteId, {
//         $set: req.body
//     }, { new: true })
//     .then(campsite => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(campsite);
//     })
//     .catch(err => next(err));
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//     Favorite.findByIdAndDelete(req.params.campsiteId)
//     .then(response => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(response);
//     })
//     .catch(err => next(err));
// });

// module.exports = favoriteRouter;