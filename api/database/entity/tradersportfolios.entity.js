module.exports = (sequelize, Sequelize) => {
    const TradersPortfolios = sequelize.define("tradersportfolios", {
      traderId: {
        type: Sequelize.INTEGER
      },
      shareName: {
        type: Sequelize.STRING
      },
      shareCode: {
        type: Sequelize.STRING
      },
      shareAmount: {
        type: Sequelize.DOUBLE
      },
      shareBlockedAmount: {
        type: Sequelize.DOUBLE
      }
    });
  
    return TradersPortfolios;
  };