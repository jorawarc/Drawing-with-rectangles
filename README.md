

# Drawing with Rectangles
## Server

### Payload structure
```
json{ 
    "width": float,
    "height": float,
    "colour": string,
    "x": float,
    "y": float,
    "identifier": string
}
```

### Rectangle Endpoints
`POST /create` - Create a new rectangle
- Requires: all fields

`GET /read` - Get all rectangles

`POST /find` - Find rectangle with `identifier` (Note: will return `200` if rectangle not found)
- Requires: `identifier` 

`PUT /update` - Update rectangle with `identifier` (Note: Cannot change `identifier` field)
- Requires: fields to be updated

`DELETE /delete` - Delete rectangle with `identifier`
- Requires: `identifier` 


### Status Codes
- `200` on Success
- `404` Rectangle not found
- `400` All other failures
- `409` Rectangle with same `identifier` already exists


## MySQL Database
```
Rectangle
 - width: float
 - height: float
 - colour: string
 - x: float
 - y: float
 - identifier: string
```
