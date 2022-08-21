const upload = require('../middleware/upload');
const router = require('express').Router();

router.get('/', (req,res) => {
    return res.render('upload', {
        layout: 'index',
        cssP: () => 'css',
        scriptsP: () => 'scripts',
        navP: () => 'navUpload',
        footerP: () => 'footer'
    })
});

router.post('/', upload.single('fileUp'), (req,res) => {
    console.log('file Up: ',req.file);
    return res.redirect('/upload');
})

module.exports = router;