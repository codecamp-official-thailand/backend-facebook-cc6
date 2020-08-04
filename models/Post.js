module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        caption: DataTypes.STRING,
        image_url: DataTypes.STRING(1250)
    }, {
        tableName: "posts",
    });

    Post.associate = models => {
        Post.belongsTo(models.User, { foreignKey: "user_id" });
        Post.hasMany(models.Comment, { foreignKey: "post_id" });
    };

    return Post;
}