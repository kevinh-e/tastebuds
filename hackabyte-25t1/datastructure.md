# Data structure design

### Main Data Object

```json


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

## Place object can be found on Google Places API documentation
<https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places>
