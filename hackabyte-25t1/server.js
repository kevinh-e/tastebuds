import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "https://admin.socket.io"],
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

  const data = {};

  function addRoom(roomCode, roundTime) {
    data[roomCode] = {
      roomMembers: {},
      restaurants: [],
      roomSettings: {
        roomCode: roomCode,
        roundTime: roundTime,
      }
    }
  }

  function joinRoom(roomCode, id, name) {
    data[roomCode].roomMembers[id] = {
      name: name,
      isHost: false,
      preferences: {},
    };
  }

  function setPreferences(roomCode, id, preferences) {
    data[roomCode].roomMembers[id].preferences = preferences;
  }

  io.on("connection", (socket) => {
    socket.on("createRoom", (roundTime, id, hostname, cb) => {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      addRoom(roomCode, roundTime);

      const member = {
        name: hostname,
        isHost: true,         // default value, adjust if necessary
        preferences: {},
      };
      data[roomCode].roomMembers[id] = member;

      cb(roomCode);
      socket.join(roomCode);
      io.in(roomCode).emit("syncData", JSON.stringify(data[roomCode]));
    });

    socket.on("joinRoom", (roomCode, id, name, cb) => {
      socket.join(roomCode);
      joinRoom(roomCode, id, name);
      cb(roomCode);
      io.in(roomCode).emit("syncData", JSON.stringify(data[roomCode]));
    });

    socket.on("reccomendationsBroadcast", (roomCode, recommendations) => {
      data[roomCode].restaurants = JSON.parse(recommendations);
      io.in(roomCode).emit("reccomendationsRecieved", JSON.stringify(data[roomCode]));
    });

    socket.on("sendPreferences", (roomCode, preferences, id, cb) => {
      // add/replace preferences to data
      setPreferences(roomCode, id, JSON.parse(preferences));
      io.in(roomCode).emit("syncData", JSON.stringify(data[roomCode]));
      cb(JSON.stringify(data));
    });

    socket.on("senderUserVote", (vote, id, cb) => {
      // add/replace vote to data
      data.roomMembers[id].vote = vote;

      // call back to confirm the data was sent
      // cb("sent data: \n" + vote + "\n\nwith id:\n" + id);
      cb(JSON.stringify(data));
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });

  instrument(io, {
    auth: false,
  });
});
