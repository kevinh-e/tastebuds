import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

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

  const io = new Server(httpServer);
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

  io.on("connection", (socket) => {
    socket.on("preferences", (preferences, id, cb) => {
      // add/replace preferences to data

      cb("sent data: \n" + preferences + "\n\nwith id:\n" + id);
    })
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
