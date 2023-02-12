'use strict';

const { TraderService } = require('../service/trader.service')

class TraderController{
    constructor(){
    }

    async createtrader(req, res){
        const trader = req.body;
        const traderService = new TraderService();
        const response = await traderService.createtrader(trader);
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }

    async gettraders(req, res){
        const traderService = new TraderService();
        const response = await traderService.gettraders();
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }
};
exports.TraderController = TraderController