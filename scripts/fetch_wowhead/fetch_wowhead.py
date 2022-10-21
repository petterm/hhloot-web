import re
import csv
import json
import requests
import xml.etree.ElementTree as ET


SOURCE_ITEM_DB = 'item_db.csv'
SOURCE_ITEM_DB_FIELDS = ['instance_name', 'source_name', 'item_name', 'item_quality', 'item_id', 'url']

TARGET_ITEM_DB = 'item_db.json'

item_slot = {
    0: "None",
    1: "Head",
    2: "Neck",
    3: "Shoulders",
    4: "Shirt",
    5: "Vest",
    6: "Waist",
    7: "Legs",
    8: "Feet",
    9: "Wrist",
    10: "Hands",
    11: "Ring",
    12: "Trinket",
    13: "One hand",
    14: "Shield",
    15: "Bow",
    16: "Back",
    17: "Two hand",
    18: "Bag",
    19: "Tabard",
    20: "Robe",
    21: "Main hand",
    22: "Off hand",
    23: "Held",
    24: "Ammo",
    25: "Thrown",
    26: "Ranged",
    27: "Ranged (Can't remember what)",
    28: "Relic",
}


def wowhead_url(item_id):
    return 'https://www.wowhead.com/wotlk/item={}&xml'.format(item_id)


def fetch_items(source_item):
    fetched_items = []

    url = wowhead_url(source_item["id"])
    r = requests.get(url)
    item_tree = ET.fromstring(r.text)

    for item in item_tree.iter('wowhead'):
        fetched_items.append(parse_item(item, source_item))

    return fetched_items


def parse_item(item, source_item):
    item_data = {}
    item_data['id'] = int(item.find('item').attrib.get('id'))
    item_data['name'] = item.findtext('item/name')
    item_data['icon'] = item.findtext('item/icon')

    item_details = json.loads('{' + item.findtext('item/json') + '}')
    item_data['slot'] = item_slot.get(item_details.get('slot'))

    item_data['source'] = source_item["source"]

    return item_data


def get_source_items():
    source_items = []

    with open(SOURCE_ITEM_DB) as source_file:
        reader = csv.DictReader(
            filter(lambda row: row[0] != '#', source_file),
            dialect=csv.excel_tab,
            fieldnames=SOURCE_ITEM_DB_FIELDS)
        for row in reader:
            item = {
                "id": row['item_id'],
                "name": row['item_name'],
                "source": row['source_name'],
            }
            source_items.append(item)
    
    return source_items


def print_db():
    source_items = get_source_items()
    items = []

    print('Fetching items...')
    for source_item in source_items:
        print('- {}'.format(source_item["id"]))
        for item in fetch_items(source_item):
            items.append(item)

    with open(TARGET_ITEM_DB, mode='w') as target_file:
        json.dump(items, target_file, indent=4)


if __name__ == '__main__':
    print_db()
