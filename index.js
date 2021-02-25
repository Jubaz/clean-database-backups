const AWS = require("aws-sdk");
const numberOfDays = 15;

AWS.config.update({ region: "eu-west-2" });
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

exports.handler = async (event) => {
  listBuckets();
};

function listBuckets() {
  s3.listBuckets(function (err, data) {
    if (!err) {
      data.Buckets.forEach((element) => {
        if (element.Name.includes("database")) listObjects(element.Name);
      });
    }
  });
}

function listObjects(BucketName) {
  s3.listObjects({ Bucket: BucketName }, function (err, data) {
    data.Contents.forEach((element) => {
      let daysDiff = diffDays(element.LastModified);
      if (daysDiff > numberOfDays && element.Key.includes("backups/ebdb")) {
        deleteObject(BucketName, element.Key);
      }
    });
  });
}

function deleteObject(bucketName, objectKey) {
  console.log("Item " + objectKey + " from bucket " + bucketName);
  /*
    s3.deleteObject({Bucket: bucketName,Key: objectKey}, function(err, data) {
      if(!err){
        console.log('Item '+objectKey+' from bucket '+bucketName)
      }
    });
    */
}

function diffDays(date)
{
  const today = new Date();
  const diffTime = Math.abs(date - today);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
}
