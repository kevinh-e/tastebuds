class RoomService {
  constructor() { this.data = {} }

  addRoom(roomCode, roundTime) {
    this.data[roomCode] = {
      roomMembers: {},
      restaurants: [],
      roomSettings: {
        roomCode: roomCode,
        roundTime: roundTime,
        restIndex: -1,
      }
    }
  }

  removeRoom(roomCode) {
    delete this.data[roomCode];
  }

  joinRoom(roomCode, id, name) {
    console.log(`${id} joined the room (${roomCode})`)
    this.data[roomCode].roomMembers[id] = {
      name: name,
      isHost: false,
      preferences: {},
    };
  }

  leaveRoom(roomCode, id) {
    console.log(`${id} left the room (${roomCode})`)
    // set a new host
    if (this.data[roomCode].roomMembers[id].isHost) {
      if (Object.entries(this.data[roomCode].roomMembers).length > 1) {
        delete this.data[roomCode].roomMembers[id];
        const key = Object.keys(this.data[roomCode].roomMembers)[0];
        console.log(key);
        this.data[roomCode].roomMembers[key].isHost = true;
      } else {
        // delete the room if it the last user
        this.removeRoom(roomCode);
      }
      return;
    }
    delete this.data[roomCode].roomMembers[id];
  }

  setPreferences(roomCode, id, preferences) {
    this.data[roomCode].roomMembers[id].preferences = preferences;
  }

  setVote(roomCode, id, vote, restIndex) {
    const votes = this.data[roomCode].restaurants[restIndex].votes;

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

  setReaction(roomCode, id, reaction, restIndex) {
    // Get the restaurant based on restIndex
    const restaurant = this.data[roomCode].restaurants[restIndex];
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

  setThumbnail(roomCode, restIndex, url) {
    this.data[roomCode].restaurants[restIndex].thumbnail = url;
  }

}
export default RoomService;
