let UserModel = require('../models/user');

module.exports.create = async function (req, res, next) {

    try {
        let newUser = new UserModel(req.body);

        let result = await UserModel.create(newUser);
        console.log(result);

        res.json(
            {
                success: true,
                message: "User created successfully."
            }
        );
    } catch (error) {
        console.log(error);
        next(error);
    }

}

module.exports.list = async function (req, res, next) {
    try {
        let list = await UserModel.find({}, '-password');

        res.json(list);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.userByID = async function (req, res, next) {
    try {
        let id = req.params.userID;
        req.user = await UserModel.findOne({ _id: id }, '-password');
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.read = async function (req, res, next) {
    res.json(req.user);
}

module.exports.update = async (req, res, next) => {
    try {
        let userId = req.params.userID;
        let updatedUser = UserModel(req.body);
        updatedUser._id = userId;

        let result = await UserModel.updateOne({ _id: userId }, updatedUser);
        console.log(result);
        if (result.modifiedCount > 0) {
            res.json(
                {
                    success: true,
                    message: "User updated successfully."
                }
            );
        }
        else {
            // Express will catch this on its own.
            throw new Error('User not updated. Are you sure it exists?')
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
}


module.exports.remove = async (req, res, next) => {
    try {
        let userId = req.params.userID;

        let result = await UserModel.deleteOne({ _id: userId });

        console.log(result);
        if (result.deletedCount > 0) {
            res.json(
                {
                    success: true,
                    message: "User deleted successfully."
                }
            );
        }
        else {
            // Express will catch this on its own.
            throw new Error('User not deleted. Are you sure it exists?')
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
}