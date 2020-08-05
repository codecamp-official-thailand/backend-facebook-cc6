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

const getAllPosts = (req, res) => {

};

const deletePostById = async (req, res) => {
    const id = Number(req.params.id);
    const targetPost = await db.Post.findOne({ where: { id } });

    if (!targetPost) {
        res.status(404).send({ message: `Not Found Post ID: ${id}` });
    } else {
        if (targetPost.user_id === req.user.id) {
            await targetPost.destroy();
            res.status(204).send();
        } else {
            res.status(401).send();
        }
    }
};

const editPostById = (req, res) => {
    const id = Number(req.params.id);
    const { caption } = req.body;
    const targetPost = await db.Post.findOne({ where: { id } });

    if (!targetPost) {
        res.status(404).send({ message: `Not Found Post ID: ${id}` });
    } else {
        if (targetPost.user_id === req.user.id) {
            await targetPost.update({
                caption
            });
            res.status(204).send();
        } else {
            res.status(401).send();
        }
    }
};

module.exports = {
    create,
    getAllPosts,
    deletePostById,
    editPostById,
};;