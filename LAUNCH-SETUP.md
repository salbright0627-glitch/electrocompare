# ElectroCompare — next-stage launch setup

## 1. Affiliate accounts
Apply for the retailer programs you want to use and keep your IDs in your private server-side configuration.

- Amazon Associates: use Amazon's current Associates/Creators API rules and approved tagged links.
- Best Buy: its developer portal provides product data including pricing, availability, specifications and images; its creator/affiliate program uses tracked links.
- Walmart: its affiliate program provides links and data feeds.

## 2. Do not put secret API credentials in the browser
The public site should call your own backend. The backend calls retailer APIs, normalizes the product data, caches it, and returns only what the browser needs.

Recommended flow:

Browser -> /api/search?q=laptop -> your server -> retailer APIs
                                      -> normalize/cache
Browser <- products + offers + tracking URLs

## 3. Normalized product record

{
  "id": "retailer:sku",
  "brand": "...",
  "name": "...",
  "category": "Laptops",
  "image": "...",
  "price": 999.99,
  "availability": "In Stock",
  "rating": 4.6,
  "specs": {
    "display": "...",
    "processor": "...",
    "ram": "...",
    "storage": "...",
    "battery": "..."
  },
  "offers": [
    {
      "retailer": "Best Buy",
      "price": 999.99,
      "url": "YOUR_TRACKED_URL"
    }
  ]
}

## 4. Revenue model
Keep comparison results useful and transparent. Clearly label paid/sponsored placements and maintain an affiliate disclosure.

## 5. Before public launch
- Replace sample products with current licensed/API data.
- Add working tracked retailer URLs.
- Add privacy policy, terms, affiliate disclosure and cookie/consent handling where required.
- Add analytics.
- Add an email provider for price alerts.
- Add server-side caching/rate limiting.
- Test every outbound affiliate link and mobile layout.

## 6. Current status
The included index.html remains a working front-end demo. This launch kit adds the configuration shape and backend integration plan without exposing or inventing your private affiliate credentials.
