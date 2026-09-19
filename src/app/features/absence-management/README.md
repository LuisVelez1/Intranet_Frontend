# Absence management — HTTP integration

The existing pages, routes, table, filters and styles now use:

`Component → AbsenceService → AbsenceApiService → Backend API`

`AbsenceApiService` uses `HttpClient` and `API_ENDPOINTS.absences`. The existing auth interceptor supplies the bearer token. Production keeps `apiUrl: ''`, so requests use the same-origin Nginx `/api` proxy.

## Operations

- `GET /api/absences/my`: personal requests and personal reports.
- `GET /api/absences/pending`: assigned pending approvals.
- `POST /api/absences`: `{ type, startDate, endDate, startTime, endTime, reason }`.
- `PUT /api/absences/{id}/approve`: `{ comment: '' }`.
- `PUT /api/absences/{id}/reject`: `{ comment }`, empty if omitted.

The service maps requester fields and separate dates/times into the existing display model. Mutation success refreshes active list subscriptions. A 409 conflict also refreshes the lists. Errors, loading states and retries are distinct from empty results. Request streams are shared while subscribed and reloaded on navigation, preventing a persistent cache from crossing sessions.

The form loads the employee display from the existing `/api/users/me` service. The backend alone selects requester and approver. Since no approver-lookup endpoint exists, the form explains that assignment occurs on save and displays the returned approver in the success message.

## Scope of available API

The supplied API does not support cancellation, all-company reporting, site information per absence, or demo reset. The UI therefore has no cancellation/reset actions. Reports explicitly cover the current employee's requests; breakdowns use status, type and reason. No additional endpoints are invented.

Timed requests require both times and a strictly increasing range. Full-day requests send both times as null and allow inclusive single-day ranges. Full-day totals are calendar days and are shown separately from timed hours and averages; they are not converted into assumed working hours. ISO local dates and times are displayed without timezone conversion. Java `HH:mm:ss` responses are displayed at minute precision.

Production seed/repository files and demo identities have been removed. This feature no longer reads or writes localStorage; an old prototype storage key, if present in a browser, is ignored. Existing authentication storage remains managed by the application.

## Tests

Feature tests use Angular's HTTP testing backend, fixed fixtures and the existing zoneless TestBed convention. No live backend or emails are used. They cover request methods/bodies, the existing authentication interceptor, mapping, validation, nullable times, data refresh, filtering, report calculations, loading/errors/retry, conflicts and duplicate submissions.

```sh
npm run lint
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```

On this Linux workstation, `CHROME_BIN=/opt/brave.com/brave/brave` selects the installed Chromium-based browser. Production font inlining is disabled in `angular.json` because the external Google Fonts download failed repeatedly during builds. Script/style optimization remains enabled; the existing stylesheet import loads fonts in the browser.
