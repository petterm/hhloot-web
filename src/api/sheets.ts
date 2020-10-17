let callbackIndex = 0;

type SheetData = {
    range: string,
    majorDimension: string,
    values: string[][],
};
type GoogleError = {
    error: {
        code: number,
        message: string,
        status: string,
        details?: any,
    }
};

const apiKey = () => process.env.REACT_APP_DEV_API_KEY ? process.env.REACT_APP_DEV_API_KEY : 'AIzaSyBaVroI2BsGCAYX6w1ZJAJGo2u_oi9r3ls';

const getDataUrl = (sheetId: string, tab: string, callback: string) =>
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tab}?key=${apiKey()}&callback=${callback}`;

const getCallbackName = (): string => `hhlootcb_${callbackIndex++}`;

export const getSheet = (sheetId: string, tab: string): Promise<string[][]> => new Promise((resolve, reject) => {
    const callbackName = getCallbackName();
    (window as any)[callbackName] = (data: SheetData | GoogleError) => {
        if ('error' in data) {
            reject(data.error);
        } else {
            resolve(data.values);
        }
    };

    const el = document.createElement('script');
    el.setAttribute('src', getDataUrl(sheetId, tab, callbackName));
    document.body.append(el);
});
