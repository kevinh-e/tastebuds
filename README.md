# Data structure design:

### Main Data Object
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

### PLACE OBJECT

Ew.

```
    const EXAMPLE_PLACE = {
        "name": "places/ChIJl44XdACxEmsRq10vi-qbegA",
        "id": "ChIJl44XdACxEmsRq10vi-qbegA",
        "types": [
            "chinese_restaurant",
            "restaurant",
            "food",
            "point_of_interest",
            "establishment"
        ],
        "nationalPhoneNumber": "0450 271 322",
        "internationalPhoneNumber": "+61 450 271 322",
        "formattedAddress": "130 Anzac Parade, Kensington NSW 2033, Australia",
        "addressComponents": [
            {
                "longText": "130",
                "shortText": "130",
                "types": [
                    "street_number"
                ],
                "languageCode": "en-US"
            },
            {
                "longText": "Anzac Parade",
                "shortText": "Anzac Parade",
                "types": [
                    "route"
                ],
                "languageCode": "en"
            },
            {
                "longText": "Kensington",
                "shortText": "Kensington",
                "types": [
                    "locality",
                    "political"
                ],
                "languageCode": "en"
            },
            {
                "longText": "Randwick City Council",
                "shortText": "Randwick City Council",
                "types": [
                    "administrative_area_level_2",
                    "political"
                ],
                "languageCode": "en"
            },
            {
                "longText": "New South Wales",
                "shortText": "NSW",
                "types": [
                    "administrative_area_level_1",
                    "political"
                ],
                "languageCode": "en"
            },
            {
                "longText": "Australia",
                "shortText": "AU",
                "types": [
                    "country",
                    "political"
                ],
                "languageCode": "en"
            },
            {
                "longText": "2033",
                "shortText": "2033",
                "types": [
                    "postal_code"
                ],
                "languageCode": "en-US"
            }
        ],
        "plusCode": {
            "globalCode": "4RRH36RF+PG",
            "compoundCode": "36RF+PG Kensington NSW, Australia"
        },
        "location": {
            "latitude": -33.9081441,
            "longitude": 151.2237956
        },
        "viewport": {
            "low": {
                "latitude": -33.9094136802915,
                "longitude": 151.2225330697085
            },
            "high": {
                "latitude": -33.90671571970851,
                "longitude": 151.22523103029147
            }
        },
        "rating": 4.3,
        "googleMapsUri": "https://maps.google.com/?cid=34511378818489771",
        "websiteUri": "https://www.instagram.com/paddy.chans",
        "regularOpeningHours": {
            "openNow": true,
            "periods": [
                {
                    "open": {
                        "day": 0,
                        "hour": 14,
                        "minute": 30
                    },
                    "close": {
                        "day": 0,
                        "hour": 21,
                        "minute": 30
                    }
                },
                {
                    "open": {
                        "day": 1,
                        "hour": 15,
                        "minute": 0
                    },
                    "close": {
                        "day": 1,
                        "hour": 21,
                        "minute": 0
                    }
                },
                {
                    "open": {
                        "day": 2,
                        "hour": 17,
                        "minute": 0
                    },
                    "close": {
                        "day": 2,
                        "hour": 21,
                        "minute": 0
                    }
                },
                {
                    "open": {
                        "day": 3,
                        "hour": 17,
                        "minute": 0
                    },
                    "close": {
                        "day": 3,
                        "hour": 21,
                        "minute": 0
                    }
                },
                {
                    "open": {
                        "day": 4,
                        "hour": 17,
                        "minute": 0
                    },
                    "close": {
                        "day": 4,
                        "hour": 21,
                        "minute": 0
                    }
                },
                {
                    "open": {
                        "day": 5,
                        "hour": 16,
                        "minute": 30
                    },
                    "close": {
                        "day": 5,
                        "hour": 22,
                        "minute": 0
                    }
                },
                {
                    "open": {
                        "day": 6,
                        "hour": 15,
                        "minute": 0
                    },
                    "close": {
                        "day": 6,
                        "hour": 22,
                        "minute": 0
                    }
                }
            ],
            "weekdayDescriptions": [
                "Monday: 3:00 – 9:00 PM",
                "Tuesday: 5:00 – 9:00 PM",
                "Wednesday: 5:00 – 9:00 PM",
                "Thursday: 5:00 – 9:00 PM",
                "Friday: 4:30 – 10:00 PM",
                "Saturday: 3:00 – 10:00 PM",
                "Sunday: 2:30 – 9:30 PM"
            ],
            "nextCloseTime": "2025-03-24T10:00:00Z"
        },
        "utcOffsetMinutes": 660,
        "adrFormatAddress": "<span class=\"street-address\">130 Anzac Parade</span>, <span class=\"locality\">Kensington</span> <span class=\"region\">NSW</span> <span class=\"postal-code\">2033</span>, <span class=\"country-name\">Australia</span>",
        "businessStatus": "OPERATIONAL",
        "userRatingCount": 248,
        "iconMaskBaseUri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet",
        "iconBackgroundColor": "#FF9E67",
        "displayName": {
            "text": "Paddy Chans",
            "languageCode": "en"
        },
        "primaryTypeDisplayName": {
            "text": "Chinese Restaurant",
            "languageCode": "en-US"
        },
        "takeout": true,
        "dineIn": true,
        "servesLunch": true,
        "servesDinner": true,
        "servesBeer": false,
        "servesWine": false,
        "currentOpeningHours": {
            "openNow": true,
            "periods": [
                {
                    "open": {
                        "day": 0,
                        "hour": 14,
                        "minute": 30,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 30
                        }
                    },
                    "close": {
                        "day": 0,
                        "hour": 21,
                        "minute": 30,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 30
                        }
                    }
                },
                {
                    "open": {
                        "day": 1,
                        "hour": 15,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 24
                        }
                    },
                    "close": {
                        "day": 1,
                        "hour": 21,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 24
                        }
                    }
                },
                {
                    "open": {
                        "day": 2,
                        "hour": 17,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 25
                        }
                    },
                    "close": {
                        "day": 2,
                        "hour": 21,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 25
                        }
                    }
                },
                {
                    "open": {
                        "day": 3,
                        "hour": 17,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 26
                        }
                    },
                    "close": {
                        "day": 3,
                        "hour": 21,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 26
                        }
                    }
                },
                {
                    "open": {
                        "day": 4,
                        "hour": 17,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 27
                        }
                    },
                    "close": {
                        "day": 4,
                        "hour": 21,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 27
                        }
                    }
                },
                {
                    "open": {
                        "day": 5,
                        "hour": 16,
                        "minute": 30,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 28
                        }
                    },
                    "close": {
                        "day": 5,
                        "hour": 22,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 28
                        }
                    }
                },
                {
                    "open": {
                        "day": 6,
                        "hour": 15,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 29
                        }
                    },
                    "close": {
                        "day": 6,
                        "hour": 22,
                        "minute": 0,
                        "date": {
                            "year": 2025,
                            "month": 3,
                            "day": 29
                        }
                    }
                }
            ],
            "weekdayDescriptions": [
                "Monday: 3:00 – 9:00 PM",
                "Tuesday: 5:00 – 9:00 PM",
                "Wednesday: 5:00 – 9:00 PM",
                "Thursday: 5:00 – 9:00 PM",
                "Friday: 4:30 – 10:00 PM",
                "Saturday: 3:00 – 10:00 PM",
                "Sunday: 2:30 – 9:30 PM"
            ],
            "nextCloseTime": "2025-03-24T10:00:00Z"
        },
        "primaryType": "chinese_restaurant",
        "shortFormattedAddress": "130 Anzac Parade, Kensington",
        "reviews": [
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/reviews/ChZDSUhNMG9nS0VJQ0FnSURfclkybk5REAE",
                "relativePublishTimeDescription": "a month ago",
                "rating": 5,
                "text": {
                    "text": "I was not expecting how good this would be. First time having a spice bag, shared a large which was the perfect amount. Def spicy, we will be back again!",
                    "languageCode": "en"
                },
                "originalText": {
                    "text": "I was not expecting how good this would be. First time having a spice bag, shared a large which was the perfect amount. Def spicy, we will be back again!",
                    "languageCode": "en"
                },
                "authorAttribution": {
                    "displayName": "Janet Michie",
                    "uri": "https://www.google.com/maps/contrib/110711939639997999548/reviews",
                    "photoUri": "https://lh3.googleusercontent.com/a/ACg8ocKkv6d0kBLl3Edtqx5EG0TasEDjEpWz5o8EUdJ98kIiSC2VRA=s128-c0x00000000-cc-rp-mo-ba3"
                },
                "publishTime": "2025-01-26T06:48:17.705998Z",
                "flagContentUri": "https://www.google.com/local/review/rap/report?postId=ChZDSUhNMG9nS0VJQ0FnSURfclkybk5REAE&d=17924085&t=1",
                "googleMapsUri": "https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sChZDSUhNMG9nS0VJQ0FnSURfclkybk5REAE!2m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/reviews/ChdDSUhNMG9nS0VJQ0FnTUN3OHFfdTd3RRAB",
                "relativePublishTimeDescription": "in the last week",
                "rating": 4,
                "text": {
                    "text": "It's a takeaway shop not a restaurant try the Newtown version if you're after a sit in experience.\n\nGood spice bag great value and very quick service.",
                    "languageCode": "en"
                },
                "originalText": {
                    "text": "It's a takeaway shop not a restaurant try the Newtown version if you're after a sit in experience.\n\nGood spice bag great value and very quick service.",
                    "languageCode": "en"
                },
                "authorAttribution": {
                    "displayName": "Steve South",
                    "uri": "https://www.google.com/maps/contrib/110628444796477949811/reviews",
                    "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjXTM7eBgDGzCTBc9ekLkurUVKHnbxgIr6yXh0Y8rmCRVCwQagMf=s128-c0x00000000-cc-rp-mo-ba5"
                },
                "publishTime": "2025-03-17T22:43:22.769815Z",
                "flagContentUri": "https://www.google.com/local/review/rap/report?postId=ChdDSUhNMG9nS0VJQ0FnTUN3OHFfdTd3RRAB&d=17924085&t=1",
                "googleMapsUri": "https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sChdDSUhNMG9nS0VJQ0FnTUN3OHFfdTd3RRAB!2m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/reviews/ChdDSUhNMG9nS0VJQ0FnSUR2bWJfNXNBRRAB",
                "relativePublishTimeDescription": "3 months ago",
                "rating": 5,
                "text": {
                    "text": "I got the salt and chilli curry chicken box and it was so nice, Very big box. Staff so friendly and lovely, gave me portion prawn crackers for free for Christmas, very friendly and festive. Couldn’t recommend it enough!",
                    "languageCode": "en"
                },
                "originalText": {
                    "text": "I got the salt and chilli curry chicken box and it was so nice, Very big box. Staff so friendly and lovely, gave me portion prawn crackers for free for Christmas, very friendly and festive. Couldn’t recommend it enough!",
                    "languageCode": "en"
                },
                "authorAttribution": {
                    "displayName": "Ciara Keating",
                    "uri": "https://www.google.com/maps/contrib/101008078010436476532/reviews",
                    "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjXomfjsgzWarZqa7mHW9d6-sXGWZ3hkGumODrirultZPkMcQ8_zLQ=s128-c0x00000000-cc-rp-mo"
                },
                "publishTime": "2024-12-21T22:55:29.310514Z",
                "flagContentUri": "https://www.google.com/local/review/rap/report?postId=ChdDSUhNMG9nS0VJQ0FnSUR2bWJfNXNBRRAB&d=17924085&t=1",
                "googleMapsUri": "https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sChdDSUhNMG9nS0VJQ0FnSUR2bWJfNXNBRRAB!2m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/reviews/ChZDSUhNMG9nS0VJQ0FnSUNQakpTb0FnEAE",
                "relativePublishTimeDescription": "4 months ago",
                "rating": 4,
                "text": {
                    "text": "Great little spot to get your Irish Chinese fix. The 3 in 1 has a delicious curry sauce. The satay prawns were good and the vegetable chow mein was also good. Pretty quick service when you get in shortly after opening time too.",
                    "languageCode": "en"
                },
                "originalText": {
                    "text": "Great little spot to get your Irish Chinese fix. The 3 in 1 has a delicious curry sauce. The satay prawns were good and the vegetable chow mein was also good. Pretty quick service when you get in shortly after opening time too.",
                    "languageCode": "en"
                },
                "authorAttribution": {
                    "displayName": "Carlito",
                    "uri": "https://www.google.com/maps/contrib/109494349894032546446/reviews",
                    "photoUri": "https://lh3.googleusercontent.com/a/ACg8ocLNCAyEL2NiKi7Dd_v-VyPcaF4PTFQJzgDdlWXi5U2mmPX1sQ=s128-c0x00000000-cc-rp-mo-ba6"
                },
                "publishTime": "2024-11-22T01:22:47.975869Z",
                "flagContentUri": "https://www.google.com/local/review/rap/report?postId=ChZDSUhNMG9nS0VJQ0FnSUNQakpTb0FnEAE&d=17924085&t=1",
                "googleMapsUri": "https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sChZDSUhNMG9nS0VJQ0FnSUNQakpTb0FnEAE!2m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/reviews/ChdDSUhNMG9nS0VJQ0FnSUR2LWF1NTdBRRAB",
                "relativePublishTimeDescription": "3 months ago",
                "rating": 3,
                "text": {
                    "text": "The food was quite tasty overall, but there were some quality issues. The fried rice was undercooked and had hard bits, while the batter on the chicken balls was underdone and still runny.\n\nHowever, the garlic sauce and chili onion topping were outstanding and definitely worth trying!",
                    "languageCode": "en"
                },
                "originalText": {
                    "text": "The food was quite tasty overall, but there were some quality issues. The fried rice was undercooked and had hard bits, while the batter on the chicken balls was underdone and still runny.\n\nHowever, the garlic sauce and chili onion topping were outstanding and definitely worth trying!",
                    "languageCode": "en"
                },
                "authorAttribution": {
                    "displayName": "Kayye C",
                    "uri": "https://www.google.com/maps/contrib/109672123323705893876/reviews",
                    "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjXb486wN4Po6l9vfhxgcedM_0RdoeLS3wl-irpRZNZu2A3Q2io=s128-c0x00000000-cc-rp-mo"
                },
                "publishTime": "2024-12-22T04:24:48.758853Z",
                "flagContentUri": "https://www.google.com/local/review/rap/report?postId=ChdDSUhNMG9nS0VJQ0FnSUR2LWF1NTdBRRAB&d=17924085&t=1",
                "googleMapsUri": "https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sChdDSUhNMG9nS0VJQ0FnSUR2LWF1NTdBRRAB!2m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            }
        ],
        "photos": [
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ34OvbN1Yf0PSzkeDQIgmQ9gW1bctPaCqlfM5q4OMYzrjzFx41DyVpem7X24ZUS0mcJD2q9o-CI4sBzFNxj4BtL0Z8gKdwLjI-xB3gviYaGpvEJSkzNSINpJp2h43W2-qZq_8C8bgWlrPRBXSnplQIYlPLzRmbWtS0SAehpm5qjpi4tOLYDxLupcp-h6L1txI_1IpkuupH-uCZAJNmZ58ZpbkLqF52-X7ZymEBvwfnb6t1HM1a4BpzGTO9Z-ASv-564ttmy414afLYTJg88Jl0HuuL4R96jDL99p_1IJBFwINjJHydGdGUFnjN6p3CjgQUk5kzMx8P8yIc5DGu1GA-M_Vr9-BthqwpaRfLyQPH0syWjQjn35gkvZ66C2WqTs0Y1IawBII0Bb--KqU1OHVDbr5-khSWFI-P-feBUPiPSWcVq",
                "widthPx": 4032,
                "heightPx": 3024,
                "authorAttributions": [
                    {
                        "displayName": "James Yong",
                        "uri": "https://maps.google.com/maps/contrib/107498932934211644732",
                        "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjUFdCXNxA3b7kudSA_ZMdIYJRUMsZ5TRFteg034PO6sOsF4G0Za=s100-p-k-no-mo"
                    }
                ],
                "flagContentUri": "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sCIHM0ogKEICAgICrvavcpAE&hl=en-US",
                "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgICrvavcpAE!2e10!4m2!3m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ0G6uXVU2FQgVX3JB1AlNvi60Ni1rv91nM-_XTpwVz_U5zeb9iuVpgC2mD3PMTSJl1PpjmwTH_KhtuVY_N_hq04bTEIWqaIMVASjUdfkAbeoNrUGIxb7-JqNwgLEaUp-hJjuy9hKHAgx6HRC5Enaq3yyTo_T-NTr_eJHE_RfHX1tPzU1xNxKZMMGq-64prOQF9u6z3sJ1PxlYxaLhryEKVTXjxTWrfe7f3nA5efBwJ3EUi7eG31wELXHptklmUGlTCyRc4qNiUVetrOLI68kbHJ7D3UPMKDn0EMVT_7SaYXV6UDMwYMnglJV-oorAogBJicCm0QPx2f2L4oQJnhTqMMhSA_p25VkGeThT2pOYk8NuB4_qF9I9YAIjKACJo7dSlGyQemY6EcjOX83Y3rFfJDTa8OLOtRVmlffXBE7R32fhaT",
                "widthPx": 1950,
                "heightPx": 4080,
                "authorAttributions": [
                    {
                        "displayName": "Thomas Martin",
                        "uri": "https://maps.google.com/maps/contrib/104799039342857105035",
                        "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjUB0iX1KOgVU7-PDiEcAlqyv8eONkS5TEQlCR5Nf-cdRoPf29Mz7A=s100-p-k-no-mo"
                    }
                ],
                "flagContentUri": "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sCIHM0ogKEICAgIC_rpvd1QE&hl=en-US",
                "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgIC_rpvd1QE!2e10!4m2!3m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ3nC19dwwKSOUbjSkO5ZmMr1WjVr7lyrwb5bzQUxpFD8wEr9AOsk9V31zw3HSmBNtBhoVyxDzX7juVsJz8lIVxPXeMJLArwdsgPbr3Tb7NA8dKrSBacdWB_nZMABNjdijeKU_HAW5xoc85s-dnho2bpU0sGddUUG-oxxw0aITJFfrNq9qjOhvD-c2ylVSP2KJDFBaOKGleZSGW3fiGEoC7H-Pm3vTbn0c7RjmKzSVOEWaS0AseA_ktR37iA3VPxx4IHsd2ePqFlycqxPd2017XefB-p1XQH5sjAnkDJURGFj1O8ptfXwf9f7M7NwTa9dQwyru0M-sByVGLKn_lcqo3HNK0Y26pdXm0WKCXKWWFenC-Actm7hsge96r64reyZ1FCSc2J9ek3FY3FFd9yqwE3fKTtCrXRjWMBVRhh4HtDJDla",
                "widthPx": 3024,
                "heightPx": 4032,
                "authorAttributions": [
                    {
                        "displayName": "Will Suen",
                        "uri": "https://maps.google.com/maps/contrib/102356598477405062192",
                        "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjUMv3VVg5wHwA6vQfMGFf7iUNpPZYfrmxwYULc0u0rbxHnjs1Q=s100-p-k-no-mo"
                    }
                ],
                "flagContentUri": "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sCIHM0ogKEICAgIDb2ZbApQE&hl=en-US",
                "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgIDb2ZbApQE!2e10!4m2!3m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ3Klc_ssNGhMIAtoO2NFNxas1Yf90RtadZWYDcyHtpFscWIEAUCpcYswKmHgw7pl6ssWpqrfCVMzN_AqpmTd-gTOpsBO3JMRuaWILpdRkjBlPtkXM-zGTpBBbC85DlAkIBRfSYveQG5izoH-roRgEv8_dcEHs2M9azYkyq_BFhDcQkRG56Oy5wyggJ6LnCA9mpNtTP2PYj_Co9qC7XkXdvTJVcsn5M6rFP-8R7RGwpMk_XI73EwMJ8FEyORlGuOT5sENyRrXaFveX23VI0AQMLiVWeW3Jf6r_BRF8Ggqy8nrb09PQK_klcGv28V8U1e_Sf4nOXr8MI_Wktf12A1dZH0pOovAJj0ArM_LCNGhWxbwGdht67oStrHBVWoGZmYNuCiroi9sRthAPiwCjXdQhb1NizwT673katwgkw93kpQpjw",
                "widthPx": 1536,
                "heightPx": 2048,
                "authorAttributions": [
                    {
                        "displayName": "rachelohora",
                        "uri": "https://maps.google.com/maps/contrib/107406842202510097152",
                        "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjU_ruzGRf4WLHJZxXYfmc4IjwS_wXI12glEmVs6dYMAJxUEgKRbWw=s100-p-k-no-mo"
                    }
                ],
                "flagContentUri": "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sCIHM0ogKEICAgICT596uqgE&hl=en-US",
                "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgICT596uqgE!2e10!4m2!3m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ2PAI6kxuVkukjT7iHayk9b2-8C-cs77LAG89L8WkHK32Su5wBoHeRM__QRuTj071Wbi_itHUPLb82xyBZol_INsAsKRPHBQvTcnKmkm2bBxKjoXEwjMZ7wMLBkPK9Y4FdtBYjjl00XR86PqMSwvhTP5Kv8zjKfOF6WIVi243XsYD1CDr26KfJu1aVeEyATBNtVLgJ9jxxlM5PZzaXLGF_fOTx0130fI5m_6hKs9qMfwtiNl1oVMQ_tr3JmhvfzHYWtEdGAQ8X50e9J5F_Xs9KyA0fiU0_3CYUadvetEv5Va8WT6sCnSJFEGXEjjaHAyc1W1U3ju2gbc-6oWpL5LgWS6abhnORjlrdHhTBFG2noHKAmHHXr5GZhUo0-7b9h5leZGe5HrE9fpVdScEsyoo444_-8VriuF6uIP09HHTMJc2U",
                "widthPx": 3024,
                "heightPx": 4032,
                "authorAttributions": [
                    {
                        "displayName": "Lauren Mc D",
                        "uri": "https://maps.google.com/maps/contrib/102369997256393163563",
                        "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjUIoLkvGcYemh4Xe8e-WANQ7FQPgZqqzDYkNKySWEW-VieEQvNi=s100-p-k-no-mo"
                    }
                ],
                "flagContentUri": "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sCIHM0ogKEICAgICT3dDwugE&hl=en-US",
                "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgICT3dDwugE!2e10!4m2!3m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ0cHn3xgpGqIsO39nOdlfXHl7MgmvKCVxI9C1ADvvFRKpvEMseM1K0S_3mXHT4Q7hoO9EWa3_2cBW_ShizaXYFgX2HmDos2G3I_LJCjjVvyJO35YDjfoZYJnuyMOrP3NBStXXG_2mL9Fg4U-zEEU4vf104SnJqUEifPjr-s4tLlKaknt03fPlNFhomLpv70rk8EuQQfvCcxAug6p6rmIpRh7wU2zod_AYvXpB3_tdbpqSnv6P2qRp10x_8PiwIqwFiFbZMlOp5McGXsHI-nrjg-eu6knjmzlZTWw8uH-eUdMLehz7bDLFhxZcOFr-B-pLeWknMLs1zMFn5BGRcgLNbUqLkswwYTsTJr7YezwNexZQf8SU8RtCbv5GPhMhIZrgWyUjvwhyuMwI3g5ppBZv9moN530QDbCJoClEmXE3vqbA",
                "widthPx": 2895,
                "heightPx": 1699,
                "authorAttributions": [
                    {
                        "displayName": "Louise Lowry",
                        "uri": "https://maps.google.com/maps/contrib/114645514405604046808",
                        "photoUri": "https://lh3.googleusercontent.com/a/ACg8ocLqoMj0dra15V6JrNNXYBJKnElFWGtZBbnXq1DOz8hCmqzUDg=s100-p-k-no-mo"
                    }
                ],
                "flagContentUri": "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sCIHM0ogKEICAgMDgte_8Nw&hl=en-US",
                "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgMDgte_8Nw!2e10!4m2!3m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ0djNhKEayxW99AmZ3_Rv-GZcqJrewq8k1Pmq9vgvfR2PhtnQGrQoJJU-3DRuPo5izOEvJxdRjA8iocoxoALtLySGaNVNQy63VJIWN9x_VoDGuF4eCG5aO5rme_RamwJhGNy9kVAResboCWvN7tqSmZkqkIq5ncZ8MQr-fUyRgHKiiuWI0u_ESrMbZNABV4k-CHNh75BlYAjzcP93efbo3nDyRHaACVeXPMBXII7bMfgCTdloBi0BiKBhx3G7edVYU0FqTfyT-oue1Jze4bYhGixizBU7n1cYUyiqFc7fPtapQoByhbsyRicO5zDJEc7gYo1QRFmuquHCblie1IQ8_ofRT3AGwYVqmuzJomfgLPIZDc1C-z2KsB2o5FlbDix4NWwLS3qHneRWaUT-knjWFmeeziGJgWKbBvcWPUOMZ5u9O-",
                "widthPx": 3024,
                "heightPx": 4032,
                "authorAttributions": [
                    {
                        "displayName": "Megan",
                        "uri": "https://maps.google.com/maps/contrib/104402347485286079123",
                        "photoUri": "https://lh3.googleusercontent.com/a/ACg8ocI8yQOtfLRjEJsNbQbZPF-WNR-UmN3mpNyGRurKmDMU4HOhkg=s100-p-k-no-mo"
                    }
                ],
                "flagContentUri": "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sCIHM0ogKEICAgICT3ezclwE&hl=en-US",
                "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgICT3ezclwE!2e10!4m2!3m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ01y266Jh-hMP5Kkx20-ezh4e8aGr_baCvee5gYGWm8twfXB1aXmeaRCEc7q0N3ZuakADlbbHn_NpyU-S6H66KszFd3dKOKfPSdQjB-WoP2cXwgdQqQkLp5ooULpWWMQCV4f5M-PP_lvS4L1Ffi6eq8LRAZOkbn4VR0T1rPqIfbWqvwm-QJmAsDpQy41yJ7hJCHtLD999B0LT0h6QXjILxHx53MX0mWXQBW2irc1nTCPvihWk39v9KO_Ssf46G37T4iNow9W3tcNVu5jguAGFFPV8c3Ou-qddz-IbqRum2-75YUq9Gmibm3OdzSH82DCT6iovJSoDnRu0ypl7sDh_bW31Wfoc7f4s6Q4nicNkW45YAckH8pEQVADbSb3SbYzk-4QeHa4YnMzH4FxOVa7Fmscf4XZQuRVWFJVnBzVe70ZQ",
                "widthPx": 2252,
                "heightPx": 4000,
                "authorAttributions": [
                    {
                        "displayName": "Stef",
                        "uri": "https://maps.google.com/maps/contrib/100437403593705171181",
                        "photoUri": "https://lh3.googleusercontent.com/a/ACg8ocLqrrAUFsRofhae4nyizV2fWQEZOrRXTEnU-lPvhoIKxt7Irw=s100-p-k-no-mo"
                    }
                ],
                "flagContentUri": "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sCIHM0ogKEICAgICzqJvzCw&hl=en-US",
                "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgICzqJvzCw!2e10!4m2!3m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ3c9Tw61e37_fGmV9jCp_ITGL3SN3dzeZx4HlNNwMBmKvMUzia4Tshz0Br7i7tsydNBonYdbbAbwuEKJ24G7jkgRAZ4co3O0UD6kRrxBChofu5SvtDzAS7ShPCxKMZ8pStP-PY6efcieAnTluqwqoMmN19D8l7yEZhfopz9LHRvTIrcmYEDkBwficgf7nac0cS-83EEbby-X2o-Biqq1UNLySNkQVTr1JefQkfcoo60l_KQhVV2jPrr1FlQ6iXxKrhxa3ogF3AxdIITqCIf4zMfaIq9aRWZElWeVHOCvZxRx4X4eZEU5B51TMNUXlpaeqdOr98mwqENF_8KG0549MX-y1UGMhx82f01IYJvnCfZnd60D7ZfIyCS-Wilz_I71FwjKxpowG97ZK78A7M0WJifgVOhWH5NU2wSTzL7PFp52u4Y",
                "widthPx": 4032,
                "heightPx": 3024,
                "authorAttributions": [
                    {
                        "displayName": "Ben O",
                        "uri": "https://maps.google.com/maps/contrib/102628052657724950810",
                        "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjWsavyErl-yqzf_eGNDnGAn0J_eZMenihnQElORzE6GmZ5iSJBogA=s100-p-k-no-mo"
                    }
                ],
                "flagContentUri": "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sCIHM0ogKEICAgIDH0uv_zAE&hl=en-US",
                "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgIDH0uv_zAE!2e10!4m2!3m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            },
            {
                "name": "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ18Uz9hEb5r5-p_ST8SjXA9TmRra1Hq5mm6QGP7HM5sBCkGd0iKzBna-luHr7I-3UV972iZnrkscnTxS8HPi80GY2fTgz1xgzEOwiJMRRK8WiVNysIWm0sKhAx9dF0uHsJuIAM3TdcswBYvWBlUYWVrp-Dj_8lI2HT1HmUDU3wzB2iIE8dK5Yx-aJY81pDMutWDzz6iZzyKxWD9GSMyfe1Wdly3BtvrcBD9XXkP_AtGOgL5PccBl0z8J0NbEJugppnGrmhFg5Gtm2Glr9tcSR4OVrVe0Hba-xh7vy_dnsISfVYcl40GFD1WKx_YOfpu0ibol5n-e22Rc2U1uu4Y7aee7fYL4fqcLQYomd8rUaD2lnK07fOAUV3JimRdDAfFovD7gR0uriGQXeG4wIzH22cio6qfThv-S7vEks11TgU_Eg",
                "widthPx": 3024,
                "heightPx": 4032,
                "authorAttributions": [
                    {
                        "displayName": "Lauren Mc D",
                        "uri": "https://maps.google.com/maps/contrib/102369997256393163563",
                        "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjUIoLkvGcYemh4Xe8e-WANQ7FQPgZqqzDYkNKySWEW-VieEQvNi=s100-p-k-no-mo"
                    }
                ],
                "flagContentUri": "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sCIHM0ogKEICAgICT3dDweg&hl=en-US",
                "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIHM0ogKEICAgICT3dDweg!2e10!4m2!3m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab"
            }
        ],
        "outdoorSeating": false,
        "liveMusic": false,
        "servesCocktails": false,
        "servesCoffee": false,
        "restroom": false,
        "goodForWatchingSports": false,
        "paymentOptions": {
            "acceptsCreditCards": true,
            "acceptsCashOnly": false
        },
        "parkingOptions": {
            "freeParkingLot": true,
            "freeStreetParking": true
        },
        "addressDescriptor": {
            "landmarks": [
                {
                    "name": "places/ChIJ1xDxJfKxEmsRllaxAw1LRDw",
                    "placeId": "ChIJ1xDxJfKxEmsRllaxAw1LRDw",
                    "displayName": {
                        "text": "St George Coptic Orthodox Church",
                        "languageCode": "en"
                    },
                    "types": [
                        "church",
                        "establishment",
                        "place_of_worship",
                        "point_of_interest"
                    ],
                    "spatialRelationship": "AROUND_THE_CORNER",
                    "straightLineDistanceMeters": 70.43427,
                    "travelDistanceMeters": 127.43024
                },
                {
                    "name": "places/ChIJMXv0jvGxEmsRsrIUCunI3oQ",
                    "placeId": "ChIJMXv0jvGxEmsRsrIUCunI3oQ",
                    "displayName": {
                        "text": "Pondok Buyung",
                        "languageCode": "en"
                    },
                    "types": [
                        "establishment",
                        "food",
                        "point_of_interest",
                        "restaurant"
                    ],
                    "spatialRelationship": "DOWN_THE_ROAD",
                    "straightLineDistanceMeters": 26.19929,
                    "travelDistanceMeters": 24.088861
                },
                {
                    "name": "places/ChIJIeR5k_GxEmsRWe3CPhr7ZBc",
                    "placeId": "ChIJIeR5k_GxEmsRWe3CPhr7ZBc",
                    "displayName": {
                        "text": "Peter's of Kensington",
                        "languageCode": "en"
                    },
                    "types": [
                        "department_store",
                        "establishment",
                        "furniture_store",
                        "home_goods_store",
                        "point_of_interest",
                        "store"
                    ],
                    "spatialRelationship": "DOWN_THE_ROAD",
                    "straightLineDistanceMeters": 111.03431,
                    "travelDistanceMeters": 135.16655
                },
                {
                    "name": "places/ChIJS_4SM_KxEmsR2Esxq0VK7hg",
                    "placeId": "ChIJS_4SM_KxEmsR2Esxq0VK7hg",
                    "displayName": {
                        "text": "Kensington Public School",
                        "languageCode": "en"
                    },
                    "types": [
                        "establishment",
                        "point_of_interest",
                        "primary_school",
                        "school"
                    ],
                    "spatialRelationship": "AROUND_THE_CORNER",
                    "straightLineDistanceMeters": 194.52182,
                    "travelDistanceMeters": 197.30417
                },
                {
                    "name": "places/ChIJ0Tw3l_GxEmsR5PW2iqxMIY4",
                    "placeId": "ChIJ0Tw3l_GxEmsR5PW2iqxMIY4",
                    "displayName": {
                        "text": "7-Eleven",
                        "languageCode": "en"
                    },
                    "types": [
                        "establishment",
                        "gas_station",
                        "point_of_interest"
                    ],
                    "spatialRelationship": "DOWN_THE_ROAD",
                    "straightLineDistanceMeters": 94.76252,
                    "travelDistanceMeters": 94.09265
                }
            ],
            "areas": [
                {
                    "name": "places/ChIJxRN6dvGxEmsRjvXHpeCsPx0",
                    "placeId": "ChIJxRN6dvGxEmsRjvXHpeCsPx0",
                    "displayName": {
                        "text": "Kokoda Memorial Park",
                        "languageCode": "en"
                    },
                    "containment": "NEAR"
                }
            ]
        },
        "googleMapsLinks": {
            "directionsUri": "https://www.google.com/maps/dir//''/data=!4m7!4m6!1m1!4e2!1m2!1m1!1s0x6b12b10074178e97:0x7a9bea8b2f5dab!3e0",
            "placeUri": "https://maps.google.com/?cid=34511378818489771",
            "writeAReviewUri": "https://www.google.com/maps/place//data=!4m3!3m2!1s0x6b12b10074178e97:0x7a9bea8b2f5dab!12e1",
            "reviewsUri": "https://www.google.com/maps/place//data=!4m4!3m3!1s0x6b12b10074178e97:0x7a9bea8b2f5dab!9m1!1b1",
            "photosUri": "https://www.google.com/maps/place//data=!4m3!3m2!1s0x6b12b10074178e97:0x7a9bea8b2f5dab!10e5"
        },
        "priceRange": {
            "startPrice": {
                "currencyCode": "AUD",
                "units": "20"
            },
            "endPrice": {
                "currencyCode": "AUD",
                "units": "40"
            }
        },
        "timeZone": {
            "id": "Australia/Sydney"
        }
    }
```


# Default Instructions

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
