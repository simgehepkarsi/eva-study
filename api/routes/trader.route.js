module.exports = app => {
    const { TraderController } = require("../controller/trader.controller.js");
  
    var router = require("express").Router();
  
    const traderController = new TraderController();

    router.post("/createtrader", traderController.createtrader);
    router.get("/gettraders", traderController.gettraders);

    app.use('/api/trader', router);
  };