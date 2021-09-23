const { nanoid } = require("nanoid");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const signupUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs data", 422));
    }

    try {
        const existingUser = await User.findOne({ emai: req.body.email });
        if (existingUser)
            return next(new HttpError("email already exists in database", 422));
    } catch (error) {
        return next(new HttpError("internal server error", 500));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(req.body.password, 12);
    } catch (error) {
        next(new HttpError("can't create a user try again", 500));
    }

    let user = new User({
        ...req.body,
        password: hashedPassword
    });
    try {
        user.avatar = await sharp(req.file.buffer)
            .resize(250, 250)
            .jpeg()
            .toBuffer();
        user.image = `/${user._id}/avatar`;
        await user.save();
    } catch (error) {
        return next(new HttpError("internal server error", 500));
    }
    const token = user.generateAuthToken();
    user = { ...user.toObject({ getters: true }) };
    delete user.password;
    delete user.avatar;
    res.status(201).send({ user, token });
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    let user;
    try {
        user = await User.findByEmailAndPassword(email, password);
        if (!user)
            return next(new HttpError("email or password is wrong", 422));
    } catch (error) {
        return next(new HttpError("internal server error", 500));
    }
    const token = user.generateAuthToken();
    user = { ...user.toObject({ getters: true }) };
    delete user.password;
    delete user.avatar;
    res.send({ user, token });
};

const getAvatar = async (req, res) => {
    try {
        const { avatar } = await User.findOne(
            { _id: req.params.id },
            { avatar: 1, _id: 0 }
        );

        res.set("Content-Type", "image/jpeg");
        if (!avatar) throw Error({ error: "not found" });

        res.send(avatar);
    } catch (error) {
        res.status(400).send();
    }
};

const deleteUser = (req, res, next) => {
    const NEW_USERS = USERS.filter((u) => u.id !== req.params.uid);

    if (NEW_USERS.length === USERS.length) {
        return next(new HttpError("no user found", 404));
    }
    USERS = NEW_USERS;
    res.send();
};

const updateUser = (req, res, next) => {
    const indexOfUser = USERS.findIndex((u) => u.id === req.params.uid);

    if (indexOfUser === -1) {
        return next(new HttpError("no user found", 404));
    }

    for (key in req.body) {
        USERS[indexOfUser][key] = req.body[key];
    }
    res.send(USERS[indexOfUser]);
};

const findAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, { avatar: 0, password: 0 });
        if (!users || users.length < 1)
            return next(new HttpError("no users in database", 404));
    } catch (error) {
        return next(new HttpError("internal server error", 500));
    }

    res.send(users.map((user) => user.toObject({ getters: true })));
};

module.exports = {
    signupUser,
    loginUser,
    deleteUser,
    updateUser,
    findAllUsers,
    getAvatar
};
