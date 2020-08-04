const db = require("../models");
const bc = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { username, password, name, image_url: imageUrl } = req.body;
    const targetUser = await db.User.findOne({ where: { username } });

    if (targetUser) {
        res.status(400).send({ message: "Username already used" });
    } else {
        const salt = bc.genSaltSync(Number(process.env.ROUNDS));
        const hashedPW = bc.hashSync(password, salt);

        await db.User.create({
            password: hashedPW,
            image_url: imageUrl,
            username,
            name
        });

        res.status(201).send({ message: "User created" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const targetUser = await db.User.findOne({ where: { username } });
    if (!targetUser) {
        res.status(400).send({ message: "Username or password is wrong." });
    } else {
        const isPWCorrect = bc.compareSync(password, targetUser.password);

        if (isPWCorrect) {
            const payload = { id: targetUser.id, name: targetUser.name };
            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 });

            res.status(200).send({
                message: "Successfully login.",
                access_token: token,
                accessToken: token,
            });
        } else {
            res.status(400).send({ message: "Username or password is wrong." });
        }
    }
};

module.exports = {
    register,
    login,
};