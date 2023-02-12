'use strict';

const { TradersPortfoliosService } = require('../service/tradersportfolios.service')

class TradersPortfoliosController{
    constructor(){
    }

    async createtradersportfolios(req, res){
        const tradersPortfolios = req.body;
        const tradersPortfoliosService = new TradersPortfoliosService();
        const response = await tradersPortfoliosService.createtradersportfolios(tradersPortfolios);
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }

    async gettradersportfolios(req, res){
        const tradersPortfoliosService = new TradersPortfoliosService();
        const response = await tradersPortfoliosService.gettradersportfolios();
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }
};
exports.TradersPortfoliosController = TradersPortfoliosController