Overview website for Held Hostile loot system used in AQ40.

TODO: 
- Add systematic fix to enforce the "One weapon per section" rule.
- Change list-submit to be custom page pushing data to sheet
  - Enforce rules
  - Easier drag-and-drop interface
    https://github.com/atlassian/react-beautiful-dnd
    https://github.com/react-dnd/react-dnd
  - Google sheets api
    `POST https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}:append`
    https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append