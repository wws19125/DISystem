var express = require('express');
var router = express.Router();

router.get('/:projectId/list-by-project',function(req,res,next){
  res.json({ok:1});
});

router.get('/:_id/showdetail',function(req,res,next)
{
  res.json({ok:1});
});

module.exports = router;
