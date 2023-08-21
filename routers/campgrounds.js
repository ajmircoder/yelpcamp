const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLogIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(upload.array('Images'), validateCampground, catchAsync(campgrounds.makeNewCampground));

router.get('/new', isLogIn, campgrounds.newCampgroundForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showOneCampground))
    .put(upload.array('Images'), validateCampground, catchAsync(campgrounds.editCampground));

router.get('/:id/edit', isLogIn, isAuthor, catchAsync(campgrounds.editCampgroundForm));

router.delete('/:id/delete', isAuthor, catchAsync(campgrounds.destroyCamground));

module.exports = router;