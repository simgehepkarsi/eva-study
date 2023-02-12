module.exports = (sequelize, Sequelize) => {
    const TransactionLogs = sequelize.define("transactionlogs", {
      traderId: {
        type: Sequelize.INTEGER
      },
      shareCode: {
        type: Sequelize.STRING
      },
      shareAmount: {
        type: Sequelize.DOUBLE
      },
      sharePrice: {
        type: Sequelize.DOUBLE
      },
      tradeSide: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      }
    });
  
    return TransactionLogs;
  };