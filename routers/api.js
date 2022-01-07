const router = require('express').Router();
const atsRouter = require('./ats');

router.use(
    (req, res, next) => {
        console.log(req.originalUrl);
        next();
    })
// There's only 1 entity in this project "customers"
router.use('/ats', atsRouter);

module.exports = router;
