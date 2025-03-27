# Data structure design

### Main Data Object

```

```

data: {
    roomCode: {
        roomMembers: {
            id: {
                name: string,
                isHost: boolean,
                preferences: {
                  cuisineTags: string[],
                  locationTags: string[],
                  prices: string[] (eg. [$, $$, $$$, $$$$], or [$, $$, $$$$]),
                  rating: string,
                }
            }
        },
        restaurants: [ {
            place: PLACE (refer to PLACE OBJECT heading),
            countDownStart: datetime.datetime,
            votes: {
                yes: string[] (string of user Ids),
                no: string[] (string of user Ids),
            },
            reactions: {
              id: string,
            },
            thumbnail: string,
        } ],
        roomSettings: {
          restIndex: number,
          roomCode: string,
          roundTime: number,
        }
    }
}

```
```

## Place object can be found on google API
