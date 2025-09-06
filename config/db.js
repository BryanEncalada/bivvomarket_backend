const { Sequelize } = require("sequelize");


//BD - USR -PWD
// const sequelize = new Sequelize('enervymc_bivvo', 'enervymc_bivvo', 'xvVDTkEF7nET3f7zry4U', {

//     host:'201.148.107.153',
//     dialect:'mysql'
// });


const sequelize = new Sequelize('brunella_bivvo', 'brunella_bivvo', 'kV70!9QMTOlM', {

    host:'201.148.104.66',
    dialect:'mysql'
});



const connectDB = async () => {
   sequelize.authenticate().then(
        () => {

            console.log("Se conecto");
        }
    ).catch(
        () => {

            console.log("No se conecto");
        }

    );
};

module.exports = { connectDB, sequelize }; ;
