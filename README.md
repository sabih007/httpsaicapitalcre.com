# AI Capital CRE — static website

A rebuild of aicapitalcre.com as a commercial real estate site, with a built-in
listing manager. Plain HTML, CSS and vanilla JavaScript — no build step, no
framework, no dependencies to install.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, search, featured listings, sectors, markets, team, testimonials |
| `properties.html` | Full inventory with keyword / type / submarket / status / price filters and sorting |
| `property.html` | Single listing detail (`property.html?id=aic-1001`) — gallery, financials, enquiry form |
| `services.html` | Service lines and the assignment process |
| `about.html` | Firm story, principles, team |
| `contact.html` | Contact details, map, enquiry form |
| `admin.html` | **Listing manager** — add, edit, delete listings and upload photos |

## Running it

Open `index.html` directly in a browser, or serve the folder:

```
python -m http.server 8000
```

then visit <http://localhost:8000>. A local server is recommended — some
browsers restrict storage on `file://` URLs.

## Adding listings

Go to **Add Listing** (`admin.html`):

1. Fill in the asset details. Only title, address and submarket are required —
   every other field is hidden on the page when left blank.
2. Drag photos onto the upload area, or click to browse. The first photo
   becomes the cover image. Up to six per listing.
3. Tick **Feature on the homepage** to surface it in the front-page grid.
4. Publish. It appears on `properties.html` immediately.

Listings with no photo fall back to a branded placeholder tile, so the grid
never looks broken.

### How storage works

There is no server, so listings are saved in the browser's `localStorage`
under the key `aicapitalcre.listings.v1`. Consequences worth knowing:

- Listings are visible **on the device where they were added**. A different
  computer, a different browser, or cleared site data shows the sample set.
- The quota is roughly 5MB per site. Uploaded photos are automatically
  downscaled to 1600px and re-encoded as JPEG at 78% quality before storing
  (a 3.5MB phone photo lands at roughly 25–150KB), and the admin page shows
  current usage under **Storage Used**.
- **Export to listings.json** backs everything up and moves it between
  machines; **Import** restores it. Export after any significant change.
- **Restore Sample Data** replaces everything with the eight demo assets.

### Making listings permanent (when you're ready)

The storage layer is isolated in `Store` at the bottom of
`assets/js/data.js` — `all()`, `save()`, `remove()`, `write()`. To move to a
real backend, replace those five methods with `fetch()` calls to your API.
No page markup or other JavaScript needs to change.

A simpler middle step: export `listings.json`, commit it next to the HTML, and
change `Store.all()` to fetch that file. Listings then come from the repo and
are identical for every visitor, with the admin page used to generate the file.

## Forms

The contact and listing-enquiry forms have no server to post to, so they open
the visitor's email client pre-addressed to `justin@aicapitalre.com`. To accept
submissions in the browser instead, point the `<form>` at Formspree, Netlify
Forms, Basin or similar — the handler lives in `initForms()` in
`assets/js/app.js`.

## Customising

| What | Where |
| --- | --- |
| Colours, fonts, spacing | CSS custom properties at the top of `assets/css/style.css` |
| Company name, phone, email, address, licence | `SITE` object at the top of `assets/js/data.js` |
| Property types, statuses, submarkets | `PROPERTY_TYPES`, `STATUSES`, `MARKETS` in `assets/js/data.js` |
| Sample listings | `SEED_LISTINGS` in `assets/js/data.js` |
| Headline copy, stats, team, testimonials | Directly in each HTML file |

Note that `SITE` is used by the JavaScript-rendered parts (property pages,
form handlers), while the header, footer and top bar carry the contact details
inline in each HTML file — update both if the phone number or address changes.

Property illustrations in `assets/img/*.svg` are vector placeholders in the
brand palette. Replace them with photography when you have it, or just upload
real photos through the listing manager.

## Deploying

Upload the whole folder to any static host — Netlify, Vercel, Cloudflare Pages,
GitHub Pages, or ordinary shared hosting via FTP. There is nothing to build.

`admin.html` carries `noindex, nofollow` so it stays out of search results, but
it is **not password protected** — anyone with the URL can edit listings on
their own device. If the site goes live publicly, put the page behind your
host's access control (Netlify Identity, Cloudflare Access, or an `.htaccess`
basic-auth rule).
