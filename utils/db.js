import mongoose from "mongoose";

const connection = {};

const connect = async () => {
  if (connection.isConnected) {
    console.log("User is Connected to Db");
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("Use previous connection");
      return;
    }
  }
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log("User has a new Connection to Db");
  connection.isConnected = db.connections[0].readyState;
};

const disConnect = async () => {
  if (connection.isConnected) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("not disconnected");
    }
  }
};

const db = { connect, disConnect };
export default db;
