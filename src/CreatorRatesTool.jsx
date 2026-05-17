import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, TrendingUp, DollarSign, MapPin, Users, Briefcase, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

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

// === RATE BRACKETS ===
const RATE_BRACKETS = [
  'Free / product only', 'Under $100', '$100-$250', '$250-$500', '$500-$1,000',
  '$1,000-$2,500', '$2,500-$5,000', '$5,000-$10,000', '$10,000+'
];

const REVENUE_BRACKETS = [
  '$0', 'Under $1K', '$1K-$5K', '$5K-$10K', '$10K-$25K',
  '$25K-$50K', '$50K-$100K', '$100K+'
];

const LICENSING_BRACKETS = [
  '0% (included)', '10-25%', '25-50%', '50-100%', '100-200%', '200%+'
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
  { key: 'ownProducts', label: 'Own products (courses, ebooks, merch)' },
  { key: 'services', label: 'Services (coaching, consulting, SMM)' },
  { key: 'speaking', label: 'Speaking & appearances' },
  { key: 'podcast', label: 'Podcast sponsorships' },
  { key: 'memberships', label: 'Substack / Patreon / memberships' },
  { key: 'total', label: 'Total annual income from content' },
];

const LICENSING_TYPES = [
  { key: 'duration6mo', label: '6 month licence uplift' },
  { key: 'duration12mo', label: '12 month licence uplift' },
  { key: 'paidSocial', label: 'Paid social / whitelisting uplift' },
  { key: 'web', label: 'Brand website uplift' },
  { key: 'ooh', label: 'Out of home (billboards) uplift' },
  { key: 'exclusivity', label: 'Category exclusivity uplift' },
];

const FOLLOWERS = ['1K-5K', '5K-10K', '10K-25K', '25K-50K', '50K-100K', '100K-500K', '500K+'];
const COUNTRIES = ['New Zealand', 'Australia', 'United Kingdom', 'United States'];
const NICHES = ['Travel', 'Outdoor', 'Lifestyle', 'Food', 'Fashion', 'Beauty', 'Fitness', 'Parenting', 'Business'];
const WORK = ['Full-time creator', 'Part-time', 'Side hustle', 'Hobby with occasional paid opportunities'];
const YEARS = ['Under 1', '1-2', '3-5', '6-10', '10+'];

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

// Parse rate or revenue bracket to numeric range for comparison
function bracketToRange(bracket) {
  if (!bracket || bracket === 'N/A') return null;
  if (bracket === 'Free / product only' || bracket === '$0') return [0, 0];
  if (bracket === 'Under $100') return [0, 100];
  if (bracket === 'Under $1K') return [0, 1000];
  const m = bracket.match(/\$?([\d,]+)K?\s*[-\u2013]\s*\$?([\d,]+)K?/);
  if (m) {
    const isK = bracket.includes('K');
    return [parseInt(m[1].replace(/,/g, '')) * (isK ? 1000 : 1), parseInt(m[2].replace(/,/g, '')) * (isK ? 1000 : 1)];
  }
  const plus = bracket.match(/\$?([\d,]+)K?\+/);
  if (plus) {
    const isK = bracket.includes('K');
    return [parseInt(plus[1].replace(/,/g, '')) * (isK ? 1000 : 1), Infinity];
  }
  return null;
}

// === COMPONENTS ===
function DistributionChart({ distribution, accentColor = C.darkGreen }) {
  const maxCount = Math.max(...distribution.map(d => d.count), 1);
  const totalCount = distribution.reduce((sum, d) => sum + d.count, 0);

  if (totalCount === 0) {
    return <div style={{ padding: '24px', textAlign: 'center', color: C.inkSoft, fontSize: '14px', fontStyle: 'italic' }}>No data yet for this filter combination</div>;
  }

  return (
    <div style={{ marginTop: '8px' }}>
      {distribution.map(d => {
        const widthPct = (d.count / maxCount) * 100;
        const sharePct = totalCount > 0 ? Math.round((d.count / totalCount) * 100) : 0;
        return (
          <div key={d.bracket} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 80px', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <div style={{ fontSize: '13px', color: C.ink }}>{d.bracket}</div>
            <div style={{ height: '24px', backgroundColor: C.borderSoft, borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
              {d.count > 0 && (
                <div style={{ height: '100%', width: `${widthPct}%`, backgroundColor: accentColor, borderRadius: '3px', transition: 'width 0.3s', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                  {widthPct > 20 && <span style={{ color: C.offWhite, fontSize: '12px', fontWeight: 600 }}>{d.count}</span>}
                </div>
              )}
              {d.count > 0 && widthPct <= 20 && (
                <span style={{ position: 'absolute', left: `calc(${widthPct}% + 8px)`, top: '50%', transform: 'translateY(-50%)', color: C.ink, fontSize: '12px', fontWeight: 600 }}>{d.count}</span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: C.inkSoft, textAlign: 'right' }}>{d.count > 0 ? `${sharePct}%` : ''}</div>
          </div>
        );
      })}
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
              backgroundColor: active ? C.darkGreen : 'transparent',
              border: `1px solid ${active ? C.darkGreen : C.border}`,
              borderRadius: '20px', color: active ? C.offWhite : C.ink, cursor: 'pointer', transition: 'all 0.15s',
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
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: '24px', color: C.purple, margin: '0 0 6px 0',
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
      textTransform: 'uppercase', color: C.purple, marginBottom: '12px',
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
    ['Country', creator.country],
    ['Age', creator.age],
    ['Gender', creator.gender],
    ['Years creating', creator.years],
    ['Stage', creator.work],
    ['Follower size', creator.followers],
    ['Niche', creator.niche],
    ['Currency', creator.currency],
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
            {LICENSING_TYPES.map(l => (
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
          </div>
        </div>
      </div>
    </div>
  );
}

// === RAW DATA TABLE ===
function RawDataTable({ responses, onOpen }) {
  const [expanded, setExpanded] = useState(false);

  const styles = {
    wrap: {
      marginTop: '32px', paddingTop: '24px',
      borderTop: `1px solid ${C.borderSoft}`,
    },
    toggleBtn: {
      display: 'flex', alignItems: 'center', gap: '8px',
      background: 'none', border: `1px solid ${C.border}`,
      borderRadius: '6px', padding: '10px 16px', cursor: 'pointer',
      fontSize: '13px', fontFamily: "'Lato', sans-serif",
      color: C.ink, fontWeight: 600,
    },
    helper: { fontSize: '12px', color: C.inkSoft, marginLeft: '12px' },
    tableWrap: { marginTop: '16px', overflowX: 'auto', borderRadius: '6px', border: `1px solid ${C.borderSoft}` },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: '1200px' },
    th: {
      textAlign: 'left', padding: '10px 8px',
      backgroundColor: `${C.darkGreen}15`,
      fontWeight: 700, fontSize: '11px', letterSpacing: '0.3px',
      textTransform: 'uppercase', color: C.ink,
      borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap',
    },
    td: {
      padding: '8px', borderBottom: `1px solid ${C.borderSoft}`,
      color: C.ink, whiteSpace: 'nowrap',
    },
    tdMuted: { color: C.inkSoft, fontStyle: 'italic' },
    tdHighlight: { fontWeight: 700, color: C.darkGreen },
    detailBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: C.purple, fontWeight: 600, fontSize: '11px',
      display: 'flex', alignItems: 'center', gap: '4px',
    },
    row: { transition: 'background-color 0.1s' },
  };

  return (
    <div style={styles.wrap}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <button style={styles.toggleBtn} onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide raw data' : 'Show raw data'} ({responses.length} {responses.length === 1 ? 'creator' : 'creators'})
        </button>
        <span style={styles.helper}>One row per creator. Click any row to see the full breakdown.</span>
      </div>

      {expanded && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Country</th>
                <th style={styles.th}>Followers</th>
                <th style={styles.th}>Niche</th>
                <th style={styles.th}>Stage</th>
                <th style={styles.th}>Yrs</th>
                <th style={{ ...styles.th, backgroundColor: `${C.purple}15`, color: C.purple }}>Total revenue</th>
                {DELIVERABLES.map(d => <th key={d.key} style={styles.th}>{d.short}</th>)}
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {responses.map(c => (
                <tr key={c.id} style={styles.row} onMouseEnter={e => e.currentTarget.style.backgroundColor = `${C.lightGreen}20`} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={styles.td}>#{c.id}</td>
                  <td style={styles.td}>{c.country}</td>
                  <td style={styles.td}>{c.followers}</td>
                  <td style={styles.td}>{c.niche}</td>
                  <td style={styles.td}>{c.work}</td>
                  <td style={styles.td}>{c.years}</td>
                  <td style={{ ...styles.td, ...styles.tdHighlight }}>{c.revenue.total}</td>
                  {DELIVERABLES.map(d => (
                    <td key={d.key} style={{ ...styles.td, ...(c.rates[d.key] === 'N/A' ? styles.tdMuted : {}) }}>
                      {c.rates[d.key]}
                    </td>
                  ))}
                  <td style={styles.td}>
                    <button style={styles.detailBtn} onClick={() => onOpen(c)}>
                      <ExternalLink size={11} /> Details
                    </button>
                  </td>
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
  else if (lower.match(/100k|100,000|hundred k/)) followerFilter = '100K-500K';
  else if (lower.match(/50k|50,000|fifty k/)) followerFilter = '50K-100K';
  else if (lower.match(/25k|25,000|twenty-five k/)) followerFilter = '25K-50K';
  else if (lower.match(/10k|10,000|ten k/)) followerFilter = '10K-25K';
  else if (lower.match(/5k|5,000|five k/)) followerFilter = '5K-10K';
  else if (lower.match(/1k|1,000/)) followerFilter = '1K-5K';

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
  if (lower.includes('full-time') || lower.includes('full time')) workFilter = 'Full-time creator';
  else if (lower.includes('part-time') || lower.includes('part time')) workFilter = 'Part-time';
  else if (lower.includes('side hustle') || lower.includes('side income')) workFilter = 'Side hustle';
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

function runQuery(parsed) {
  let pool = RESPONSES;

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

// === MAIN COMPONENT ===
export default function CreatorRatesTool() {
  const [mode, setMode] = useState('explore');
  const [filters, setFilters] = useState({ countries: [], niches: [], followers: [], work: [], years: [] });
  const [exploreDeliverable, setExploreDeliverable] = useState('shortform');
  const [question, setQuestion] = useState('');
  const [questionResult, setQuestionResult] = useState(null);
  const [openCreator, setOpenCreator] = useState(null);

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => setFilters({ countries: [], niches: [], followers: [], work: [], years: [] });

  const filteredResponses = useMemo(() => RESPONSES.filter(r => {
    if (filters.countries.length && !filters.countries.includes(r.country)) return false;
    if (filters.niches.length && !filters.niches.includes(r.niche)) return false;
    if (filters.followers.length && !filters.followers.includes(r.followers)) return false;
    if (filters.work.length && !filters.work.includes(r.work)) return false;
    if (filters.years.length && !filters.years.includes(r.years)) return false;
    return true;
  }), [filters]);

  const hasFilters = filters.countries.length || filters.niches.length || filters.followers.length || filters.work.length || filters.years.length;

  const exploreData = useMemo(() => {
    const values = filteredResponses.map(r => r.rates[exploreDeliverable]);
    return { distribution: getDistribution(values, RATE_BRACKETS), validCount: getValidCount(values) };
  }, [filteredResponses, exploreDeliverable]);

  const handleQuestion = () => {
    if (!question.trim()) { setQuestionResult(null); return; }
    const parsed = parseQuestion(question);
    const result = runQuery(parsed);
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
    tabActive: { color: C.purple, borderBottomColor: C.purple },
    layout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' },
    sidebar: { backgroundColor: C.white, borderRadius: '8px', padding: '24px', border: `1px solid ${C.border}`, height: 'fit-content', position: 'sticky', top: '24px' },
    sidebarTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', margin: '0 0 16px 0', color: C.ink },
    main: { backgroundColor: C.white, borderRadius: '8px', padding: '32px', border: `1px solid ${C.border}` },
    sectionTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: '500', margin: '0 0 8px 0', color: C.ink },
    sectionSubtitle: { fontSize: '14px', color: C.inkSoft, marginBottom: '24px', lineHeight: '1.55' },
    matchBox: { backgroundColor: `${C.lightGreen}40`, borderLeft: `3px solid ${C.darkGreen}`, padding: '14px 18px', borderRadius: '4px', fontSize: '13px', color: C.ink, marginBottom: '24px' },
    smallSample: { backgroundColor: `${C.purple}15`, borderLeft: `3px solid ${C.purple}`, padding: '14px 18px', borderRadius: '4px', fontSize: '13px', color: C.ink, marginBottom: '24px', fontStyle: 'italic' },
    select: { width: '100%', padding: '12px 14px', fontSize: '15px', fontFamily: "'Lato', sans-serif", color: C.ink, backgroundColor: C.offWhite, border: `1px solid ${C.border}`, borderRadius: '6px', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232a3d1e' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '12px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', color: C.inkSoft, marginBottom: '8px' },
    chartBlock: { marginBottom: '32px', paddingBottom: '24px', borderBottom: `1px solid ${C.borderSoft}` },
    chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' },
    chartTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '17px', color: C.ink, margin: 0 },
    chartMeta: { fontSize: '12px', color: C.inkSoft, fontStyle: 'italic' },
    clearBtn: { background: 'none', border: 'none', color: C.purple, fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', padding: 0, marginTop: '4px', fontFamily: "'Lato', sans-serif" },
    questionBox: { width: '100%', padding: '16px', fontSize: '16px', fontFamily: "'Lato', sans-serif", color: C.ink, backgroundColor: C.offWhite, border: `1px solid ${C.border}`, borderRadius: '6px', resize: 'vertical', minHeight: '70px', marginBottom: '14px', boxSizing: 'border-box' },
    primaryBtn: { padding: '12px 24px', backgroundColor: C.darkGreen, color: C.offWhite, border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Lato', sans-serif", letterSpacing: '0.3px' },
    exampleChip: { display: 'inline-block', padding: '6px 12px', margin: '0 6px 6px 0', fontSize: '13px', backgroundColor: C.offWhite, border: `1px solid ${C.border}`, borderRadius: '4px', color: C.ink, cursor: 'pointer', fontFamily: "'Lato', sans-serif" },
    disclaimer: { marginTop: '32px', padding: '20px', backgroundColor: `${C.purple}10`, borderRadius: '6px', fontSize: '13px', color: C.inkSoft, lineHeight: '1.6' },
    disclaimerTitle: { fontWeight: '700', color: C.ink, marginBottom: '6px' },
  };

  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Lato:wght@400;600;700&display=swap');`;

  // === MAIN CONTENT ===
  let mainContent;

  if (mode === 'explore') {
    mainContent = (
      <div>
        <h2 style={styles.sectionTitle}>Explore rate distributions</h2>
        <p style={styles.sectionSubtitle}>Pick a deliverable to see the full spread of what creators charge. Filters on the left narrow the data by country, audience size, niche, and stage. Every bar shows exactly how many creators sit in that bracket.</p>

        <div style={{ marginBottom: '24px' }}>
          <label style={styles.label}>Deliverable</label>
          <select value={exploreDeliverable} onChange={e => setExploreDeliverable(e.target.value)} style={styles.select}>
            {DELIVERABLES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
        </div>

        <div style={styles.matchBox}>
          <strong>{filteredResponses.length}</strong> {filteredResponses.length === 1 ? 'creator matches' : 'creators match'} your filters · <strong>{exploreData.validCount}</strong> of them offer this deliverable
        </div>

        {exploreData.validCount > 0 && exploreData.validCount < 5 && (
          <div style={styles.smallSample}>Small sample size ({exploreData.validCount}). These results are indicative only.</div>
        )}

        <DistributionChart distribution={exploreData.distribution} accentColor={C.darkGreen} />

        <RawDataTable responses={filteredResponses} onOpen={setOpenCreator} />
      </div>
    );
  }

  if (mode === 'all') {
    mainContent = (
      <div>
        <h2 style={styles.sectionTitle}>All deliverables at a glance</h2>
        <p style={styles.sectionSubtitle}>Every deliverable, every rate distribution, on one page. Filters on the left narrow the data.</p>

        <div style={styles.matchBox}>
          <strong>{filteredResponses.length}</strong> {filteredResponses.length === 1 ? 'creator matches' : 'creators match'} your filters out of {RESPONSES.length} total responses
        </div>

        {DELIVERABLES.map(d => {
          const values = filteredResponses.map(r => r.rates[d.key]);
          const dist = getDistribution(values, RATE_BRACKETS);
          const validCount = getValidCount(values);
          return (
            <div key={d.key} style={styles.chartBlock}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>{d.label}</h3>
                <span style={styles.chartMeta}>{validCount > 0 ? `${validCount} ${validCount === 1 ? 'creator' : 'creators'}` : 'No data'}{validCount > 0 && validCount < 5 && ' · small sample'}</span>
              </div>
              <DistributionChart distribution={dist} accentColor={C.darkGreen} />
            </div>
          );
        })}

        <RawDataTable responses={filteredResponses} onOpen={setOpenCreator} />
      </div>
    );
  }

  if (mode === 'income') {
    mainContent = (
      <div>
        <h2 style={styles.sectionTitle}>Income streams & licensing</h2>
        <p style={styles.sectionSubtitle}>The full income picture beyond brand deals: where creators actually earn their money, what they charge for licensing, and how exclusivity affects pricing. Filters apply across this whole tab.</p>

        <div style={styles.matchBox}>
          <strong>{filteredResponses.length}</strong> {filteredResponses.length === 1 ? 'creator matches' : 'creators match'} your filters
        </div>

        <h3 style={{ ...styles.chartTitle, marginTop: '16px', marginBottom: '20px', fontSize: '20px', color: C.purple }}>Annual revenue by stream</h3>
        {REVENUE_STREAMS.map(s => {
          const values = filteredResponses.map(r => r.revenue[s.key]);
          const dist = getDistribution(values, REVENUE_BRACKETS);
          const validCount = values.filter(v => v && v !== 'N/A').length;
          const isTotal = s.key === 'total';
          return (
            <div key={s.key} style={{ ...styles.chartBlock, ...(isTotal ? { backgroundColor: `${C.lightGreen}25`, padding: '20px', borderRadius: '6px', borderBottom: 'none', marginTop: '16px' } : {}) }}>
              <div style={styles.chartHeader}>
                <h3 style={{ ...styles.chartTitle, ...(isTotal ? { color: C.darkGreen } : {}) }}>{isTotal && '★ '}{s.label}</h3>
                <span style={styles.chartMeta}>{validCount > 0 ? `${validCount} ${validCount === 1 ? 'creator' : 'creators'}` : 'No data'}</span>
              </div>
              <DistributionChart distribution={dist} accentColor={isTotal ? C.darkGreen : C.lightGreen} />
            </div>
          );
        })}

        <h3 style={{ ...styles.chartTitle, marginTop: '40px', marginBottom: '20px', fontSize: '20px', color: C.purple }}>Licensing & usage rights uplifts</h3>
        <p style={styles.sectionSubtitle}>What creators charge on top of their base rate for extended usage, exclusivity, and different platform rights.</p>
        {LICENSING_TYPES.map(l => {
          const values = filteredResponses.map(r => r.licensing[l.key]);
          const dist = getDistribution(values, LICENSING_BRACKETS);
          const validCount = values.filter(v => v && v !== 'N/A').length;
          return (
            <div key={l.key} style={styles.chartBlock}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>{l.label}</h3>
                <span style={styles.chartMeta}>{validCount > 0 ? `${validCount} ${validCount === 1 ? 'creator' : 'creators'}` : 'No data'}</span>
              </div>
              <DistributionChart distribution={dist} accentColor={C.purple} />
            </div>
          );
        })}

        <h3 style={{ ...styles.chartTitle, marginTop: '40px', marginBottom: '16px', fontSize: '20px', color: C.purple }}>Business setup breakdown</h3>
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

        <RawDataTable responses={filteredResponses} onOpen={setOpenCreator} />
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

  return (
    <div style={styles.container}>
      <style>{fontImport}</style>

      <header style={styles.header}>
        <h1 style={styles.title}>Creator Rates Transparency</h1>
        <p style={styles.subtitle}>A live, community-built dataset of what creators actually charge across deliverables, licensing, and revenue streams. Explore the data, find your benchmark, and contribute your own.</p>
        <div style={styles.statsBar}>
          <span style={styles.stat}><span style={styles.statNumber}>{RESPONSES.length}</span> responses</span>
          <span style={styles.stat}><span style={styles.statNumber}>{COUNTRIES.length}</span> countries</span>
          <span style={styles.stat}><span style={styles.statNumber}>{DELIVERABLES.length}</span> deliverables tracked</span>
          <span style={styles.stat}><span style={styles.statNumber}>{REVENUE_STREAMS.length - 1}</span> revenue streams</span>
        </div>
      </header>

      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(mode === 'explore' ? styles.tabActive : {}) }} onClick={() => setMode('explore')}><Search size={16} /> Explore by deliverable</button>
        <button style={{ ...styles.tab, ...(mode === 'all' ? styles.tabActive : {}) }} onClick={() => setMode('all')}><SlidersHorizontal size={16} /> All deliverables</button>
        <button style={{ ...styles.tab, ...(mode === 'income' ? styles.tabActive : {}) }} onClick={() => setMode('income')}><DollarSign size={16} /> Income & licensing</button>
        <button style={{ ...styles.tab, ...(mode === 'question' ? styles.tabActive : {}) }} onClick={() => setMode('question')}><TrendingUp size={16} /> Ask a question</button>
      </div>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Filter the data</h3>
          <FilterChips label="Country" options={COUNTRIES} selected={filters.countries} onToggle={v => toggleFilter('countries', v)} icon={<MapPin size={12} />} />
          <FilterChips label="Follower size" options={FOLLOWERS} selected={filters.followers} onToggle={v => toggleFilter('followers', v)} icon={<Users size={12} />} />
          <FilterChips label="Niche" options={NICHES} selected={filters.niches} onToggle={v => toggleFilter('niches', v)} />
          <FilterChips label="Creator stage" options={WORK} selected={filters.work} onToggle={v => toggleFilter('work', v)} icon={<Briefcase size={12} />} />
          <FilterChips label="Years creating" options={YEARS} selected={filters.years} onToggle={v => toggleFilter('years', v)} />
          {hasFilters && <button style={styles.clearBtn} onClick={clearFilters}>Clear all filters</button>}
        </aside>

        <main style={styles.main}>{mainContent}</main>
      </div>

      <div style={styles.disclaimer}>
        <div style={styles.disclaimerTitle}>About this data</div>
        This is a community-built benchmark, not financial advice. Rates are self-reported by creators and reflect what they've actually been paid. Sample sizes are shown for every result. Currency is shown in the creator's local currency. Click any creator row in the raw data table to see their full anonymous breakdown. This resource is published under CC BY 4.0, facilitated by Feijoa Social, and independent of our courses and client work.
      </div>

      <CreatorModal creator={openCreator} onClose={() => setOpenCreator(null)} />
    </div>
  );
}
