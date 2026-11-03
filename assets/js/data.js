/* =========================================================
   AI Capital CRE — site config, seed data & listing store
   ---------------------------------------------------------
   Listings live in the browser's localStorage so the site
   stays pure HTML/CSS/JS with no server. The admin page can
   export the whole set to listings.json (and import it back)
   so inventory moves between machines or into a real backend
   later without changing any of the page markup.
   ========================================================= */

const SITE = {
  name: 'AI Capital CRE',
  tagline: 'Commercial Real Estate · Investment Sales · Capital Markets',
  phone: '+1 (213) 247-0741',
  phoneHref: 'tel:+12132470741',
  email: 'justin@aicapitalre.com',
  address: '936 Crenshaw Blvd, Suite 100',
  city: 'Los Angeles, CA 90019',
  license: 'CA DRE #02145897',
  hours: 'Mon – Fri, 8:30am – 6:00pm PT'
};

/* ---------- Taxonomy ---------- */
const PROPERTY_TYPES = [
  'Office', 'Retail', 'Industrial', 'Multifamily',
  'Mixed-Use', 'Medical', 'Hospitality', 'Land', 'Self-Storage'
];

const STATUSES = ['For Sale', 'For Lease', 'Under Contract', 'Sold', 'Leased'];

const MARKETS = [
  'Los Angeles', 'Mid-Wilshire', 'Downtown LA', 'Koreatown', 'Inglewood',
  'Long Beach', 'Pasadena', 'Vernon', 'Santa Monica', 'Orange County',
  'San Diego', 'Las Vegas', 'Phoenix'
];

/* ---------- Seed inventory (shipped with the site) ---------- */
const SEED_LISTINGS = [
  {
    id: 'aic-1001',
    title: 'Crenshaw Boulevard Retail Plaza',
    address: '936 Crenshaw Blvd',
    market: 'Mid-Wilshire',
    state: 'CA',
    zip: '90019',
    type: 'Retail',
    status: 'For Sale',
    price: 4850000,
    priceUnit: 'total',
    sf: 12400,
    lotSf: 21780,
    year: 1986,
    units: 6,
    parking: 34,
    capRate: 6.1,
    noi: 295850,
    occupancy: 100,
    zoning: 'LAC2-1VL',
    featured: true,
    broker: 'Justin Alvarez',
    images: ['assets/img/prop-retail.svg'],
    highlights: [
      'Six-tenant neighborhood center on a hard corner',
      'All leases NNN with scheduled 3% annual increases',
      '38,000+ vehicles per day on Crenshaw Blvd',
      'Assumable fixed-rate debt at 4.35% through 2031'
    ],
    description:
      'A fully stabilized six-tenant retail plaza on one of the highest-traffic corridors in Mid-Wilshire. The property has been under the same ownership since 2004 and offers a rare combination of in-place NNN income, below-market rents averaging 14% under the submarket, and assumable fixed-rate financing. Recent capital work includes a 2022 roof replacement, resealed and restriped parking field, and new monument signage.'
  },
  {
    id: 'aic-1002',
    title: 'Wilshire Medical & Professional Tower',
    address: '3465 Wilshire Blvd',
    market: 'Koreatown',
    state: 'CA',
    zip: '90010',
    type: 'Medical',
    status: 'For Sale',
    price: 7200000,
    priceUnit: 'total',
    sf: 18600,
    lotSf: 14500,
    year: 1978,
    units: 11,
    parking: 52,
    capRate: 5.8,
    noi: 417600,
    occupancy: 92,
    zoning: 'LAC4-2',
    featured: true,
    broker: 'Justin Alvarez',
    images: ['assets/img/prop-office.svg'],
    highlights: [
      'Eleven suites built out for medical and dental use',
      'Subterranean parking at 2.8 / 1,000 SF',
      'Two blocks from Wilshire/Normandie Metro B Line',
      '8% vacancy offers immediate lease-up upside'
    ],
    description:
      'An eleven-suite medical and professional building in the heart of the Koreatown office corridor. Suites range from 850 to 2,400 rentable square feet with plumbed treatment rooms, and the rent roll is anchored by two practices that have each renewed three times. The current 92% occupancy leaves one vacant suite available to mark to market immediately on close.'
  },
  {
    id: 'aic-1003',
    title: 'Vernon Distribution & Cold Storage',
    address: '4710 Alcoa Ave',
    market: 'Vernon',
    state: 'CA',
    zip: '90058',
    type: 'Industrial',
    status: 'For Lease',
    price: 1.35,
    priceUnit: 'sf-mo',
    sf: 64000,
    lotSf: 108900,
    year: 1994,
    units: 1,
    parking: 48,
    capRate: null,
    noi: null,
    occupancy: 0,
    zoning: 'VEM-1',
    featured: true,
    broker: 'Justin Alvarez',
    images: ['assets/img/prop-industrial.svg'],
    highlights: [
      '28\' clear height with ESFR sprinkler system',
      '12 dock-high doors plus two grade-level ramps',
      '4,000 SF of built-out freezer and cooler space',
      'Two miles from the I-710 / I-10 interchange'
    ],
    description:
      'A 64,000 square foot distribution facility in the Vernon industrial core, available for immediate occupancy. The building offers 28-foot clear height, ESFR fire protection, twelve dock-high positions, heavy 2,000-amp power, and approximately 4,000 square feet of existing freezer and cooler build-out. The fully fenced and secured yard supports 53-foot trailer circulation.'
  },
  {
    id: 'aic-1004',
    title: 'Olympic Mixed-Use Residences',
    address: '1240 S Olympic Blvd',
    market: 'Downtown LA',
    state: 'CA',
    zip: '90015',
    type: 'Mixed-Use',
    status: 'For Sale',
    price: 11500000,
    priceUnit: 'total',
    sf: 31200,
    lotSf: 17400,
    year: 2017,
    units: 24,
    parking: 30,
    capRate: 5.4,
    noi: 621000,
    occupancy: 96,
    zoning: 'LAR4-2',
    featured: true,
    broker: 'Justin Alvarez',
    images: ['assets/img/prop-multifamily.svg'],
    highlights: [
      '24 residential units over 4,100 SF of ground-floor retail',
      'Built 2017 — exempt from LA rent stabilization',
      'Average in-place rent 11% below submarket comparables',
      'Walk Score of 94 with Metro E Line two blocks away'
    ],
    description:
      'A 2017-vintage mixed-use asset offering 24 residential units above two ground-floor retail suites. Because the building was completed after 2008 it sits outside LA rent stabilization, giving an incoming owner full flexibility to mark rents to market as units turn. Unit interiors feature quartz counters, stainless appliances, and in-unit laundry; the retail component is fully leased to a cafe and a physical therapy studio.'
  },
  {
    id: 'aic-1005',
    title: 'Ocean Terrace Apartments',
    address: '628 Linden Ave',
    market: 'Long Beach',
    state: 'CA',
    zip: '90802',
    type: 'Multifamily',
    status: 'Under Contract',
    price: 9750000,
    priceUnit: 'total',
    sf: 27800,
    lotSf: 19600,
    year: 1963,
    units: 32,
    parking: 32,
    capRate: 5.9,
    noi: 575250,
    occupancy: 98,
    zoning: 'LBR4N',
    featured: false,
    broker: 'Justin Alvarez',
    images: ['assets/img/prop-multifamily.svg'],
    highlights: [
      '32 units — 8 studios, 18 one-bedroom, 6 two-bedroom',
      'Soft-story retrofit completed and signed off in 2021',
      'Six blocks from the Long Beach waterfront',
      'Separately metered gas and electric'
    ],
    description:
      'A well-maintained 32-unit apartment community six blocks from the Long Beach waterfront. Twenty-two of the thirty-two units have been renovated with new flooring, cabinetry, and fixtures, leaving ten classic units for the next owner to capture. The mandated soft-story seismic retrofit was completed and approved in 2021, and all units are separately metered for gas and electricity.'
  },
  {
    id: 'aic-1006',
    title: 'Arts District Creative Office',
    address: '905 E 2nd St',
    market: 'Downtown LA',
    state: 'CA',
    zip: '90013',
    type: 'Office',
    status: 'For Lease',
    price: 3.25,
    priceUnit: 'sf-mo',
    sf: 22000,
    lotSf: 22000,
    year: 1927,
    units: 3,
    parking: 26,
    capRate: null,
    noi: null,
    occupancy: 33,
    zoning: 'LAM3',
    featured: true,
    broker: 'Justin Alvarez',
    images: ['assets/img/prop-office.svg'],
    highlights: [
      'Brick-and-timber creative space with 16\' ceilings',
      'Divisible from 6,500 SF to the full 22,000 SF',
      'Private roof deck and ground-floor roll-up doors',
      'Fiber-ready with dual-carrier redundancy'
    ],
    description:
      'A 1927 brick-and-timber warehouse converted to creative office in the Arts District. Sixteen-foot exposed ceilings, original bow-truss framing, oversized steel windows, and polished concrete floors throughout. The space is divisible from 6,500 square feet and includes a private 2,800 square foot roof deck, secured parking, and two ground-floor roll-up doors suited to showroom or studio use.'
  },
  {
    id: 'aic-1007',
    title: 'Inglewood Stadium District Land',
    address: '3401 W Century Blvd',
    market: 'Inglewood',
    state: 'CA',
    zip: '90303',
    type: 'Land',
    status: 'For Sale',
    price: 3200000,
    priceUnit: 'total',
    sf: 0,
    lotSf: 52272,
    year: null,
    units: 0,
    parking: 0,
    capRate: null,
    noi: null,
    occupancy: 0,
    zoning: 'INC3',
    featured: false,
    broker: 'Justin Alvarez',
    images: ['assets/img/prop-land.svg'],
    highlights: [
      '1.2 acres of flat, fully entitled commercial land',
      'By-right approval for 58 residential units',
      '1.5 miles from SoFi Stadium and Intuit Dome',
      'All utilities stubbed to the property line'
    ],
    description:
      'A 1.2-acre development site on Century Boulevard inside the Inglewood stadium district. The parcel is flat, rectangular, and free of known environmental issues, with entitlements in place for 58 residential units by right under the city\'s density bonus program. All utilities are stubbed to the property line and a current ALTA survey, Phase I, and geotechnical report are available in the diligence room.'
  },
  {
    id: 'aic-1008',
    title: 'Foothill Self-Storage Portfolio',
    address: '2250 E Foothill Blvd',
    market: 'Pasadena',
    state: 'CA',
    zip: '91107',
    type: 'Self-Storage',
    status: 'For Sale',
    price: 14800000,
    priceUnit: 'total',
    sf: 86500,
    lotSf: 74000,
    year: 2003,
    units: 742,
    parking: 18,
    capRate: 6.4,
    noi: 947200,
    occupancy: 94,
    zoning: 'PDCG',
    featured: false,
    broker: 'Justin Alvarez',
    images: ['assets/img/prop-industrial.svg'],
    highlights: [
      '742 climate-controlled units across two buildings',
      '94% physical occupancy with a 1.9% monthly churn rate',
      'Fully automated access, kiosk, and gate systems',
      'Expansion pad approved for 11,000 additional SF'
    ],
    description:
      'A two-building, 742-unit climate-controlled self-storage facility on Foothill Boulevard in East Pasadena. The property runs on automated gate, kiosk, and access control systems with a single on-site manager, producing an expense ratio of just 31%. An approved expansion pad allows an incoming owner to add roughly 11,000 net rentable square feet without new entitlements.'
  }
];

/* =========================================================
   Store
   ========================================================= */
const STORAGE_KEY = 'aicapitalcre.listings.v1';

const Store = {
  /** All listings — seeded on first visit, then read from localStorage. */
  all() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.write(SEED_LISTINGS);
        return SEED_LISTINGS.slice();
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : SEED_LISTINGS.slice();
    } catch (err) {
      // Private browsing or disabled storage — fall back to the seed set.
      console.warn('Listing storage unavailable, using seed data.', err);
      return SEED_LISTINGS.slice();
    }
  },

  write(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (err) {
      console.warn('Could not save listings.', err);
      return false;
    }
  },

  find(id) {
    return this.all().find(l => l.id === id) || null;
  },

  save(listing) {
    const list = this.all();
    const i = list.findIndex(l => l.id === listing.id);
    if (i > -1) list[i] = listing;
    else list.unshift(listing);
    return this.write(list);
  },

  remove(id) {
    return this.write(this.all().filter(l => l.id !== id));
  },

  reset() {
    return this.write(SEED_LISTINGS.slice());
  },

  newId() {
    const nums = this.all()
      .map(l => parseInt(String(l.id).replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const next = (nums.length ? Math.max.apply(null, nums) : 1000) + 1;
    return 'aic-' + next;
  }
};

/* =========================================================
   Formatting helpers
   ========================================================= */
function money(n) {
  if (n === null || n === undefined || n === '') return '—';
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/** Headline price: lump sum, or a per-SF monthly lease rate. */
function priceLabel(l) {
  if (!l.price) return 'Price On Request';
  if (l.priceUnit === 'sf-mo') return '$' + Number(l.price).toFixed(2) + '<small> /SF/MO</small>';
  if (l.priceUnit === 'sf-yr') return '$' + Number(l.price).toFixed(2) + '<small> /SF/YR</small>';
  return money(l.price);
}

function num(n) {
  if (n === null || n === undefined || n === '' || isNaN(n)) return '—';
  return Number(n).toLocaleString('en-US');
}

function sf(n) {
  return n ? num(n) + ' SF' : '—';
}

function acres(lotSf) {
  if (!lotSf) return '—';
  return (lotSf / 43560).toFixed(2) + ' AC';
}

function pricePerSf(l) {
  if (!l.price || !l.sf || l.priceUnit !== 'total') return null;
  return '$' + (l.price / l.sf).toFixed(0) + ' /SF';
}

function escapeHtml(str) {
  return String(str === null || str === undefined ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function statusClass(status) {
  if (status === 'For Sale') return 'badge--gold';
  if (status === 'For Lease') return 'badge--green';
  if (status === 'Sold' || status === 'Leased') return 'badge--white';
  return '';
}

function initials(name) {
  return String(name || '')
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('');
}
