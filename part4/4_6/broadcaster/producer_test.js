const { connect, StringCodec  } = require("nats");

connect({ servers: "demo.nats.io:4222" }).then(async (nc) => {
    const sc = StringCodec();

    nc.publish("messages", sc.encode("world"));
    nc.publish("messages", sc.encode("again"));
    
}).catch((err) => {
    console.error(err);
});
