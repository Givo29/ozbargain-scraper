# ozbargain-scraper
A simple API that uses web scraped data to help you query for bargains on ozbargain.

## Endpoints

### Get Bargain Details
`/bargain/:id`

Get information in JSON format of certain listing on ozbargain.

#### Example Response
```json
{
  "name": "Lenovo IdeaPad Chromebook Duet $267.75 Delivered @ Amazon AU",
  "description": "Great deal on this popular Chromebook convertible.I've had one for a while now and have found it to be a great media consumption device.",
  "price": 267,
  "expired": true,
  "post_information": {
    "date_posted": " - 00:12  amazon.",
    "last_updated": "01/08/2021",
    "upvotes": "386",
    "downvotes": "0",
    "tags": [
      {
        "tag_name": " Computing",
        "tag_link": "https://www.ozbargain.com.au/cat/computing"
      },
      {
        "tag_name": " Chromebook",
        "tag_link": "https://www.ozbargain.com.au/tag/chromebook"
      },
      {
        "tag_name": " 10.1inch",
        "tag_link": "https://www.ozbargain.com.au/tag/10-1inch"
      },
      {
        "tag_name": " Lenovo",
        "tag_link": "https://www.ozbargain.com.au/brand/lenovo"
      },
      {
        "tag_name": " Tablet",
        "tag_link": "https://www.ozbargain.com.au/tag/tablet"
      }
    ]
  },
  "product_information": {
    "referrer": "amazon.com.au",
    "product_link": "https://www.ozbargain.com.au/goto/641709"
  },
  "user_information": {
    "username": "rekuhs",
    "user_link": "https://www.ozbargain.com.au/user/106341"
  }
}
```

### Get Category Results
`/category/:cat`

Get listing information in JSON format of listings in a category.

#### Example Response
```json
{
  "category_name": "computing",
  "bargains": [
    {
      "title": "Samson Meteor USB Microphone $59 (Normally $79) @ JB Hi-Fi",
      "description": "Great little mic for zoom, slack, teams calls. Connects via USB port and has neat little mute button that works wonders during conference calls. I purchased one a year ago for my Mac and very happy …",
      "price": 59,
      "item_code": "644108",
      "expired": false,
      "post_information": {
        "date_posted": "12/08/2021",
        "upvotes": "44",
        "downvotes": "0",
        "post_link": "https://www.ozbargain.com.au/node/644108"
      },
      "product_information": {
        "referrer": "jbhifi.com.au",
        "product_link": "https://www.ozbargain.com.au/goto/644108"
      },
      "user_information": {
        "username": "williape",
        "user_link": "https://www.ozbargain.com.au/user/311529"
      }
    }
  ],
  "next_page_url": "/category/computing?show_expired=true&page=1"
}
```

### Get Search Results
`/search/:query`

Get listing information in JSON format of listings for a search query.

#### Example Response
```json
{
  "query": "rtx2080",
  "results": [
    {
      "title": "HP Omen 15.5\", 144hz, i7 9750H, 16GB RAM, 512GB SSD, RTX2080 $2849.25 Delivered @ Microsoft",
      "expired": true,
      "price": 2849,
      "post_information": {
        "date_posted": "21/08/2020",
        "upvotes": "13",
        "downvotes": "",
        "post_link": "https://www.ozbargain.com/node/560037"
      },
      "user_information": {
        "username": "bustedcustard",
        "user_link": "https://www.ozbargain.com/user/313799"
      }
    }
  ],
  "next_page_url": "/search/rtx2080?show_expired=true&page=1"
}

```
