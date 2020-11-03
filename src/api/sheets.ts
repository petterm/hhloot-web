const setup = async () => {
    await new Promise((resolve, reject) => gapi.load('client', resolve));
    await gapi.client.init({
        apiKey: process.env.REACT_APP_DEV_API_KEY ? process.env.REACT_APP_DEV_API_KEY : 'AIzaSyBaVroI2BsGCAYX6w1ZJAJGo2u_oi9r3ls',
        scope: 'https://www.googleapis.com/auth/spreadsheets',
    });
    await gapi.client.load('sheets', 'v4');
}

export const getSheet = async (sheetId: string, tab: string): Promise<string[][]> => {
    await setup();

    const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: tab,
    });

    return response.result.values || [];
};

export const appendSheet = async (sheetId: string, tab: string, values: string[] ) => {
    await setup();

    const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: tab,
        valueInputOption: 'RAW',
        resource: {
            values: [
                values,
            ],
        }
    });

    return response.result.updates;
};
