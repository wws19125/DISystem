var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

/* GET home page. */
router.get('/', function(req, res, next) {

  var url = 'mongodb://localhost:27017/test';
  MongoClient.connect(url,function(err,db){
    assert.equal(null,err);
    console.log('Connected correctly to server.');
    /*
    db.collection("t",function(err,collection){
      collection.find({name:'wang'},function(err,data){
        if(data)
        {
          console.log(data);
        }
      });
    });
    */
    var cursor = db.collection('t').find();
    cursor.each(function(err,doc){
      assert.equal(err,null);
      if(doc!=null)
      {
        console.dir(doc);
        db.close();
      }
    });
    //db.close();
  });
  res.render('index', { title: 'DISystem' });
});

module.exports = router;
