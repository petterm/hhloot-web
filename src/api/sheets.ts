const apiKey = 'AIzaSyBaVroI2BsGCAYX6w1ZJAJGo2u_oi9r3ls';
let callbackIndex = 0;

type SheetData = {
    range: string,
    majorDimension: string,
    values: string[][],
};

const getDataUrl = (sheetId: string, tab: string, callback: string) =>
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tab}?key=${apiKey}&callback=${callback}`;

const getCallbackName = (): string => `hhlootcb_${callbackIndex++}`;

export const getSheet = (sheetId: string, tab: string): Promise<string[][]> => new Promise((resolve, reject) => {
    const callbackName = getCallbackName();
    (window as any)[callbackName] = (data: SheetData) => {
        resolve(data.values);
    };

    const el = document.createElement('script');
    el.setAttribute('src', getDataUrl(sheetId, tab, callbackName));
    document.body.append(el);
});
