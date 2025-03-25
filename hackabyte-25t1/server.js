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
        restIndex: -1,
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

  function setVote(roomCode, id, vote, restIndex) {
    const votes = data[roomCode].restaurants[restIndex].votes;

    if (vote === "yes") {
      // Remove id from the "no" votes
      votes.no = votes.no.filter(v => v !== id);
      // Toggle id in the "yes" votes
      votes.yes = votes.yes.includes(id)
        ? votes.yes.filter(v => v !== id)
        : [...votes.yes, id];
    } else if (vote === "no") {
      // Remove id from the "yes" votes
      votes.yes = votes.yes.filter(v => v !== id);
      // Toggle id in the "no" votes
      votes.no = votes.no.includes(id)
        ? votes.no.filter(v => v !== id)
        : [...votes.no, id];
    }
  }

  function setReaction(roomCode, id, reaction, restIndex) {
    // Get the restaurant based on restIndex
    const restaurant = data[roomCode].restaurants[restIndex];
    if (!restaurant) return;

    // Ensure there's a place to store reactions
    if (!restaurant.reactions) {
      restaurant.reactions = {};
    }

    // If reaction is falsy or an empty string, we can remove the user's reaction
    if (!reaction) {
      delete restaurant.reactions[id];
    } else {
      // Otherwise, store or update the reaction
      restaurant.reactions[id] = reaction;
    }
  }

  function setThumbnail(roomCode, restIndex, url) {
    data[roomCode].restaurants[restIndex].thumbnail = url;
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
      io.in(roomCode).emit("newUser", JSON.stringify({ id, name }));
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

    socket.on("sendUserVote", (vote, id, roomCode, restaurantIndex, cb) => {
      // add/replace vote to data
      setVote(roomCode, id, vote, restaurantIndex);
      // call back to confirm the data was sent
      cb(data[roomCode].restaurants[restaurantIndex].votes);
      // cb("sent data: \n" + vote + "\n\nwith id:\n" + id);
      // cb(JSON.stringify(data));
      io.in(roomCode).emit("syncData", JSON.stringify(data[roomCode]));
    });

    socket.on("nextRestaurant", (roomCode, hostStartTime) => {
      if (data[roomCode].roomSettings.restIndex >= data[roomCode].restaurants.length) {
        // podium time
        io.in(roomCode).emit("gotoResults");
      } else {
        // go to the next restuarant for everyone
        data[roomCode].roomSettings.restIndex += 1;
        data[roomCode].restaurants[data[roomCode].roomSettings.restIndex].countDownStart = hostStartTime;
        io.in(roomCode).emit("startNextCard", JSON.stringify(data[roomCode]));
      }
    });

    socket.on("sendUserVote", (vote, id, roomCode, restaurantIndex, cb) => {
      // add/replace vote to data
      setVote(roomCode, id, vote, restaurantIndex);
      // call back to confirm the data was sent
      cb(data[roomCode].restaurants[restaurantIndex].votes);
      // cb("sent data: \n" + vote + "\n\nwith id:\n" + id);
      // cb(JSON.stringify(data));
      io.in(roomCode).emit("syncData", JSON.stringify(data[roomCode]));
    });

    socket.on("sendUserReaction", (reaction, id, roomCode, restIndex, cb) => {
      // Store or remove the user's reaction in `data`
      setReaction(roomCode, id, reaction, restIndex);

      const userName = data[roomCode].roomMembers[id]?.name || "Unknown user";

      // Broadcast a toast *only* to others in the same room — not back to the sender
      // `socket.to(...)` ensures the event is *not* sent to the socket who emitted it
      socket.to(roomCode).emit("reactionToast", { userName, reaction });

      // Send back any updated data if needed
      cb(data[roomCode].restaurants[restIndex].reactions);

      // Then sync your updated room data with everyone
      io.in(roomCode).emit("syncData", JSON.stringify(data[roomCode]));
    });

    socket.on("setThumbnail", (roomCode, restIndex, url, cb) => {
      // Store or remove the user's reaction in `data`
      setThumbnail(roomCode, restIndex, url);

      // Then sync your updated room data with everyone
      io.in(roomCode).emit("syncData", JSON.stringify(data[roomCode]));
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
