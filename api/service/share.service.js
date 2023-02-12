'use strict';

const { ShareRepository } = require("../repository/share.repository.js");
const { TradersPortfoliosRepository } = require("../repository/tradersportfolios.repository");
const { TraderRepository } = require("../repository/trader.repository");
const { TransactionLogsRepository } = require("../repository/transactionlogs.repository");



class ShareService{
  constructor(){
  }

  async initDatabase() {
    const traderRepository = new TraderRepository();
    const tradersPortfoliosRepository = new TradersPortfoliosRepository();

    const trader1 = {
      name: "simge",
      email: "simge@gmail.com",
      password: "12345",
      balance: 1000,
      blockedBalance: 0
    };
    traderRepository.create(trader1);

    const trader2 = {
      name: "kerim",
      email: "kerim@gmail.com",
      password: "12345",
      balance: 1000,
      blockedBalance: 0
    };
    traderRepository.create(trader2);

    const trader3 = {
      name: "seyma",
      email: "seyma@gmail.com",
      password: "12345",
      balance: 1000,
      blockedBalance: 0
    };
    traderRepository.create(trader3);

    const trader4 = {
      name: "bilge",
      email: "bilge@gmail.com",
      password: "12345",
      balance: 1000,
      blockedBalance: 0
    };
    traderRepository.create(trader4);

    const trader5 = {
      name: "ali",
      email: "ali@gmail.com",
      password: "12345",
      balance: 1000,
      blockedBalance: 0
    };
    traderRepository.create(trader5);

    const trader1portfoliosABC = {
      traderId: 1,
      shareName: "ABC",
      shareCode: "ABC",
      shareAmount: 10,
      shareBlockedAmount: 0
    };
    tradersPortfoliosRepository.create(trader1portfoliosABC);

    const trader1portfoliosXYZ = {
      traderId: 1,
      shareName: "XYZ",
      shareCode: "XYZ",
      shareAmount: 10,
      shareBlockedAmount: 0
    };
    tradersPortfoliosRepository.create(trader1portfoliosXYZ);

    const trader1portfoliosASD = {
      traderId: 1,
      shareName: "ASD",
      shareCode: "ASD",
      shareAmount: 10,
      shareBlockedAmount: 0
    };
    tradersPortfoliosRepository.create(trader1portfoliosASD);

    const trader2portfoliosABC = {
      traderId: 2,
      shareName: "ABC",
      shareCode: "ABC",
      shareAmount: 20,
      shareBlockedAmount: 0
    };
    tradersPortfoliosRepository.create(trader2portfoliosABC);

    const trader2portfoliosXYZ = {
      traderId: 2,
      shareName: "XYZ",
      shareCode: "XYZ",
      shareAmount: 20,
      shareBlockedAmount: 0
    };
    tradersPortfoliosRepository.create(trader2portfoliosXYZ);

    const trader2portfoliosASD = {
      traderId: 2,
      shareName: "ASD",
      shareCode: "ASD",
      shareAmount: 20,
      shareBlockedAmount: 0
    };
    tradersPortfoliosRepository.create(trader2portfoliosASD);

    const trader3portfoliosABC = {
      traderId: 3,
      shareName: "ABC",
      shareCode: "ABC",
      shareAmount: 30,
      shareBlockedAmount: 0
    };
    tradersPortfoliosRepository.create(trader3portfoliosABC);

    const trader3portfoliosXYZ = {
      traderId: 3,
      shareName: "XYZ",
      shareCode: "XYZ",
      shareAmount: 30,
      shareBlockedAmount: 0
    };
    tradersPortfoliosRepository.create(trader3portfoliosXYZ);

    const trader3portfoliosASD = {
      traderId: 3,
      shareName: "ASD",
      shareCode: "ASD",
      shareAmount: 30,
      shareBlockedAmount: 0
    };
    tradersPortfoliosRepository.create(trader3portfoliosASD);

    return "OK";
  }

  async getShare() {
    const shareRepository = new ShareRepository();
    const getres = await shareRepository.get();

    if(getres === null) {
        return null; 
    }

    return getres;
  }

  async createShare(share) {
    const validateCreateShare = this.validateCreateShare(share);

    let res = {
      status: true,
      message: ""
    };

    if(validateCreateShare.status === false) {
      res.message = validateCreateShare.message;
      res.status = false;

      return res;
    }
    
    const shareRepository = new ShareRepository();
    const createres = await shareRepository.create(share);

    if(createres === null) {
      return null; 
    }

    return createres;
  }

  async buyShare(trade) {
    const validateTrade = await this.validateBuyShare(trade);

    let res = {
      status: true,
      message: ""
    };

    if(validateTrade.status === false) {
      res.message = validateTrade.message;
      res.status = false;

      return res;
    }

    const result = validateTrade.message;
    const totalPrice = (trade.buyAmount * result.price).toFixed(2);

    const traderRepository = new TraderRepository();

    const resBuyTrade = traderRepository.updateTradersBalancesForBuyTrade(trade.buyerTraderId, result.traderId, totalPrice);

    if(!resBuyTrade) {
      res.message = "Error UpdateTradersBalancesForBuyTrade";
      res.status = false;

      return res;
    }
    
    const tradersPortfoliosRepository = new TradersPortfoliosRepository();

    const resPortfoliosBuyTrade = tradersPortfoliosRepository.updateTradersPortfoliosForBuyTrade(trade.buyerTraderId, result.traderId, trade.shareCode, trade.buyAmount);
    if(!resPortfoliosBuyTrade) {
      res.message = "Error UpdateTradersPortfoliosForBuyTrade";
      res.status = false;

      return res;
    }

    const shareRepository = new ShareRepository();

    if(trade.buyAmount == result.registeredAmount) {
      const resDelete = shareRepository.delete(result.id);

      if(!resDelete) {
        res.message = "Cannot deleted record.";
        res.status = false;

        return res;
      }

      const transactionLogsRepository = new TransactionLogsRepository();

      const paramsBuyer = {
        traderId : trade.buyerTraderId,
        shareCode : trade.shareCode,
        shareAmount : trade.buyAmount,
        sharePrice : result.price,
        tradeSide : "BUY",
        status : "Successful"
      };
      transactionLogsRepository.create(paramsBuyer);

      const paramsSeller = {
        traderId : result.traderId,
        shareCode : trade.shareCode,
        shareAmount : trade.buyAmount,
        sharePrice : result.price,
        tradeSide : "SELL",
        status : "Successful"
      };
      transactionLogsRepository.create(paramsSeller);

      res.message = "The BUY trade was successful!";
      res.status = true;

      return res;
    } else if(trade.buyAmount < result.registeredAmount) {

      const resUpdate = shareRepository.updateRegisteredShareAmount(result.id, trade.buyAmount);

      if(!resUpdate) {
        res.message = "Trade transaction failed!";
        res.status = false;

        return res;
      }

      const transactionLogsRepository = new TransactionLogsRepository();
      const paramsBuyer = {
        traderId : trade.buyerTraderId,
        shareCode : trade.shareCode,
        shareAmount : trade.buyAmount,
        sharePrice : result.price,
        tradeSide : "BUY",
        status : "Successful"
      };
      transactionLogsRepository.create(paramsBuyer);

      const paramsSeller = {
        traderId : result.traderId,
        shareCode : trade.shareCode,
        shareAmount : trade.buyAmount,
        sharePrice : result.price,
        tradeSide : "SELL",
        status : "Successful"
      };
      transactionLogsRepository.create(paramsSeller);

      res.message = "The BUY trade was successful!";
      res.status = true;
      return res;
    }
  }

  async sellShare(trade) {
    const validateTrade = await this.validateSellShare(trade);

    let res = {
      status: true,
      message: ""
    };

    if(validateTrade.status === false) {
      res.message = validateTrade.message;
      res.status = false;

      return res;
    }

    const result = validateTrade.message;
    const totalPrice = (trade.sellAmount * result.price).toFixed(2);

    const traderRepository = new TraderRepository();
    const resSellTrade = await traderRepository.updateTradersBalancesForSellTrade(trade.sellerTraderId, result.traderId, totalPrice);

    if(!resSellTrade) {
      res.message = "Error UpdateTradersBalancesForSellTrade";
      res.status = false;

      return res;
    }

    const tradersPortfoliosRepository = new TradersPortfoliosRepository();
    const resPortfoliosSellTrade = await tradersPortfoliosRepository.updateTradersPortfoliosForSellTrade(trade.sellerTraderId, result.traderId, trade.shareCode, trade.sellAmount);

    if(!resPortfoliosSellTrade){
      res.message = "Error UpdateTradersPortfoliosForSellTrade";
      res.status = false;

      return res;
    }

    const shareRepository = new ShareRepository();

    if(trade.sellAmount == result.registeredAmount) {
      const resDelete = shareRepository.delete(result.id);

      if(!resDelete) {
        res.message = "Cannot deleted record.";
        res.status = false;

        return res;
      }

      const transactionLogsRepository = new TransactionLogsRepository();
      const paramsSeller = {
        traderId : trade.sellerTraderId,
        shareCode : trade.shareCode,
        shareAmount : trade.sellAmount,
        sharePrice : result.price,
        tradeSide : "SELL",
        status : "Successful"
      };
      transactionLogsRepository.create(paramsSeller);

      const paramsBuyer = {
        traderId : result.traderId,
        shareCode : trade.shareCode,
        shareAmount : trade.sellAmount,
        sharePrice : result.price,
        tradeSide : "BUY",
        status : "Successful"
      };
      transactionLogsRepository.create(paramsBuyer);

      res.message = "The SELL trade was successful!";
      res.status = true;

      return res;

    } else if(trade.sellAmount < result.registeredAmount) {
      const resUpdate = shareRepository.updateRegisteredShareAmount(result.id, trade.sellAmount,);

      if(!resUpdate) {
        res.message = "Trade transaction failed!";
        res.status = false;

        return res;
      }

      const transactionLogsRepository = new TransactionLogsRepository();
      const paramsSeller = {
        traderId : trade.sellerTraderId,
        shareCode : trade.shareCode,
        shareAmount : trade.sellAmount,
        sharePrice : result.price,
        tradeSide : "SELL",
        status : "Successful"
      };
      transactionLogsRepository.create(paramsSeller);

      const paramsBuyer = {
        traderId : result.traderId,
        shareCode : trade.shareCode,
        shareAmount : trade.sellAmount,
        sharePrice : result.price,
        tradeSide : "BUY",
        status : "Successful"
      };
      transactionLogsRepository.create(paramsBuyer);

      res.message = "The SELL trade was successful!";
      res.status = true;

      return res;
    }
  }

  async registerShare(share) {
    const validateRegisterShare = this.validateRegisterShare(share);

    let res = {
      status: true,
      message: "Successful."
    };

    if(validateRegisterShare.status === false) {
      res.message = validateRegisterShare.message;
      res.status = false;

      return res;
    }
    
    const shareRepository = new ShareRepository();
    const createres = await shareRepository.create(share);
    if(createres === null) {
      res.message = "Share can not created.";
      res.status = false;

      return res; 
    }

    const traderRepository = new TraderRepository();
    const tradersPortfoliosRepository = new TradersPortfoliosRepository();

    if(share.tradeSide === "BUY") {
      const totalAmount = (share.registeredAmount * share.price).toFixed(2);
      const resShare = traderRepository.updateTradersBalanceForRegisterShare(share.traderId, totalAmount);

      if(!resShare) {
        res.message = "Share cannot registered!";
        res.status = false;

        return res;  
      }
      else {
        res.message = "The share registered successfully!";
        res.status = true;

        return res; 
      }
    }
    else if(share.tradeSide === "SELL") {
      const resShare = tradersPortfoliosRepository.updateTradersPortfolioForRegisterShare(share.traderId, share.code, share.registeredAmount);
      if(!resShare){
        res.message = "Share cannot registered!";
        res.status = false;

        return res;  
      }
      else{
        res.message = "The share registered successfully!";
        res.status = true;

        return res; 
      }
    }
    return res;
  }

  async updatePriceRegisteredShare(share) {
    const validateUpdateSharePrice = await this.validateUpdateSharePrice(share);

    let res = {
      status: true,
      message: "Successful."
    };

    if(validateUpdateSharePrice.status === false) {
      res.message = validateUpdateSharePrice.message;
      res.status = false;

      return res;
    }

    const resultShare = validateUpdateSharePrice.message;
    const shareRepository = new ShareRepository();
    const createres = await shareRepository.updatePriceAndDate(resultShare.id,share.newPrice);

    if(createres === null) {
      res.message = "The registered share cannot updated!";
      res.status = false;

      return res; 
    }

    //If trade side is BUY, update trader's balance and blocked balance values
    if(resultShare.tradeSide === "BUY") {
      const priceDifference = Number(share.newPrice) - Number(resultShare.price);
      const totalAmount = priceDifference * resultShare.registeredAmount;
      
      const traderRepository = new TraderRepository();
      const resShare = traderRepository.updateTradersBalanceForRegisterShare(share.traderId, totalAmount);
      if(!resShare) {
        res.message = "The registered share cannot updated!";
        res.status = false;

        return res;  
      }
      else{
        res.message = "The registered share updated successfully!";
        res.status = true;

        return res; 
      }
    }
    else if(resultShare.tradeSide === "SELL") {
      res.message = "The registered share updated successfully!";
      res.status = true;

      return res;
    }
    return res;
  }

  async validateBuyShare(trade){
    try {
      let res = {
        status: true,
        message: ""
      };
      //Return an error message if any data is blank
      if(isNaN(trade.shareId) || (!trade.shareCode) || isNaN(trade.buyAmount) || isNaN(trade.buyerTraderId)) {
        res.status = false;
        res.message = "Please enter all values completely!";

        return res;
      }
      //Registered Id Check
      if(trade.shareId <= 0) {
        res.status = false;
        res.message = "The registered share ID cannot be null!";

        return res;
      }

      //Buy Amount Check
      if(trade.buyAmount <= 0) {
        res.status = false;
        res.message = "Amount cannot be empty or negative value!";

        return res;
      }

      //Buyer Trader Id Check
      if(trade.buyerTraderId <= 0) {
        res.status = false;
        res.message = "TraderId cannot be null!";

        return res;
      }

      const tradersPortfoliosRepository = new TradersPortfoliosRepository();
      //Trader portfolio check
      const isTruePortfolio = await tradersPortfoliosRepository.checkTraderPortfolio(trade.buyerTraderId, trade.shareCode);
      if (!isTruePortfolio) {
        res.status = false;
        res.message = "Share should be registered in the trader portfolio!";

        return res;
      } 
      const shareRepository = new ShareRepository();

      //Get Registered Share Record for check
      const reqShare = await shareRepository.getRegisteredShare(trade.shareId);
      
      //Record check
      if (reqShare === null) {
        res.status = false;
        res.message = "Share is not registered or does not belong to this trader!";

        return res;
      } 

      //Check registered share's trade side, Should be SELL for this trader!
      if(reqShare.tradeSide != "SELL") {
        res.status = false;
        res.message = "The selected share is not suitable for BUY!";

        return res;
      }

      //Check amount of registered share and trade amount
      if(reqShare.registeredAmount < trade.buyAmount) {
        res.status = false;
        res.message = "The amount to be purchased cannot exceed the entire share!";

        return res;
      }

      const traderRepository = new TraderRepository();
      //Check trader's balance for this transaction
      const traderBalance = await traderRepository.getTraderBalance(trade.buyerTraderId);
      const totalAmount = reqShare.price * trade.buyAmount;
      
      if(traderBalance < totalAmount) {
        res.status = false;
        res.message = "Trader balance is not enough for trading!";

        return res;
      }

      res.status = true;
      res.message = reqShare;

      return res;
    } catch (err) {
      return null;
    } 
  }

  async validateSellShare(trade){
    try {
      let res = {
        status: true,
        message: ""
      };

      //Return an error message if any data is blank
      if(isNaN(trade.shareId) || (!trade.shareCode) || isNaN(trade.sellAmount) || isNaN(trade.sellerTraderId)) {
        res.status = false;
        res.message = "Please enter all values completely!";

        return res;
      }

      //Registered Id Check
      if(trade.shareId <= 0) {
        res.status = false;
        res.message = "The registered share ID cannot be null!";

        return res;
      }

      //Sell Amount Check
      if(trade.sellAmount <= 0) {
        res.status = false;
        res.message = "Amount cannot be empty or negative value!";

        return res;
      }

      //Seller Trader Id Check
      if(trade.sellerTraderId <= 0) {
        res.status = false;
        res.message = "TraderId cannot be null!";

        return res;
      }

      const tradersPortfoliosRepository = new TradersPortfoliosRepository();
      //Trader portfolio check
      const isTruePortfolio = await tradersPortfoliosRepository.checkTraderPortfolio(trade.sellerTraderId, trade.shareCode);
    
      if (!isTruePortfolio) {
        res.status = false;
        res.message = "Share should be registered in the trader portfolio!";

        return res;
      } 

      const shareRepository = new ShareRepository();
      //Get Registered Share Record for check
      const reqShare = await shareRepository.getRegisteredShare(trade.shareId);
      
      //Record check
      if (reqShare === null) {
        res.status = false;
        res.message = "Share is not registered or does not belong to this trader!";

        return res;
      } 

      //Check registered share's trade side, Should be SELL for this trader!
      if(reqShare.tradeSide != "BUY") {
        res.status = false;
        res.message = "The selected share is not suitable for SELL!";

        return res;
      }

      //Check amount of registered share and trade amount
      if(reqShare.registeredAmount < trade.sellAmount) {
        res.status = false;
        res.message = "The amount to be purchased cannot exceed the entire share!";

        return res;
      }

      //Check trader's balance for this transaction
      const sellerAmount = await tradersPortfoliosRepository.getPortfiliosShareAmount(trade.sellerTraderId, trade.shareCode);
      if(sellerAmount < trade.sellAmount){
        res.status = false;
        res.message = "Trader balance is not enough for trading!";

        return res;
      }

      res.status = true;
      res.message = reqShare;

      return res;
    } catch (err) {
      return null;
    } 
  }

  validateCreateShare(share){
    try {
         let res = {
             status: true,
             message: "Ok."
         };

         if(isNaN(share.traderId) || (!share.name) || (!share.code) || isNaN(share.registeredAmount) || isNaN(share.price) || (!share.tradeSide)){
            res.status = false;
            res.message ="Missing parameter.";

            return res;
         }
         return res;
     } catch (err) {
         return null;
    } 
  }

  async validateRegisterShare(share){
    try {
      let res = {
        status: true,
        message: ""
      };
      //Return an error message if any data is blank
      if((!share.name) || (!share.code) || (!share.tradeSide) || isNaN(share.traderId) || isNaN(share.registeredAmount) || isNaN(share.price)){
        res.status = false;
        res.message ="Missing parameter.";

        return res;
      } 

      //TraderId Check
      if(share.traderId <= 0){
        res.status = false;
        res.message ="TraderId not null.";

        return res;
      }
      
      //Amount Check
      if(share.registeredAmount <= 0){
        res.status = false;
        res.message ="Amount cannot be empty or negative value!";

        return res;
      }

      //Price Check
      if(share.price <= 0){
        res.status = false;
        res.message ="Share price cannot be negative value!";

        return res;
      }

      const tradersPortfoliosRepository = new TradersPortfoliosRepository();
      //Trader portfolio check
      const isTruePortfolio = await tradersPortfoliosRepository.checkTraderPortfolio(share.traderId, share.code);
      if (!isTruePortfolio) {
        res.status = false;
        res.message ="Share should be registered in the trader portfolio!";

        return res;
      } 

      const tradersRepository = new TraderRepository();
      //If register transaction side buy, checking trader's balance 
      if (share.tradeSide == "BUY"){
        const traderBalance = await tradersRepository.getTraderBalance(share.traderId);
        const shareTotalBuyPrice = (share.registeredAmount * share.price).toFixed(2);
      
        if (traderBalance < shareTotalBuyPrice){
          res.status = false;
          res.message ="Trader balance is not enough for trading!";

          return res;
        }
      }
      else if (share.tradeSide == "SELL"){ //If register transaction side sell, checking trader's share amount
        const portfoliosShareAmount = await tradersPortfoliosRepository.getPortfiliosShareAmount(share.traderId, share.code);
        
        if (portfoliosShareAmount < share.registeredAmount){
          res.status = false;
          res.message ="The share amount is not enough for trading!";

          return res;
        }
      }
      else {
        res.status = false;
        res.message ="Unsupported trade type!";

        return res;
      }

      return res;
    } catch (err) {
      return null;
    } 
  }

  async validateUpdateSharePrice(share){
    try {
      let res = {
        status: true,
        message: ""
      };

      //Return an error message if any data is blank
      if(isNaN(share.id) || isNaN(share.traderId) || (!share.code) || isNaN(share.newPrice)){
        res.status = false;
        res.message ="Please enter all values completely!";

        return res;
      }

      //Id Check
      if(share.id <= 0){
        res.status = false;
        res.message ="Id cannot be null!";

        return res;
      }

      //TraderId Check
      if(share.traderId <= 0){
        res.status = false;
        res.message ="TraderId cannot be null!";

        return res;
      }

      //Share Price Check
      if(share.newPrice <= 0){
        res.status = false;
        res.message ="Share price cannot be negative value!";

        return res;
      }

      const shareRepository = new ShareRepository();
      const reqShare = await shareRepository.getRegisteredShareCode(share.id, share.traderId, share.code);
  
      if (reqShare === null) {
        res.status = false;
        res.message ="Share is not registered or does not belong to this trader!";

        return res;
      } 

      //Last Update Date Check
      const dateNow = new Date();
      const hoursDifference = Math.abs(dateNow - reqShare.updatedAt) / 36e5;;
      
      if (hoursDifference < 1){
        res.status = false;
        res.message ="You can only update the price once in hour!";

        return res;
      }

      const traderRepository = new TraderRepository();
      //If registered transaction side buy and new price is bigger than old price, check trader's balance
      if((share.newPrice > reqShare.price) && (reqShare.tradeSide == "BUY")){
        const priceDifference = Number(share.newPrice) - Number(reqShare.price);
        const traderBalance = await traderRepository.getTraderBalance(share.traderId);
        const shareTotalBuyPriceDifference = (Number(reqShare.RegisteredAmount) * Number(priceDifference)).toFixed(2);
        
        //if trader hasn't enough balance for update price
        if(traderBalance < shareTotalBuyPriceDifference){
          res.status = false;
          res.message ="Trader balance is not enough for trading!";

          return res;
        }
      }
      res.status = true;
      res.message = reqShare;
      return res;
    } catch (err) {
      return null;
    } 
  }
};
exports.ShareService = ShareService