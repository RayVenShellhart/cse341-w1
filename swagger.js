const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Contacts Api',
        description: 'Contacts Api'
    },
    host: 'localhost:3000',
    schemes: [ 'http', 'https' ]
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js']

swaggerAutogen(outputFile, endpointFiles, doc);