const UserAddClick = require('../models/userAddClick');

exports.NoOfAddsByUser = async (req, res) => {

    var userClick = await UserAddClick.findOne({ userId: req.body.userId });

    if (!userClick) {
        userClick = new UserAddClick(req.body);
        userClick.noOfAddClick = 1;
        userClick.userId = req.body.userId;
    }
    else {
        userClick.noOfAddClick = userClick.noOfAddClick + 1;
    }
    userClick.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(result);
    });

};


exports.getAllNoOfAddsByUser = async (req, res) => {
    UserAddClick.find()
        .then((data) => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });

};


