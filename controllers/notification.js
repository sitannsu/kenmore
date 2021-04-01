const Notification = require('../models/notification');

exports.sendNotifications = async (req, res) => {

    const notification = new Notification(req.body);
    notification.user = req.body.currentUserId;
    notification.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(result);
    });
     
};

exports.getAllNotifications = async (req, res, userId) => {
    Notification.find({currentUserId:userId})
        .populate('user', '_id name profileImageUrl')
      .then((data) => {
        res.send(data);
    })
       .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
     
};
