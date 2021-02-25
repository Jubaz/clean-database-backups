const AWS = require("aws-sdk");
const MOMENT = require("moment");
const numberOfDays = 15;

AWS.config.update({ region: "eu-west-2" });

// Create S3 service object
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// Call S3 to list the buckets

listBuckets();

async function listBuckets() {
  var hamada = await s3.listBuckets();

  console.log(hamada.then);
}

function listObjects(BucketName) {
  s3.listObjects({ Bucket: BucketName }, function (err, data) {
    data.Contents.forEach((element) => {
      let daysDiff = MOMENT().diff(element.LastModified, "days");
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
