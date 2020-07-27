const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;
    // console.log("filename:", filename);

    const promise = s3
        .putObject({
            Bucket: "candasimageboard",
            ACL: "public-read",
            Key: `${req.session.userId}/${filename}`,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();
    promise
        .then(() => {
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log("error in upload s3:", err);
            res.sendStatus(500);
        });
};

exports.delete = (req, res, next) => {
    let willBeDeletedObjs = [];
    const promiseList = s3
        .listObjectsV2({
            Bucket: "candasimageboard",
            Prefix: `${req.session.userId}/`,
        })
        .promise();

    promiseList
        .then((data) => {
            console.log(data);
            data.Contents.map((each) => {
                let obj = {
                    Key: each.Key,
                };
                willBeDeletedObjs.push(obj);
            });
            console.log("willbedeleted:", willBeDeletedObjs);
            const promiseDelete = s3
                .deleteObjects({
                    Bucket: "candasimageboard",
                    Delete: {
                        Objects: willBeDeletedObjs,
                    },
                })
                .promise();
            promiseDelete
                .then(() => {
                    console.log("s3 delete worked");
                    next();
                })
                .catch((err) => {
                    console.log("error in delete s3:", err);
                    res.sendStatus(500);
                });
        })
        .catch((err) => {
            console.log("error in listObjectsV2 at s3", err);
        });
};
