const db = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
    const { caption } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send({ message: "No files were uploaded." });
    }

    // req.file.{{ชื่อ field ใน Postman นะจ๊ะ}}
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

const getAllPosts = async (req, res) => {
    const myId = Number(req.user.id);
    const friendsList = await db.Friend.findAll({
        where: {
            [Op.and]: [
                { status: "FRIEND" },
                {
                    [Op.or]: [
                        { request_from_id: myId },
                        { request_to_id: myId }
                    ]
                }
            ]
        }
    });

    const idsList = friendsList.map(friend => {
        const { request_from_id, request_to_id } = friend;

        if (request_from_id !== myId) {
            return request_from_id;
        }

        return request_to_id;
    });

    idsList.push(myId);

    const allPosts = await db.Post.findAll({
        where: { user_id: idsList },
        order: [
            ['id', 'DESC'],
        ],
        attributes: [['id', 'post_id'], 'caption', 'createdAt', 'updatedAt'],
        include: [
            { model: db.User, attributes: ['id', 'name', 'image_url'] },
            {
                model: db.Comment,
                attributes: ['id', 'comment'],
                include: {
                    model: db.User,
                    attributes: ['id', 'name', 'image_url']
                }
            }
        ]
    });

    res.send(allPosts);
};

const getMyPosts = async (req, res) => {
    res.status(200).send(await db.Post.findAll({ where: { user_id: req.user.id } }));
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

const editPostById = async (req, res) => {
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
    getMyPosts,
};;