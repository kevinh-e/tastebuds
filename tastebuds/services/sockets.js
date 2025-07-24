import roomService from "./roomService.js";

export const handleSockets = (io) => {
  const rs = new roomService();

  io.on("connection", (socket) => {
    socket.on("createRoom", (roundTime, id, hostname, cb) => {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      rs.addRoom(roomCode, roundTime);

      const member = {
        name: hostname,
        isHost: true,         // default value, adjust if necessary
        preferences: {},
      };
      rs.data[roomCode].roomMembers[id] = member;

      cb(roomCode);
      socket.join(roomCode);
      io.in(roomCode).emit("syncData", JSON.stringify(rs.data[roomCode]));
    });

    socket.on("leaveRoom", (roomCode, id, cb) => {
      socket.leave(roomCode);
      rs.leaveRoom(roomCode, id);
      io.in(roomCode).emit("syncData", JSON.stringify(rs.data[roomCode]));
      if (typeof cb === "function") cb()
    });

    socket.on("joinRoom", (roomCode, id, name, cb) => {
      socket.join(roomCode);
      rs.joinRoom(roomCode, id, name);
      cb(roomCode);
      io.in(roomCode).emit("syncData", JSON.stringify(rs.data[roomCode]));
      io.in(roomCode).emit("newUser", JSON.stringify({ id, name }));
    });

    socket.on("reccomendationsBroadcast", (roomCode, recommendations) => {
      rs.data[roomCode].restaurants = JSON.parse(recommendations);

      // Start the first restaurant immediately
      if (rs.data[roomCode].restaurants.length > 0) {
        rs.data[roomCode].roomSettings.restIndex = 0;
        rs.data[roomCode].restaurants[0].countDownStart = Date.now();
      }

      io.in(roomCode).emit("reccomendationsRecieved", JSON.stringify(rs.data[roomCode]));
    });

    socket.on("sendPreferences", (roomCode, preferences, id, cb) => {
      // add/replace preferences to data
      rs.setPreferences(roomCode, id, JSON.parse(preferences));
      io.in(roomCode).emit("syncData", JSON.stringify(rs.data[roomCode]));
      if (typeof cb == "function") cb(JSON.stringify(rs.data));
    });

    socket.on("nextRestaurant", (roomCode, hostStartTime) => {
      // Add room validation
      if (!rs.data[roomCode] || !rs.data[roomCode].restaurants) {
        console.error(`Room ${roomCode} not found or has no restaurants`);
        return;
      }

      if (rs.data[roomCode].roomSettings.restIndex >= rs.data[roomCode].restaurants.length) {
        // podium time
        io.in(roomCode).emit("gotoResults");
      } else {
        // go to the next restuarant for everyone
        rs.data[roomCode].roomSettings.restIndex += 1;

        // Add bounds checking before setting countDownStart
        const nextIndex = rs.data[roomCode].roomSettings.restIndex;
        if (nextIndex < rs.data[roomCode].restaurants.length && rs.data[roomCode].restaurants[nextIndex]) {
          rs.data[roomCode].restaurants[nextIndex].countDownStart = hostStartTime;
          io.in(roomCode).emit("startNextCard", JSON.stringify(rs.data[roomCode]));
        } else {
          // If we somehow exceeded bounds, go to results
          io.in(roomCode).emit("gotoResults");
        }
      }
    });

    socket.on("sendUserVote", (vote, id, roomCode, restaurantIndex) => {
      // Add room and restaurant validation
      if (!rs.data[roomCode] || !rs.data[roomCode].restaurants || !rs.data[roomCode].restaurants[restaurantIndex]) {
        console.error(`Invalid room ${roomCode} or restaurant index ${restaurantIndex}`);
        return;
      }

      // add/replace vote to data
      rs.setVote(roomCode, id, vote, restaurantIndex);
      // call back to confirm the data was sent
      const userName = rs.data[roomCode].roomMembers[id]?.name || "Unknown user";
      socket.to(roomCode).emit("voteToast", { userName, vote });

      io.in(roomCode).emit("syncData", JSON.stringify(rs.data[roomCode]));
    });

    socket.on("sendUserReaction", (reaction, id, roomCode, restIndex, cb) => {
      // Add room and restaurant validation
      if (!rs.data[roomCode] || !rs.data[roomCode].restaurants || !rs.data[roomCode].restaurants[restIndex]) {
        console.error(`Invalid room ${roomCode} or restaurant index ${restIndex}`);
        if (typeof cb === "function") cb({});
        return;
      }

      // Store or remove the user's reaction in `data`
      rs.setReaction(roomCode, id, reaction, restIndex);
      console.log("EMITTING react TOAST")

      const userName = rs.data[roomCode].roomMembers[id]?.name || "Unknown user";

      // Broadcast a toast *only* to others in the same room — not back to the sender
      // `socket.to(...)` ensures the event is *not* sent to the socket who emitted it
      socket.to(roomCode).emit("reactionToast", { userName, reaction });

      // Send back any updated data if needed
      cb(rs.data[roomCode].restaurants[restIndex].reactions);

      // Then sync your updated room data with everyone
      io.in(roomCode).emit("syncData", JSON.stringify(rs.data[roomCode]));
    });

    socket.on("setThumbnail", (roomCode, restIndex, url, cb) => {
      // Add room and restaurant validation
      if (!rs.data[roomCode] || !rs.data[roomCode].restaurants || !rs.data[roomCode].restaurants[restIndex]) {
        console.error(`Invalid room ${roomCode} or restaurant index ${restIndex}`);
        if (typeof cb === "function") cb();
        return;
      }

      // Store or remove the user's reaction in `data`
      rs.setThumbnail(roomCode, restIndex, url);

      // Then sync your updated room data with everyone
      io.in(roomCode).emit("syncData", JSON.stringify(rs.data[roomCode]));
    });
  });
};

export default handleSockets;
