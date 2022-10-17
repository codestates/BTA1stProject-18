
var Hapi = require("@hapi/hapi"),
    Content = require('@hapi/content')



const server = Hapi.server({
    host: 'localhost',
    port: 8080
});

var init = async () => {

    await server.register([
        { plugin: require('./dist/') }
    ]);


    await server.route({
        method: "*",
        path: "/fetch",
        options: {
            plugins: {
                body: { merge: true }
            },
        },


        handler: (request, h) => {
            console.log(request.method)
            console.log(request.headers);

            return h.response(request.payload);
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}


init();
