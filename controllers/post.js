const db = require("../models");

const create = async (req, res) => {
    const { caption } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send({ message: "No files were uploaded." });
    }

    let image = req.files.image;
    let fileExtension = image.name.split(".").slice(-1)[0];
    let filePath = `/${(new Date()).getTime()}.${fileExtension}`;

    image.mv(`images/${filePath}`);

    const newPost = await db.Post.create({
        user_id: req.user.id,
        image_url: filePath,
        caption,
    });

    res.status(201).send(newPost);
};

module.exports = {
    create,
};;