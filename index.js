require("dotenv").config();

const express = require("express");
const db = require("./models");
const cors = require("cors");
const commentRoutes = require("./routes/comment");
const postRoutes = require("./routes/post");
const friendRoutes = require("./routes/friend");
const userRoutes = require("./routes/user");
const fileUpload = require("express-fileupload");
const app = express();

require('./config/passport');

let allowedOrigins = ["http://localhost:3000", "http://yourapp.com"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            let mes = "เข้าไม่ได้นะ";
            return callback(new Error(mes), false);
        }

        return callback(null, true);
    }
}));

app.use(fileUpload());
app.use(express.static('./images'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/comments", commentRoutes);
app.use("/posts", postRoutes);
app.use("/friends", friendRoutes);
app.use("/users", userRoutes);

db.sequelize.sync({ force: false }).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at ${process.env.PORT}`);
    });
});