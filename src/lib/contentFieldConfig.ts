import { ContentType } from './mediaApi';

export type FieldKey = 'category' | 'source' | 'author' | 'date' | 'readTime' | 'videoUrl'
  | 'company' | 'location' | 'price' | 'salary' | 'platform'
  | 'zone' | 'targetPages' | 'startDate' | 'endDate' | 'packageType';

// Fields shown on the create/edit form per content type — shared by the admin
// CMS and the user-facing self-post form so both offer identical capability.
export const FIELD_CONFIG: Record<ContentType, FieldKey[]> = {
  'news':                ['category', 'source', 'date', 'readTime'],
  'magazine':            ['category', 'source', 'author', 'date', 'readTime'],
  'video':               ['videoUrl', 'source', 'date'],
  'gallery':             ['category', 'location', 'date'],
  'impact-story':        ['category', 'source', 'author', 'date', 'readTime'],
  'market-intelligence': ['category', 'source', 'author', 'date', 'readTime'],
  'tech-trends':         ['category', 'source', 'author', 'date', 'readTime'],
  'press-release':       ['company', 'source', 'date'],
  'industry-report':     ['category', 'source', 'author', 'date', 'readTime'],
  'competition':         ['company', 'location', 'date', 'price', 'category'],
  'webinar':             ['source', 'company', 'platform', 'location', 'date', 'price', 'videoUrl'],
  'meetup':              ['company', 'location', 'date', 'price'],
  'job':                 ['company', 'source', 'location', 'salary', 'category', 'date'],
  'training':            ['company', 'location', 'price', 'category', 'date'],
  'certification':       ['company', 'location', 'price', 'category', 'date'],
  'networking':          ['category', 'location', 'company', 'date'],
  'community':           ['company', 'location', 'category'],
  'manufacturer':        ['company', 'location', 'category'],
  'ai-company':          ['company', 'location', 'category'],
  'event-organizer':     ['company', 'location', 'category'],
  'education-partner':   ['company', 'location', 'category'],
  'industry-player':     ['company', 'location', 'category'],
  'applications':        ['company', 'location', 'category'],
  'ad':                  ['zone', 'targetPages', 'startDate', 'endDate', 'packageType', 'company'],
};

export const FIELD_LABELS: Partial<Record<ContentType, Partial<Record<FieldKey, string>>>> = {
  'webinar':          { source: 'Speaker', company: 'Organizer' },
  'competition':      { company: 'Organizer' },
  'meetup':           { company: 'Organizer' },
};

export const FIELD_PLACEHOLDER: Record<FieldKey, string> = {
  category: 'e.g. Agriculture',
  source: 'e.g. Reuters',
  author: 'Author name',
  date: '',
  readTime: 'e.g. 5 min',
  videoUrl: 'https://youtube.com/...',
  company: 'Company / organizer name',
  location: 'e.g. Hyderabad',
  price: 'e.g. Rs. 5,000',
  salary: 'e.g. Rs. 30,000-40,000/mo',
  platform: 'e.g. Zoom, YouTube Live',
  zone: '',
  targetPages: '',
  startDate: '',
  endDate: '',
  packageType: '',
};

export const FIELD_TYPE: Partial<Record<FieldKey, 'date'>> = {
  date: 'date',
  startDate: 'date',
  endDate: 'date',
};
