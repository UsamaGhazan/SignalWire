export interface AfghanCatergoriesLoader {
  "Internal Envmt": boolean;
  "Diplo Overtures": boolean;
  "Pakistan Corner": boolean;
  "India Corner": boolean;
  "X-Hairs": boolean;
}

export interface AfghanCategoriesPage {
  ["Internal Envmt"]: number;
  ["Diplo Overtures"]: number;
  ["Pakistan Corner"]: number;
  ["India Corner"]: number;
  ["X-Hairs"]: number;
}

// export interface IranCategoriesPage {
//   ["iran_internal_env"]: number;
//   ["iran_diplo"]: number;
//   ["iran_pak_corner"]: number;
//   ["iran_india_corner"]: number;
//   ["iran_x_hair"]: number;

// }
export interface IranCategoriesLoader {
  Internal_Envmt: boolean;
  Diplo_Overtures: boolean;
  Pakistan_Corner: boolean;
  Terrorist_Groups: boolean;
  ["X-Hairs"]: boolean;
}

export interface IranCategoriesPage {
  ["Internal_Envmt"]: number;
  ["Diplo_Overtures"]: number;
  ["Pakistan_Corner"]: number;
  ["Terrorist_Groups"]: number;
  ["X-Hairs"]: number;
}
interface BaseNewsFormat {
  id: string;
  source: string;
  title: string;
  description: string;
  country: string;
  published_date: string;
  cat_hits?: any; // Adjust type based on the actual structure of cat_hits
  image: string;
}
export interface NewsFormat extends BaseNewsFormat {
  report_title: string;
  news_link: string;
  keywords: string[];
  flag?: boolean;
}

export interface EditorialNewsFormat extends BaseNewsFormat {
  link: string;
}

// let newsFormate = {
//   id: element._id,
//   source: element._source.source_news,
//   title: this.api.highlightWords(
//     element?._source?.data?.title,
//     element?._source?.data?.keywords_hits
//   ), //element?._source?.data?.title,
//   description: element?._source?.data?.description,
//   link: element._source.data.link,
//   country: element._source.data.country,
//   published_date: this.api.formatDate(
//     element._source.published_date
//   ),
//   cat_hits: element?._source?.data?.cat_hits,
//   image: element?._source?.data?.thumbnail || "",
// };
export interface AfghanCategory {
  [key: string]: NewsFormat[];
}

type allCatI =
  | "Internal Envmt"
  | "Diplo Overtures"
  | "Pakistan Corner"
  | "India Corner"
  | "X-Hairs";
type allCatI_Iran =
  | "Internal_Envmt"
  | "Diplo_Overtures"
  // | "Pakistan_Corner"
  | "Terrorist_Groups"
  | "X-Hairs";
export interface AfghanSubCategory {
  all: allCatI[];
  [key: string]: NewsFormat[] | allCatI[];
}
export interface IranSubCategory {
  all: allCatI_Iran[];
  [key: string]: NewsFormat[] | allCatI_Iran[];
}
