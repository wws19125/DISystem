var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

function guid() {
  function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var url = 'mongodb://localhost:27017/test';
router.post('/update',function(req,res,next){
  //console.log(req.query);
  //console.log(req.body);
  res.json({ok:12});
  return;
  var data = JSON.parse(req.body.data);
  //console.log(data);
  for(var i=0;i<data.length;i++)
  {
    data[i]["_id"] = guid();
  }
  //console.log("===========");
  //return;
  MongoClient.connect(url,function(err,db){
    assert.equal(null,err);
    console.log('Connected correctly to server.');

    db.collection("t",function(err,collection){
      assert.equal(null,err);
      console.log('Connected correctly to collection.');
      collection.insert(data,{safe:true},function(err){
        db.close();
        if(err)
          console.log("error");
        res.json({ok:1});
      });

    });

    //console.log(data[0]);
    //var ct = db.collection("t");
    //t.insert(data);
  });


});
/* GET home page. */
router.get('/', function(req, res, next) {

  //var url = 'mongodb://localhost:27017/test';
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
    //cursor.forEach(printjson);
    cursor.each(function(err,doc){
      assert.equal(err,null);
      if(doc!=null)
      {
        //console.log(doc);
        db.close();
      }
    });
    //db.close();
  });
  res.render('index', { title: 'DISystem' });
});

module.exports = router;
