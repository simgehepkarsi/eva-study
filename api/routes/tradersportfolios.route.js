module.exports = app => {
    const { TradersPortfoliosController } = require("../controller/tradersportfolios.controller.js");
  
    var router = require("express").Router();
  
    const tradersportfoliosController = new TradersPortfoliosController();

    router.post("/createtradersportfolios", tradersportfoliosController.createtradersportfolios);
    router.get("/gettradersportfolios", tradersportfoliosController.gettradersportfolios);

    app.use('/api/tradersportfolios', router);
  };