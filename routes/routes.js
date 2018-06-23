const Painting = require('../models/Painting');

exports.routes = [   
    {
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            return `<h1>Here we go</h1>`;
        }
    },
    {
        method: 'GET',
        path: '/api/v1/paintings',
        config: {
            description: 'Get all paintings',
            tags: ['api', 'v1', 'painting']
        },
        handler: function(request, reply) {
            return Painting.find();
        }   
    },
    {
        method: 'POST',
        path: '/api/v1/paintings',
        config: {
            description: 'Get painting by ID',
            tags: ['api', 'v1', 'painting']
        },
        handler: function(request, reply) {
            const { name, url, techniques } = request.payload;
            const painting = new Painting({
                name,
                url,
                techniques
            })
            return painting.save();
        }   
    }
];