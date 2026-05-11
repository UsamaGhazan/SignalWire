export interface SectionInfoWest {
  "Internal Envmt": {
    is: string[];
    political: string[];
  };
  "Diplo Overtures": {
    bilateral: string[];
    multilateralForums: string[];
    G2G: string[];
    B2B: string[];
    I2I: string[];
    M2M: string[];
  };
  "Pakistan Corner": {};
  "India Corner": {};
  "X-Hairs": {
    ttp: string[];
    k2n: string[];
    isis: string[];
    xborder: string[];
  };
}

interface ArticleData {
  area_hits: any[];
  army_further_cat_hits: string;
  cat_hits: string;
  country: string;
  description: string;
  keywords_hits: any[];
  news_link: string;
  published_by: string;
  published_date: string;
  source: string;
  sub_cat_hits: string;
  thumbnail: string;
  title: string;
  type: string;
}

interface ArticleSource {
  data: ArticleData;
  frequency: string;
  is_pass: boolean;
  parent_id: string;
  published_date: string;
  ranking: number;
  source_news: string;
  summary: string;
  timestamp_insert: string;
  timestamp_update: string;
  title: string;
}

export interface Article {
  _id: string;
  _index: string;
  _score: null | number;
  _source: ArticleSource;
  _type: string;
  sort: number[];
}

export interface PremiumSourceFilterI {
  authors?: {
    [key: string]: number;
  };

  data: Editorial[];
}

export interface Editorial {
  _id: string;
  _index: string;
  _score: number | null;
  _source: {
    data: {
      area_hits: any[];
      army_further_cat_hits: string;
      cat_hits: string;
      country: string;
      description: string;
      keywords_hits: any[];
      link: string;
      published_by: string;
      published_date: string;
      source: string;
      sub_cat_hits: string;
      thumbnail: string;
      title: string;
      type: string;
    };
    frequency: string;
    is_pass: boolean;
    parent_id: string;
    published_date: string;
    ranking: number;
    source_news: string;
    summary: string;
    timestamp_insert: string;
    timestamp_update: string;
    title: string;
  };
  _type: string;
  sort: number[];
}

export interface EditorialObj {
  Editorials: Editorial[];
}

export interface PremiumSourcesFilter {
  date?: string;
  keywords?: string;
  source?: string;
  author?: string;
  pageNumber?: number;
}

export interface ReportData{
  bulletPoints: string[];
  keyPeople: string[];
  keyAreas: string[];
}

export interface ScrapperStatus{
  category: string,
  channel_name: string,
  id: number,
  last_update: string,
  status: string,
  type: string
  last_data_insert: string,
}