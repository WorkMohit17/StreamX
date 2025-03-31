const { ObjectID } = require("mongodb");
const moment = require("moment");
const crypto = require("crypto");
const path = require("path");
const mime = require("mime-types");
const multer = require("multer");
const User = require("../models/user");
const Channel = require("../models/channel");

const upload = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, "../public/files/image"),
        filename: (req, file, cb) => {
            crypto.pseudoRandomBytes(4, (err, raw) => {
                if (err) return cb(err);
                const mimeType = mime.lookup(file.originalname);
                const nameSplit = file.originalname.split(".").slice(0, -1);
                const sanitizedName = nameSplit.join(".").replace(/\s/g, "-");
                cb(null, raw.toString("hex") + sanitizedName + "." + mime.extension(mimeType));
            });
        },
    }),
});

exports.uploadMiddleware = upload.single("channel_picture");

exports.createChannel = async (req, res) => {
    if (!ObjectID.isValid(req.user._id)) {
        return res.redirect("/");
    }

    const channelData = {
        creator: req.user._id,
        channel_name: req.body.channel_name,
    };

    if (req.file) {
        channelData.channel_picture = "/files/image/" + req.file.filename;
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.redirect("/");

        const newChannel = await Channel.create(channelData);
        user.channels.push(newChannel._id);
        await user.save();

        newChannel.participant.push(user._id);
        await newChannel.save();

        res.redirect(`/channel/${newChannel._id}`);
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
};

exports.getJoinChannel = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.redirect("/");
    }

    try {
        const channel = await Channel.findById(req.params.id).populate("participant");
        if (!channel) return res.redirect("/");

        res.render("join", { channel, title: "Join Channel" });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
};

exports.postJoinChannel = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.redirect("/");
    }

    try {
        const channel = await Channel.findById(req.params.id);
        if (!channel) return res.redirect("/");

        if (channel.participant.some(participant => participant.equals(req.user._id))) {
            return res.redirect(`/channel/${channel._id}`);
        }

        const user = await User.findById(req.user._id);
        user.channels.push(channel._id);
        await user.save();

        channel.participant.push(req.user._id);
        await channel.save();

        res.redirect(`/channel/${channel._id}`);
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
};

exports.getChannelChat = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.redirect("/");
    }

    try {
        const channel = await Channel.findById(req.params.id)
            .populate({ path: "message", populate: { path: "author" } })
            .populate("participant")
            .limit(10)
            .sort({ date: -1 });

        if (!channel) return res.redirect("/");

        const user = await User.findById(req.user._id).populate("channels");
        res.render("chat", { channel, channels: user.channels, title: channel.channel_name, moment });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
};
