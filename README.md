Overview website for Held Hostile loot system used in AQ40.

TODO: 
- Add systematic fix to enforce the "One weapon per section" rule.
- Change list-submit to be custom page pushing data to sheet
  - Enforce rules
  - Google sheets api
    `POST https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}:append`
    https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
    https://github.com/googleapis/google-api-nodejs-client
    https://developers.google.com/sheets/api/guides/values#appending_values
  - UI
    - Stripe lists
    - Scroll for options list
    - Force select-player before showing reservationList (simplify logic to require player)
    - Add url path directly to player
    - Show rules in text?
- Approve submitted lists from separate page via google sheets
- Scroll to top on navigation
- Fixed position for header
- Scroll-to-top button?
- Flip attendance table order (latest first)

Future:
- Support for multiple instances (naxx)
- Support for instance-dependant slots and scores
