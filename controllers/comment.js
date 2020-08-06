const db = require("../models");

const create = async (req, res) => {
    const myId = Number(req.user.id);
    const postId = Number(req.params.post_id);
    const { comment } = req.body;

    const targetPost = await db.Post.findOne({ where: { id: postId } });

    if (targetPost) {
        const newComment = await db.Comment.create({
            comment,
            post_id: postId,
            user_id: myId,
        });

        res.status(201).send(newComment);
    } else {
        res.status(404).send({ message: `Post Not Found` });
    }
};

const deleteById = async (req, res) => {
    const commentId = Number(req.params.comment_id);
    const targetComment = await db.Comment.findOne({ where: { id: commentId } });

    if (targetComment && targetComment.user_id === req.user.id) {
        await targetComment.destroy();
        res.status(204).send();
    } else {
        res.status(400).send({ message: `Something went wrong.` });
    }
};

const editById = async (req, res) => {
    const commentId = Number(req.params.id);
    const { comment } = req.body;
    const targetComment = await db.Comment.findOne({ where: { id: commentId } });

    if (targetComment && targetComment.user_id === req.user.id) {
        await targetComment.update({ comment });
        res.status(200).send();
    } else {
        res.status(400).send({ message: `Something went wrong.` });
    }
};

module.exports = {
    create,
    deleteById,
    editById,
};