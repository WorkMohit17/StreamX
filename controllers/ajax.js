const crypto = require("crypto");
const path = require("path");
const mime = require("mime-types");
const multer = require("multer");
const Channel = require("../models/channel");
const User = require("../models/user");

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

exports.getChannelParticipants = async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id).populate("participant");
        if (!channel) return res.status(404).json({ error: "Channel not found" });

        const participantList = channel.participant.map((participant) => ({
            username: participant.username,
            online: participant.online,
            image: participant.profile_picture,
            id: participant._id,
        }));

        res.json(participantList);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.uploadProfilePicture = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = "/files/image/" + req.file.filename;

    try {
        await User.findByIdAndUpdate(req.user._id, { profile_picture: filePath });
        res.json({ path: filePath });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile picture" });
    }
};

exports.uploadMiddleware = upload.single("file");
