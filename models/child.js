// models/child.js
module.exports = (sequelize, DataTypes) => {
    const Child = sequelize.define('Child', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        height: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    });

    return Child;
};
