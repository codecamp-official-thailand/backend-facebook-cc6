module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            unique: true,
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        image_url: {
            allowNull: false,
            type: DataTypes.STRING(1200)
        }
    }, {
        tableName: "users"
    });

    User.associate = models => {
        User.hasMany(models.Post, { foreignKey: "user_id" });
        User.hasMany(models.Comment, { foreignKey: "user_id" });
        User.belongsToMany(models.User, { through: models.Friend, as: "To", foreignKey: "request_to_id" });
        User.belongsToMany(models.User, { through: models.Friend, as: "From", foreignKey: "request_from_id" });
    };

    return User;
}