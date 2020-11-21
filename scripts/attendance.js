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

            fs.writeFile('tmpRidb.json', JSON.stringify(ridbData, null, 2), err => { if (err) throw err; });
            // if ("Players" in ridbData) {
            //     const players = [];
            //     for (const name in ridbData["Players"]) {
            //         players.push({
            //             name,
            //             class: ridbData["Players"][name]["Class"].toUpperCase(),
            //             guildRank: ridbData["Players"][name]["Rank"],
            //         });
            //     }
            //     players.sort((a, b) => a.name.localeCompare(b.name));

            //     fs.writeFile(
            //         '../src/data/players.json',
            //         JSON.stringify(
            //             players.filter(a => ["Guild Master", "Officer", "Member", "Initiate"].includes(a.guildRank)),
            //             null,
            //             4,
            //         ),
            //         err => {
            //             if (err) throw err;
            //             console.log('Wrote to file src/data/players.json');
            //         },
            //     );
            // }

            if ("NewAttendance" in ridbData) {
                const sortedAttendance = {};

                Object.keys(ridbData["NewAttendance"])
                    .sort()
                    .forEach((playerName) => {
                        const valueList = ridbData["NewAttendance"][playerName];
                        const attendanceList = [];

                        for (const i in valueList) {
                            const attendance = {
                                key: `index-${i}`,
                                value: valueList[i],
                            };
                            if ("NewRaidMapping" in ridbData && playerName in ridbData["NewRaidMapping"]) {
                                const infoStr = ridbData["NewRaidMapping"][playerName][i];
                                if (infoStr && infoStr !== "fake") {
                                    const [raid, date] = infoStr.split(" - ");
                                    attendance.raid = raid;
                                    attendance.date = date;
                                }
                            }
                            attendanceList.push(attendance);
                        }
                        sortedAttendance[playerName] = attendanceList;
                    });

                fs.writeFile('../src/data/attendance.json', JSON.stringify(sortedAttendance, null, 2), err => {
                    if (err) throw err;
                    console.log('Wrote to file src/data/attendance.json');
                });
            } else {
                console.log("No NewAttendance in the RIDB data");
            }
        } else {
            console.log("No RIDB in lua data");
        }
    });
});
