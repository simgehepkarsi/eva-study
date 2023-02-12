module.exports = (sequelize, Sequelize) => {
    const Share = sequelize.define("share", {
      traderId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING(3),
        allowNull: false
      },
      registeredAmount: {
        type: Sequelize.DOUBLE
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      tradeSide: {
        type: Sequelize.STRING
      }
    });
  
    return Share;
  };