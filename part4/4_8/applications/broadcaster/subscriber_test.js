const { connect, StringCodec  } = require("nats");

connect({ servers: "demo.nats.io:4222" }).then(async (nc) => {
    const sc = StringCodec();

    const sub = nc.subscribe("messages");
    (async () => {
        for await (const m of sub) {
          console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
        }
        console.log("subscription closed");
      })();

    //nc.publish("hello", sc.encode("world"));
    //nc.publish("hello", sc.encode("again"));
    
}).catch((err) => {
    console.error(err);
});
