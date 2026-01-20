import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

console.log("Checking DNS for URI:", mongoURI);

const clusterHost = mongoURI.split("@")[1].split("/")[0];
console.log("Cluster Host:", clusterHost);

dns.resolveSrv(`_mongodb._tcp.${clusterHost}`, (err, addresses) => {
    if (err) {
        console.error("DNS SRV Lookup failed:", err);
    } else {
        console.log("DNS SRV Lookup success:", addresses);
    }
});

mongoose.connect(mongoURI)
    .then(() => {
        console.log("✅ Successfully connected to MongoDB");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });
