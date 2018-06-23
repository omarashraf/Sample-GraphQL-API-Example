const hapi = require('hapi');
const mongoose = require('mongoose');
const Router = require('./routes/routes');
const schema = require('./graphql/schema');

const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const dotenv = require('dotenv');
const result = dotenv.config()

mongoose.connect(`mongodb://${result.parsed["USER"]}:${result.parsed["PASSWORD"]}@${result.parsed["DB"]}`);

mongoose.connection.once('open', () => {
    console.log("connected to mlab's db");
}, (err) => {
    console.log("ERR --> ", err);
});

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});

const init = async () => {

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Paintings API Documentation',
                    version: Pack.version
                }
            }
        }
    ]);

    await server.register({
        plugin: graphiqlHapi,
        options: {
            path: '/graphiql',
            graphiqlOptions: {
                endpointURL: '/graphql'
            },
            route: {
                cors: true
            }
        }
    });

    await server.register({
        plugin: graphqlHapi,
        options: {
            path: '/graphql',
            graphqlOptions: {
                schema
            },
            route: {
                cors: true
            }
        }
    });

    server.route(Router.routes);

    await server.start();
    console.log(`Server is running at: ${server.info.uri}`);
}

init();
