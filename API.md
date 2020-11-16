**Base data:**
`GET /reservations`

```json
[
    {
        "id": 12,
        "name": "Meche",
        "submitted": "2020-10-10 23:00:00",
        "approved": "2020-10-12 10:00:00",
        "approvedBy": "Meche",
        "instance": "aq40",
        "slots": [
            "Carapace of the Old God",
            "Death's Sting",
            "Qiraji Bindings of Command",
            "Imperial Qiraji Armaments",
            "Ouro's Intact Hide",
            "Vek'nilash's Circlet",
            null,
            "Barbed Choker",
            "Cloak of the Golden Hive",
            "Mark of C'Thun"
        ]
    }
]
```

**Optional extensions with:**
`GET /reservations/approved`
  Only the latest approved post per player and instance.

`GET /reservations?instance=aq40`
  Only posts for instance

`GET /reservations?player=Meche`
  Only posts for player


**Submission:**
This could be behind authorization and only allow submissions for account-linked characters.
I think it might be overkill though.
`POST /reservations`

Body:
```json
{
    "name": "Meche",
    "instance": "aq40",
    "slots": [
        "Carapace of the Old God",
        "Death's Sting",
        "Qiraji Bindings of Command",
        "Imperial Qiraji Armaments",
        "Ouro's Intact Hide",
        "Vek'nilash's Circlet",
        null,
        "Barbed Choker",
        "Cloak of the Golden Hive",
        "Mark of C'Thun"
    ]
}
```
```json
{
    "name": "Meche",
    "instance": "aq40",
    "slots": [
        20929,
        21126,
        20928,
        21232,
        20927,
        20926,
        null,
        21664,
        21621,
        22732
    ]
}
```
```json
{
    "name": "Meche",
    "instance": "aq40",
    "slots": [
        20929,
        21611,
        20928,
        21232,
        20927,
        20926,
        null,
        21664,
        21621,
        22732
    ]
}
```

Response:
```json
{
    "id": 12,
    "name": "Meche",
    "submitted": "2020-10-10 23:00:00",
    "approved": null,
    "instance": "aq40",
    "slots": [
        "Carapace of the Old God",
        "Death's Sting",
        "Qiraji Bindings of Command",
        "Imperial Qiraji Armaments",
        "Ouro's Intact Hide",
        "Vek'nilash's Circlet",
        null,
        "Barbed Choker",
        "Cloak of the Golden Hive",
        "Mark of C'Thun"
    ]
}
```

**Approve:**
This could be behind authorization. Probably fine if it is not as well.
`POST /reservations/approve`

Body:
```json
{
    "id": 12,
    "approver": "Meche"
}
```

Response:
```json
{
    "id": 12,
    "name": "Meche",
    "submitted": "2020-10-10 23:00:00",
    "approved": "2020-10-12 10:00:00",
    "approvedBy": "Meche",
    "instance": "aq40",
    "slots": [
        "Carapace of the Old God",
        "Death's Sting",
        "Qiraji Bindings of Command",
        "Imperial Qiraji Armaments",
        "Ouro's Intact Hide",
        "Vek'nilash's Circlet",
        null,
        "Barbed Choker",
        "Cloak of the Golden Hive",
        "Mark of C'Thun"
    ]
}
```