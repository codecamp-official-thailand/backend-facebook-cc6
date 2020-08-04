module.exports = (sequelize, DataTypes) => {
    const Friend = sequelize.define("Friend", {
        status: DataTypes.ENUM("FRIEND", "PENDING", "BLOCK")
    }, {
        tableName: "friends"
    });

    return Friend;
}