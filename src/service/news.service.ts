import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { global_pointer } from "src/assets/js/global_config";
import { PremiumSourcesFilter, SectionInfoWest } from "./interfaces";
import { map } from "rxjs/operators"; // Import the map operator
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class NewsService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
  ) {
    window.addEventListener("click", (e: any) => {
      if (this.current_context_menu.type != "gen") {
        this.current_context_menu["menuOpen"] = false;
      }
    });
  }
  //Public Ip
  ip: string = global_pointer.newsIp;
  system: string = global_pointer.system;
  uid = this.getCookie("uid");
  userId = "";
  // map-pin popup
  pin_popup: any = false;

  // move-custom-menu
  subCats: any = [];
  current_context_menu: any = {
    menuOpen: false,
  };
  // news-category
  newsList: any = {};
  tweetList: any = {};

  // news-explore
  NewsList_explore: any = {};
  tweetList_explore: any = {};
  podcastList_explore: any = {};
  section_info_west: SectionInfoWest = {
    "Internal Envmt": {
      is: ["Tsm", "Protests"],
      political: ["Elections", "Conferences"],
    },
    "Diplo Overtures": {
      bilateral: [
        "iran_usa",
        "iran_russia",
        "iran_israel",
        "Afg-China",
        "Afg-Iran",
        "Afg-India",
      ],
      multilateralForums: ["Regional_Engagement", "International_Engagement"],
      G2G: ["G2G"],
      B2B: ["B2B"],
      I2I: ["I2I"],
      M2M: ["M2M"],
    },
    "India Corner": {},
    "Pakistan Corner": {},
    "X-Hairs": {
      isis: ["ISIS"],
      k2n: ["K2N"],
      ttp: ["TTP"],
      xborder: ["xborder"],
    },
  };
  cat_info_west = {
    "Internal Envmt": "Internal Envmt",
    "Diplo Overtures": "Diplo Overtures",
    "Pakistan Corner": "Pakistan Corner",
    "India Corner": "India Corner",
    "X-Hairs": "X-Hairs",
  };
  getCookie(name) {
    var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    console.log("cookies", match);
    if (match) {
      return match[2];
    } else {
      return 1;
    }
  }
  logout() {
    return this.http.get(this.ip + "logout");
  }
  dateFormate(Gmt, country = "") {
    let gmtx = Gmt;
    country = country.toLowerCase();
    gmtx =
      country == "india"
        ? Gmt.replace("0000", "0530")
        : country == "afghanistan"
          ? Gmt.replace("0000", "0430")
          : country == "iran"
            ? Gmt.replace("0000", "0330")
            : Gmt.replace("0000", "0500");
    let x: any = new Date(gmtx).toString();
    return x.split(" (")[0];
  }
  gotoHome() {
    this.router.navigate([""]);
  }

  //========================================Admin=======================================================
  //User
  checkUserType() {
    return this.http.get(this.ip + "get_user_type");
  }

  getAllUser() {
    return this.http.get(this.ip + "get_all_user");
  }
  addUser(name, pass, category, remarks) {
    console.log("remarks ", remarks);
    console.log(
      "add user api ",
      this.ip +
        "add_user/" +
        name +
        "/" +
        pass +
        "/" +
        category +
        "/" +
        remarks,
    );
    return this.http.get(
      this.ip +
        "add_user/" +
        name +
        "/" +
        pass +
        "/" +
        category +
        "/" +
        remarks,
    );
  }
  updateUser(id, name, pass, category, remarks) {
    return this.http.get(
      this.ip +
        "update_user/" +
        id +
        "/" +
        name +
        "/" +
        pass +
        "/" +
        category +
        "/" +
        remarks,
    );
  }
  deleteUser(id) {
    return this.http.get(this.ip + "delete_user/" + id);
  }
  //Twitter
  getAllHandler(corner) {
    return this.http.get(this.ip + "get_all_handle/" + corner);
  }
  addHandler(hanlde, category, cat_specific) {
    return this.http.get(
      this.ip + "add_handle/" + category + "/" + hanlde + "/" + cat_specific,
    );
  }
  updateHandler(id, category, handle, cat_specific) {
    return this.http.get(
      this.ip +
        "update_handle/" +
        id +
        "/" +
        category +
        "/" +
        handle +
        "/" +
        cat_specific,
    );
  }
  deleteHandler(id) {
    return this.http.get(this.ip + "delete_handle/" + id);
  }
  //Youtube
  getAllYTHandler(corner) {
    return this.http.get(this.ip + "get_all_youtube_handle/" + corner);
  }
  addYTHandler(hanlde, category) {
    console.log(" addYTHandler hanlde", hanlde);
    console.log(" addYTHandler category", category);
    return this.http.get(
      this.ip + "add_youtube_handle/" + category + "/" + hanlde,
    );
  }
  updateYTHandler(id, category, handle) {
    return this.http.get(
      this.ip + "update_youtube_handle/" + id + "/" + category + "/" + handle,
    );
  }
  deleteYTHandler(id) {
    return this.http.get(this.ip + "delete_youtube_handle/" + id);
  }

  //keywords
  getAllkeywords(type, corner) {
    return this.http.get(this.ip + "get_all_keywords/" + type + "/" + corner);
  }
  addkeywords(keyword, cattype, category) {
    return this.http.get(
      this.ip + "add_keyword/" + keyword + "/" + cattype + "/" + category,
    );
  }
  updatekeywords(id, keyword, cattype, category) {
    return this.http.get(
      this.ip +
        "update_keyword/" +
        id +
        "/" +
        keyword +
        "/" +
        cattype +
        "/" +
        category,
    );
  }
  deletekeywords(id, cattype) {
    return this.http.get(this.ip + "delete_keyword/" + id + "/" + cattype);
  }
  //=======================================Admin=========================================================

  wikipediaSearch(text) {
    return this.http.get(this.ip + "get_wiki_data/" + text);
  }
  newsGeneralSearch(text, corner) {
    return this.http.get(
      this.ip + "general_seach_data?search_text=" + text + "&corner=" + corner,
    );
  }
  getFlashNews(typex) {
    return this.http.get(this.ip + "fetch_trending_top_news_images/" + typex);
  }
  filterNewsandTweets(
    origin,
    type,
    date,
    keywords,
    trending,
    cats = "",
    page_number = 1,
  ) {
    let cats_ = cats ? "&cats=" + cats : "";
    origin =
      type === "tweet" && origin === "west_corner_iran"
        ? "iran_corner"
        : origin;
    return this.http.get(
      this.ip +
        "fetch_data?category=" +
        origin +
        "&typee=" +
        type +
        "&datee=" +
        date +
        "&keywords=" +
        keywords +
        "&trending=" +
        trending +
        cats_ +
        "&page_number=" +
        page_number,
    );
  }
  filterNewsandTweets_report(
    origin,
    type,
    date,
    keywords,
    trending,
    cats = "",
  ) {
    if (
      type === "tweet" &&
      (origin === "west_corner" || origin === "iran_corner")
    ) {
      if (origin === "west_corner") {
        cats = "international_env,diplo,pak_corner,india_corner,x_hair";
      }
      if (origin === "iran_corner") {
        cats = "iran_internal_env,iran_diplo,iran_pak_corner,iran_x_hair";
      }
    }
    if (origin === "west_corner" && type === "news") {
      cats = "dom_env,diplo_econ,mil,is_tsm";
    }
    if (origin === "iran_corner" && type === "news") {
      cats = "Internal_Envmt,Diplo_Overtures,Terrorist_Groups,X-Hairs";
    }
    console.log("final origin ", origin);
    console.log("final cats ", cats);
    let cats_ = cats ? "&cats=" + cats : "";
    return this.http.get(
      this.ip +
        "fetch_data_reporting?category=" +
        origin +
        "&typee=" +
        type +
        "&datee=" +
        date +
        "&keywords=" +
        keywords +
        "&trending=" +
        trending +
        cats_,
    );
  }
  getEditorials(origin, date, keywords, trending, page_number = 1) {
    console.log("Editorial api called");
    return this.http.get(
      this.ip +
        "fetch_editorial_hub?category=" +
        origin +
        "_editorial&datee=" +
        date +
        "&keywords=" +
        keywords +
        "&trending=" +
        trending +
        "&page_number=" +
        page_number,
    );
  }
  fetch_historical_data(origin, news_id) {
    return this.http.get(
      this.ip + "fetch_historical_data/" + origin + "/" + news_id,
    );
  }
  new_by_tag(origin, keywords, trending, page_number) {
    return this.http.get(
      this.ip +
        "fetch_news_by_tag/" +
        keywords +
        "/" +
        origin +
        "/" +
        trending +
        "?page_number=" +
        page_number,
    );
  }
  fetch_sub_news(
    category,
    sub_cats,
    datee,
    keywords,
    trending,
    url = "fetch_sub_news",
    page_number = 1,
    section = "",
  ) {
    let mainCat = section;

    return this.http.get(
      this.ip +
        "" +
        url +
        "?category=" +
        category +
        "&sub_cats=" +
        sub_cats +
        "&datee=" +
        datee +
        "&keywords=" +
        keywords +
        "&trending=" +
        trending +
        "&page_number=" +
        page_number +
        "&cats=" +
        mainCat,
    );
  }

  fetch_twitter_data(
    category,
    sub_cats,
    datee,
    keywords,
    trending,
    url = "fetch_twitter_data",
    page_number = 1,
  ) {
    return this.http.get(
      this.ip +
        "" +
        url +
        "?category=" +
        category +
        "&sub_cats=" +
        sub_cats +
        "&datee=" +
        datee +
        "&keywords=" +
        keywords +
        "&trending=" +
        trending +
        "&page_number=" +
        page_number,
    );
  }
  getProdCasts(date, corner, keyword, page_number = 1, type) {
    console.log("babie ", type);
    return this.http.get(
      this.ip +
        "fetch_youtube_data?page_number=" +
        page_number +
        "&cats=" +
        type +
        "&date=" +
        date +
        "&country=" +
        corner +
        "&keywords=" +
        keyword,
    );
    // return this.http.get(this.ip + "fetch_youtube_data/" + date + "/" + corner + "/" + (keyword ? keyword : 'none') + "?page_number=" + page_number)
  }

  // Fetch initial tweets/pool from the external X-UP Pro service
  getInitialData(): Observable<any> {
    // Direct call to the provided endpoint
    return this.http.get("http://192.168.100.110:8090/get_initial_data");
  }

  // Fetch refreshing data from the external service
  getRefreshingData(): Observable<any> {
    return this.http.get("http://192.168.100.110:8090/get_refreshing_data");
  }

  getInitialHashtagData(): Observable<any> {
    return this.http.get("http://192.168.100.110:8090/get_hashtag_data_initial");
  }

  getHashtagDataByTopCursor(): Observable<any> {
    return this.http.get("http://192.168.100.110:8090/get_hashtag_data_by_top_cursor");
  }

  getEastCornerArmyTweets(cursor?: string, cursorType?: 'top' | 'bottom', size: number = 20): Observable<any> {
    let params = new HttpParams().set('size', size.toString());
    if (cursor && cursorType) {
      params = params.set(cursorType, cursor);
    }
    const headers = new HttpHeaders({
      'Cookie': 'session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4; session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4; session=EieCYgUYHQXGpbfm9V3Tv4peOGzvmPn6tXxhsKEjdP4'
    });
    return this.http.get("http://192.168.100.110:8090/east_corner_army", { headers, params });
  }

  getCsvFile() {
    return this.http.get(this.ip + "generate_csv");
  }
  getNewsByDate(origin, date, trend) {
    return this.http.get(
      this.ip + "fetch_news_by_date/" + date + "/" + origin + "/" + trend,
    );
  }
  getTweetsByDate(origin, date, trend) {
    return this.http.get(
      this.ip + "fetch_tweets_by_date/" + date + "/" + origin + "/" + trend,
    );
  }
  getNews(origin, trending = false) {
    return this.http.get(
      this.ip + "fetch_trending_top_news/" + origin + "/" + trending,
    );
  }

  getTweets(origin, trending = false) {
    return this.http.get(
      this.ip + "fetch_top_tweets/" + origin + "/" + trending,
    );
  }

  getPremiumEditorials(pageNumber = 1) {
    return this.http.get(
      this.ip + `fetch_all_premium_editorials/${pageNumber}`,
    );
  }

  getPremiumSources() {
    return this.http.get(this.ip + "premium_metadata");
  }

  getPremiumSourcesBy(premiumSourcesFilter: PremiumSourcesFilter) {
    let params = new HttpParams();

    const { date, keywords, source, author, pageNumber } = premiumSourcesFilter;
    if (date) {
      params = params.set("datee", date);
    }
    if (keywords) {
      params = params.set("keywords", keywords);
    }
    if (source) {
      params = params.set("source", source);
    }
    if (author) {
      params = params.set("author", author);
    }
    params = params.set("page_number", pageNumber);
    params = params.set("trending", false);

    return this.http.get(`${this.ip}fetch_premium`, { params });
  }
  seacrhKeyword(
    origin,
    keyword,
    type,
    trending = false,
    id = "",
    cat = "",
    subcat = "",
  ) {
    if (type == "news") {
      return this.http.get(
        this.ip + "fetch_news_by_keyword/" + origin + "/" + cat + "/" + subcat,
      );
    } else {
      return this.http.get(
        this.ip +
          "fetch_tweet_by_keyword/" +
          origin +
          "/" +
          keyword +
          "/" +
          trending,
      );
    }
  }

  getPremiumAuthors() {
    return this.http.get(this.ip + "fetch_premium_editorials");
  }

  newsById(origin, id) {
    return this.http.get(this.ip + "fetch_news/" + origin + "/" + id);
  }
  getNewsEditorialAudio(
    audioType: string,
    description: any,
  ): Observable<string> {
    console.log("data sending ", description);
    audioType = audioType.trim().split(" ").join("_").toLowerCase();

    let formattedText = "The crux is as under:\n";
    formattedText += description.bulletPoints
      .map((point: string) => `- ${point}`)
      .join("\n");

    if (description.keyAreas.length > 0) {
      formattedText += `\n\nKey Areas:\n`;
      formattedText += description.keyAreas
        .map((area: string) => `- ${area}`)
        .join("\n");
    }

    if (description.keyPeople.length > 0) {
      formattedText += `\n\nKey People:\n`;
      formattedText += description.keyPeople
        .map((person: string) => `- ${person}`)
        .join("\n");
    }

    const payload = {
      text: formattedText.replace(/•/g, "-"), // Replace any stray bullet points
      voice: audioType,
    };

    console.log("payload ", payload);

    return this.http
      .post<any>(this.ip + "get_speach", payload)
      .pipe(
        map(
          (data) =>
            `${this.ip}static/generated_speech/${data.generated_speach}`,
        ),
      );
  }

  editorialById(origin, id) {
    return this.http.get(
      this.ip + "fetch_editorials_by_keyword/" + origin + "/false/" + id,
    );
  }
  tweetById(origin, id) {
    return this.http.get(this.ip + "fetch_tweet/" + id);
  }
  youtubeById(origin, id) {
    return this.http.get(
      this.ip + "fetch_youtube_vids/" + origin + "/false/" + id,
    );
  }
  getChartData() {
    return this.http.get(this.ip + "get_charts");
  }
  addKeyword(keyword, origin) {
    return this.http.get(this.ip + "add_keyword/" + keyword + "/" + origin);
  }
  addHandle(keyword, origin) {
    return this.http.get(
      this.ip + "add_handle/" + this.uid + "/" + origin + "/" + keyword,
    );
  }
  getHandles(origin) {
    return this.http.get(this.ip + "get_all_handle/" + this.uid + "/" + origin);
  }
  deleteHandles(id) {
    return this.http.get(this.ip + "delete_handle/" + id);
  }
  updateHandles(id, origin, handle) {
    return this.http.get(
      this.ip + "update_handle/" + id + "/" + origin + "/" + handle,
    );
  }

  getLastSync() {
    return this.http.get(this.ip + "get_last_synced/");
  }

  getChannels(catagory) {
    return this.http.get(this.ip + "get_all_channels/" + catagory);
  }
  getProrities(catagory) {
    return this.http.get(this.ip + "fetch_priority/" + catagory);
  }
  resetProrities(catagory) {
    return this.http.get(this.ip + "reset_priority/" + catagory);
  }
  geoCode(str) {
    return this.http.get(
      "https://api.opencagedata.com/geocode/v1/json?q=" +
        str +
        "&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=en",
    );
  }
  resolve_date(x) {
    let ms = {
      second: 999.998904110799913,
      sec: 999.998904110799913,
      minute: 60000,
      min: 60000,
      hour: 3.6e6,
      day: 8.64e7,
      week: 6.048e8,
      month: 2.628e9,
    };
    if (!x.includes("ago")) {
      return x ? new Date(x) : "";
    }
    let n = parseInt(x);
    let str = x.replace(" ago", "");
    str = str.split(" ")[1];
    str = str.replace(/.$/, (match) => {
      match = match.replace("s", "");
      return match;
    });
    str = str.toLowerCase();
    let now = new Date();
    let nd = new Date();
    let t = nd.getTime() - ms[str] * n;
    let final = new Date(t);
    return final;
  }
  // updateProrities(catagory) {
  //   return this.http.
  // }

  highlightWords(words, keywords, ignorePlurals = true) {
    // if(!words) {
    //   return ''
    // }
    if (typeof words === "object") {
      words = words.join(" ");
    }

    try {
      if (!ignorePlurals) {
        let markedText = words;
        keywords.forEach((keyword) => {
          const regex = new RegExp(`\\b${keyword}\\b`, "gi");
          markedText = markedText.replace(regex, (match) => {
            return `<mark class="text-mark">${match}</mark>`;
          });
        });

        return markedText;
      } else {
        let markedText = words;
        keywords.forEach((el) => {
          let keyword = el;
          if (!keyword) {
            return;
          }
          if (keyword.includes(".")) {
            keyword = el.replace(".", "");
          }
          const pluralRegex = new RegExp(`\\b${keyword}s?\\b`, "gi");
          markedText = markedText.replace(pluralRegex, (match) => {
            if (match.toLowerCase() === keyword.toLowerCase()) {
              return `<mark class="text-mark">${match}</mark>`;
            } else if (match.toLowerCase() === `${keyword.toLowerCase()}s`) {
              return `<mark class="text-mark">${match.slice(
                0,
                match.length - 1,
              )}</mark>${match.charAt(match.length - 1)}`;
            }
            return match;
          });
        });

        return markedText
          ?.replace(/<br>/g, "<br><br>")
          .replace(/\n/g, "<br><br>");
      }
    } catch (error) {
      console.log(words, "words", keywords, "keywords");
    }
  }

  // makeParagraphs(words) {
  //   console.log(words);
  //   if (typeof words === "object") {
  //     words = words.join(" ");
  //   }

  //   try {
  //     let newText = "";
  //     let currentParagraph = "";
  //     let currentLength = 0;

  //     for (let i = 0; i < words.length; i++) {
  //       currentParagraph += words[i];
  //       currentLength++;

  //       if (words[i] === "." && currentLength >= 500) {
  //         newText += `<p class="big-description text-black lh-lg manrope f-20 fw-400 text-justify">${currentParagraph.trim()}</p>`;
  //         currentParagraph = "";
  //         currentLength = 0;
  //       }
  //     }

  //     // Add the last paragraph if it exists
  //     if (currentParagraph.trim()) {
  //       newText += `<p class="big-description text-black lh-lg manrope f-20 fw-400 text-justify">${currentParagraph.trim()}</p>`;
  //     }

  //     return newText;
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // }
  makeParagraphs(text, maxSentences = 5) {
    // console.log('input text ',text)
    const doc = (window as any).nlp(text);
    // console.log('doc ',doc)
    const sentences = doc.sentences().out("array");
    // console.log('Sentences:', sentences);

    const paragraphs = [];
    let currentParagraph = "";
    sentences.forEach((sentence, index) => {
      currentParagraph += sentence + " ";
      if ((index + 1) % maxSentences === 0 || index === sentences.length - 1) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = "";
      }
    });
    console.log("pargraphs ", paragraphs);
    return paragraphs.join("<br><br>");
  }

  showKeywords(event, keywords) {
    let popup = document.createElement("div");
    popup.innerHTML = `
    <div class="custom-keywords-popup" style="left: ${event.pageX}px;top:${
      event.pageY - 100
    }px;">
      ${keywords
        .map((x) => {
          return (
            '<span style="padding: 8px 1rem; background: #f4f4f4;border-radius: 8px;">' +
            x +
            "</span>"
          );
        })
        .join("")}
      <div style="position: absolute; cursor: pointer; top: 0; right: 0; padding: 1rem;" onclick="this.parentElement.remove()">
        <i class="fa fa-times"></i>
      </div>
    </div>`;
    document.body.appendChild(popup);
  }

  formatCount(count) {
    let formatter = Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 2,
    });
    return formatter.format(count);
  }

  moveNewsOld(cat, origin, id) {
    return this.http.get(
      this.ip + "change_cat_news/" + cat + "/" + origin + "/" + id,
    );
  }

  genNews(cat, sub_cat, origin, id) {
    // return this.http.get(this.ip + 'change_main_cat_news/' + cat + '/' + sub_cat + '/' + origin + '/' + id);
  }
  moveNews(cat, sub_cat, origin, id) {
    return this.http.get(
      this.ip +
        "change_main_cat_news/" +
        cat +
        "/" +
        sub_cat +
        "/" +
        origin +
        "/" +
        id,
    );
  }
  moveTweet(cat, sub_cat, origin, id) {
    return this.http.get(
      this.ip + "change_cat_twitter/" + cat + "/" + sub_cat + "/" + id,
    );
  }
  deleteNews(type, origin, id) {
    return this.http.get(
      this.ip + "delete_news/" + type + "/" + origin + "/" + id + "",
    );
  }
  getWeather(region) {
    return this.http.get(this.ip + "get_weather_time/" + region);
  }
  getCV() {}
  fetch_locations(cat, sub_cat, corner, datee) {
    return this.http.get(
      this.ip +
        "fetch_locations?cats=" +
        cat +
        "&sub_section=" +
        sub_cat +
        "&index_name=" +
        corner +
        "&datee=" +
        datee,
    );
  }
  getTopKeywords(typex) {
    return this.http.get(this.ip + "fetch_trending_keywords/" + typex);
  }
  registerLog(msg) {
    return this.http.get(this.ip + "register_log?message=" + msg);
  }
  getLogsoffset(uid, offset) {
    return this.http.get(
      this.ip + "get_logs_with_page_num/" + uid + "/" + offset + "/50",
    );
  }
  getLogs(uid) {
    return this.http.get(this.ip + "get_logs/" + uid);
  }
  getSummary(id, corner, youtube = false) {
    if (youtube) {
      return this.http.get(
        this.ip + "get_news_summary/" + "youtube_videos" + "/" + id,
      );
    }
    return this.http.get(this.ip + "get_news_summary/" + corner + "/" + id);
  }

  getTimes() {
    return this.http.get(this.ip + "get_time_all");
  }
  getTrendingHashtag(corner) {
    return this.http.get(this.ip + "get_top_trending/" + corner + "/");
  }
  getEditorialSourceOrAuth(corner, type) {
    return this.http.get(
      this.ip + "fetch_editorial_info/" + corner + "/" + type,
    );
  }
  getAuditorialAuthdetails(corner, type, text, offset) {
    return this.http.get(
      this.ip +
        "fetch_editorials_by_type/" +
        corner +
        "/" +
        type +
        "/" +
        text +
        "/" +
        offset,
    );
  }
  getAuditorialByAuthSource(corner, type, text, offset) {
    return this.http.get(
      this.ip +
        "fetch_editorials_by_author_source/" +
        corner +
        "/" +
        type +
        "/" +
        text +
        "/" +
        offset,
    );
  }

  saveUser(user) {
    return this.http.post("https://reqres.in/api/users", user);
  }

  scrollX(el, by) {
    if (!el) return;
    el?.scrollBy({ left: by, behavior: "smooth" });
  }

  scrollEdges(el) {
    el.parentElement.classList.remove("hide_right");
    el.parentElement.classList.remove("hide_left");
    if (el.scrollLeft <= 0) {
      el.parentElement.classList.add("hide_left");
    }
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 0.5) {
      el.parentElement.classList.add("hide_right");
    }
  }

  sortCats(cat, corner, type = "") {
    console.log(corner);
    var cat_type = {};
    if (corner == "east_corner") {
      cat_type = this.sections_info;
    } else if (corner == "internal_security") {
      if (type === "tweet") {
        cat_type = this.sections_info_internal_twitter;
      } else {
        cat_type = this.sections_info_internal;
      }
    } else if (corner == "west_corner") {
      cat_type = this.sections_info_west_corner;
    } else if (corner == "west_corner_iran") {
      cat_type = this.sections_info_west_corner_iran;
    }
    this.subCats = [];
    let keys_main = Object.keys(cat_type);
    let values_main = Object.values(cat_type);

    // Keys & Values;
    console.log(keys_main);
    console.log(values_main);

    let temp = {
      index: 0,
      d: null,
    };
    keys_main.forEach((mk, i) => {
      let keys = Object.keys(values_main[i]);
      let values = Object.values(values_main[i]);

      // Keys and Values;
      console.log(keys);
      console.log(values);

      let newTitle;
      if (corner == "east_corner") {
        newTitle = this.cat_info[mk];
      } else if (type == "tweet") {
        newTitle = this.resolveCatName(mk);
      } else if (corner === "internal_security") {
        newTitle = this.cat_info_internal[mk];
      } else if (corner == "west_corner") {
        newTitle = this.cat_info_west_corner[mk];
      } else if (corner == "west_corner_iran") {
        newTitle = this.cat_info_west_corner[mk];
      }

      console.log(newTitle);
      this.subCats.push({
        key: mk,
        title: newTitle,
        value: [],
      });
      console.log(this.subCats);
      keys.forEach((key, j) => {
        this.subCats[i]?.value.push({
          title: values[j],
          key: key,
        });

        console.log(this.subCats[i]);
      });
      console.log(this.subCats);

      console.log(mk, cat);

      if (mk == cat) {
        temp = {
          index: i,
          d: this.subCats[i],
        };

        console.log(temp);
      }
    });

    // moving current category to first place
    let localCatIndex = temp?.index;
    console.log(localCatIndex);
    if (localCatIndex !== -1) {
      let localCatArray = this.subCats.splice(localCatIndex, 1);
      console.log(localCatArray);

      this.subCats.unshift(localCatArray[0]);
      console.log(this.subCats);
    }
    console.log(this.subCats);
  }

  genContext(event, target, data) {
    console.log("tick1 event", event, "target ", target, "data ", data);
    event.preventDefault();
    let { type, corner, id, title, cat, subCat, content } = data;
    this.sortCats(cat, corner, type);

    console.log(corner);
    this.current_context_menu = {
      targetEl: target,
      type: type,
      corner: corner,
      content: content,
      id: id,
      title: title,
      cat: cat,
      subCat: subCat,
      menuOpen: true,
      bounds: target.getBoundingClientRect(),
    };
  }
  gen_news(context, corner, cat, sub_cat, date) {
    var formdata = new FormData();
    formdata.append("title", context.title);
    formdata.append("desc", context.desc);
    formdata.append("date_text", date);
    formdata.append("link", context.link);
    formdata.append("img", context.img);
    formdata.append("cat", cat);
    formdata.append("sub_cat", sub_cat);
    formdata.append("corner", corner);
    var requestOptions: any = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    fetch(this.ip + "add_general_news", requestOptions)
      .then((response) => response.text())
      .then((result: any) => {
        if (JSON.parse(result).message) {
          this.toastr.success("Catagory updated Successfully");
        }
      })
      .catch((error) => console.log("error", error));
  }
  move_News(cat, sub_cat) {
    if (cat == "mil") {
      cat = "army";
    }
    this.moveNews(
      cat,
      sub_cat,
      this.current_context_menu.corner,
      this.current_context_menu.id,
    ).subscribe((data: any) => {
      if (data.message) {
        this.toastr.success("Catagory updated Successfully");
        let from_sub_cat = this.current_context_menu.subCat;
        if (from_sub_cat) {
          this.newsList[from_sub_cat] = this.newsList[from_sub_cat].filter(
            (x) => x.id != this.current_context_menu.id,
          );
          let content_ = this.current_context_menu.content;
          content_["sub_cat"] = sub_cat;
          this.newsList[sub_cat]?.push(content_);
        } else {
          let cat_ = this.current_context_menu.cat;
          this.NewsList_explore[cat_] = this.NewsList_explore[cat_].filter(
            (x) => x.id != this.current_context_menu.id,
          );
          this.NewsList_explore[cat]?.push(this.current_context_menu.content);
        }
      }
    });
  }

  move_Tweet(cat, sub_cat) {
    if (cat == "mil") {
      cat = "army";
    }
    this.moveTweet(
      cat,
      sub_cat,
      this.current_context_menu.corner,
      this.current_context_menu.id,
    ).subscribe((data: any) => {
      if (data.message) {
        this.toastr.success("Catagory updated Successfully");
        let from_sub_cat = this.current_context_menu.subCat;
        if (from_sub_cat) {
          this.tweetList[from_sub_cat] = this.tweetList[from_sub_cat].filter(
            (x) => x.id_str != this.current_context_menu.id,
          );
          this.tweetList[sub_cat]?.push(this.current_context_menu.content);
        }
      } else {
        let cat_ = this.current_context_menu.cat;
        this.tweetList_explore[cat_] = this.tweetList_explore[cat_].filter(
          (x) => x.id_str != this.current_context_menu.id,
        );
        this.tweetList_explore[cat]?.push(this.current_context_menu.content);
      }
    });
  }

  deleteContent() {
    let { type, corner, id } = this.current_context_menu;
    this.deleteNews(type, corner, id).subscribe(
      (res: any) => {
        if (res?.message) {
          this.toastr.success(type + " deleted successfully!");
          let from_sub_cat = this.current_context_menu.subCat;
          if (from_sub_cat) {
            if (type == "news") {
              this.newsList[from_sub_cat] = this.newsList[from_sub_cat].filter(
                (x) => x.id != this.current_context_menu.id,
              );
            }
            if (type == "tweet") {
              this.tweetList[from_sub_cat] = this.tweetList[
                from_sub_cat
              ].filter((x) => x.id_str != this.current_context_menu.id);
            }
          } else {
            let cat_ = this.current_context_menu.cat;
            if (type == "news") {
              this.NewsList_explore[cat_] = this.NewsList_explore[cat_].filter(
                (x) => x.id != this.current_context_menu.id,
              );
            }
            if (type == "tweet") {
              this.tweetList_explore[cat_] = this.tweetList_explore[
                cat_
              ].filter((x) => x.id_str != this.current_context_menu.id);
            }
          }
        }
      },
      (error) => {
        console.error(error, "deleteContent", type, corner, id);
      },
    );
  }

  cat_info = {
    mil: "Military",
    intl: "International",
    iiojk: "Indian-Occupied Kashmir",
    domestic: "Domestic",
  };

  cat_info_west_corner = {
    internalEnvmt: "Internal Enviroment",

    diplomacy: "Diplomacy",

    xHair: "X-Hair",

    pkCorner: "Pakistan Corner",

    inCorner: "India Corner",
  };

  // Temporirly hardcoding cats untill we get twitter data from zulon
  cat_info_west_corner_temp = {
    internalEnvmt: "Intl Envr",

    diplomacy: "Diplo",

    xHair: "X-Hair",

    pkCorner: "Pak Corner",

    inCorner: "Ind Corner",
  };

  sections_info = {
    mil: {
      inland_visit_and_conferences: "Conf & Visits - Inland Activities",
      inland_exercises: "Ex & trgs (IA) - Inland Activities",
      pmf_conferences: "PMF Corner - Inland Activities",
      m2m_colaboration: "Collaborations & Proc - INTL/M2M",
      m2m_training: "Jt Trgs/Ex - INTL/M2M",
      m2m_talks: "Talks - INTL/M2M",
      m2m_conferences: "Visits & Conf - INTL/M2M",
      inland_drdo: "R&D(DRDO/ISRO)/Msl Testing",
      pak_corner: "Pakistan Corner",
      indo_china: "Indo-China Standoff",
      indian_airforce: "Indian AirForce [IAF] - Inland Activities",
      indian_navy: "Indian Navy [IN] - Inland Activities",
      indian_coast_guard: "Indian Coast Guard - Inland Activities",
      other_mil: "Others",
      m2m_visits: "m2m_visits",
    },
    intl: {
      g2g: "G2G Talks",
      regional: "Regional Engagement",
      indo_china: "Indo China - Bileteral Corner",
      indo_israel: "Indo Israel - Bileteral Corner",
      indo_neighbour: "Imed Neighborhood - Bileteral Corner",
      indo_russia: "Indo Russia - Bileteral Corner",
      indo_us: "Indo Us - Bileteral Corner",
      indo_afghan_iran: "Iran & Afg Corner",
      // "other_intl": "Others"
    },
    iiojk: {
      // atrocities: "Atrocities Of Indian AF",
      // development_project: "Dev Projects",
      // indian_armedforces: "Indian AFs & PMF CFVs",
      // iijok_political_parties: "Pol Angle (Local Pol Parties/Rallies Etc)",
      // visits_jk: "High Level Visists: Foreigners & Govt & AFs Officials",
      // others_iiojk: "Others",

      iiojk: "iiojk",
      religious_cultural: "religious_cultural",
      education: "education",
      welfare_measures: "welfare_measures",
      economy: "economy",
      media_restrictions: "media_restrictions",
      atrocities: "Atrocities Of Indian AF",
      jihad_organization: "Jihadi Org Activities",
      development_project: "Dev Projects",
      indian_armedforces: "Indian AFs & PMF CFVs",
      iijok_political_parties: "Pol Angle (Local Pol Parties/Rallies Etc)",
      visits_jk: "High Level Visists: Foreigners & Govt & AFs Officials",
      others_iiojk: "Others",
      disappearances: "Disappearances & Missing Persons",
      infiltration_militancy: "Infiltration & Militancy Incidents",
      curfews_lockdowns: "Curfews & Lockdowns",
      protests: "Protests, Rallies & Public Unrest",
      pok: "PoK - Pakistan Occupied Kashmir Related",
      foreign_reactions: "Foreign Reactions (IoJK/PoK)",
    },
    domestic: {
      naxal: "Naxalites - Separatists Movement",
      nemove: "NE Movements - Separatists Movement",
      ladakh: "Ladakh - Separatists Movement",
      khalis: "Khalistan - Separatists Movement",
      loksabha: "Lok Sabha Sessions, Budgets, Policies Related To AFs",
      polparties: "Pol Parties Activities: Elections, Protests And Rallies",
      pm: "Prime Minister - X-Hair",
      dm: "Defence Minister - X-Hair",
      ea: "Minister of External Affairs - X-Hair",
      hm: "Home Minister - X-Hair",
      other_domestic: "Others",
      developmental_projects: "developmental_projects",
    },
  };

  cat_info_internal = {
    govt: "Govt",
    polparties: "Pol Parties",
    is: "IS & CT",
    military: "Military",
    diplomat: "Diplomat",
  };
  twitter_cat_info_internal = {
    govt: "Govt",
    polparties: "Pol Parties",
    is: "IS & CT",
    military: "Military",
    anti_state: "Anti State",
  };

  sections_info_internal = {
    govt: {
      parliament: "parliament",
      xhair: "xhair",
      policies_and_holidays: "Policies and_holidays",
      // notifications: "Notifications",
      economy: "economy",
      judiciary: "judiciary",
      // other_govt: "Others",
    },
    polparties: {
      pol_leaders: "Pol ldrship",
      protest: "Protest",
      byelections: "Byelections",
      other_polparties: "Others",
      // "other_intl": "Others"
    },
    is: {
      tsm: "TSM",
      ro_and_do: "Ro and Do",
      law_and_order: "Law and Order",
      disaster: "Disaster",
      activist: "Activist",
      other_is: "Others",
    },
    military: {
      m2m_training: "M2m training",
      int_collaboration: "Int collaboration",
      m2m_visit: "M2m visit",
      paf_and_pn: "Paf and PN",
      other_domestic: "Others",
    },
    diplomat: {
      g2g: "G2G",
      neighbours: "Neighbours",
      regional: "Regional",
      international: "International",
      other_diplomat: "Others",
    },
    xhair: {
      TTP: "TTP",
      K2N: "K2N",
      ISIS: "ISIS",
      XBORDER: "XBORDER ACTIVITIES",
    },
  };

  sections_info_west_corner = {
    internalEnvmt: {
      Tsm: "Tsm",
      Protests: "Protests",
      Elections: "Elections",
      Conferences: "Conferences",
    },

    diplomacy: {
      "Afg-China": "Afg-China",
      "Afg-Iran": "Afg-Iran",
      "Afg-India": "Afg-India",
      Regional_Engagement: "Regional_Engagement",
      International_Engagement: "International_Engagement",
      G2G: "G2G",
      B2B: "B2B",
      I2I: "I2I",
      M2M: "M2M",
    },

    xHair: {
      ttp: "TTP",
      isis: "ISIS",
      K2N: "K2N",
      xborder: "XBORDER ACTIVITIES",
    },

    pkCorner: {
      "Pakistan Corner": "Pakistan Corner",
    },

    inCorner: {
      "India Corner": "India Corner",
    },
  };

  sections_info_west_corner_iran = {
    internalEnvmt: {
      Tsm: "Tsm",
      Protests: "Protests",
      Elections: "Elections",
      Conferences: "Conferences",
    },

    diplomacy: {
      iran_usa: "iran_usa",
      iran_russia: "iran_russia",
      iran_israel: "iran_israel",
      Regional_Engagement: "Regional_Engagement",
      International_Engagement: "International_Engagement",
      G2G: "G2G",
      B2B: "B2B",
      I2I: "I2I",
      M2M: "M2M",
    },

    xHair: {
      jua: "JUA",
      isis: "ISIS",
      sb: "SB",
      xborder: "XBORDER ACTIVITIES",
      No2: "No2",
    },

    pkCorner: {
      "Pakistan Corner": "Pakistan Corner",
    },

    inCorner: {
      "India Corner": "India Corner",
    },
  };

  sections_info_internal_twitter = {
    govt: {
      parliament: "Parliament",
      xhair: "Xhair",
      policies_and_holidays: "Policies and_holidays",
      notifications: "Notifications",
      judiciary: "Judiciary",
      economy: "Economy",
      other_govt: "Govt Others",
      g2g: "G2G",
      neighbours: "Neighbours",
      regional: "Regional",
      international: "International",
      other_diplomat: "Diplomat Others",
    },
    polparties: {
      pol_leaders: "Pol ldrship",
      protest: "Protest",
      byelections: "Byelections",
      other_polparties: "Others",
      // "other_intl": "Others"
    },
    is: {
      tsm: "TSM",
      ro_and_do: "Ro and Do",
      law_and_order: "Law and Order",
      disaster: "Disaster",
      activist: "Activist",
      other_is: "Others",
    },
    military: {
      m2m_training: "M2m training",
      int_collaboration: "Int collaboration",
      m2m_visit: "M2m visit",
      paf_and_pn: "Paf and PN",
      other_domestic: "Others",
    },
    anti_state: {
      anti_state: "Anti State",
    },
    xhair: {
      TTP: "TTP",
      K2N: "K2N",
      ISIS: "ISIS",
      XBORDER: "XBORDER ACTIVITIES",
    },
  };

  sub_cats_t = {
    mil: [
      "inland_visit_and_conferences",
      "inland_exercises",
      "pmf_conferences",
      "m2m_colaboration",
      "m2m_training",
      "m2m_talks",
      "m2m_conferences",
      "inland_drdo",
      "pak_corner",
      "indo_china",
      "m2m_visits",
      // "other_mil"
    ],
    intl: [
      "g2g",
      "regional",
      "indo_china",
      "indo_israel",
      "indo_neighbour",
      "indo_russia",
      "indo_us",
      "indo_afghan_iran",
      // "other_intl"
    ],
    iiojk: [
      "atrocities",
      "development_project",
      "indian_armedforces",
      "iijok_political_parties",
      "visits_jk",
      "atinCombined",
      "odjCombined",
      "iivCombined",
      "others_iiojk",
    ],
    domestic: [
      // 'other',
      "naxal",
      "nemove",
      "ladakh",
      "loksabha",
      "polparties",
      "pm",
      "dm",
      "ea",
      "hm",
      "khalis",
      "combineSepratists",
      "combineXhair",
      "developmental_projects",

      // "other_domestic"
    ],
    // chn4
    intenv: [
      // 'IS',
      // 'Political',
      "Tsm",
      "Protests",
      "Sm Activities",
      "Elections",
      "Conferences",
      "Other",
    ],
    xhair: ["TTP", "K2N", "ISIS", "XBORDER ACTIVITIES"],
  };

  // For the api request you need to alter this object. for the internal insight corner.
  sub_cats_t_internal = {
    govt: [
      "xhair",
      "economy",
      "judiciary",
      "parliament",
      "policies_and_holidays",
    ],
    polparties: ["pol_leaders", "protest", "byelections", "other_polparties"],
    is: [
      "tsm",
      "ro_and_do",
      "law_and_order",
      "disaster",
      "activist",
      "other_is",
    ],
    military: ["m2m_training", "int_collaboration", "m2m_visit", "paf_and_pn"],
    diplomat: [
      "g2g",
      "neighbours",
      "regional",
      "international",
      "other_diplomat",
    ],
    xhair: ["TTP", "K2N", "ISIS", "XBORDER ACTIVITIES"],
  };

  sub_cats = {
    mil: [
      "inland_visit_and_conferences",
      "inland_exercises",
      "pmf_conferences",
      "m2m_colaboration",
      "m2m_training",
      "m2m_talks",
      "m2m_conferences",
      "inland_drdo",
      "pak_corner",
      "indo_china",
      "other_mil",
      "m2m_visits",
      "indian_navy",
      "indian_coast_guard",
      "indian_airforce",
    ],
    intl: [
      "g2g",
      "regional",
      "indo_china",
      "indo_israel",
      "indo_neighbour",
      "indo_russia",
      "indo_us",
      "indo_afghan_iran",
      "other_intl",
    ],
    iiojk: [
      "iiojk",
      "religious_cultural",
      "education",
      "welfare_measures",
      "economy",
      "media_restrictions",
      "atrocities",
      "jihad_organization",
      "development_project",
      "indian_armedforces",
      "iijok_political_parties",
      "visits_jk",
      "others_iiojk",
      "disappearances",
      "infiltration_militancy",
      "curfews_lockdowns",
      "protests",
      "pok",
      "foreign_reactions",
      "atinCombined",
      "odjCombined",
      "iivCombined",
    ],
    domestic: [
      // 'other',
      "naxal",
      "nemove",
      "ladakh",
      "loksabha",
      "polparties",
      "pm",
      "dm",
      "ea",
      "hm",
      "khalis",
      "other_domestic",
      "combineSepratists",
      "combineXhair",
      "developmental_projects",
    ],
    intenv: [
      "Tsm",
      "Protests",
      "Sm Activities",
      "Elections",
      "Conferences",
      "Other Activities",
    ],
  };

  sections_main = {
    mil: {
      m2m: ["m2m_colaboration", "m2m_training", "m2m_talks", "m2m_conferences"],
      inland: [
        "inland_visit_and_conferences",
        "inland_exercises",
        "pmf_conferences",
      ],
      indian_forces: ["indian_airforce", "indian_navy", "indian_coast_guard"],
      rnd: ["inland_drdo"],
      pak_corner: ["pak_corner"],
      indo_china: ["indo_china"],
      other_mil: ["other_mil"],
      m2m_visits: ["m2m_visits"],
      indian_navy: ["indian_navy"],
      indian_coast_guard: ["indian_coast_guard"],
      indian_airforce: ["indian_airforce"],
      all: this.sub_cats.mil,

      "INTL/M2M_temp": [
        "pak_corner",
        "indo_china",
        "m2m_training",
        "m2m_talks",
        "m2m_colaboration",
        "m2m_conferences",
      ],

      inland_activities_temp: [
        "inland_exercises",
        "inland_visit_and_conferences",
        "pmf_conferences",
        "indian_coast_guard",
        "indian_navy",
        "inland_drdo",
      ],
    },
    intl: {
      g2g: ["g2g"],
      bilateral: [
        "indo_china",
        "indo_israel",
        "indo_neighbour",
        "indo_russia",
        "indo_us",
      ],
      afghan_iran: ["indo_afghan_iran"],
      regional: ["regional"],
      other_intl: ["other_intl"],
      all: this.sub_cats.intl,

      bilateralTemp: [
        "indo_china",
        "indo_israel",
        "indo_neighbour",
        "indo_russia",
        "indo_us",
        "g2g",
      ],

      regional_en_temp: ["indo_afghan_iran", "regional"],
    },
    iiojk: {
      atrocities: ["atrocities"],
      proxies: [
        "development_project",
        "indian_armedforces",
        "disappearances",
        "jihad_organization",
        "infiltration_militancy",
        "curfews_lockdowns",
        "media_restrictions",
        "economy",
        "welfare_measures",
        "education",
        "religious_cultural",
        "protests",
        "pok",
        "iiojk",
        "foreign_reactions",
      ],
      iijok_political_parties: ["iijok_political_parties"],
      visits_jk: ["visits_jk"],
      other_iiojk: ["other_iiojk"],
      iivCombined: ["visits_jk", "iijok_political_parties"],
      odjCombined: ["other_iiojk", "development_project"],
      atinCombined: ["atrocities", "indian_armedforces"],
      all: this.sub_cats.iiojk,
    },
    domestic: {
      other_domestic: ["other_domestic", "developmental_projects"],
      separatists: ["khalis", "naxal", "nemove", "ladakh"],
      loksabha: ["loksabha"],
      polparties: ["polparties"],
      xhair: ["pm", "dm", "ea", "hm"],
      all: this.sub_cats.domestic,
    },
    // Chn3
    // intenv:{
    //   // IS:["tsm","protests","sm"],
    //   // political:["elections","conferences","other"],
    //   tsm:['Tsm'],
    //   protest:['Protests'],
    //   sm:['Sm Activities'],
    //   all:this.sub_cats.intenv
    // }
    intenv: {
      IS: ["Tsm", "Protests", "Sm Activities"],
      political: ["Elections", "Conferences", "Other Activities"],
      // tsm:['Tsm'],
      // protest:['Protests'],
      // sm:['Sm Activities'],
      all: this.sub_cats.intenv,
    },
  };

  sections_main_internal = {
    govt: {
      parliament: ["parliament"],
      governance: ["xhair", "policies_and_holidays"],
      judiciary: ["judiciary"],
      economy: ["economy"],
      // other_govt: ["other_govt"],
      all: this.sub_cats_t_internal.govt,

      parliment_and_gov_temp: ["parliament", "xhair", "policies_and_holidays"],

      judiary_eco_temp: ["judiciary", "economy", "other_govt"],
    },
    polparties: {
      events: ["protest", "byelections"],
      pol_leaders: ["pol_leaders"],
      other_polparties: ["other_polparties"],
      events_polleadership: ["byelections", "protest", "pol_leaders"],
      others: ["other_polparties"],
      all: this.sub_cats_t_internal.polparties,
    },
    is: {
      tsm: ["tsm"],
      disaster: ["disaster"],
      activist: ["activist"],
      ro_and_do: ["ro_and_do", "law_and_order"],
      other_is: ["other_is"],
      all: this.sub_cats_t_internal.is,
    },
    military: {
      m2m: ["m2m_training", "int_collaboration", "m2m_visit"],
      paf_and_pn: ["paf_and_pn"],
      milCombined: ["int_collaboration", "m2m_training", "m2m_visit"],
      all: this.sub_cats_t_internal.military,
    },
    diplomat: {
      g2g: ["g2g"],
      bilateral: ["neighbours", "regional"],
      international: ["international"],
      other_diplomat: ["other_diplomat"],
      gnrCombine: ["g2g", "neighbours", "regional", "international"],
      all: this.sub_cats_t_internal.diplomat,
    },
    xhair: {
      TTP: ["TTP"],
      K2N: ["K2N"],
      ISIS: ["ISIS"],
      XBORDER: ["XBORDER ACTIVITIES"],
      all: this.sub_cats_t_internal.xhair,
    },
  };

  // To get all the arrays names and there properties to be combined;
  section_combined = {
    east_corner: {
      mil: {
        "INTL/M2M_temp": [
          "pak_corner",
          "indo_china",
          "m2m_training",
          "m2m_talks",
          "m2m_colaboration",
          "m2m_conferences",
          "m2m_visits",
          "indian_navy",
          "indian_coast_guard",
          "indian_airforce",
        ],

        inland_activities_temp: [
          "inland_exercises",
          "inland_visit_and_conferences",
          "pmf_conferences",
          "indian_coast_guard",
          "indian_navy",
          "inland_drdo",
        ],
      },

      intl: {
        bilateralTemp: [
          "indo_china",
          "indo_israel",
          "indo_neighbour",
          "indo_russia",
          "indo_us",
          "g2g",
        ],

        regional_en_temp: ["indo_afghan_iran", "regional"],
      },
      iiojk: {
        atinCombined: ["atrocities", "indian_armedforces"],
        odjCombined: ["development_project"],
        iivCombined: ["visits_jk", "iijok_political_parties"],
      },
    },

    internal_security: {
      govt: {
        parliment_and_gov_temp: [
          "parliament",
          "xhair",
          "policies_and_holidays",
        ],

        judiary_eco_temp: [
          "judiciary",
          "economy",
          "other_govt",
          "Other Internal Affairs in Pakistan",
        ],
      },
      polparties: {
        events_polleadership: ["byelections", "protest", "pol_leaders"],
        // others: ["other_polparties"],
      },
      military: {
        milCombined: ["int_collaboration", "m2m_training", "m2m_visit"],
      },
      diplomat: {
        gnrCombine: ["g2g", "neighbours", "regional", "international"],
      },
      // diplomat:{

      // }
    },

    west_corner: {
      afghanistan: {
        internalEnvmt: {
          society_culture_welfare: ["society_culture_welfare"],
          governance_politics_law: ["governance_politics_law"],
          infrastructure_env_domestic: ["infrastructure_env_domestic"],

          // is_political_temp: ["Tsm", "Protests", "Elections", "Conferences"],
          is_political_temp: [
            "governance_politics_law",
            "society_culture_welfare",
            "infrastructure_env_domestic",
          ],
        },

        diplomacy: {
          bilateral_multilateral: ["bilateral_multilateral"],
          intl_institutional_civil: ["intl_institutional_civil"],
          economic_diaspora_external: ["economic_diaspora_external"],
          multi_bi_g2g_m2m_b2b_i2i_temp: [
            // "Afg-China",
            // "Afg-Iran",
            // "Afg-India",
            // "Regional_Engagement",
            // "International_Engagement",
            // "G2G",
            // "B2B",
            // "I2I",
            // "M2M",
            "bilateral_multilateral",
            "intl_institutional_civil",
            "economic_diaspora_external",
          ],
        },

        xHair: {
          isis_k2n_ttp_temp: ["terrorism_insurgency_ct"],
          xborder_temp: ["terrorism_insurgency_ct"],
        },

        pkCorner: {
          pkCorner_temp: ["Pakistan Corner"],
          inCorner_temp: ["India Corner"],
        },
        afgMil: {
          afgMil: ["defense_mil_capacity"],
        },
        inCorner: {
          inCorner_temp: ["India Corner"],
        },
      },

      iran: {
        internalEnvmt: {
          is_political_temp: ["Tsm", "Protests", "Elections", "Conferences"],
        },

        diplomacy: {
          multi_bi_g2g_m2m_b2b_i2i_temp: [
            "iran_usa",
            "iran_russia",
            "iran_israel",
            "Regional_Engagement",
            "International_Engagement",
            "G2G",
            "B2B",
            "I2I",
            "M2M",

            "Diplomatic",
            "Government",
            "Finance",
            "Military",
            "Industry",
            "Judicial",
            "Other News",
          ],
        },

        xHair: {
          isis_k2n_ttp_temp: ["jua", "isis", "sb", "No2"],
          xborder_temp: ["xborder"],
        },

        pkCorner: {
          pkCorner_temp: [
            "Diplomatic",
            "Government",
            "Finance",
            "Military",
            "Industry",
            "Judicial",
            "Other News",
            "No2",
          ],
          inCorner_temp: ["India Corner"],
        },

        inCorner: {
          inCorner_temp: ["India Corner"],
        },
      },
    },
  };

  theme = {
    // $$$$$$$$$$$$$$$$ For the internal security;
    govt: {
      background: "linear-gradient(180deg, #06b5eebd 0%, #044dcabf 100%)",
      titleBar: "url(../../../../../assets/images/intl_titleBar.svg)",
      buttonBg: "linear-gradient(180deg, #2451ca 0%, #3476dc 100%)",
    },

    polparties: {
      background: "linear-gradient(-45deg, #d58800, #fe6029)",
      titleBar: "url(../../../../../assets/images/domestic_titleBar.svg)",
      buttonBg: "linear-gradient(180deg, #ed741e 5.86%, #fd7a29 51.07%)",
    },
    is: {
      background: "linear-gradient(-45deg, #d58800, #fe6029)",
      titleBar: "url(../../../../../assets/images/domestic_titleBar.svg)",
      buttonBg: "linear-gradient(-222deg, #282236, #6d5f8f) ",
    },

    military: {
      background: "linear-gradient(45deg, #003319, #045d08e6)",
      titleBar: "url(../../../../../assets/images/IS_mil_titleBar.svg)",
      buttonBg: "linear-gradient(231deg, #0f8949 5.86%, #005a16 51.07%)",
    },
    diplomat: {
      // background: " linear-gradient(45deg, #5201439c, #9b218287)",
      background: " linear-gradient(45deg, #0c5056, #061728c2)",
      titleBar: "url(../../../../../assets/images/iiojk_titleBar.svg)",
      buttonBg: "linear-gradient(180deg, #ef8d1e 5.86%, #fe7d2a 51.07%)",
    },

    // ########################## For the east side;
    iiojk: {
      background: " linear-gradient(45deg, #0c5056, #061728c2)",
      titleBar: "url(../../../../../assets/images/iiojk_titleBar.svg)",
      buttonBg: "linear-gradient(23deg, #066a73 5.86%, #081f39 51.07%)",
    },

    mil: {
      background: "linear-gradient(-45deg, #4400519c, #d82532c9)",
      titleBar: "url(../../../../../assets/images/mil_titleBar.svg)",
      buttonBg: "linear-gradient(54deg, #3b0051, #de282f)",
    },

    intl: {
      background: "linear-gradient(180deg, #06b5eebd 0%, #044dcabf 100%)",
      titleBar: "url(../../../../../assets/images/intl_titleBar.svg)",
      buttonBg: "linear-gradient(180deg, #218ecb 0%, #1d71be 101%)",
    },

    domestic: {
      background: "linear-gradient(180deg, #06b5eebd 0%, #044dcabf 100%)",
      titleBar: "url(../../../../../assets/images/intl_titleBar.svg)",
      buttonBg: "linear-gradient(180deg, #ef8d1e 5.86%, #fe7d2a 51.07%)",
    },
    // For the west #################################

    west_corner: {
      internalEnvmt: {
        background: "linear-gradient(-45deg, #4400519c, #d82532c9)",
        titleBar: "url(../../../../../assets/images/mil_titleBar.svg)",
        buttonBg: "linear-gradient(54deg, #3b0051, #de282f)",
      },

      diplomacy: {
        background: "linear-gradient(180deg, #06b5eebd 0%, #044dcabf 100%)",
        titleBar: "url(../../../../../assets/images/intl_titleBar.svg)",
        buttonBg: "linear-gradient(180deg, #2451ca 0%, #3476dc 100%)",
      },

      xHair: {
        background: " linear-gradient(45deg, #0c5056, #061728c2)",
        titleBar: "url(../../../../../assets/images/iiojk_titleBar.svg)",
        buttonBg: "linear-gradient(23deg, #066a73 5.86%, #081f39 51.07%)",
      },

      pkCorner: {
        background: "linear-gradient(45deg, #003319, #045d08e6)",
        titleBar: "url(../../../../../assets/images/IS_mil_titleBar.svg)",
        buttonBg: "linear-gradient(231deg, #0f8949 5.86%, #005a16 51.07%)",
      },

      inCorner: {
        background: "linear-gradient(90deg, #EE451E, #fd7c29e0)",
        titleBar: "url(../../../../../assets/images/domestic_titleBar.svg)",
        buttonBg: "linear-gradient(90deg, #EE451E, #fd7c29e0)",
      },
    },
  };

  // To get all the cats .... for the api request ...
  sub_cats_t_west = {
    afghanistan: {
      internalEnvmt: [
        "governance_politics_law",
        "society_culture_welfare",
        "infrastructure_env_domestic",
      ],
      diplomacy: [
        // "Afg-China",
        // "Afg-Iran",
        // "Afg-India",
        // "Regional_Engagement",
        // "International_Engagement",
        // "G2G",
        // "B2B",
        // "I2I",
        // "M2M",
        // "Other Activities",
        "bilateral_multilateral",
        "intl_institutional_civil",
        "economic_diaspora_external",
      ],

      xHair: ["terrorism_insurgency_ct"],

      pkCorner: ["Pakistan Corner"],
      afgMil: ["defense_mil_capacity"],
      inCorner: ["India Corner"],
    },

    iran: {
      internalEnvmt: [
        "Tsm",
        "Protests",
        "Elections",
        "Conferences",
        "other_activities",
        "No2",
      ],
      diplomacy: [
        "iran_usa",
        "iran_russia",
        "iran_israel",
        "Regional_Engagement",
        "International_Engagement",
        "G2G",
        "B2B",
        "I2I",
        "M2M",
        "Other Activities",
        // "Other News",
        "Diplomatic",
        "Government",
        "Finance",
        "Military",
        "Industry",
        "Judicial",
        "Other News",
      ],

      xHair: ["jua", "isis", "sb", "xborder", "No2"],

      pkCorner: [
        "Diplomatic",
        "Government",
        "Finance",
        "Military",
        "Industry",
        "Judicial",
        "Other News",
        "No2",
      ],
      afgMil: ["defense_mil_capacity"],

      inCorner: ["India Corner"],
    },
  };

  sub_cats_t_west_twitter = {
    afghanistan: {
      internalEnvmt: ["Tsm", "Protests", "Elections", "Conferences"],
      diplomacy: [
        "Afg-China",
        "Afg-Iran",
        "Afg-India",
        "Regional_Engagement",
        "International_Engagement",
        "G2G",
        "B2B",
        "I2I",
        "M2M",
      ],

      xHair: ["ttp", "isis", "k2n", "xborder"],

      pkCorner: ["Pakistan Corner"],
      inCorner: ["India Corner"],
    },

    iran: {
      internalEnvmt: ["Tsm", "Protests", "Elections", "Conferences"],
      diplomacy: [
        "iran_usa",
        "iran_russia",
        "iran_israel",
        "Regional_Engagement",
        "International_Engagement",
        "G2G",
        "B2B",
        "I2I",
        "M2M",
      ],

      xHair: ["jua", "isis", "sb", "xborder", "No2"],

      pkCorner: ["Pakistan Corner"],
      inCorner: ["India Corner"],
    },
  };

  section_west_internal_twitter = {
    afghanistan: {
      internalEnvmt: {
        is_political_temp: ["Tsm", "Protests", "Elections", "Conferences"],
        all: this.sub_cats_t_west_twitter.afghanistan.internalEnvmt,
      },

      diplomacy: {
        multi_bi_g2g_m2m_b2b_i2i_temp: [
          "Afg-China",
          "Afg-Iran",
          "Afg-India",
          "Regional_Engagement",
          "International_Engagement",
          "G2G",
          "B2B",
          "I2I",
          "M2M",
        ],

        all: this.sub_cats_t_west.afghanistan.diplomacy,
      },

      xHair: {
        isis_k2n_ttp_temp: ["ttp", "isis", "k2n"],
        xborder_temp: ["xborder"],
        all: this.sub_cats_t_west.afghanistan.xHair,
      },

      pkCorner: {
        pkCorner_temp: ["Pakistan Corner"],
        all: this.sub_cats_t_west.afghanistan.pkCorner,
      },

      inCorner: {
        inCorner_temp: ["India Corner"],
        all: this.sub_cats_t_west.afghanistan.inCorner,
      },
    },

    iran: {
      internalEnvmt: {
        is_political_temp: ["Tsm", "Protests", "Elections", "Conferences"],
        all: this.sub_cats_t_west.iran.internalEnvmt,
      },

      diplomacy: {
        multi_bi_g2g_m2m_b2b_i2i_temp: [
          "iran_usa",
          "iran_russia",
          "iran_israel",
          "Regional_Engagement",
          "International_Engagement",
          "G2G",
          "B2B",
          "I2I",
          "M2M",
        ],

        all: this.sub_cats_t_west.iran.diplomacy,
      },

      xHair: {
        isis_k2n_ttp_temp: ["jua", "isis", "sb"],
        xborder_temp: ["xborder"],
        all: this.sub_cats_t_west.iran.xHair,
      },

      pkCorner: {
        pkCorner_temp: ["Pakistan Corner"],
        all: this.sub_cats_t_west.iran.pkCorner,
      },

      inCorner: {
        inCorner_temp: ["India Corner"],
        all: this.sub_cats_t_west.iran.inCorner,
      },
    },
  };
  section_west_internal = {
    afghanistan: {
      internalEnvmt: {
        is_political_temp: [
          "governance_politics_law",
          "society_culture_welfare",
          "infrastructure_env_domestic",
        ],
        governance_politics_law: ["governance_politics_law"],
        society_culture_welfare: ["society_culture_welfare"],
        infrastructure_env_domestic: ["infrastructure_env_domestic"],

        all: this.sub_cats_t_west.afghanistan.internalEnvmt,
      },

      diplomacy: {
        bilateral_multilateral: ["bilateral_multilateral"],
        intl_institutional_civil: ["intl_institutional_civil"],
        economic_diaspora_external: ["economic_diaspora_external"],
        multi_bi_g2g_m2m_b2b_i2i_temp: [
          // "Afg-China",
          // "Afg-Iran",
          // "Afg-India",
          // "Regional_Engagement",
          // "International_Engagement",
          // "G2G",
          // "B2B",
          // "I2I",
          // "M2M",
          "bilateral_multilateral",
          "intl_institutional_civil",
          "economic_diaspora_external",
        ],

        all: this.sub_cats_t_west.afghanistan.diplomacy,
      },

      xHair: {
        isis_k2n_ttp_temp: ["terrorism_insurgency_ct"],
        xborder_temp: ["terrorism_insurgency_ct"],
        all: this.sub_cats_t_west.afghanistan.xHair,
      },

      pkCorner: {
        pkCorner_temp: ["Pakistan Corner"],
        all: this.sub_cats_t_west.afghanistan.pkCorner,
      },

      afgMil: {
        pkCorner_temp: ["defense_mil_capacity"],
        all: this.sub_cats_t_west.afghanistan.afgMil,
      },

      inCorner: {
        inCorner_temp: ["India Corner"],
        all: this.sub_cats_t_west.afghanistan.inCorner,
      },
    },

    iran: {
      internalEnvmt: {
        is_political_temp: ["Tsm", "Protests", "Elections", "Conferences"],
        all: this.sub_cats_t_west.iran.internalEnvmt,
      },

      diplomacy: {
        multi_bi_g2g_m2m_b2b_i2i_temp: [
          "iran_usa",
          "iran_russia",
          "iran_israel",
          "Regional_Engagement",
          "International_Engagement",
          "G2G",
          "B2B",
          "I2I",
          "M2M",
          "Diplomatic",
          "Government",
          "Finance",
          "Military",
          "Industry",
          "Judicial",
          "Other News",
        ],

        all: this.sub_cats_t_west.iran.diplomacy,
      },

      xHair: {
        isis_k2n_ttp_temp: ["jua", "isis", "sb", "No2"],
        xborder_temp: ["xborder"],
        all: this.sub_cats_t_west.iran.xHair,
      },

      pkCorner: {
        pkCorner_temp: [
          "Diplomatic",
          "Government",
          "Finance",
          "Military",
          "Industry",
          "Judicial",
          "Other News",
          "No2",
        ],
        all: this.sub_cats_t_west.iran.pkCorner,
      },

      inCorner: {
        inCorner_temp: ["India Corner"],
        all: this.sub_cats_t_west.iran.inCorner,
      },
    },
  };

  getImageUrlOrFallback(
    imageUrl: string,
    minWidth: number,
    minHeight: number,
    fallbackUrl: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth >= minWidth && img.naturalHeight >= minHeight) {
          resolve(imageUrl);
        } else {
          resolve(fallbackUrl);
        }
      };
      img.onerror = () => {
        resolve(fallbackUrl); // Fallback if image fails to load
      };
      img.src = imageUrl;
    });
  }
  getCatName(name, isAfg = false): string {
    if (isAfg) {
      if (name === "pkCorner_temp") {
        return "Mil / LEA";
      }
      if (name === "isis_k2n_ttp_temp") {
        return "Tsm, Insurg & CT";
      }
    }

    switch (name) {
      case "pkCorner_temp":
        return "Pakistan & India Corner";
      case "inCorner_temp":
        return "India Corner";
      case "INTL/M2M_temp":
        return "INTL/M2M";
      case "inland_activities_temp":
        return "Inland Activities";
      case "bilateralTemp":
        return "Bilateral & Multilateral Corner";
      case "regional_en_temp":
        return "Other Regional Engagements";
      case "parliment_and_gov_temp":
        return "Parliament & Government";
      case "judiary_eco_temp":
        return "Judiciary, Economics & Finance";
      case "events_polleadership":
        return "Pol Leadership, Protests, Rallies & Elections";
      case "milCombined":
        return "Tri SVCs";
      case "gnrCombine":
        return "INTL, Bilateral & Multilateral";
      case "iivCombined":
        return "ATROCITIES OF INDIAN AF (HRVS,CASOS & APPREHENSIONS)";
      case "odjCombined":
        return "POL ANGLE (LOCAL POL PARTIES/RALLIES ETC)";
      case "atinCombined":
        return "ATROCITIES OF INDIAN AF (HRVS,CASOS & APPREHENSIONS)";
      case "is_political_temp":
        return "Tsm, Pol, Elections & Conferences";
      case "multi_bi_g2g_m2m_b2b_i2i_temp":
        return "Intl, Bilateral & Multilateral";
      case "isis_k2n_ttp_temp":
        return "K2N, ISIS, TTP, & Other Tts Org";
      case "xborder_temp":
        return "X-Border Activities";
      case "society_culture_welfare":
        return "Society,Culture and Welfare";
      case "infrastructure_env_domestic":
        return "Infrastructure,Env and Domestic";
      case "governance_politics_law":
        return "Governance,Politics and Law";
      case "bilateral_multilateral":
        return "intl, bilateral and multilateral";
      case "intl_institutional_civil":
        return "Intl Institutional";
      case "economic_diaspora_external":
        return "Eco, Diaspora and others";
      default:
        return "No Category Name Provided";
    }
  }

  getSubCats(
    cat,
    section,
    corner = "east_corner",
    country = "",
    isTweet = false,
  ) {
    if (corner == "east_corner") {
      return this.sections_main[cat][section];
    } else if (corner == "internal_security") {
      return this.sections_main_internal[cat][section];
    } else {
      if (country === "afghanistan" && isTweet) {
        return this.section_west_internal_twitter[country][cat][section];
      }
      console.log(country, cat, section);
      return this.section_west_internal[country][cat][section];
    }
  }
  getSubCats_internal(cat, section) {
    return this.sections_main_internal[cat][section];
  }
  getCats(origin) {
    if (origin == "east_corner") {
      return Object.keys(this.cat_info);
    }
    if (origin == "internal_security") {
      let arr: any = Object.keys(this.cat_info_internal);
      arr = arr.join(",").replace("diplomat", "anti_state");
      return arr.split(",");
    }

    if (origin == "west_corner" || origin === "west_corner_iran") {
      return Object.keys(this.cat_info_west_corner_temp);
    }
    if (origin == "all") {
      let arr: any = Object.keys({
        ...this.cat_info,
        ...this.cat_info_internal,
      });
      arr = arr.join(",").replace("diplomat", "anti_state");
      return arr.split(",");
    }
  }
  resolveCatName(cat) {
    console.log("resolve cat name cat ", cat);
    cat = cat == "anti_state" ? "diplomat" : cat;
    let cate = {
      ...this.cat_info,
      ...this.cat_info_internal,
      ...this.cat_info_west_corner_temp,
    }[cat];
    return cate == "Diplomat"
      ? "Anti State"
      : cate == "Govt"
        ? cate + " & Diplo"
        : cate;
  }

  formatDate(date, json = false) {
    if (!date) return "N/A";
    try {
      date = date.replace("+0000", "");
      date = date.replace("z", "");
      date = date.replace("Z", "");
      let d = new Date(date);
      let t_ = d.toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
      });
      // let d_ = d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' })
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const dayOfWeek = days[d.getDay()];
      const dayOfMonth = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();

      const formattedDate = !json
        ? `${dayOfWeek}, ${dayOfMonth} ${month}, ${year}`
        : `${dayOfMonth} ${month}, ${year}`;
      let value: any = json
        ? {
            time: t_,
            date: formattedDate,
          }
        : formattedDate + " " + t_;

      return value;
    } catch (error) {
      return "N/A";
    }
  }
  // getNewsSummary(news) {
  //   return this.http.post(
  //     this.ip + "getSummary",
  //     news
  //   );
  // }

  getReportHistory() {
    return this.http.get(this.ip + "fetch_report_history");
  }
  getCustomYoutubeSummary(videoId) {
    console.log(this.ip + `get_custom_summary/${videoId}`);
    return this.http.get(this.ip + `get_custom_summary/${videoId}`);
  }

  getScrapperStatus() {
    return this.http.get(this.ip + "get_all_scrapper_status");
  }
  toggleUserStatus(userId, status) {
    return this.http.get(
      this.ip + "update_status" + "/" + userId + "/" + status,
    );
  }
  changePassword(userId: string, newPassword: string): Observable<any> {
    const url = this.ip + "change_password";

    const body = {
      user_id: userId,
      new_password: newPassword,
    };

    return this.http.post(url, body);
  }
  updateOTPStatus(userId, status) {
    return this.http.get(
      this.ip + "otp_status_update" + "/" + userId + "/" + status,
    );
  }
}
