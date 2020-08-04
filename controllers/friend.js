const db = require("../models");
const { Op } = require("sequelize");

const sendFriendRequest = async (req, res) => {
    const targetId = Number(req.params.id);
    const myId = Number(req.user.id);

    const friendRelationship = await db.Friend.findOne({
        where: {
            [Op.or]: [
                { request_from_id: myId, request_to_id: targetId },
                { request_from_id: targetId, request_to_id: myId }
            ]
        }
    });

    if (!friendRelationship && targetId !== myId) {
        const friendRlt = await db.Friend.create({
            request_from_id: myId,
            request_to_id: targetId,
            status: "PENDING"
        });

        res.status(201).send(friendRlt);
    } else {
        res.status(400).send({ message: `Something went wrong.` });
    }
};

const denyFriendRequest = async (req, res) => {
    const targetId = Number(req.params.id);
    const myId = Number(req.user.id);

    const friendRelationship = await db.Friend.findOne({
        where: {
            [Op.and]: [
                { status: "PENDING" },
                {
                    [Op.or]: [
                        { request_from_id: myId, request_to_id: targetId },
                        { request_from_id: targetId, request_to_id: myId }
                    ]
                }
            ]
        }
    });

    if (friendRelationship) {
        await friendRelationship.destroy();
        res.status(204).send();
    } else {
        res.status(400).send({ message: "Something went wrong." });
    }
};

const acceptFriendRequest = async (req, res) => {
    const targetId = Number(req.params.id);
    const myId = Number(req.user.id);

    const friendRelationship = await db.Friend.findOne({
        where: {
            status: "PENDING", request_from_id: targetId, request_to_id: myId,
        }
    });

    if (friendRelationship) {
        await friendRelationship.update({ status: "FRIEND" });
        res.status(200).send({ message: "success" });
    } else {
        res.status(400).send({ message: "Something went wrong." });
    }
};

const deleteFriend = async (req, res) => {
    const targetId = Number(req.params.id);
    const myId = Number(req.user.id);

    const friendRelationship = await db.Friend.findOne({
        where: {
            [Op.and]: [
                { status: "FRIEND" },
                {
                    [Op.or]: [
                        { request_from_id: myId, request_to_id: targetId },
                        { request_from_id: targetId, request_to_id: myId }
                    ]
                }
            ]
        }
    });

    if (friendRelationship) {
        await friendRelationship.destroy();
        res.status(204).send();
    } else {
        res.status(400).send({ message: "Something went wrong." });
    }
};

module.exports = {
    sendFriendRequest,
    denyFriendRequest,
    acceptFriendRequest,
    deleteFriend,
};