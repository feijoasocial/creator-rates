import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, TrendingUp, DollarSign, FileText, MapPin, Users, Briefcase, Camera, X, ChevronDown, ChevronUp, ExternalLink, List } from 'lucide-react';
import Papa from 'papaparse';

// === BRAND COLOURS (Feijoa Social) ===
const C = {
  darkGreen: '#6e8c4f',
  lightGreen: '#b3d88e',
  purple: '#773691',
  offWhite: '#f8f0e2',
  ink: '#2a3d1e',
  inkSoft: '#5a6d4e',
  border: '#6e8c4f25',
  borderSoft: '#6e8c4f15',
  white: '#ffffff',
};

const FORM_URL = 'https://forms.gle/59N1esQac1yyfXQP8';

// Privacy floor: never display a breakdown, median, or benchmark built on fewer
// than this many creators. Applies to every individual chart, not just the filter total.
const MIN_SAMPLE = 5;

// === RATE BRACKETS ===
const RATE_BRACKETS = [
  'Contra', '< $100', '$100 to 250', '$250 to 500', '$500 to 1k',
  '$1k - 2.5k', '$2.5k - 5k', '$5k - 10k', '$10k - 20k', '$20k+'
];

const REVENUE_BRACKETS = [
  '$0', '< $1K', '$1K - $5K', '$5K - $10K', '$10K - $25K',
  '$25K - $50K', '$50K - $100K', '$100K+'
];

const LICENSING_BRACKETS = [
  '0%', '10-25%', '25-50%', '50-100%', '100-200%', '200%+'
];

// === DUMMY DATA (40 responses) ===
const r = (id, country, age, gender, years, work, followers, niche, currency, rates, licensing, revenue, business) => ({
  id, country, age, gender, years, work, followers, niche, currency, rates, licensing, revenue, business
});

const RESPONSES = [
  r(1, 'New Zealand', '25-34', 'Woman', '3-5', 'Full-time creator', '10K-25K', 'Travel', 'NZD',
    { feed: '$500-$1,000', shortform: '$1,000-$2,500', story: '$250-$500', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$250-$500', ugcImage: '$100-$250', ugcVideo: '$250-$500', proImage: '$500-$1,000', proVideo: 'N/A', event: '$1,000-$2,500', ambassador: '$1,000-$2,500' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: '100-200%', exclusivity: '50-100%' },
    { brandDeals: '$25K-$50K', ugc: '$5K-$10K', affiliate: '$1K-$5K', adRevenue: '$0', ownProducts: '$1K-$5K', services: '$0', speaking: '$1K-$5K', podcast: '$0', memberships: '$0', total: '$25K-$50K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(2, 'New Zealand', '25-34', 'Woman', '6-10', 'Full-time creator', '50K-100K', 'Outdoor', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: '$2,500-$5,000', ytDedicated: '$5,000-$10,000', podcast: 'N/A', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$2,500-$5,000', ambassador: '$5,000-$10,000' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$100K+', ugc: '$10K-$25K', affiliate: '$5K-$10K', adRevenue: '$1K-$5K', ownProducts: '$10K-$25K', services: '$5K-$10K', speaking: '$5K-$10K', podcast: '$0', memberships: '$0', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'Yes, NZ-based' }),
  r(3, 'Australia', '35-44', 'Woman', '6-10', 'Full-time creator', '100K-500K', 'Lifestyle', 'AUD',
    { feed: '$2,500-$5,000', shortform: '$5,000-$10,000', story: '$1,000-$2,500', ytIntegrated: '$5,000-$10,000', ytDedicated: '$10,000+', podcast: '$2,500-$5,000', blog: '$1,000-$2,500', ugcImage: '$500-$1,000', ugcVideo: '$1,000-$2,500', proImage: '$2,500-$5,000', proVideo: '$5,000-$10,000', event: '$5,000-$10,000', ambassador: '$10,000+' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$100K+', ugc: '$25K-$50K', affiliate: '$10K-$25K', adRevenue: '$5K-$10K', ownProducts: '$25K-$50K', services: '$10K-$25K', speaking: '$10K-$25K', podcast: '$5K-$10K', memberships: '$5K-$10K', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'Yes, international' }),
  r(4, 'New Zealand', '18-24', 'Woman', '1-2', 'Side hustle', '5K-10K', 'Beauty', 'NZD',
    { feed: '$100-$250', shortform: '$250-$500', story: 'Under $100', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: 'N/A', ugcImage: '$100-$250', ugcVideo: '$100-$250', proImage: 'N/A', proVideo: 'N/A', event: 'N/A', ambassador: '$250-$500' },
    { duration6mo: '0% (included)', duration12mo: '10-25%', paidSocial: '25-50%', web: '0% (included)', ooh: 'N/A', exclusivity: '10-25%' },
    { brandDeals: '$1K-$5K', ugc: '$1K-$5K', affiliate: 'Under $1K', adRevenue: '$0', ownProducts: '$0', services: '$0', speaking: '$0', podcast: '$0', memberships: '$0', total: '$1K-$5K' },
    { structure: 'Not yet registered', gstRegistered: 'No, under threshold', ratesShown: 'N/A', contracts: 'Sometimes', agent: 'No' }),
  r(5, 'New Zealand', '25-34', 'Man', '3-5', 'Part-time', '10K-25K', 'Outdoor', 'NZD',
    { feed: '$500-$1,000', shortform: '$1,000-$2,500', story: '$250-$500', ytIntegrated: '$1,000-$2,500', ytDedicated: '$2,500-$5,000', podcast: 'N/A', blog: '$250-$500', ugcImage: '$100-$250', ugcVideo: '$250-$500', proImage: '$500-$1,000', proVideo: '$1,000-$2,500', event: 'N/A', ambassador: '$1,000-$2,500' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: '100-200%', exclusivity: '50-100%' },
    { brandDeals: '$10K-$25K', ugc: '$5K-$10K', affiliate: '$1K-$5K', adRevenue: '$0', ownProducts: '$0', services: '$25K-$50K', speaking: '$0', podcast: '$0', memberships: '$0', total: '$50K-$100K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Usually', agent: 'No' }),
  r(6, 'New Zealand', '35-44', 'Woman', '10+', 'Full-time creator', '50K-100K', 'Food', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: '$1,000-$2,500', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$2,500-$5,000', ambassador: '$5,000-$10,000' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: '100-200%', exclusivity: '100-200%' },
    { brandDeals: '$50K-$100K', ugc: '$10K-$25K', affiliate: '$5K-$10K', adRevenue: '$1K-$5K', ownProducts: '$25K-$50K', services: '$10K-$25K', speaking: '$5K-$10K', podcast: '$5K-$10K', memberships: '$0', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(7, 'Australia', '25-34', 'Woman', '3-5', 'Full-time creator', '25K-50K', 'Travel', 'AUD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: '$2,500-$5,000', ytDedicated: '$5,000-$10,000', podcast: 'N/A', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$2,500-$5,000', ambassador: '$5,000-$10,000' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$50K-$100K', ugc: '$10K-$25K', affiliate: '$5K-$10K', adRevenue: '$0', ownProducts: '$5K-$10K', services: '$0', speaking: '$1K-$5K', podcast: '$0', memberships: '$0', total: '$50K-$100K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'Yes, international' }),
  r(8, 'United States', '25-34', 'Non-binary', '6-10', 'Full-time creator', '100K-500K', 'Fashion', 'USD',
    { feed: '$2,500-$5,000', shortform: '$5,000-$10,000', story: '$1,000-$2,500', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$1,000-$2,500', ugcImage: '$500-$1,000', ugcVideo: '$1,000-$2,500', proImage: '$2,500-$5,000', proVideo: '$5,000-$10,000', event: '$5,000-$10,000', ambassador: '$10,000+' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$100K+', ugc: '$25K-$50K', affiliate: '$10K-$25K', adRevenue: '$0', ownProducts: '$25K-$50K', services: '$10K-$25K', speaking: '$5K-$10K', podcast: '$0', memberships: '$10K-$25K', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'N/A (not NZ)', ratesShown: 'N/A (not NZ)', contracts: 'Always', agent: 'Yes, international' }),
  r(9, 'New Zealand', '25-34', 'Woman', '1-2', 'Part-time', '5K-10K', 'Fitness', 'NZD',
    { feed: '$250-$500', shortform: '$500-$1,000', story: '$100-$250', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: 'N/A', ugcImage: '$100-$250', ugcVideo: '$250-$500', proImage: 'N/A', proVideo: 'N/A', event: 'N/A', ambassador: '$500-$1,000' },
    { duration6mo: '10-25%', duration12mo: '25-50%', paidSocial: '25-50%', web: '10-25%', ooh: 'N/A', exclusivity: '25-50%' },
    { brandDeals: '$5K-$10K', ugc: '$1K-$5K', affiliate: 'Under $1K', adRevenue: '$0', ownProducts: '$0', services: '$10K-$25K', speaking: '$0', podcast: '$0', memberships: '$0', total: '$25K-$50K' },
    { structure: 'Sole trader', gstRegistered: 'No, under threshold', ratesShown: 'GST inclusive', contracts: 'Sometimes', agent: 'No' }),
  r(10, 'New Zealand', '25-34', 'Woman', '6-10', 'Full-time creator', '25K-50K', 'Outdoor', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: '$2,500-$5,000', ytDedicated: '$5,000-$10,000', podcast: '$1,000-$2,500', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$1,000-$2,500', ambassador: '$2,500-$5,000' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: '100-200%', exclusivity: '50-100%' },
    { brandDeals: '$50K-$100K', ugc: '$10K-$25K', affiliate: '$1K-$5K', adRevenue: 'Under $1K', ownProducts: '$5K-$10K', services: '$0', speaking: '$1K-$5K', podcast: '$0', memberships: '$0', total: '$50K-$100K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(11, 'United Kingdom', '35-44', 'Woman', '10+', 'Full-time creator', '500K+', 'Lifestyle', 'GBP',
    { feed: '$5,000-$10,000', shortform: '$10,000+', story: '$2,500-$5,000', ytIntegrated: '$10,000+', ytDedicated: '$10,000+', podcast: '$5,000-$10,000', blog: '$2,500-$5,000', ugcImage: '$1,000-$2,500', ugcVideo: '$2,500-$5,000', proImage: '$5,000-$10,000', proVideo: '$10,000+', event: '$10,000+', ambassador: '$10,000+' },
    { duration6mo: '100-200%', duration12mo: '200%+', paidSocial: '200%+', web: '100-200%', ooh: '200%+', exclusivity: '200%+' },
    { brandDeals: '$100K+', ugc: '$50K-$100K', affiliate: '$25K-$50K', adRevenue: '$25K-$50K', ownProducts: '$100K+', services: '$25K-$50K', speaking: '$25K-$50K', podcast: '$10K-$25K', memberships: '$25K-$50K', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'N/A (not NZ)', ratesShown: 'N/A (not NZ)', contracts: 'Always', agent: 'Yes, international' }),
  r(12, 'New Zealand', '18-24', 'Woman', 'Under 1', 'Hobby with occasional paid opportunities', '1K-5K', 'Beauty', 'NZD',
    { feed: 'Free / product only', shortform: 'Free / product only', story: 'Free / product only', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: 'N/A', ugcImage: 'Under $100', ugcVideo: 'Under $100', proImage: 'N/A', proVideo: 'N/A', event: 'N/A', ambassador: 'Under $100' },
    { duration6mo: '0% (included)', duration12mo: '0% (included)', paidSocial: '10-25%', web: '0% (included)', ooh: 'N/A', exclusivity: '0% (included)' },
    { brandDeals: 'Under $1K', ugc: 'Under $1K', affiliate: '$0', adRevenue: '$0', ownProducts: '$0', services: '$0', speaking: '$0', podcast: '$0', memberships: '$0', total: 'Under $1K' },
    { structure: 'Not yet registered', gstRegistered: 'No, under threshold', ratesShown: 'N/A', contracts: 'Never', agent: 'No' }),
  r(13, 'New Zealand', '25-34', 'Woman', '3-5', 'Side hustle', '10K-25K', 'Travel', 'NZD',
    { feed: '$500-$1,000', shortform: '$1,000-$2,500', story: '$250-$500', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$250-$500', ugcImage: '$100-$250', ugcVideo: '$250-$500', proImage: '$500-$1,000', proVideo: '$1,000-$2,500', event: '$1,000-$2,500', ambassador: '$1,000-$2,500' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '25-50%', web: '25-50%', ooh: '100-200%', exclusivity: '50-100%' },
    { brandDeals: '$10K-$25K', ugc: '$5K-$10K', affiliate: '$1K-$5K', adRevenue: '$0', ownProducts: '$0', services: '$25K-$50K', speaking: '$0', podcast: '$0', memberships: '$0', total: '$50K-$100K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Usually', agent: 'No' }),
  r(14, 'Australia', '35-44', 'Man', '6-10', 'Full-time creator', '50K-100K', 'Outdoor', 'AUD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: '$2,500-$5,000', ytDedicated: '$5,000-$10,000', podcast: '$1,000-$2,500', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$2,500-$5,000', proVideo: '$5,000-$10,000', event: '$2,500-$5,000', ambassador: '$5,000-$10,000' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$100K+', ugc: '$10K-$25K', affiliate: '$5K-$10K', adRevenue: '$1K-$5K', ownProducts: '$10K-$25K', services: '$5K-$10K', speaking: '$5K-$10K', podcast: '$5K-$10K', memberships: '$0', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'N/A (not NZ)', ratesShown: 'N/A (not NZ)', contracts: 'Always', agent: 'Yes, NZ-based' }),
  r(15, 'New Zealand', '25-34', 'Woman', '6-10', 'Full-time creator', '100K-500K', 'Parenting', 'NZD',
    { feed: '$2,500-$5,000', shortform: '$5,000-$10,000', story: '$1,000-$2,500', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: '$2,500-$5,000', blog: '$1,000-$2,500', ugcImage: '$500-$1,000', ugcVideo: '$1,000-$2,500', proImage: '$2,500-$5,000', proVideo: '$5,000-$10,000', event: '$5,000-$10,000', ambassador: '$10,000+' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$100K+', ugc: '$25K-$50K', affiliate: '$10K-$25K', adRevenue: '$5K-$10K', ownProducts: '$50K-$100K', services: '$10K-$25K', speaking: '$10K-$25K', podcast: '$10K-$25K', memberships: '$5K-$10K', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'Yes, NZ-based' }),
  r(16, 'New Zealand', '25-34', 'Woman', '3-5', 'Full-time creator', '25K-50K', 'Fashion', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$1,000-$2,500', ambassador: '$2,500-$5,000' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: '100-200%', exclusivity: '50-100%' },
    { brandDeals: '$25K-$50K', ugc: '$10K-$25K', affiliate: '$5K-$10K', adRevenue: '$0', ownProducts: '$5K-$10K', services: '$0', speaking: '$0', podcast: '$0', memberships: '$0', total: '$50K-$100K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(17, 'New Zealand', '35-44', 'Woman', '6-10', 'Full-time creator', '10K-25K', 'Business', 'NZD',
    { feed: '$500-$1,000', shortform: '$1,000-$2,500', story: '$250-$500', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: '$1,000-$2,500', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$500-$1,000', proVideo: '$1,000-$2,500', event: '$2,500-$5,000', ambassador: '$2,500-$5,000' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: 'N/A', exclusivity: '50-100%' },
    { brandDeals: '$25K-$50K', ugc: '$10K-$25K', affiliate: '$1K-$5K', adRevenue: '$0', ownProducts: '$25K-$50K', services: '$50K-$100K', speaking: '$5K-$10K', podcast: '$1K-$5K', memberships: '$5K-$10K', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(18, 'New Zealand', '25-34', 'Woman', '1-2', 'Side hustle', '5K-10K', 'Food', 'NZD',
    { feed: '$250-$500', shortform: '$500-$1,000', story: '$100-$250', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: 'N/A', ugcImage: '$100-$250', ugcVideo: '$250-$500', proImage: 'N/A', proVideo: 'N/A', event: 'N/A', ambassador: '$500-$1,000' },
    { duration6mo: '10-25%', duration12mo: '25-50%', paidSocial: '25-50%', web: '10-25%', ooh: 'N/A', exclusivity: '25-50%' },
    { brandDeals: '$5K-$10K', ugc: '$1K-$5K', affiliate: 'Under $1K', adRevenue: '$0', ownProducts: '$0', services: '$0', speaking: '$0', podcast: '$0', memberships: '$0', total: '$5K-$10K' },
    { structure: 'Sole trader', gstRegistered: 'No, under threshold', ratesShown: 'GST inclusive', contracts: 'Rarely', agent: 'No' }),
  r(19, 'Australia', '25-34', 'Woman', '3-5', 'Full-time creator', '10K-25K', 'Travel', 'AUD',
    { feed: '$500-$1,000', shortform: '$1,000-$2,500', story: '$250-$500', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$250-$500', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$500-$1,000', proVideo: '$1,000-$2,500', event: '$1,000-$2,500', ambassador: '$2,500-$5,000' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: '100-200%', exclusivity: '50-100%' },
    { brandDeals: '$25K-$50K', ugc: '$10K-$25K', affiliate: '$1K-$5K', adRevenue: '$0', ownProducts: '$0', services: '$0', speaking: '$1K-$5K', podcast: '$0', memberships: '$0', total: '$25K-$50K' },
    { structure: 'Sole trader', gstRegistered: 'N/A (not NZ)', ratesShown: 'N/A (not NZ)', contracts: 'Always', agent: 'No' }),
  r(20, 'New Zealand', '45-54', 'Woman', '10+', 'Full-time creator', '100K-500K', 'Lifestyle', 'NZD',
    { feed: '$2,500-$5,000', shortform: '$5,000-$10,000', story: '$1,000-$2,500', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: '$2,500-$5,000', blog: '$1,000-$2,500', ugcImage: '$500-$1,000', ugcVideo: '$1,000-$2,500', proImage: '$2,500-$5,000', proVideo: '$5,000-$10,000', event: '$5,000-$10,000', ambassador: '$10,000+' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$100K+', ugc: '$25K-$50K', affiliate: '$10K-$25K', adRevenue: '$1K-$5K', ownProducts: '$25K-$50K', services: '$25K-$50K', speaking: '$10K-$25K', podcast: '$10K-$25K', memberships: '$10K-$25K', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(21, 'New Zealand', '25-34', 'Woman', '3-5', 'Full-time creator', '25K-50K', 'Outdoor', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: '$2,500-$5,000', ytDedicated: '$5,000-$10,000', podcast: 'N/A', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$1,000-$2,500', ambassador: '$2,500-$5,000' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '50-100%', web: '50-100%', ooh: '100-200%', exclusivity: '50-100%' },
    { brandDeals: '$25K-$50K', ugc: '$5K-$10K', affiliate: '$1K-$5K', adRevenue: 'Under $1K', ownProducts: '$1K-$5K', services: '$0', speaking: '$0', podcast: '$0', memberships: '$0', total: '$25K-$50K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(22, 'New Zealand', '18-24', 'Woman', '1-2', 'Side hustle', '10K-25K', 'Beauty', 'NZD',
    { feed: '$250-$500', shortform: '$500-$1,000', story: '$100-$250', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: 'N/A', ugcImage: '$100-$250', ugcVideo: '$250-$500', proImage: 'N/A', proVideo: 'N/A', event: '$500-$1,000', ambassador: '$1,000-$2,500' },
    { duration6mo: '10-25%', duration12mo: '25-50%', paidSocial: '25-50%', web: '10-25%', ooh: 'N/A', exclusivity: '25-50%' },
    { brandDeals: '$5K-$10K', ugc: '$1K-$5K', affiliate: '$1K-$5K', adRevenue: '$0', ownProducts: '$0', services: '$0', speaking: '$0', podcast: '$0', memberships: '$0', total: '$10K-$25K' },
    { structure: 'Sole trader', gstRegistered: 'No, under threshold', ratesShown: 'GST inclusive', contracts: 'Sometimes', agent: 'No' }),
  r(23, 'New Zealand', '25-34', 'Man', '3-5', 'Full-time creator', '25K-50K', 'Outdoor', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: '$2,500-$5,000', ytDedicated: '$5,000-$10,000', podcast: 'N/A', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$2,500-$5,000', ambassador: '$5,000-$10,000' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$50K-$100K', ugc: '$10K-$25K', affiliate: '$5K-$10K', adRevenue: '$1K-$5K', ownProducts: '$5K-$10K', services: '$0', speaking: '$1K-$5K', podcast: '$0', memberships: '$0', total: '$50K-$100K' },
    { structure: 'Registered limited company', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(24, 'Australia', '25-34', 'Woman', '6-10', 'Full-time creator', '100K-500K', 'Travel', 'AUD',
    { feed: '$2,500-$5,000', shortform: '$5,000-$10,000', story: '$1,000-$2,500', ytIntegrated: '$5,000-$10,000', ytDedicated: '$10,000+', podcast: '$2,500-$5,000', blog: '$1,000-$2,500', ugcImage: '$500-$1,000', ugcVideo: '$1,000-$2,500', proImage: '$2,500-$5,000', proVideo: '$5,000-$10,000', event: '$5,000-$10,000', ambassador: '$10,000+' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$100K+', ugc: '$25K-$50K', affiliate: '$10K-$25K', adRevenue: '$5K-$10K', ownProducts: '$25K-$50K', services: '$5K-$10K', speaking: '$10K-$25K', podcast: '$5K-$10K', memberships: '$0', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'N/A (not NZ)', ratesShown: 'N/A (not NZ)', contracts: 'Always', agent: 'Yes, international' }),
  r(25, 'New Zealand', '35-44', 'Woman', '6-10', 'Full-time creator', '50K-100K', 'Outdoor', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: '$2,500-$5,000', ytDedicated: '$5,000-$10,000', podcast: '$1,000-$2,500', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$2,500-$5,000', proVideo: '$5,000-$10,000', event: '$2,500-$5,000', ambassador: '$5,000-$10,000' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '50-100%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$50K-$100K', ugc: '$25K-$50K', affiliate: '$5K-$10K', adRevenue: '$1K-$5K', ownProducts: '$10K-$25K', services: '$10K-$25K', speaking: '$5K-$10K', podcast: '$1K-$5K', memberships: '$0', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'Yes, NZ-based' }),
  r(26, 'New Zealand', '25-34', 'Woman', '3-5', 'Full-time creator', '10K-25K', 'Fitness', 'NZD',
    { feed: '$500-$1,000', shortform: '$1,000-$2,500', story: '$250-$500', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$250-$500', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$500-$1,000', proVideo: '$1,000-$2,500', event: '$1,000-$2,500', ambassador: '$1,000-$2,500' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: 'N/A', exclusivity: '50-100%' },
    { brandDeals: '$10K-$25K', ugc: '$5K-$10K', affiliate: '$1K-$5K', adRevenue: '$0', ownProducts: '$10K-$25K', services: '$25K-$50K', speaking: '$0', podcast: '$0', memberships: '$5K-$10K', total: '$50K-$100K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Usually', agent: 'No' }),
  r(27, 'New Zealand', '25-34', 'Woman', '1-2', 'Part-time', '5K-10K', 'Travel', 'NZD',
    { feed: '$250-$500', shortform: '$500-$1,000', story: '$100-$250', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$100-$250', ugcImage: '$100-$250', ugcVideo: '$250-$500', proImage: '$250-$500', proVideo: '$500-$1,000', event: 'N/A', ambassador: '$500-$1,000' },
    { duration6mo: '10-25%', duration12mo: '25-50%', paidSocial: '25-50%', web: '10-25%', ooh: 'N/A', exclusivity: '25-50%' },
    { brandDeals: '$5K-$10K', ugc: '$5K-$10K', affiliate: 'Under $1K', adRevenue: '$0', ownProducts: '$0', services: '$25K-$50K', speaking: '$0', podcast: '$0', memberships: '$0', total: '$25K-$50K' },
    { structure: 'Sole trader', gstRegistered: 'No, under threshold', ratesShown: 'GST inclusive', contracts: 'Usually', agent: 'No' }),
  r(28, 'Australia', '35-44', 'Woman', '10+', 'Full-time creator', '500K+', 'Lifestyle', 'AUD',
    { feed: '$5,000-$10,000', shortform: '$10,000+', story: '$2,500-$5,000', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: '$5,000-$10,000', blog: '$2,500-$5,000', ugcImage: '$1,000-$2,500', ugcVideo: '$2,500-$5,000', proImage: '$5,000-$10,000', proVideo: '$10,000+', event: '$10,000+', ambassador: '$10,000+' },
    { duration6mo: '100-200%', duration12mo: '200%+', paidSocial: '200%+', web: '100-200%', ooh: '200%+', exclusivity: '200%+' },
    { brandDeals: '$100K+', ugc: '$50K-$100K', affiliate: '$25K-$50K', adRevenue: '$10K-$25K', ownProducts: '$100K+', services: '$25K-$50K', speaking: '$25K-$50K', podcast: '$25K-$50K', memberships: '$25K-$50K', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'N/A (not NZ)', ratesShown: 'N/A (not NZ)', contracts: 'Always', agent: 'Yes, international' }),
  r(29, 'New Zealand', '25-34', 'Woman', '6-10', 'Full-time creator', '25K-50K', 'Food', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$1,000-$2,500', ambassador: '$2,500-$5,000' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: '100-200%', exclusivity: '50-100%' },
    { brandDeals: '$25K-$50K', ugc: '$10K-$25K', affiliate: '$1K-$5K', adRevenue: '$0', ownProducts: '$10K-$25K', services: '$5K-$10K', speaking: '$1K-$5K', podcast: '$0', memberships: '$0', total: '$50K-$100K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(30, 'United States', '25-34', 'Woman', '6-10', 'Full-time creator', '100K-500K', 'Travel', 'USD',
    { feed: '$2,500-$5,000', shortform: '$5,000-$10,000', story: '$1,000-$2,500', ytIntegrated: '$5,000-$10,000', ytDedicated: '$10,000+', podcast: '$2,500-$5,000', blog: '$1,000-$2,500', ugcImage: '$500-$1,000', ugcVideo: '$1,000-$2,500', proImage: '$2,500-$5,000', proVideo: '$5,000-$10,000', event: '$5,000-$10,000', ambassador: '$10,000+' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$100K+', ugc: '$25K-$50K', affiliate: '$10K-$25K', adRevenue: '$5K-$10K', ownProducts: '$25K-$50K', services: '$5K-$10K', speaking: '$10K-$25K', podcast: '$5K-$10K', memberships: '$5K-$10K', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'N/A (not NZ)', ratesShown: 'N/A (not NZ)', contracts: 'Always', agent: 'Yes, international' }),
  r(31, 'New Zealand', '18-24', 'Non-binary', '1-2', 'Side hustle', '5K-10K', 'Fashion', 'NZD',
    { feed: '$100-$250', shortform: '$250-$500', story: 'Under $100', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: 'N/A', ugcImage: '$100-$250', ugcVideo: '$250-$500', proImage: 'N/A', proVideo: 'N/A', event: 'N/A', ambassador: '$500-$1,000' },
    { duration6mo: '10-25%', duration12mo: '25-50%', paidSocial: '25-50%', web: '10-25%', ooh: 'N/A', exclusivity: '10-25%' },
    { brandDeals: '$1K-$5K', ugc: '$1K-$5K', affiliate: 'Under $1K', adRevenue: '$0', ownProducts: '$0', services: '$0', speaking: '$0', podcast: '$0', memberships: '$0', total: '$1K-$5K' },
    { structure: 'Not yet registered', gstRegistered: 'No, under threshold', ratesShown: 'N/A', contracts: 'Sometimes', agent: 'No' }),
  r(32, 'New Zealand', '25-34', 'Woman', '3-5', 'Full-time creator', '50K-100K', 'Travel', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: '$2,500-$5,000', ytDedicated: '$5,000-$10,000', podcast: '$1,000-$2,500', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$2,500-$5,000', ambassador: '$5,000-$10,000' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$50K-$100K', ugc: '$10K-$25K', affiliate: '$5K-$10K', adRevenue: '$1K-$5K', ownProducts: '$5K-$10K', services: '$0', speaking: '$1K-$5K', podcast: '$0', memberships: '$0', total: '$50K-$100K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(33, 'Australia', '25-34', 'Man', '3-5', 'Full-time creator', '25K-50K', 'Outdoor', 'AUD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: '$2,500-$5,000', ytDedicated: '$5,000-$10,000', podcast: 'N/A', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$1,000-$2,500', ambassador: '$2,500-$5,000' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: '100-200%', exclusivity: '50-100%' },
    { brandDeals: '$25K-$50K', ugc: '$5K-$10K', affiliate: '$1K-$5K', adRevenue: 'Under $1K', ownProducts: '$0', services: '$0', speaking: '$1K-$5K', podcast: '$0', memberships: '$0', total: '$25K-$50K' },
    { structure: 'Sole trader', gstRegistered: 'N/A (not NZ)', ratesShown: 'N/A (not NZ)', contracts: 'Always', agent: 'No' }),
  r(34, 'New Zealand', '35-44', 'Woman', '6-10', 'Part-time', '25K-50K', 'Parenting', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$1,000-$2,500', ambassador: '$2,500-$5,000' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: 'N/A', exclusivity: '50-100%' },
    { brandDeals: '$25K-$50K', ugc: '$10K-$25K', affiliate: '$1K-$5K', adRevenue: '$0', ownProducts: '$5K-$10K', services: '$25K-$50K', speaking: '$0', podcast: '$0', memberships: '$0', total: '$50K-$100K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Usually', agent: 'No' }),
  r(35, 'New Zealand', '25-34', 'Woman', '3-5', 'Full-time creator', '10K-25K', 'Outdoor', 'NZD',
    { feed: '$500-$1,000', shortform: '$1,000-$2,500', story: '$250-$500', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$250-$500', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$500-$1,000', proVideo: '$1,000-$2,500', event: '$1,000-$2,500', ambassador: '$1,000-$2,500' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '25-50%', web: '25-50%', ooh: '100-200%', exclusivity: '50-100%' },
    { brandDeals: '$25K-$50K', ugc: '$10K-$25K', affiliate: '$1K-$5K', adRevenue: 'Under $1K', ownProducts: '$5K-$10K', services: '$10K-$25K', speaking: '$1K-$5K', podcast: '$0', memberships: '$0', total: '$50K-$100K' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(36, 'New Zealand', '25-34', 'Woman', '6-10', 'Full-time creator', '100K-500K', 'Travel', 'NZD',
    { feed: '$2,500-$5,000', shortform: '$5,000-$10,000', story: '$1,000-$2,500', ytIntegrated: '$5,000-$10,000', ytDedicated: '$10,000+', podcast: '$2,500-$5,000', blog: '$1,000-$2,500', ugcImage: '$500-$1,000', ugcVideo: '$1,000-$2,500', proImage: '$2,500-$5,000', proVideo: '$5,000-$10,000', event: '$5,000-$10,000', ambassador: '$10,000+' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$100K+', ugc: '$25K-$50K', affiliate: '$10K-$25K', adRevenue: '$5K-$10K', ownProducts: '$25K-$50K', services: '$10K-$25K', speaking: '$10K-$25K', podcast: '$10K-$25K', memberships: '$5K-$10K', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'Yes, NZ-based' }),
  r(37, 'United Kingdom', '25-34', 'Woman', '6-10', 'Full-time creator', '50K-100K', 'Outdoor', 'GBP',
    { feed: '$2,500-$5,000', shortform: '$5,000-$10,000', story: '$1,000-$2,500', ytIntegrated: '$5,000-$10,000', ytDedicated: '$10,000+', podcast: '$2,500-$5,000', blog: '$1,000-$2,500', ugcImage: '$500-$1,000', ugcVideo: '$1,000-$2,500', proImage: '$2,500-$5,000', proVideo: '$5,000-$10,000', event: '$5,000-$10,000', ambassador: '$10,000+' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '100-200%', web: '50-100%', ooh: '200%+', exclusivity: '100-200%' },
    { brandDeals: '$100K+', ugc: '$25K-$50K', affiliate: '$10K-$25K', adRevenue: '$5K-$10K', ownProducts: '$25K-$50K', services: '$10K-$25K', speaking: '$10K-$25K', podcast: '$10K-$25K', memberships: '$0', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'N/A (not NZ)', ratesShown: 'N/A (not NZ)', contracts: 'Always', agent: 'Yes, international' }),
  r(38, 'New Zealand', '45-54', 'Woman', '10+', 'Full-time creator', '25K-50K', 'Business', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: '$2,500-$5,000', blog: '$1,000-$2,500', ugcImage: '$500-$1,000', ugcVideo: '$1,000-$2,500', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$5,000-$10,000', ambassador: '$5,000-$10,000' },
    { duration6mo: '25-50%', duration12mo: '50-100%', paidSocial: '50-100%', web: '25-50%', ooh: 'N/A', exclusivity: '50-100%' },
    { brandDeals: '$50K-$100K', ugc: '$25K-$50K', affiliate: '$5K-$10K', adRevenue: '$0', ownProducts: '$50K-$100K', services: '$100K+', speaking: '$25K-$50K', podcast: '$5K-$10K', memberships: '$10K-$25K', total: '$100K+' },
    { structure: 'Registered limited company', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(39, 'New Zealand', '25-34', 'Woman', '3-5', 'Full-time creator', '50K-100K', 'Lifestyle', 'NZD',
    { feed: '$1,000-$2,500', shortform: '$2,500-$5,000', story: '$500-$1,000', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: '$1,000-$2,500', blog: '$500-$1,000', ugcImage: '$250-$500', ugcVideo: '$500-$1,000', proImage: '$1,000-$2,500', proVideo: '$2,500-$5,000', event: '$2,500-$5,000', ambassador: '$5,000-$10,000' },
    { duration6mo: '50-100%', duration12mo: '100-200%', paidSocial: '50-100%', web: '50-100%', ooh: '100-200%', exclusivity: '100-200%' },
    { brandDeals: '$50K-$100K', ugc: '$10K-$25K', affiliate: '$5K-$10K', adRevenue: '$1K-$5K', ownProducts: '$10K-$25K', services: '$5K-$10K', speaking: '$5K-$10K', podcast: '$1K-$5K', memberships: '$0', total: '$100K+' },
    { structure: 'Sole trader', gstRegistered: 'Yes', ratesShown: 'GST exclusive', contracts: 'Always', agent: 'No' }),
  r(40, 'New Zealand', '25-34', 'Woman', '1-2', 'Side hustle', '10K-25K', 'Outdoor', 'NZD',
    { feed: '$250-$500', shortform: '$500-$1,000', story: '$100-$250', ytIntegrated: 'N/A', ytDedicated: 'N/A', podcast: 'N/A', blog: '$250-$500', ugcImage: '$100-$250', ugcVideo: '$250-$500', proImage: '$500-$1,000', proVideo: '$1,000-$2,500', event: 'N/A', ambassador: '$500-$1,000' },
    { duration6mo: '10-25%', duration12mo: '25-50%', paidSocial: '25-50%', web: '10-25%', ooh: 'N/A', exclusivity: '25-50%' },
    { brandDeals: '$5K-$10K', ugc: '$1K-$5K', affiliate: 'Under $1K', adRevenue: '$0', ownProducts: '$0', services: '$25K-$50K', speaking: '$0', podcast: '$0', memberships: '$0', total: '$25K-$50K' },
    { structure: 'Sole trader', gstRegistered: 'No, under threshold', ratesShown: 'GST inclusive', contracts: 'Usually', agent: 'No' }),
];

const DELIVERABLES = [
  { key: 'feed', label: 'IG feed post', short: 'Feed' },
  { key: 'shortform', label: 'Short-form video (Reel / TikTok)', short: 'Reel/TT' },
  { key: 'story', label: 'Story set', short: 'Story' },
  { key: 'ytIntegrated', label: 'YouTube integrated mention', short: 'YT Int.' },
  { key: 'ytDedicated', label: 'YouTube dedicated video', short: 'YT Ded.' },
  { key: 'podcast', label: 'Podcast sponsorship', short: 'Podcast' },
  { key: 'blog', label: 'Blog post (sponsored)', short: 'Blog' },
  { key: 'ugcImage', label: 'UGC imagery (per image)', short: 'UGC img' },
  { key: 'ugcVideo', label: 'UGC short-form (per video)', short: 'UGC vid' },
  { key: 'proImage', label: 'Professional imagery (per image)', short: 'Pro img' },
  { key: 'proVideo', label: 'Professional videography (per video)', short: 'Pro vid' },
  { key: 'event', label: 'Event appearance or speaking', short: 'Event' },
  { key: 'ambassador', label: 'Ambassadorship (monthly retainer)', short: 'Ambass.' },
];

const REVENUE_STREAMS = [
  { key: 'brandDeals', label: 'Brand partnerships & sponsored content' },
  { key: 'ugc', label: 'UGC (brand-owned content)' },
  { key: 'affiliate', label: 'Affiliate income' },
  { key: 'adRevenue', label: 'Platform creator fund / ad revenue' },
  { key: 'digitalProducts', label: 'Digital products (courses, ebooks, presets)' },
  { key: 'physicalProducts', label: 'Physical products (merch)' },
  { key: 'experiences', label: 'Experiences (events, tours, retreats)' },
  { key: 'agencyServices', label: 'Agency services (consulting, SMM, commercial shoots)' },
  { key: 'speaking', label: 'Speaking & appearances' },
  { key: 'podcast', label: 'Podcast sponsorships' },
  { key: 'memberships', label: 'Substack / Patreon / memberships' },
  { key: 'other', label: 'Other' },
  { key: 'total', label: 'Total annual income from content' },
];

const LICENSING_DURATION = [
  { key: 'dur1mo', label: '1 month' },
  { key: 'dur3mo', label: '3 months' },
  { key: 'dur6mo', label: '6 months' },
  { key: 'dur12mo', label: '12 months' },
  { key: 'dur3yr', label: '3 years' },
  { key: 'durPerpetuity', label: 'In perpetuity (forever)' },
];
const LICENSING_USAGE = [
  { key: 'useOrganicReshare', label: 'Organic reshare on brand socials' },
  { key: 'usePaidSocial', label: 'Paid social ads' },
  { key: 'useWebsite', label: 'Brand website' },
  { key: 'usePrint', label: 'Print (magazines etc)' },
  { key: 'useOOH', label: 'Out of home (billboards etc)' },
  { key: 'useTV', label: 'TV / broadcast' },
];
const LICENSING_TERRITORY = [
  { key: 'terrOneCountry', label: 'One country only (e.g. NZ)' },
  { key: 'terrRegion', label: 'Wider region (Australasia / Europe / North America)' },
  { key: 'terrGlobal', label: 'Global' },
];
const LICENSING_ALL = [...LICENSING_DURATION, ...LICENSING_USAGE, ...LICENSING_TERRITORY, { key: 'exclusivity', label: 'Category exclusivity' }];
const TOTAL_BRACKETS = ['$0', 'Under $1K', '$1K - $5K', '$5K - $10K', '$10K - $25K', '$25K - $50K', '$50K - $100K', '$100K - $150K', '$150K - $250K', '$250K+'];

const FOLLOWERS = ['Under 1K', '1K - 5K', '5K - 10K', '10K - 25K', '25K - 50K', '50K - 100K', '100K - 500K', '500K+'];
const COUNTRIES = ['New Zealand', 'Australia', 'United Kingdom', 'United States'];
const NICHES = ['Travel', 'Outdoor/Adventure', 'Food/Cooking', 'Fashion', 'Beauty/Skincare', 'Fitness/Wellness', 'Parenting/Family', 'Business/Finance', 'Tech/Gaming', 'Lifestyle', 'Comedy/Entertainment', 'Education/Tutorials', 'Other'];
const WORK = ['Full-time creative', 'Part-time alongside other part-time work', 'Side hustle alongside other full-time work', 'Hobby with occasional paid opportunities', 'Unpaid passion project / hobby'];
const YEARS = ['Under 1', '1-2', '3-5', '6-10', '10+'];

// === EXTRA FIELDS (illustrative sample values until the live feed is wired) ===
const CREATOR_TYPES = ['Content Creator', 'UGC Creator', 'Influencer', 'Photographer', 'Blogger', 'Videographer', 'YouTuber', 'TikToker', 'Instagrammer', 'Podcaster', 'Freelancer', 'Creative Agency', 'Other'];
const CURRENCIES = ['NZD', 'AUD', 'USD', 'GBP'];
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Podcast', 'Blog', 'Twitch', 'Substack', 'LinkedIn'];
const ENGAGEMENT_LEVELS = ['Under 1%', '1% - 3%', '3% - 5%', '5% - 10%', '10%+'];
const TRAINING_OPTIONS = ["No, I'm fully self-taught", 'Free resources (YouTube, blogs, free webinars)', 'Paid online courses', 'Live workshops or webinars', 'Group programmes, memberships or communities', '1:1 coaching or mentoring', 'Formal qualification (degree, diploma, certificate)'];

function enrichResponse(r, i) {
  let creatorType;
  if (r.rates.podcast && r.rates.podcast !== 'N/A' && i % 3 === 0) creatorType = 'Podcaster';
  else if (r.rates.proVideo && r.rates.proVideo !== 'N/A' && i % 4 === 0) creatorType = 'Videographer';
  else if (r.rates.proImage && r.rates.proImage !== 'N/A' && i % 4 === 1) creatorType = 'Photographer';
  else if (r.rates.blog && r.rates.blog !== 'N/A' && i % 5 === 0) creatorType = 'Blogger';
  else if (r.work === 'Hobby with occasional paid opportunities' || (r.followers === '1K - 5K' && i % 2 === 0)) creatorType = 'Freelancer';
  else creatorType = (i % 2 === 0) ? 'Content Creator' : 'Influencer';

  let primaryPlatform;
  if (creatorType === 'Podcaster') primaryPlatform = 'Podcast';
  else if (creatorType === 'Blogger') primaryPlatform = 'Blog';
  else if (r.rates.ytDedicated && r.rates.ytDedicated !== 'N/A' && i % 3 === 0) primaryPlatform = 'YouTube';
  else primaryPlatform = (i % 4 === 0) ? 'TikTok' : 'Instagram';

  const secPool = PLATFORMS.filter(p => p !== primaryPlatform);
  const secondaryPlatforms = [secPool[i % secPool.length], secPool[(i + 2) % secPool.length]].filter((v, idx, a) => a.indexOf(v) === idx);

  const fIdx = FOLLOWERS.indexOf(r.followers);
  let engagementRate;
  if (fIdx <= 1) engagementRate = (i % 2 === 0) ? '10%+' : '5% - 10%';
  else if (fIdx <= 3) engagementRate = (i % 2 === 0) ? '5% - 10%' : '3% - 5%';
  else if (fIdx <= 5) engagementRate = (i % 2 === 0) ? '3% - 5%' : '1% - 3%';
  else engagementRate = (i % 2 === 0) ? '1% - 3%' : 'Under 1%';

  let inbound;
  if (fIdx >= 5 || r.work === 'Full-time creative') inbound = (i % 3 === 0) ? 75 : 60;
  else if (fIdx >= 3) inbound = 50;
  else inbound = (i % 3 === 0) ? 25 : 40;
  const inboundOutbound = inbound + '% inbound / ' + (100 - inbound) + '% outbound';

  const nPool = NICHES.filter(n => n !== r.niche);
  const secondaryNiches = [nPool[i % nPool.length], nPool[(i + 3) % nPool.length]].filter((v, idx, a) => a.indexOf(v) === idx);

  const followersAll = (fIdx >= 0 && fIdx < FOLLOWERS.length - 1 && i % 2 === 0) ? FOLLOWERS[fIdx + 1] : r.followers;

  const dealOpts = ['Usually under rate card', 'On par with rate card', 'Often over rate card'];
  const dealVsRate = dealOpts[i % 3];

  const clientLocation = (i % 4 === 0) ? 'USA' : r.country;

  let training;
  if (r.work === 'Hobby with occasional paid opportunities' || (fIdx <= 1 && i % 2 === 0)) training = ["No, I'm fully self-taught"];
  else {
    const tp = ['Free resources (YouTube, blogs, free webinars)', 'Paid online courses', 'Live workshops or webinars', 'Group programmes, memberships or communities', '1:1 coaching or mentoring', 'Formal qualification (degree, diploma, certificate)'];
    training = [tp[i % tp.length]];
    if (i % 3 === 0) training.push(tp[(i + 2) % tp.length]);
    if (fIdx >= 4 && i % 2 === 0) training.push('1:1 coaching or mentoring');
    training = Array.from(new Set(training));
  }
  const spendOpts = ['$0', 'Under $250', '$250 to $1,000', '$1,000 to $3,000', '$3,000 to $10,000', '$10,000+'];
  let trainingSpend;
  if (training.length === 1 && training[0] === "No, I'm fully self-taught") trainingSpend = (i % 2 === 0) ? '$0' : 'Under $250';
  else if (fIdx >= 5 || r.work === 'Full-time creative') trainingSpend = spendOpts[3 + (i % 3)];
  else trainingSpend = spendOpts[1 + (i % 3)];

  const LB = ['0%', '10-25%', '25-50%', '50-100%', '100-200%', '200%+'];
  const lbase = Math.max(0, Math.min(5, Math.round((fIdx / 6) * 5)));
  const ljit = (i % 3) - 1;
  const lic = (offset, naIfSmall) => {
    if (naIfSmall && fIdx <= 1) return 'N/A';
    return LB[Math.max(0, Math.min(5, lbase + offset + ljit))];
  };
  const licensing = {
    dur1mo: lic(-2, false), dur3mo: lic(-1, false), dur6mo: lic(0, false), dur12mo: lic(1, false), dur3yr: lic(1, true), durPerpetuity: lic(2, true),
    useOrganicReshare: lic(-2, false), usePaidSocial: lic(0, false), useWebsite: lic(-1, false), usePrint: lic(0, true), useOOH: lic(1, true), useTV: lic(2, true),
    terrOneCountry: lic(-1, false), terrRegion: lic(0, false), terrGlobal: lic(1, true),
    exclusivity: lic(1, false),
  };
  const chargesLicensing = (fIdx >= 4) ? 'Always' : (fIdx >= 2 ? 'Sometimes' : (i % 2 === 0 ? 'No, included in base rate' : "I don't know what this is"));
  const baseRateIncludes = ['Organic post only, no additional usage', 'Organic post plus brand re-share on their socials', 'Organic post plus limited paid usage (e.g. 30 days boosting)', 'Varies deal by deal', "I don't charge for licensing separately"][i % 5];

  return { creatorType, primaryPlatform, secondaryPlatforms, engagementRate, inboundOutbound, secondaryNiches, followersAll, dealVsRate, clientLocation, training, trainingSpend, licensing, chargesLicensing, baseRateIncludes };
}

const NICHE_MAP = { 'Outdoor': 'Outdoor/Adventure', 'Food': 'Food/Cooking', 'Beauty': 'Beauty/Skincare', 'Fitness': 'Fitness/Wellness', 'Parenting': 'Parenting/Family', 'Business': 'Business/Finance' };
const FOLLOWER_MAP = { '1K-5K': '1K - 5K', '5K-10K': '5K - 10K', '10K-25K': '10K - 25K', '25K-50K': '25K - 50K', '50K-100K': '50K - 100K', '100K-500K': '100K - 500K', '500K+': '500K+' };
const WORK_MAP = { 'Full-time creator': 'Full-time creative', 'Part-time': 'Part-time alongside other part-time work', 'Side hustle': 'Side hustle alongside other full-time work', 'Hobby with occasional paid opportunities': 'Hobby with occasional paid opportunities' };
const RATE_MAP = { 'Free / product only': 'Contra', 'Under $100': '< $100', '$100-$250': '$100 to 250', '$250-$500': '$250 to 500', '$500-$1,000': '$500 to 1k', '$1,000-$2,500': '$1k - 2.5k', '$2,500-$5,000': '$2.5k - 5k', '$5,000-$10,000': '$5k - 10k', '$10,000+': '$10k - 20k', 'N/A': 'N/A' };
const REVENUE_MAP = { '$0': '$0', 'Under $1K': '< $1K', '$1K-$5K': '$1K - $5K', '$5K-$10K': '$5K - $10K', '$10K-$25K': '$10K - $25K', '$25K-$50K': '$25K - $50K', '$50K-$100K': '$50K - $100K', '$100K+': '$100K+' };
const TOTAL_MAP = { '$0': '$0', 'Under $1K': 'Under $1K', '$1K-$5K': '$1K - $5K', '$5K-$10K': '$5K - $10K', '$10K-$25K': '$10K - $25K', '$25K-$50K': '$25K - $50K', '$50K-$100K': '$50K - $100K', '$100K-$150K': '$100K - $150K', '$150K-$250K': '$150K - $250K', '$250K+': '$250K+' };
RESPONSES.forEach((r, i) => {
  r.country = 'New Zealand';
  r.currency = 'NZD';
  r.niche = NICHE_MAP[r.niche] || r.niche;
  r.followers = FOLLOWER_MAP[r.followers] || r.followers;
  r.work = WORK_MAP[r.work] || r.work;
  Object.assign(r, enrichResponse(r, i));
  Object.keys(r.rates).forEach(k => { r.rates[k] = RATE_MAP[r.rates[k]] || r.rates[k]; });
  r.revenue.digitalProducts = r.revenue.ownProducts;
  r.revenue.physicalProducts = (i % 3 === 0) ? 'Under $1K' : (i % 5 === 0 ? '$1K-$5K' : '$0');
  r.revenue.experiences = (i % 4 === 0) ? '$1K-$5K' : '$0';
  r.revenue.agencyServices = r.revenue.services;
  r.revenue.other = (i % 6 === 0) ? 'Under $1K' : '$0';
  if (r.revenue.total === '$100K+') { const hi = ['$100K-$150K', '$150K-$250K', '$250K+']; r.revenue.total = hi[i % 3]; }
  Object.keys(r.revenue).forEach(k => { r.revenue[k] = (k === 'total' ? (TOTAL_MAP[r.revenue[k]] || r.revenue[k]) : (REVENUE_MAP[r.revenue[k]] || r.revenue[k])); });
});

// === HELPERS ===
function getDistribution(values, brackets) {
  const dist = {};
  brackets.forEach(b => dist[b] = 0);
  values.forEach(v => {
    if (v && v !== 'N/A' && dist[v] !== undefined) dist[v]++;
  });
  return brackets.map(b => ({ bracket: b, count: dist[b] }));
}

function getValidCount(values) {
  return values.filter(v => v && v !== 'N/A').length;
}

// Brackets excluded from the median / percentile maths (paid work only, $1 upwards).
// 'Contra' is unique to deliverable rates, so excluding it here never touches revenue or licensing.
const MEDIAN_EXCLUDE = ['Contra'];

// Find the median bracket and the middle-50% (p25..p75) range by cumulative count.
// Excluded brackets (e.g. Contra) still display in the chart but are ignored here,
// so the median is calculated from paid responses ($1+) only.
function benchmarkOf(distribution) {
  const isExcluded = (b) => MEDIAN_EXCLUDE.includes(b);
  const total = distribution.reduce((sum, d) => sum + (isExcluded(d.bracket) ? 0 : d.count), 0);
  if (total === 0) return null;
  let cum = 0, p25 = -1, medianIdx = -1, p75 = -1;
  distribution.forEach((d, i) => {
    if (isExcluded(d.bracket)) return;
    cum += d.count;
    if (d.count > 0) {
      if (p25 === -1 && cum >= total * 0.25) p25 = i;
      if (medianIdx === -1 && cum >= total * 0.5) medianIdx = i;
      if (p75 === -1 && cum >= total * 0.75) p75 = i;
    }
  });
  if (p25 === -1) p25 = medianIdx;
  if (p75 === -1) p75 = medianIdx;
  return { total, p25, medianIdx, p75 };
}

// Parse rate or revenue bracket to numeric range for comparison
function bracketToRange(bracket) {
  if (!bracket || bracket === 'N/A' || bracket === 'n/a') return null;
  const b = String(bracket).trim();
  if (b === 'Contra' || b === '$0' || b === 'Free / product only') return [0, 0];
  const toNum = (str) => {
    if (str == null) return null;
    let x = String(str).toLowerCase().replace(/[$,\s]/g, '');
    let mult = 1;
    if (x.endsWith('k')) { mult = 1000; x = x.slice(0, -1); }
    const n = parseFloat(x);
    return isNaN(n) ? null : n * mult;
  };
  let m = b.match(/^(?:under|<)\s*\$?([\d.,]+k?)/i);
  if (m) { const hi = toNum(m[1]); return hi == null ? null : [0, hi]; }
  m = b.match(/^\$?([\d.,]+k?)\s*\+$/i);
  if (m) { const lo = toNum(m[1]); return lo == null ? null : [lo, Infinity]; }
  m = b.match(/\$?([\d.,]+k?)\s*(?:to|[-\u2013])\s*\$?([\d.,]+k?)/i);
  if (m) { const lo = toNum(m[1]); const hi = toNum(m[2]); if (lo != null && hi != null) return [lo, hi]; }
  return null;
}

// === LIVE DATA (Google Form responses, published as CSV) ===
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSvHA634ZaSJpNXTLoFqK0FJqVNhY0JVsJruCCW7SkwAoB1fAQUAhpA2uvWQ4d4YKk98NajxGCo8M4S/pub?gid=194493544&single=true&output=csv';

const RATE_COLS = { feed: 'Feed post', shortform: 'Short-form video', story: 'Story set', ytIntegrated: 'YT integrated mention', ytDedicated: 'YT dedicated video', podcast: 'Podcast sponsorship', blog: 'Blog post (sponsored)', ugcImage: 'UGC imagery (per image)', ugcVideo: 'UGC short-form (per video)', proImage: 'Professional imagery (per image)', proVideo: 'Professional videography (per video)', event: 'Event appearance or speaking', ambassador: 'Ambassadorship' };
const LIC_DURATION_COLS = { dur1mo: '1 month', dur3mo: '3 months', dur6mo: '6 months', dur12mo: '12 months', dur3yr: '3 years', durPerpetuity: 'In perpetuity (forever)' };
const LIC_USAGE_COLS = { useOrganicReshare: "Organic reshare on brand's socials", usePaidSocial: 'Paid social ads', useWebsite: 'Brand website', usePrint: 'Print (magazines etc)', useOOH: 'Out of home (billboards etc)', useTV: 'TV / broadcast' };
const LIC_TERRITORY_COLS = { terrOneCountry: 'One country only (e.g. NZ)', terrRegion: 'Wider region', terrGlobal: 'Global' };
const REVENUE_COLS = { brandDeals: 'Brand partnerships', ugc: 'UGC', affiliate: 'Affiliate', adRevenue: 'Platform creator fund', digitalProducts: 'Digital products', physicalProducts: 'Physical products', experiences: 'Experiences', speaking: 'Speaking and appearances fees', podcast: 'Podcast sponsorships', memberships: 'Memberships', agencyServices: 'Agency services', other: 'Other' };

function mapRowToResponse(row, idx) {
  const keys = Object.keys(row);
  const val = (key) => (key && row[key] != null ? String(row[key]).trim() : '');
  const get = (sub) => val(keys.find(h => h.includes(sub)));
  const getMatrix = (qSub, label) => val(keys.find(h => h.includes(qSub) && h.includes('[' + label)));
  const norm = (v, allowed) => (allowed.includes(v) ? v : 'N/A');
  const splitMulti = (v) => (v ? v.split(/,\s*/).map(x => x.trim()).filter(Boolean) : []);

  const rates = {};
  Object.entries(RATE_COLS).forEach(([k, label]) => { rates[k] = norm(getMatrix("actually been paid", label), RATE_BRACKETS); });

  const licensing = {};
  Object.entries(LIC_DURATION_COLS).forEach(([k, label]) => { licensing[k] = norm(getMatrix('For each duration', label), LICENSING_BRACKETS); });
  Object.entries(LIC_USAGE_COLS).forEach(([k, label]) => { licensing[k] = norm(getMatrix('For each usage type', label), LICENSING_BRACKETS); });
  Object.entries(LIC_TERRITORY_COLS).forEach(([k, label]) => { licensing[k] = norm(getMatrix('For each territory', label), LICENSING_BRACKETS); });
  licensing.exclusivity = norm(getMatrix('category exclusivity', 'Exclusivity'), LICENSING_BRACKETS);

  const revenue = {};
  Object.entries(REVENUE_COLS).forEach(([k, label]) => { revenue[k] = norm(getMatrix('annual ballpark income', label), REVENUE_BRACKETS); });
  revenue.total = norm(get('Total annual income'), TOTAL_BRACKETS);

  const trainingCell = get('undertaken training');
  const training = TRAINING_OPTIONS.filter(o => trainingCell.includes(o));

  const dvr = get('close deals over or under');
  const dealVsRate = (dvr === '1' || dvr === '2') ? 'Usually under rate card' : (dvr === '3') ? 'On par with rate card' : (dvr === '4' || dvr === '5') ? 'Often over rate card' : dvr;

  const inbound = get('[Inbound]');
  const outbound = get('[Outbound]');
  const inboundOutbound = (inbound || outbound) ? (inbound + ' inbound / ' + outbound + ' outbound') : '';

  const structureKey = keys.find(h => h.trim() === 'Column 8' || h.toLowerCase().includes('structure'));

  return {
    id: idx + 1,
    country: get('Country of Residence'),
    age: get('Age Bracket'),
    gender: get('Gender'),
    years: get('Years Creating').replace(/\s*years?$/i, '').trim(),
    work: get('describe your creator work'),
    creatorType: get('describe / introduce yourself'),
    followers: get('Follower Count on your Primary'),
    followersAll: get('Follower Count across all'),
    niche: get('Niche or Content Category (Select the primary'),
    secondaryNiches: splitMulti(get('Secondary niches')),
    primaryPlatform: get('Primary Platform (where').replace(/\s*\([^)]*\)\s*$/, '').trim(),
    secondaryPlatforms: splitMulti(get('Secondary Platforms')).map(p => p.replace(/\s*\([^)]*\)\s*$/, '').trim()),
    engagementRate: get('Average Engagement Rate'),
    currency: get('default currency'),
    clientLocation: get('country/region are the majority'),
    inboundOutbound,
    dealVsRate,
    chargesLicensing: get('charge extra for usage rights'),
    baseRateIncludes: get('base rate typically include'),
    training,
    trainingSpend: get('invested in growing'),
    rates,
    licensing,
    revenue,
    business: {
      structure: val(structureKey),
      gstRegistered: get('GST registered'),
      ratesShown: 'GST exclusive',
      contracts: get('written agreement'),
      agent: get('manager or agency'),
    },
  };
}

// === COMPONENTS ===
function DistributionChart({ distribution, accentColor = C.darkGreen }) {
  const maxCount = Math.max(...distribution.map(d => d.count), 1);
  const totalCount = distribution.reduce((sum, d) => sum + d.count, 0);

  if (totalCount < MIN_SAMPLE) {
    return <div style={{ padding: '24px', textAlign: 'center', color: C.inkSoft, fontSize: '14px', fontStyle: 'italic' }}>{totalCount === 0 ? 'No data yet for this filter combination' : `Not enough responses to show this yet. We only display a breakdown once at least ${MIN_SAMPLE} creators have answered.`}</div>;
  }

  const bm = benchmarkOf(distribution);

  return (
    <div style={{ marginTop: '8px' }}>
      {distribution.map((d, i) => {
        const widthPct = (d.count / maxCount) * 100;
        const sharePct = totalCount > 0 ? Math.round((d.count / totalCount) * 100) : 0;
        const isMedian = bm && i === bm.medianIdx;
        const barColor = isMedian ? C.purple : C.darkGreen;
        return (
          <div key={d.bracket} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ fontSize: '13px', color: C.ink, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>{d.bracket}{isMedian && <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: C.purple }}>median</span>}</div>
            <div style={{ height: '24px', backgroundColor: C.borderSoft, borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
              {d.count > 0 && (
                <div style={{ height: '100%', width: `${widthPct}%`, backgroundColor: barColor, borderRadius: '3px', transition: 'width 0.3s', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                  {widthPct > 20 && <span style={{ color: C.offWhite, fontSize: '12px', fontWeight: 600 }}>{sharePct}%</span>}
                </div>
              )}
              {d.count > 0 && widthPct <= 20 && (
                <span style={{ position: 'absolute', left: `calc(${widthPct}% + 8px)`, top: '50%', transform: 'translateY(-50%)', color: C.ink, fontSize: '12px', fontWeight: 600 }}>{sharePct}%</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BenchmarkHeadline({ distribution, noun = 'rate' }) {
  const bm = benchmarkOf(distribution);
  if (!bm) return null;
  const med = distribution[bm.medianIdx] && distribution[bm.medianIdx].bracket;
  return (
    <div style={{ backgroundColor: `${C.purple}10`, borderLeft: `3px solid ${C.purple}`, padding: '14px 18px', borderRadius: '4px', marginBottom: '20px' }}>
      <div style={{ fontSize: '14px', color: C.ink }}>
        Typical {noun} (the median): <strong style={{ color: C.purple }}>{med}</strong>.
      </div>
    </div>
  );
}

function FilterChips({ label, options, selected, onToggle, icon }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: C.inkSoft, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon} {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map(opt => {
          const active = selected.includes(opt);
          return (
            <button key={opt} onClick={() => onToggle(opt)} style={{
              padding: '6px 14px', fontSize: '13px', fontFamily: "'Lato', sans-serif",
              backgroundColor: active ? C.lightGreen : 'transparent',
              border: `1px solid ${active ? C.lightGreen : C.border}`,
              borderRadius: '20px', color: C.ink, fontWeight: active ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s',
            }}>{opt}</button>
          );
        })}
      </div>
    </div>
  );
}

// === CREATOR DETAIL MODAL ===
function CreatorModal({ creator, onClose }) {
  if (!creator) return null;

  const styles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(42, 61, 30, 0.55)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', overflow: 'auto',
    },
    modal: {
      backgroundColor: C.offWhite, borderRadius: '10px', maxWidth: '780px',
      width: '100%', maxHeight: '90vh', overflow: 'auto',
      position: 'relative', padding: '36px 36px 32px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    },
    closeBtn: {
      position: 'absolute', top: '16px', right: '16px',
      background: 'none', border: 'none', cursor: 'pointer',
      padding: '8px', color: C.ink, borderRadius: '50%',
    },
    title: {
      fontFamily: "'Lato', sans-serif",
      fontSize: '23px', fontWeight: 700, color: C.darkGreen, margin: '0 0 6px 0',
    },
    subtitle: {
      fontSize: '14px', color: C.inkSoft, marginBottom: '24px',
    },
    section: {
      marginBottom: '24px', paddingBottom: '20px',
      borderBottom: `1px solid ${C.borderSoft}`,
    },
    sectionTitle: {
      fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px',
      textTransform: 'uppercase', color: C.darkGreen, marginBottom: '12px',
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' },
    item: {
      padding: '10px 12px', backgroundColor: C.white,
      borderRadius: '5px', border: `1px solid ${C.borderSoft}`,
    },
    itemLabel: { fontSize: '11px', color: C.inkSoft, marginBottom: '2px' },
    itemValue: { fontSize: '13px', color: C.ink, fontWeight: 600 },
  };

  const profileItems = [
    ['Creator type', creator.creatorType],
    ['Age', creator.age],
    ['Gender', creator.gender],
    ['Years creating', creator.years],
    ['Stage', creator.work],
    ['Niche', creator.niche],
    ['Secondary niches', (creator.secondaryNiches || []).join(', ')],
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}><X size={20} /></button>

        <h2 style={styles.title}>Creator #{creator.id}</h2>
        <p style={styles.subtitle}>
          A {creator.work.toLowerCase()} from {creator.country} in the {creator.niche.toLowerCase()} niche, {creator.years} years in.
        </p>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Profile</div>
          <div style={styles.grid}>
            {profileItems.map(([k, v]) => (
              <div key={k} style={styles.item}>
                <div style={styles.itemLabel}>{k}</div>
                <div style={styles.itemValue}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Platform & audience</div>
          <div style={styles.grid}>
            <div style={styles.item}><div style={styles.itemLabel}>Primary platform</div><div style={styles.itemValue}>{creator.primaryPlatform}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Secondary platforms</div><div style={styles.itemValue}>{(creator.secondaryPlatforms || []).join(', ') || '\u2014'}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Follower size (primary)</div><div style={styles.itemValue}>{creator.followers}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Followers (all platforms)</div><div style={styles.itemValue}>{creator.followersAll}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Engagement rate</div><div style={styles.itemValue}>{creator.engagementRate}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Inbound vs outbound</div><div style={styles.itemValue}>{creator.inboundOutbound}</div></div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Deliverable rates</div>
          <div style={styles.grid}>
            {DELIVERABLES.map(d => (
              <div key={d.key} style={styles.item}>
                <div style={styles.itemLabel}>{d.label}</div>
                <div style={{ ...styles.itemValue, color: creator.rates[d.key] === 'N/A' ? C.inkSoft : C.ink, fontStyle: creator.rates[d.key] === 'N/A' ? 'italic' : 'normal' }}>
                  {creator.rates[d.key]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Licensing uplifts (on top of base rate)</div>
          <div style={styles.grid}>
            {LICENSING_ALL.map(l => (
              <div key={l.key} style={styles.item}>
                <div style={styles.itemLabel}>{l.label}</div>
                <div style={styles.itemValue}>{creator.licensing[l.key]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Annual revenue by stream</div>
          <div style={styles.grid}>
            {REVENUE_STREAMS.map(s => (
              <div key={s.key} style={{
                ...styles.item,
                backgroundColor: s.key === 'total' ? `${C.lightGreen}40` : C.white,
                borderColor: s.key === 'total' ? C.darkGreen : C.borderSoft,
              }}>
                <div style={styles.itemLabel}>{s.label}</div>
                <div style={styles.itemValue}>{creator.revenue[s.key]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.section, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
          <div style={styles.sectionTitle}>Business setup</div>
          <div style={styles.grid}>
            <div style={styles.item}><div style={styles.itemLabel}>Structure</div><div style={styles.itemValue}>{creator.business.structure}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>GST registered</div><div style={styles.itemValue}>{creator.business.gstRegistered}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Rates shown as</div><div style={styles.itemValue}>{creator.business.ratesShown}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Uses contracts</div><div style={styles.itemValue}>{creator.business.contracts}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Agent / management</div><div style={styles.itemValue}>{creator.business.agent}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Main client location</div><div style={styles.itemValue}>{creator.clientLocation}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Deals vs rate card</div><div style={styles.itemValue}>{creator.dealVsRate}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Training</div><div style={styles.itemValue}>{(creator.training || []).join(', ')}</div></div>
            <div style={styles.item}><div style={styles.itemLabel}>Invested (last 12mo)</div><div style={styles.itemValue}>{creator.trainingSpend}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === RAW DATA TABLE ===
function RawDataTable({ responses, onOpen, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('desc');

  const accessor = (c, key) => {
    if (key === 'id') return c.id;
    if (key === 'creatorType') return c.creatorType || '';
    if (key === 'followers') return FOLLOWERS.indexOf(c.followers);
    if (key === 'niche') return c.niche || '';
    if (key === 'primaryPlatform') return c.primaryPlatform || '';
    if (key === 'work') return c.work || '';
    if (key === 'years') return YEARS.indexOf(c.years);
    if (key === 'total') { const r = bracketToRange(c.revenue.total); return r ? r[0] : -1; }
    if (key && key.indexOf('rate:') === 0) { const r = bracketToRange(c.rates[key.slice(5)]); return r ? r[0] : -1; }
    return '';
  };

  // Randomise the default row order each time the data loads, so no single creator
  // is consistently shown first. A column sort still overrides this when applied.
  const shuffled = useMemo(() => {
    const arr = [...responses];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [responses]);

  const sorted = sortKey
    ? [...shuffled].sort((a, b) => {
        const av = accessor(a, sortKey), bv = accessor(b, sortKey);
        const cmp = (typeof av === 'number' && typeof bv === 'number') ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : shuffled;

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };
  const mark = (key) => (sortKey === key ? (sortDir === 'asc' ? ' \u25B2' : ' \u25BC') : '');

  const styles = {
    wrap: { marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${C.borderSoft}` },
    toggleBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '10px 16px', cursor: 'pointer', fontSize: '13px', fontFamily: "'Lato', sans-serif", color: C.ink, fontWeight: 600 },
    helper: { fontSize: '12px', color: C.inkSoft, marginLeft: '12px' },
    tableWrap: { marginTop: '16px', overflowX: 'auto', overflowY: 'auto', maxHeight: '520px', borderRadius: '6px', border: `1px solid ${C.borderSoft}` },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: '1100px' },
    th: { textAlign: 'left', padding: '10px 8px', backgroundColor: C.offWhite, fontWeight: 700, fontSize: '11px', letterSpacing: '0.3px', textTransform: 'uppercase', color: C.ink, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap', cursor: 'pointer', position: 'sticky', top: 0, zIndex: 1 },
    td: { padding: '8px', borderBottom: `1px solid ${C.borderSoft}`, color: C.ink, whiteSpace: 'nowrap' },
    tdMuted: { color: C.inkSoft, fontStyle: 'italic' },
    tdHighlight: { fontWeight: 700, color: C.darkGreen },
    detailBtn: { background: 'none', border: 'none', cursor: 'pointer', color: C.darkGreen, fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' },
    row: { transition: 'background-color 0.1s' },
  };

  return (
    <div style={styles.wrap}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <button style={styles.toggleBtn} onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide raw data' : 'Show raw data'} ({responses.length} {responses.length === 1 ? 'creator' : 'creators'})
        </button>
        <span style={styles.helper}>One row per creator. Tap a column to sort, or any row for the full breakdown.</span>
      </div>

      {expanded && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, cursor: 'default' }}></th>
                <th style={styles.th} onClick={() => toggleSort('id')}>#{mark('id')}</th>
                <th style={styles.th} onClick={() => toggleSort('creatorType')}>Type{mark('creatorType')}</th>
                <th style={styles.th} onClick={() => toggleSort('followers')}>Followers{mark('followers')}</th>
                <th style={styles.th} onClick={() => toggleSort('niche')}>Niche{mark('niche')}</th>
                <th style={styles.th} onClick={() => toggleSort('primaryPlatform')}>Platform{mark('primaryPlatform')}</th>
                <th style={styles.th} onClick={() => toggleSort('work')}>Stage{mark('work')}</th>
                <th style={styles.th} onClick={() => toggleSort('years')}>Yrs{mark('years')}</th>
                <th style={{ ...styles.th, color: C.darkGreen }} onClick={() => toggleSort('total')}>Total revenue{mark('total')}</th>
                {DELIVERABLES.map(d => <th key={d.key} style={styles.th} onClick={() => toggleSort('rate:' + d.key)}>{d.short}{mark('rate:' + d.key)}</th>)}
              </tr>
            </thead>
            <tbody>
              {sorted.map(c => (
                <tr key={c.id} style={styles.row} onMouseEnter={e => e.currentTarget.style.backgroundColor = `${C.lightGreen}20`} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={styles.td}>
                    <button style={styles.detailBtn} onClick={() => onOpen(c)}>
                      <ExternalLink size={11} /> Details
                    </button>
                  </td>
                  <td style={styles.td}>#{c.id}</td>
                  <td style={styles.td}>{c.creatorType}</td>
                  <td style={styles.td}>{c.followers}</td>
                  <td style={styles.td}>{c.niche}</td>
                  <td style={styles.td}>{c.primaryPlatform}</td>
                  <td style={styles.td}>{c.work}</td>
                  <td style={styles.td}>{c.years}</td>
                  <td style={{ ...styles.td, ...styles.tdHighlight }}>{c.revenue.total}</td>
                  {DELIVERABLES.map(d => (
                    <td key={d.key} style={{ ...styles.td, ...(c.rates[d.key] === 'N/A' ? styles.tdMuted : {}) }}>{c.rates[d.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// === SMART QUESTION PARSER ===
// Detects question intent: filter-then-rate vs filter-by-rate-then-show-demographic
function parseQuestion(q) {
  const lower = q.toLowerCase();

  // Detect deliverable
  let deliverable = null;
  if (lower.includes('reel') || lower.includes('tiktok') || lower.includes('short-form') || lower.includes('short form')) deliverable = 'shortform';
  else if (lower.includes('feed post') || lower.includes('instagram post') || lower.includes('carousel') || lower.includes('feed')) deliverable = 'feed';
  else if (lower.includes('story') || lower.includes('stories')) deliverable = 'story';
  else if (lower.includes('youtube integrated') || lower.includes('integrated mention')) deliverable = 'ytIntegrated';
  else if (lower.includes('youtube dedicated') || lower.includes('dedicated video')) deliverable = 'ytDedicated';
  else if (lower.includes('podcast')) deliverable = 'podcast';
  else if (lower.includes('blog')) deliverable = 'blog';
  else if (lower.includes('ugc') && (lower.includes('image') || lower.includes('photo'))) deliverable = 'ugcImage';
  else if (lower.includes('ugc')) deliverable = 'ugcVideo';
  else if (lower.includes('event') || lower.includes('speaking')) deliverable = 'event';
  else if (lower.includes('ambassador') || lower.includes('retainer')) deliverable = 'ambassador';

  // Detect follower size mention
  let followerFilter = null;
  if (lower.match(/500k\+|500,000\+|five hundred k/)) followerFilter = '500K+';
  else if (lower.match(/100k|100,000|hundred k/)) followerFilter = '100K - 500K';
  else if (lower.match(/50k|50,000|fifty k/)) followerFilter = '50K - 100K';
  else if (lower.match(/25k|25,000|twenty-five k/)) followerFilter = '25K - 50K';
  else if (lower.match(/10k|10,000|ten k/)) followerFilter = '10K - 25K';
  else if (lower.match(/5k|5,000|five k/)) followerFilter = '5K - 10K';
  else if (lower.match(/1k|1,000/)) followerFilter = '1K - 5K';

  // Country
  let countryFilter = null;
  if (lower.includes('new zealand') || lower.includes(' nz')) countryFilter = 'New Zealand';
  else if (lower.includes('australia') || lower.includes('aussie')) countryFilter = 'Australia';
  else if (lower.includes('uk') || lower.includes('united kingdom') || lower.includes('britain')) countryFilter = 'United Kingdom';
  else if (lower.includes('usa') || lower.includes('america')) countryFilter = 'United States';

  // Niche
  let nicheFilter = null;
  for (const n of NICHES) { if (lower.includes(n.toLowerCase())) { nicheFilter = n; break; } }

  // Stage
  let workFilter = null;
  if (lower.includes('full-time') || lower.includes('full time')) workFilter = 'Full-time creative';
  else if (lower.includes('part-time') || lower.includes('part time')) workFilter = 'Part-time alongside other part-time work';
  else if (lower.includes('side hustle') || lower.includes('side income')) workFilter = 'Side hustle alongside other full-time work';
  else if (lower.includes('hobby')) workFilter = 'Hobby with occasional paid opportunities';

  // Detect revenue/income threshold (e.g. "earning $100K+", "make $50K", "over $25k revenue")
  let revenueFilter = null;
  const revenueMatch = lower.match(/(\$?[\d]+k?\s?\+?)\s*(?:revenue|income|earning|earn|make|making|annual|year)/i);
  const directMatch = lower.match(/(?:earning|earn|make|making|annual|year)[^\d]*(\$?[\d]+k?\s?\+?)/i);
  const m = revenueMatch || directMatch;
  if (m) {
    const num = m[1].replace(/[$,\s]/g, '').toLowerCase();
    if (num.includes('100')) revenueFilter = '$100K+';
    else if (num.includes('50')) revenueFilter = '$50K-$100K';
    else if (num.includes('25')) revenueFilter = '$25K-$50K';
    else if (num.includes('10')) revenueFilter = '$10K-$25K';
    else if (num.includes('5')) revenueFilter = '$5K-$10K';
    else if (num.includes('1')) revenueFilter = '$1K-$5K';
  }

  // Detect rate threshold for deliverable (e.g. "creators charging $5K+ for ambassadorship")
  let rateThreshold = null;
  const rateMatch = lower.match(/charging\s*\$?([\d,]+)k?\s?\+?|(?:more than|over|above)\s*\$?([\d,]+)k?\s?\+?/i);
  if (rateMatch) {
    const num = (rateMatch[1] || rateMatch[2]).replace(/,/g, '').toLowerCase();
    const isK = lower.includes('k');
    rateThreshold = parseInt(num) * (isK ? 1000 : 1);
  }

  // Detect what creator characteristic the question is asking about (the "output" they want)
  // Examples: "how many years experience", "what follower size", "what niche", "what stage"
  let askAbout = null;
  if (lower.match(/years? (?:of )?(?:experience|creating|in)/) || lower.match(/how (?:long|many years)/)) askAbout = 'years';
  else if (lower.match(/follower(?: size| count|s)?|audience size|how big/)) askAbout = 'followers';
  else if (lower.match(/niche|categor|industr/)) askAbout = 'niche';
  else if (lower.match(/stage|full[\s-]?time|part[\s-]?time|hobby/)) askAbout = 'work';
  else if (lower.match(/where|country|located|based/)) askAbout = 'country';
  else if (lower.match(/age/)) askAbout = 'age';
  else if (lower.match(/structure|sole trader|company|business setup/)) askAbout = 'structure';
  else if (lower.match(/agent|representation|management/)) askAbout = 'agent';
  else if (lower.match(/gst/)) askAbout = 'gst';

  // Determine question type:
  // Type A: Standard - filter by demographics, show rate distribution for a deliverable
  // Type B: Reverse - filter by revenue/rate threshold, show demographic distribution
  let type = 'standard';
  if ((revenueFilter || rateThreshold) && askAbout && !deliverable) type = 'reverse';
  if ((revenueFilter || rateThreshold) && askAbout) type = 'reverse';
  if (deliverable && !askAbout) type = 'standard';

  return {
    type, deliverable, followerFilter, countryFilter, nicheFilter, workFilter,
    revenueFilter, rateThreshold, askAbout,
  };
}

function runQuery(parsed, allResponses) {
  let pool = allResponses;

  // Apply filters
  if (parsed.countryFilter) pool = pool.filter(r => r.country === parsed.countryFilter);
  if (parsed.followerFilter) pool = pool.filter(r => r.followers === parsed.followerFilter);
  if (parsed.nicheFilter) pool = pool.filter(r => r.niche === parsed.nicheFilter);
  if (parsed.workFilter) pool = pool.filter(r => r.work === parsed.workFilter);

  // Revenue filter (creators earning at or above this bracket)
  if (parsed.revenueFilter) {
    const targetRange = bracketToRange(parsed.revenueFilter);
    if (targetRange) {
      pool = pool.filter(r => {
        const range = bracketToRange(r.revenue.total);
        return range && range[0] >= targetRange[0];
      });
    }
  }

  // Rate threshold (creators charging at or above this for the deliverable)
  if (parsed.rateThreshold && parsed.deliverable) {
    pool = pool.filter(r => {
      const range = bracketToRange(r.rates[parsed.deliverable]);
      return range && range[0] >= parsed.rateThreshold;
    });
  }

  if (parsed.type === 'standard' && parsed.deliverable) {
    const values = pool.map(r => r.rates[parsed.deliverable]);
    return {
      type: 'standard',
      deliverable: parsed.deliverable,
      filters: parsed,
      distribution: getDistribution(values, RATE_BRACKETS),
      validCount: getValidCount(values),
      totalCount: pool.length,
      pool,
    };
  }

  if (parsed.type === 'reverse' && parsed.askAbout) {
    // Build counts for the asked-about dimension
    const counts = {};
    pool.forEach(r => {
      let v;
      if (parsed.askAbout === 'years') v = r.years;
      else if (parsed.askAbout === 'followers') v = r.followers;
      else if (parsed.askAbout === 'niche') v = r.niche;
      else if (parsed.askAbout === 'work') v = r.work;
      else if (parsed.askAbout === 'country') v = r.country;
      else if (parsed.askAbout === 'age') v = r.age;
      else if (parsed.askAbout === 'structure') v = r.business.structure;
      else if (parsed.askAbout === 'agent') v = r.business.agent;
      else if (parsed.askAbout === 'gst') v = r.business.gstRegistered;
      if (v) counts[v] = (counts[v] || 0) + 1;
    });

    // Use an ordered list if available
    let ordered;
    if (parsed.askAbout === 'years') ordered = YEARS;
    else if (parsed.askAbout === 'followers') ordered = FOLLOWERS;
    else if (parsed.askAbout === 'niche') ordered = NICHES;
    else if (parsed.askAbout === 'work') ordered = WORK;
    else if (parsed.askAbout === 'country') ordered = COUNTRIES;
    else ordered = Object.keys(counts);

    const distribution = ordered.map(o => ({ bracket: o, count: counts[o] || 0 })).filter(d => d.count > 0 || ordered.includes(d.bracket));

    return {
      type: 'reverse',
      askAbout: parsed.askAbout,
      filters: parsed,
      distribution,
      validCount: pool.length,
      totalCount: pool.length,
      pool,
    };
  }

  return { type: 'unclear', filters: parsed, pool };
}

function describeFilters(parsed) {
  const parts = [];
  if (parsed.revenueFilter) parts.push(`earning ${parsed.revenueFilter}+`);
  if (parsed.rateThreshold && parsed.deliverable) {
    const label = DELIVERABLES.find(d => d.key === parsed.deliverable)?.label;
    parts.push(`charging $${parsed.rateThreshold.toLocaleString()}+ for ${label}`);
  }
  if (parsed.followerFilter) parts.push(`${parsed.followerFilter} followers`);
  if (parsed.countryFilter) parts.push(parsed.countryFilter);
  if (parsed.nicheFilter) parts.push(parsed.nicheFilter);
  if (parsed.workFilter) parts.push(parsed.workFilter.toLowerCase());
  return parts.join(' · ');
}

const ASK_ABOUT_LABELS = {
  years: 'Years of experience',
  followers: 'Follower size',
  niche: 'Niche',
  work: 'Creator stage',
  country: 'Country',
  age: 'Age bracket',
  structure: 'Business structure',
  agent: 'Agent / management',
  gst: 'GST status',
};

// === INTRO / HOW-TO PANEL ===
function IntroPanel({ onClose }) {
  const steps = [
    ['Four ways to explore', 'Use the tabs up top: explore one deliverable, see them all at once, dig into income and licensing, or ask the data a question.'],
    ['Filter for your context', 'The filters on the left narrow the data by creator type, niche, follower size, stage and years creating.'],
    ['Find the benchmark', 'On each chart, the purple bar is the median. That is the typical rate at a glance.'],
    ['See the full picture', 'Open the Raw data tab for every response in full, then click any creator to see their complete, anonymous breakdown.'],
  ];
  return (
    <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '20px 24px', marginBottom: '24px', position: 'relative' }}>
      <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: C.inkSoft }}><X size={18} /></button>
      <h3 style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: '18px', color: C.darkGreen, margin: '0 0 4px 0' }}>New here? How to read the data</h3>
      <p style={{ fontSize: '13px', color: C.inkSoft, margin: '0 0 16px 0' }}>A 20-second tour so you can find what you need.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '18px' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%', backgroundColor: C.darkGreen, color: C.offWhite, fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: C.ink, marginBottom: '2px' }}>{step[0]}</div>
              <div style={{ fontSize: '12px', color: C.inkSoft, lineHeight: '1.5' }}>{step[1]}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', paddingTop: '16px', borderTop: `1px solid ${C.borderSoft}` }}>
        <span style={{ fontSize: '13px', color: C.ink }}>Haven't added your rates yet?</span>
        <a href={FORM_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: C.darkGreen, color: C.offWhite, borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Complete the survey</a>
      </div>
    </div>
  );
}

// === ACTIVE FILTER CHIPS ===
function ActiveFilters({ filters, onRemove, onClear }) {
  const chips = [];
  Object.entries(filters).forEach(([cat, vals]) => (vals || []).forEach(v => chips.push([cat, v])));
  if (!chips.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '20px' }}>
      <span style={{ fontSize: '12px', color: C.inkSoft, marginRight: '2px' }}>Filtering:</span>
      {chips.map(([cat, v]) => (
        <button key={cat + v} onClick={() => onRemove(cat, v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', fontSize: '12px', backgroundColor: C.lightGreen, border: `1px solid ${C.lightGreen}`, borderRadius: '14px', color: C.ink, cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}>{v}<X size={11} /></button>
      ))}
      <button onClick={onClear} style={{ background: 'none', border: 'none', color: C.darkGreen, fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Lato', sans-serif" }}>Clear all</button>
    </div>
  );
}

// === MAIN COMPONENT ===
export default function CreatorRatesTool() {
  const [mode, setMode] = useState('explore');
  const [filters, setFilters] = useState({ creatorTypes: [], niches: [], followers: [], work: [], years: [], primaryPlatforms: [], engagement: [], training: [] });
  const [exploreDeliverable, setExploreDeliverable] = useState('shortform');
  const [question, setQuestion] = useState('');
  const [questionResult, setQuestionResult] = useState(null);
  const [openCreator, setOpenCreator] = useState(null);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') return window.localStorage.getItem('crt_intro_dismissed') !== '1';
    return true;
  });
  const dismissIntro = () => {
    setShowIntro(false);
    if (typeof window !== 'undefined') window.localStorage.setItem('crt_intro_dismissed', '1');
  };
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const [responses, setResponses] = useState([]);
  const [dataState, setDataState] = useState('loading');
  const [lastUpdated, setLastUpdated] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch(CSV_URL)
      .then(r => r.text())
      .then(text => {
        if (cancelled) return;
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        const rows = (parsed.data || []).filter(row => Object.values(row).some(v => v && String(v).trim()));
        setResponses(rows.map((row, idx) => mapRowToResponse(row, idx)));
        // Google Forms exports the timestamp in NZ day/month/year order (e.g. "1/07/2026 14:30:25").
        // new Date() would read that as US month/day and flip 1 July into 7 Jan, so parse it explicitly.
        const parseFormDate = (s) => {
          if (!s) return null;
          const m = String(s).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
          if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
          const d = new Date(s);
          return isNaN(d.getTime()) ? null : d;
        };
        const tsKey = Object.keys(rows[0] || {}).find(h => h.toLowerCase().includes('timestamp'));
        let latest = null;
        if (tsKey) rows.forEach(row => { const d = parseFormDate(row[tsKey]); if (d && (!latest || d > latest)) latest = d; });
        setLastUpdated(latest ? latest.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' }) : null);
        setDataState('ready');
      })
      .catch(() => { if (!cancelled) setDataState('error'); });
    return () => { cancelled = true; };
  }, []);

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => setFilters({ creatorTypes: [], niches: [], followers: [], work: [], years: [], primaryPlatforms: [], engagement: [], training: [] });

  const filteredResponses = useMemo(() => responses.filter(r => {
    if (filters.creatorTypes.length && !filters.creatorTypes.includes(r.creatorType)) return false;
    if (filters.niches.length && !filters.niches.includes(r.niche)) return false;
    if (filters.followers.length && !filters.followers.includes(r.followers)) return false;
    if (filters.work.length && !filters.work.includes(r.work)) return false;
    if (filters.years.length && !filters.years.includes(r.years)) return false;
    if (filters.primaryPlatforms.length && !filters.primaryPlatforms.includes(r.primaryPlatform)) return false;
    if (filters.engagement.length && !filters.engagement.includes(r.engagementRate)) return false;
    if (filters.training.length && !filters.training.some(t => (r.training || []).includes(t))) return false;
    return true;
  }), [filters, responses]);

  const hasFilters = Boolean(filters.creatorTypes.length || filters.niches.length || filters.followers.length || filters.work.length || filters.years.length || filters.primaryPlatforms.length || filters.engagement.length || filters.training.length);
  const activeFilterCount = Object.values(filters).reduce((n, arr) => n + arr.length, 0);

  // Counts that reflect the actual responses, not the static survey option lists.
  const nicheCount = useMemo(
    () => new Set(responses.map(r => r.niche).filter(v => v && v !== 'N/A')).size,
    [responses]
  );
  const revenueStreamCount = useMemo(
    () => REVENUE_STREAMS.filter(s => s.key !== 'total'
      && responses.some(r => { const v = r.revenue && r.revenue[s.key]; return v && v !== 'N/A' && v !== '$0'; })
    ).length,
    [responses]
  );

  const exploreData = useMemo(() => {
    const values = filteredResponses.map(r => r.rates[exploreDeliverable]);
    return { distribution: getDistribution(values, RATE_BRACKETS), validCount: getValidCount(values) };
  }, [filteredResponses, exploreDeliverable]);

  const handleQuestion = () => {
    if (!question.trim()) { setQuestionResult(null); return; }
    const parsed = parseQuestion(question);
    const result = runQuery(parsed, responses);
    setQuestionResult(result);
  };

  const styles = {
    container: { fontFamily: "'Lato', -apple-system, sans-serif", maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', color: C.ink, backgroundColor: C.offWhite, minHeight: '100vh' },
    header: { borderBottom: `1px solid ${C.border}`, paddingBottom: '24px', marginBottom: '32px' },
    title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '40px', fontWeight: '500', letterSpacing: '-0.5px', margin: '0 0 8px 0', color: C.purple },
    subtitle: { fontSize: '15px', color: C.inkSoft, lineHeight: '1.5', margin: 0, maxWidth: '720px' },
    statsBar: { display: 'flex', gap: '24px', marginTop: '20px', flexWrap: 'wrap' },
    stat: { fontSize: '13px', color: C.inkSoft, display: 'flex', alignItems: 'center', gap: '6px' },
    statNumber: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: '500', color: C.darkGreen },
    tabs: { display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap' },
    tab: { padding: '12px 18px', background: 'none', border: 'none', borderBottom: '2px solid transparent', fontFamily: "'Lato', sans-serif", fontSize: '14px', fontWeight: '600', color: C.inkSoft, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' },
    tabActive: { color: C.darkGreen, borderBottomColor: C.darkGreen },
    layout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' },
    sidebar: { backgroundColor: C.white, borderRadius: '8px', padding: '24px', border: `1px solid ${C.border}`, height: 'fit-content', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', position: 'sticky', top: '24px' },
    sidebarTitle: { fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: '16px', margin: '0 0 16px 0', color: C.ink },
    main: { backgroundColor: C.white, borderRadius: '8px', padding: '32px', border: `1px solid ${C.border}`, minWidth: 0 },
    sectionTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: '500', margin: '0 0 8px 0', color: C.ink },
    sectionSubtitle: { fontSize: '14px', color: C.inkSoft, marginBottom: '24px', lineHeight: '1.55' },
    matchBox: { backgroundColor: `${C.lightGreen}40`, borderLeft: `3px solid ${C.darkGreen}`, padding: '14px 18px', borderRadius: '4px', fontSize: '13px', color: C.ink, marginBottom: '24px' },
    smallSample: { backgroundColor: `${C.darkGreen}12`, borderLeft: `3px solid ${C.darkGreen}`, padding: '14px 18px', borderRadius: '4px', fontSize: '13px', color: C.ink, marginBottom: '24px', fontStyle: 'italic' },
    select: { width: '100%', padding: '12px 14px', fontSize: '15px', fontFamily: "'Lato', sans-serif", color: C.ink, backgroundColor: C.offWhite, border: `1px solid ${C.border}`, borderRadius: '6px', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232a3d1e' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '12px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', color: C.inkSoft, marginBottom: '8px' },
    chartBlock: { marginBottom: '32px', paddingBottom: '24px', borderBottom: `1px solid ${C.borderSoft}` },
    chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' },
    chartTitle: { fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: '16px', color: C.ink, margin: 0 },
    chartMeta: { fontSize: '12px', color: C.inkSoft, fontStyle: 'italic' },
    clearBtn: { background: 'none', border: 'none', color: C.darkGreen, fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', padding: 0, marginTop: '4px', fontFamily: "'Lato', sans-serif" },
    questionBox: { width: '100%', padding: '16px', fontSize: '16px', fontFamily: "'Lato', sans-serif", color: C.ink, backgroundColor: C.offWhite, border: `1px solid ${C.border}`, borderRadius: '6px', resize: 'vertical', minHeight: '70px', marginBottom: '14px', boxSizing: 'border-box' },
    primaryBtn: { padding: '12px 24px', backgroundColor: C.darkGreen, color: C.offWhite, border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Lato', sans-serif", letterSpacing: '0.3px' },
    exampleChip: { display: 'inline-block', padding: '6px 12px', margin: '0 6px 6px 0', fontSize: '13px', backgroundColor: C.offWhite, border: `1px solid ${C.border}`, borderRadius: '4px', color: C.ink, cursor: 'pointer', fontFamily: "'Lato', sans-serif" },
    disclaimer: { marginTop: '32px', padding: '20px', backgroundColor: `${C.darkGreen}0d`, borderRadius: '6px', fontSize: '13px', color: C.inkSoft, lineHeight: '1.6' },
    disclaimerTitle: { fontWeight: '700', color: C.ink, marginBottom: '6px' },
  };

  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Lato:wght@400;600;700&display=swap'); html, body { margin: 0; padding: 0; background: ${C.offWhite}; }`;

  // === MAIN CONTENT ===
  let mainContent;

  if (mode === 'explore') {
    mainContent = (
      <div>
        <h2 style={styles.sectionTitle}>Explore rate distributions</h2>
        <p style={styles.sectionSubtitle}>Pick a deliverable to see the full spread of what NZ creators charge. Filters on the left narrow the data by creator type, audience size, niche, and stage. Every bar shows exactly how many creators sit in that bracket.</p>

        <div style={{ marginBottom: '24px' }}>
          <label style={styles.label}>Deliverable</label>
          <select value={exploreDeliverable} onChange={e => setExploreDeliverable(e.target.value)} style={styles.select}>
            {DELIVERABLES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
        </div>

        <div style={styles.matchBox}>
          <strong>{filteredResponses.length}</strong> {filteredResponses.length === 1 ? 'creator matches' : 'creators match'} your filters · <strong>{exploreData.validCount}</strong> of them offer this deliverable
        </div>

        {exploreData.validCount >= MIN_SAMPLE && <BenchmarkHeadline distribution={exploreData.distribution} />}

        <DistributionChart distribution={exploreData.distribution} accentColor={C.darkGreen} />
      </div>
    );
  }

  if (mode === 'all') {
    mainContent = (
      <div>
        <h2 style={styles.sectionTitle}>All deliverables at a glance</h2>
        <p style={styles.sectionSubtitle}>Every deliverable, every rate distribution, on one page. Filters on the left narrow the data.</p>

        <div style={styles.matchBox}>
          <strong>{filteredResponses.length}</strong> {filteredResponses.length === 1 ? 'creator matches' : 'creators match'} your filters out of {responses.length} total responses
        </div>

        {DELIVERABLES.map(d => {
          const values = filteredResponses.map(r => r.rates[d.key]);
          const dist = getDistribution(values, RATE_BRACKETS);
          const validCount = getValidCount(values);
          return (
            <div key={d.key} style={styles.chartBlock}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>{d.label}</h3>
                <span style={styles.chartMeta}>{validCount >= MIN_SAMPLE ? `${validCount} creators` : 'Not enough data'}</span>
              </div>
              <DistributionChart distribution={dist} accentColor={C.darkGreen} />
            </div>
          );
        })}
      </div>
    );
  }

  if (mode === 'revenue') {
    mainContent = (
      <div>
        <h2 style={styles.sectionTitle}>Annual revenue</h2>
        <p style={styles.sectionSubtitle}>The full income picture beyond brand deals: where creators actually earn their money across every stream, plus how they set up the business behind it. Filters apply across this whole tab.</p>

        <div style={styles.matchBox}>
          <strong>{filteredResponses.length}</strong> {filteredResponses.length === 1 ? 'creator matches' : 'creators match'} your filters
        </div>

        <h3 style={{ ...styles.chartTitle, marginTop: '16px', marginBottom: '20px', fontSize: '20px', color: C.darkGreen }}>Annual revenue by stream</h3>
        {REVENUE_STREAMS.map(s => {
          const values = filteredResponses.map(r => r.revenue[s.key]);
          const dist = getDistribution(values, s.key === 'total' ? TOTAL_BRACKETS : REVENUE_BRACKETS);
          const validCount = values.filter(v => v && v !== 'N/A').length;
          const isTotal = s.key === 'total';
          return (
            <div key={s.key} style={{ ...styles.chartBlock, ...(isTotal ? { backgroundColor: `${C.lightGreen}25`, padding: '20px', borderRadius: '6px', borderBottom: 'none', marginTop: '16px' } : {}) }}>
              <div style={styles.chartHeader}>
                <h3 style={{ ...styles.chartTitle, ...(isTotal ? { color: C.darkGreen } : {}) }}>{isTotal && '★ '}{s.label}</h3>
                <span style={styles.chartMeta}>{validCount >= MIN_SAMPLE ? `${validCount} creators` : 'Not enough data'}</span>
              </div>
              <DistributionChart distribution={dist} accentColor={isTotal ? C.darkGreen : C.lightGreen} />
            </div>
          );
        })}

        <h3 style={{ ...styles.chartTitle, marginTop: '40px', marginBottom: '16px', fontSize: '20px', color: C.darkGreen }}>Business setup breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {[
            { key: 'structure', label: 'Business structure' },
            { key: 'gstRegistered', label: 'GST registered (NZ)' },
            { key: 'contracts', label: 'Use a contract for brand deals' },
            { key: 'agent', label: 'Has an agent / management' },
          ].map(item => {
            const counts = {};
            filteredResponses.forEach(r => { const v = r.business[item.key]; if (v) counts[v] = (counts[v] || 0) + 1; });
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            const total = sorted.reduce((sum, [, c]) => sum + c, 0);
            return (
              <div key={item.key} style={{ padding: '16px', backgroundColor: C.offWhite, borderRadius: '6px', border: `1px solid ${C.borderSoft}` }}>
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: C.inkSoft, marginBottom: '10px' }}>{item.label}</div>
                {sorted.length === 0 ? (
                  <div style={{ fontSize: '13px', color: C.inkSoft, fontStyle: 'italic' }}>No data</div>
                ) : (
                  sorted.map(([v, count]) => (
                    <div key={v} style={{ fontSize: '13px', color: C.ink, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{v}</span>
                      <span style={{ color: C.inkSoft }}>{count} ({Math.round((count / total) * 100)}%)</span>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === 'licensing') {
    const renderLic = (arr) => arr.map(l => {
      const values = filteredResponses.map(r => (r.licensing || {})[l.key]);
      const dist = getDistribution(values, LICENSING_BRACKETS);
      const validCount = values.filter(v => v && v !== 'N/A').length;
      return (
        <div key={l.key} style={styles.chartBlock}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>{l.label}</h3>
            <span style={styles.chartMeta}>{validCount >= MIN_SAMPLE ? `${validCount} creators` : 'Not enough data'}</span>
          </div>
          <DistributionChart distribution={dist} accentColor={C.darkGreen} />
        </div>
      );
    });
    mainContent = (
      <div>
        <h2 style={styles.sectionTitle}>Licensing & usage rights</h2>
        <p style={styles.sectionSubtitle}>Licensing is what creators charge on top of their base rate when a brand uses the content beyond the original organic post. Every figure below is the percentage uplift on the base rate. Filters apply across this whole tab.</p>

        <div style={styles.matchBox}>
          <strong>{filteredResponses.length}</strong> {filteredResponses.length === 1 ? 'creator matches' : 'creators match'} your filters
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '8px' }}>
          {[
            { key: 'chargesLicensing', label: 'Do creators charge for licensing?' },
            { key: 'baseRateIncludes', label: 'What the base rate typically includes' },
          ].map(item => {
            const counts = {};
            filteredResponses.forEach(r => { const v = r[item.key]; if (v) counts[v] = (counts[v] || 0) + 1; });
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            const total = sorted.reduce((sum, [, c]) => sum + c, 0);
            return (
              <div key={item.key} style={{ padding: '16px', backgroundColor: C.offWhite, borderRadius: '6px', border: `1px solid ${C.borderSoft}` }}>
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: C.inkSoft, marginBottom: '10px' }}>{item.label}</div>
                {sorted.length === 0 ? (<div style={{ fontSize: '13px', color: C.inkSoft, fontStyle: 'italic' }}>No data</div>) : (
                  sorted.map(([v, count]) => (
                    <div key={v} style={{ fontSize: '13px', color: C.ink, marginBottom: '4px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <span>{v}</span>
                      <span style={{ color: C.inkSoft, whiteSpace: 'nowrap' }}>{count} ({Math.round((count / total) * 100)}%)</span>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>

        <h3 style={{ ...styles.chartTitle, marginTop: '32px', marginBottom: '16px', fontSize: '20px', color: C.darkGreen }}>Uplift by licence duration</h3>
        {renderLic(LICENSING_DURATION)}

        <h3 style={{ ...styles.chartTitle, marginTop: '32px', marginBottom: '16px', fontSize: '20px', color: C.darkGreen }}>Uplift by usage type</h3>
        {renderLic(LICENSING_USAGE)}

        <h3 style={{ ...styles.chartTitle, marginTop: '32px', marginBottom: '16px', fontSize: '20px', color: C.darkGreen }}>Uplift by territory</h3>
        {renderLic(LICENSING_TERRITORY)}

        <h3 style={{ ...styles.chartTitle, marginTop: '32px', marginBottom: '16px', fontSize: '20px', color: C.darkGreen }}>Category exclusivity</h3>
        {renderLic([{ key: 'exclusivity', label: 'Category exclusivity uplift' }])}
      </div>
    );
  }

  if (mode === 'question') {
    mainContent = (
      <div>
        <h2 style={styles.sectionTitle}>Ask the data a question</h2>
        <p style={styles.sectionSubtitle}>Type a natural question. The tool understands two types: <strong>what do creators with X charge for Y</strong> (filter by demographics, see rate spread) and <strong>creators earning/charging X, what do they look like</strong> (filter by income or rate, see demographic spread).</p>

        <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g. How many years experience do creators earning $100K+ have?" style={styles.questionBox} />
        <button style={styles.primaryBtn} onClick={handleQuestion}>Find the answer</button>

        {questionResult && questionResult.type === 'unclear' && (
          <div style={{ ...styles.matchBox, marginTop: 20 }}>
            I couldn't figure out what to look up. Try mentioning a deliverable (Reel, podcast, UGC), an income level ($100K+, $50K), or what you want to see (years of experience, follower size, niche).
          </div>
        )}

        {questionResult && questionResult.type === 'standard' && (
          <div style={{ marginTop: 28 }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.purple, marginBottom: '6px' }}>
                {DELIVERABLES.find(d => d.key === questionResult.deliverable)?.label}
                {describeFilters(questionResult.filters) && ` · ${describeFilters(questionResult.filters)}`}
              </div>
              <div style={{ fontSize: '13px', color: C.inkSoft }}>
                {questionResult.validCount > 0 ? `Rate distribution based on ${questionResult.validCount} matching ${questionResult.validCount === 1 ? 'creator' : 'creators'}` : 'No creators match this combination yet'}
              </div>
            </div>
            {questionResult.validCount > 0 && questionResult.validCount < 5 && (
              <div style={styles.smallSample}>Small sample size. These results are indicative only.</div>
            )}
            <DistributionChart distribution={questionResult.distribution} accentColor={C.darkGreen} />
            <RawDataTable responses={questionResult.pool} onOpen={setOpenCreator} />
          </div>
        )}

        {questionResult && questionResult.type === 'reverse' && (
          <div style={{ marginTop: 28 }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.purple, marginBottom: '6px' }}>
                {ASK_ABOUT_LABELS[questionResult.askAbout]} of creators {describeFilters(questionResult.filters)}
              </div>
              <div style={{ fontSize: '13px', color: C.inkSoft }}>
                {questionResult.validCount > 0 ? `Based on ${questionResult.validCount} matching ${questionResult.validCount === 1 ? 'creator' : 'creators'}` : 'No creators match this combination yet'}
              </div>
            </div>
            {questionResult.validCount > 0 && questionResult.validCount < 5 && (
              <div style={styles.smallSample}>Small sample size. These results are indicative only.</div>
            )}
            <DistributionChart distribution={questionResult.distribution} accentColor={C.purple} />
            <RawDataTable responses={questionResult.pool} onOpen={setOpenCreator} />
          </div>
        )}

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${C.borderSoft}` }}>
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: C.inkSoft, marginBottom: '12px' }}>Try one of these</div>
          {[
            "What do NZ creators with 50K followers charge for a Reel?",
            "How many years experience do creators earning $100K+ have?",
            "What follower size do creators earning $50K+ have?",
            "What niches do creators earning $100K+ work in?",
            "Are creators earning $100K+ full-time or part-time?",
            "Podcast sponsorship rates for travel creators",
            "Ambassadorship for outdoor creators",
          ].map(ex => (
            <span key={ex} style={styles.exampleChip} onClick={() => { setQuestion(ex); setQuestionResult(null); }}>{ex}</span>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'rawdata') {
    mainContent = (
      <div>
        <h2 style={styles.sectionTitle}>Raw data</h2>
        <p style={styles.sectionSubtitle}>Every response in the dataset, in full. Sort any column to explore, and click a row for the complete anonymous breakdown. This view always shows all responses and is deliberately not filterable, so individual contributors cannot be singled out.</p>
        {responses.length < MIN_SAMPLE ? (
          <div style={{ backgroundColor: `${C.purple}10`, borderLeft: `3px solid ${C.purple}`, padding: '20px 22px', borderRadius: '6px', color: C.ink }}>
            <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px' }}>Not enough data to show yet</div>
            <div style={{ fontSize: '14px', lineHeight: '1.55' }}>We only publish the dataset once at least {MIN_SAMPLE} creators have responded.</div>
          </div>
        ) : (
          <RawDataTable responses={responses} onOpen={setOpenCreator} defaultExpanded />
        )}
      </div>
    );
  }

  const FILTER_TABS = ['explore', 'all', 'revenue', 'licensing'];
  if (filteredResponses.length < 5 && FILTER_TABS.includes(mode)) {
    mainContent = (
      <div>
        <div style={{ backgroundColor: `${C.purple}10`, borderLeft: `3px solid ${C.purple}`, padding: '20px 22px', borderRadius: '6px', color: C.ink }}>
          <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px' }}>Not enough data to show yet</div>
          <div style={{ fontSize: '14px', lineHeight: '1.55' }}>Fewer than 5 creators match these filters. To protect everyone's anonymity, we only show results when at least 5 creators fit. Try removing a filter or two.</div>
          {hasFilters && <button onClick={clearFilters} style={{ marginTop: '14px', padding: '10px 18px', backgroundColor: C.darkGreen, color: C.offWhite, border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}>Clear all filters</button>}
        </div>
      </div>
    );
  }

  if (dataState === 'loading') {
    mainContent = (<div style={{ padding: '48px 20px', textAlign: 'center', color: C.inkSoft, fontSize: '14px' }}>Loading the latest data\u2026</div>);
  } else if (dataState === 'error') {
    mainContent = (
      <div style={{ backgroundColor: `${C.purple}10`, borderLeft: `3px solid ${C.purple}`, padding: '20px 22px', borderRadius: '6px', color: C.ink }}>
        <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px' }}>Couldn't load the data</div>
        <div style={{ fontSize: '14px', lineHeight: '1.55' }}>Please refresh in a moment. If it keeps happening, the responses sheet may have been unpublished.</div>
      </div>
    );
  } else if (dataState === 'ready' && responses.length === 0) {
    mainContent = (<div style={{ padding: '48px 20px', textAlign: 'center', color: C.inkSoft, fontSize: '14px' }}>No responses yet. Be the first to add yours.</div>);
  }

  return (
    <div style={{ ...styles.container, padding: isMobile ? '16px 14px' : '32px 24px' }}>
      <style>{fontImport}</style>

      <header style={styles.header}>
        <h1 style={{ ...styles.title, fontSize: isMobile ? '28px' : '40px' }}>New Zealand Creator Rates Benchmark</h1>
        <p style={styles.subtitle}>A free, anonymous, community-built picture of what creators across Aotearoa New Zealand actually charge, across every niche and every kind of creative work, from UGC to photography to podcasting. All rates in NZD. Explore the data, find your benchmark, and add your own.</p>
        <div style={styles.statsBar}>
          <span style={styles.stat}><span style={styles.statNumber}>{responses.length}</span> responses</span>
          <span style={styles.stat}><span style={styles.statNumber}>{nicheCount}</span> niches</span>
          <span style={styles.stat}><span style={styles.statNumber}>{DELIVERABLES.length}</span> deliverables tracked</span>
          <span style={styles.stat}><span style={styles.statNumber}>{revenueStreamCount}</span> revenue streams</span>
        </div>
        <div style={{ fontSize: '12px', color: C.inkSoft, marginTop: '10px' }}>{dataState === 'loading' ? 'Loading the latest responses\u2026' : dataState === 'error' ? 'Live data unavailable right now.' : `Live data, updated as responses come in${lastUpdated ? ' \u00b7 latest response ' + lastUpdated : ''}.`}</div>
        <a href={FORM_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '12px 22px', backgroundColor: C.darkGreen, color: C.offWhite, borderRadius: '6px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.3px' }}>+ Add your rates</a>
      </header>

      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(mode === 'explore' ? styles.tabActive : {}) }} onClick={() => setMode('explore')}><Search size={16} /> Explore by deliverable</button>
        <button style={{ ...styles.tab, ...(mode === 'all' ? styles.tabActive : {}) }} onClick={() => setMode('all')}><SlidersHorizontal size={16} /> All deliverables</button>
        <button style={{ ...styles.tab, ...(mode === 'licensing' ? styles.tabActive : {}) }} onClick={() => setMode('licensing')}><FileText size={16} /> Licensing</button>
        <button style={{ ...styles.tab, ...(mode === 'revenue' ? styles.tabActive : {}) }} onClick={() => setMode('revenue')}><DollarSign size={16} /> Annual revenue</button>
        <button style={{ ...styles.tab, ...(mode === 'rawdata' ? styles.tabActive : {}) }} onClick={() => setMode('rawdata')}><List size={16} /> Raw data</button>
      </div>

      {showIntro
        ? <IntroPanel onClose={dismissIntro} />
        : <button onClick={() => setShowIntro(true)} style={{ background: 'none', border: 'none', color: C.darkGreen, fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', padding: '0 0 16px 0', fontFamily: "'Lato', sans-serif" }}>How to read this data</button>}

      {isMobile && FILTER_TABS.includes(mode) && (
        <button onClick={() => setFiltersOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', marginBottom: '16px', backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '14px', fontWeight: 700, color: C.ink, fontFamily: "'Lato', sans-serif", cursor: 'pointer' }}>
          <SlidersHorizontal size={16} /> {filtersOpen ? 'Hide filters' : 'Filters'}{activeFilterCount ? ` (${activeFilterCount})` : ''}
        </button>
      )}

      <div style={isMobile ? { display: 'block' } : (FILTER_TABS.includes(mode) ? styles.layout : { display: 'block' })}>
        {FILTER_TABS.includes(mode) && (!isMobile || filtersOpen) && (
          <aside style={isMobile ? { backgroundColor: C.white, borderRadius: '8px', padding: '20px', border: `1px solid ${C.border}`, marginBottom: '16px' } : styles.sidebar}>
            <h3 style={styles.sidebarTitle}>Filter the data</h3>
            <FilterChips label="Creator type" options={CREATOR_TYPES} selected={filters.creatorTypes} onToggle={v => toggleFilter('creatorTypes', v)} icon={<Camera size={12} />} />
            <FilterChips label="Follower size" options={FOLLOWERS} selected={filters.followers} onToggle={v => toggleFilter('followers', v)} icon={<Users size={12} />} />
            <FilterChips label="Engagement rate" options={ENGAGEMENT_LEVELS} selected={filters.engagement} onToggle={v => toggleFilter('engagement', v)} />
            <FilterChips label="Years creating" options={YEARS} selected={filters.years} onToggle={v => toggleFilter('years', v)} />
            <FilterChips label="Primary niche" options={NICHES} selected={filters.niches} onToggle={v => toggleFilter('niches', v)} />
            <FilterChips label="Primary platform" options={PLATFORMS} selected={filters.primaryPlatforms} onToggle={v => toggleFilter('primaryPlatforms', v)} />
            <FilterChips label="Creator stage" options={WORK} selected={filters.work} onToggle={v => toggleFilter('work', v)} icon={<Briefcase size={12} />} />
            {hasFilters && <button style={styles.clearBtn} onClick={clearFilters}>Clear all filters</button>}
          </aside>
        )}

        <main style={{ ...styles.main, padding: isMobile ? '18px' : '32px' }}>
          {FILTER_TABS.includes(mode) && <ActiveFilters filters={filters} onRemove={toggleFilter} onClear={clearFilters} />}
          {mainContent}
        </main>
      </div>

      <div style={styles.disclaimer}>
        <div style={styles.disclaimerTitle}>About this data</div>
        This is a community-built benchmark for creators in Aotearoa New Zealand, and it is general information rather than financial advice. Rates are self-reported and reflect what creators have actually been paid, all in New Zealand dollars (NZD). Sample sizes show on every result. Click any creator row in the raw data table to see their full anonymous breakdown. Published under CC BY 4.0, facilitated by Feijoa Social, and independent of our courses and client work.
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: C.inkSoft, lineHeight: '1.6' }}>
        Built by <a href="https://www.feijoasocial.com" target="_blank" rel="noopener noreferrer" style={{ color: C.darkGreen, fontWeight: 600 }}>Feijoa Social</a>. Published under a Creative Commons BY 4.0 licence, free to share and build on with credit. Questions or feedback? Email <a href="mailto:abigail@feijoasocial.com" style={{ color: C.darkGreen, fontWeight: 600 }}>abigail@feijoasocial.com</a>.
      </div>

      <CreatorModal creator={openCreator} onClose={() => setOpenCreator(null)} />
    </div>
  );
}
