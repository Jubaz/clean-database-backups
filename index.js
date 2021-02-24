// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'eu-west-2' });

// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Call S3 to list the buckets

s3.listBuckets(function (err, data) {
  if (!err) {
    data.Buckets.forEach(element => {
      if (element.Name.includes('database')) {
        getToBeDeletedObjects(element.Name)
      }
    });
  }
});


function getToBeDeletedObjects(BucketName) {
  var currentDate = new Date();
  var yesterdayDate = currentDate.setDate(currentDate.getDate() - 15);
  var sub = new Date(yesterdayDate);

  s3.listObjects({ Bucket: BucketName }, function (err, data) {
    data.Contents.forEach(element => {
      if (element.LastModified < sub && element.Key.includes('backups/ebdb')) {
        deleteObject(BucketName, element.Key);
      }
    });
  });
}


function deleteObject(bucketName, objectKey) {
  console.log('Item ' + objectKey + ' from bucket ' + bucketName)
  /*
    s3.deleteObject({Bucket: bucketName,Key: objectKey}, function(err, data) {
      if(!err){
        console.log('Item '+objectKey+' from bucket '+bucketName)
      }
    });
    */
}