module.exports = (sequelize, Sequelize) => {
    const Trader = sequelize.define("trader", {
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      balance: {
        type: Sequelize.DOUBLE
      },
      blockedBalance: {
        type: Sequelize.DOUBLE
      }
    });
  
    return Trader;
  };