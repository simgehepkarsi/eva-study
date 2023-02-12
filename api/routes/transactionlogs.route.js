module.exports = app => {
    const { TransactionLogsController } = require("../controller/transactionlogs.controller.js");
  
    var router = require("express").Router();
  
    const transactionlogsController = new TransactionLogsController();

    router.post("/createlog", transactionlogsController.createlog);
    router.get("/getlogs", transactionlogsController.getlogs);
    
    app.use('/api/transactionlogs', router);
  };