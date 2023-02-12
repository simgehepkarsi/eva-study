module.exports = app => {
    const { ShareController } = require("../controller/share.controller.js");
  
    var router = require("express").Router();
  
    const shareController = new ShareController();
  
    router.get("/getShare", shareController.getShare);
    router.post("/createShare", shareController.createShare);
    router.post("/registerShare", shareController.registerShare);
    router.put("/updatePriceRegisteredShare", shareController.updatePriceRegisteredShare);
    router.post("/buyShare", shareController.buyShare);
    router.post("/sellShare", shareController.sellShare);

    router.get("/initDatabase", shareController.initDatabase);
    
    app.use('/api/share', router);
  };