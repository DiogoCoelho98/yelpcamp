const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary/index');

//Campgrounds controllers
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
};

module.exports.newRenderForm = (req, res) => {
    res.render('campgrounds/new')
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    /* console.log(geoData.body.features[0].geometry.coordinates) ---> access to the coordinates */
    
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campground.author = req.user._id
    await campground.save()
    /* console.log(campground) */
    req.flash('success', 'Campground added!')
    res.redirect(`/campgrounds/${campground._id}`) 
};

module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({ //Nested populate to check the author of the review
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'); //.populate() -> access the values of the ObjectId in the model (author of the campground)
    /* console.log(campground) */
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
};

module.exports.editRenderForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, runValidators: true });
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campground.images.push(...imgs) // returns the array in separate elements (spread operator) 
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename) //Deletes de img from Cloudinary
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }) // Checks if the filename it's in the images array, and in the deleteImages array. If so, the selected images will be deleted from MongoDB
    }
    req.flash('success', 'Campground updated!')
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds')
};