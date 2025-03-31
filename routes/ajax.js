const express     = require("express");
const multer = require("multer");
const mime = require("mime-types");
const path = require("path");
const crypto = require("crypto");
const middleware  = require("../middleware/index");
const Channel     = require("../models/channel");
const User = require("../models/user");

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, "../public/files/image"),
        filename: (req, file, cb)=>{
            crypto.pseudoRandomBytes(4, (err, raw)=>{
                const mimeType = mime.lookup(file.originalname);
                const nameSplit = file.originalname.split(".").slice(0, -1);
                const name = nameSplit.join(".").replace(/\s/g, "-");
                cb(null, raw.toString("hex") + name + "." + mime.extension(mimeType));
            });
        },
    }),
});

router.get("/current/channel/:id", middleware.isLogedIn, middleware.isChannelParticipant, (req, res)=>{
    Channel.findById(req.params.id).populate("participant").then((rChannel)=>{
        const participantList = [];
        rChannel.participant.forEach((participant)=>{
            const aParticipant = {
                username: participant.username,
                online: participant.online,
                image: participant.profile_picture,
                id: participant._id,
            };
            participantList.push(aParticipant);
        });
        res.send(participantList);
    });
});

router.post("/profile/img", middleware.isLogedIn, upload.single("file"), (req, res)=>{
    if(req.file){
        const file = {
            path: "/files/image/" + req.file.filename,
        };
       User.findByIdAndUpdate(req.user._id, { profile_picture: "/files/image/" + req.file.filename }).then(()=>{
            res.send(file);
        });
    }else{
        res.json({ error: true });
    }
});

module.exports = router;
