const http = require('http');
const luaJson = require("lua-json")
const fs = require("fs");

const dataFileURL = "http://heldhostile.com/dkp/raidinviter.lua";

http.get(dataFileURL, function(response) {
    let str = "";

    response.on("data", (chunk) => {
        str += chunk;
    });

    response.on("end", () => {
        const parts = str.split(/(?:^|\r?\n)+(\w+) = /)
        const data = {};
        let key;
        parts.forEach(part => {
            if (key) {
                data[key] = part;
                key = "";
            } else if (part.trim().length) {
                key = part;
            }
        });

        if ("RIDB" in data) {
            const ridbData = luaJson.parse("return " + data["RIDB"]);
            if ("NewAttendance" in ridbData) {
                const sortedAttendance = {};
                Object.keys(ridbData["NewAttendance"])
                    .sort()
                    .forEach(key => sortedAttendance[key] = ridbData["NewAttendance"][key])
                fs.writeFile('../src/data/attendance.json', JSON.stringify(sortedAttendance, null, 2), err => {
                    if (err) throw err;
                    console.log('Wrote to file src/data/attendance.json');
                })
            } else {
                console.log("No NewAttendance in the RIDB data");
            }
        } else {
            console.log("No RIDB in lua data");
        }
    });
});