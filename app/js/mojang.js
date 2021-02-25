const request = require('request');

// Constants
const minecraftAgent = {
    name: 'Minecraft',
    version: 1
};
const authpath = 'https://authserver.mojang.com';
const statuses = [
    {
        service: 'sessionserver.mojang.com',
        status: 'grey',
        name: 'Multiplayer Session Service',
        essential: true
    },
    {
        service: 'authserver.mojang.com',
        status: 'grey',
        name: 'Authentication Service',
        essential: true
    },
    {
        service: 'textures.minecraft.net',
        status: 'grey',
        name: 'Minecraft Skins',
        essential: false
    },
    {
        service: 'api.mojang.com',
        status: 'grey',
        name: 'Public API',
        essential: false
    },
    {
        service: 'minecraft.net',
        status: 'grey',
        name: 'Minecraft.net',
        essential: false
    },
    {
        service: 'account.mojang.com',
        status: 'grey',
        name: 'Mojang Accounts Website',
        essential: false
    }
];

// Functions

/**
 * Retrieves the status of Mojang's services.
 * The response is condensed into a single object. Each service is
 * a key, where the value is an object containing a status and name
 * property.
 *
 * @see http://wiki.vg/Mojang_API#API_Status
 */
exports.status = function(){
    return new Promise((resolve, reject) => {
        request.get('https://status.mojang.com/check',
            {
                json: true,
                timeout: 2500
            },
            function(error, response, body){

                if(error || response.statusCode !== 200){
                    console.log('Unable to retrieve Mojang status.');
                    console.log('Error while retrieving Mojang statuses:', error);
                    //reject(error || response.statusCode)
                    for(let i=0; i<statuses.length; i++){
                        statuses[i].status = 'grey';
                    }
                    resolve(statuses);
                } else {
                    for(let i=0; i<body.length; i++){
                        const key = Object.keys(body[i])[0];
                        inner:
                        for(let j=0; j<statuses.length; j++){
                            if(statuses[j].service === key) {
                                statuses[j].status = body[i][key];
                                break inner;
                            }
                        }
                    }
                    resolve(statuses);
                }
            });
    });
};
