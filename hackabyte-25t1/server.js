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

// const views = {
//   LOBBY: "LOBBY",
//   PREFERENCES: "PREFERENCES",
// };

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "https://admin.socket.io"],
      methods: ["GET", "POST"],
      credentials: true,
    }
  });
  /** data follows the following structure:
   *  {
   *    - dictionary of room members
   *    room members: {
   *      id: {
   *        isHost: boolean,
   *        preferences: {
   *          cuisineTags: string[],
   *          locationTags: string[],
   *          prices: string[],
   *          rating: string,
   *        },
   *        currentView: 
   *      }
   *    },
   *
   *    - array of retaurants
   *    restaurants: [
   *
   *    ],
   *
   *    roomSettings: {
   *      roomCode: string,
   *      roundTime: number,
   *    },
   *  }
   */
  const data = {};
  data.roomMembers = data.roomMembers || {};

  io.on("connection", (socket) => {
    socket.on("createRoom", (roundTime, id, cb) => {
      // create room code
      // set round time
      // add user as host
      data.roomMembers[id] = data.roomMembers[id] || {
        isHost: true,         // default value, adjust if necessary
        preferences: {},
        currentView: null      // or another default value
      };
      data.roomSettings = data.roomSettings || {
        roomCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        roundTime: roundTime,
      };
      // send back data
      cb(JSON.stringify(data));
    });

    socket.on("joinRoom", (id, cb) => {
      data.roomMembers[id] = data.roomMembers[id] || {
        isHost: false,
        preferences: {},
        currentView: null      // or another default value
      };
      cb(JSON.stringify(data));
    });
    // send data to the clients to sync them
  });

  socket.on("sendPreferences", (preferences, id, cb) => {
    // add/replace preferences to data
    data.roomMembers[id].preferences = preferences;

    // call back to confirm the data was sent
    // cb("sent data: \n" + preferences + "\n\nwith id:\n" + id);
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
