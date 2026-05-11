import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewsListingComponent } from "./news-listing/news-listing.component";
import { ExploreComponent } from "./explore/explore.component";
import { NewsDetailsComponent } from "./news-details/news-details.component";
import { TweetDetailsComponent } from "./tweet-details/tweet-details.component";
import { TagDetailsComponent } from "./tag-details/tag-details.component";
import { NewsHistoryComponent } from "./news-history/news-history.component";
import { YoutubeDetailsComponent } from "./youtube-details/youtube-details.component";
import { EditorialDetailsComponent } from "./editorial-details/editorial-details.component";
import { MilitaryComponent } from "./news-catagory/military/military.component";
import { IoKashmirComponent } from "./news-catagory/io-kashmir/io-kashmir.component";
import { InternationalComponent } from "./news-catagory/international/international.component";
import { DomesticComponent } from "./news-catagory/domestic/domestic.component";
import { GenSearchComponent } from "./gen-search/gen-search.component";
import { MilComponent } from "./internal_security/mil/mil.component";
import { PolComponent } from "./internal_security/pol/pol.component";
import { DiploComponent } from "./internal_security/diplo/diplo.component";
import { GovtComponent } from "./internal_security/govt/govt.component";
import { IsctComponent } from "./internal_security/isct/isct.component";
import { SourceDetailsComponent } from "./source-details/source-details.component";
import { AuthorDetailsComponent } from "./author-details/author-details.component";
import { GovernmentAfgComponent } from "./west_corner/afghanistan/government/government.component";
import { DiplomacyAfgComponent } from "./west_corner/afghanistan/diplomacy/diplomacy.component";
import { IsctAfgComponent } from "./west_corner/afghanistan/isct/isct.component";
import { DomesticAfgComponent } from "./west_corner/afghanistan/domestic/indiacorner.component";
import { GovernmentIrComponent } from "./west_corner/iran/government/government.component";
import { DiplomacyIrComponent } from "./west_corner/iran/diplomacy/diplomacy.component";
import { IsctIrComponent } from "./west_corner/iran/isct/isct.component";
import { DomesticIrComponent } from "./west_corner/iran/domestic/domestic.component";
import { InternalenvComponent } from "./west_corner/afghanistan/internalenv/internalenv.component";
import { XhairComponent } from "./west_corner/afghanistan/xhair/xhair.component";
import { CommonRoute } from "./common-route/common-route.component";
import { IntlClone } from "./intlclone/intlclone.component";
import { MainpageComponent } from "./mainpage/mainpage.component";
import { PremiumSourcesComponent } from "./premium-sources/premium-sources.component";

const routes: Routes = [
  {
    path: "",
    // component: NewsListingComponent,
    component: MainpageComponent,
  },
  {
    path: "testPage",
    component: MainpageComponent,
  },

  {
    path: "premiumsources",
    component: PremiumSourcesComponent,
  },

  {
    path: "explore/:origin",
    component: ExploreComponent,
  },
  {
    path: "explore/:origin/:origin_country",
    component: ExploreComponent,
  },
  {
    path: "east_corner/mil",
    component: CommonRoute,
  },
  {
    path: "east_corner/mil2",
    component: CommonRoute,
  },
  {
    path: "east_corner/intl",
    // component: InternationalComponent,
    component: CommonRoute,
  },

  {
    path: "east_corner/intl2",
    component: CommonRoute,
  },
  {
    path: "east_corner/iiojk",
    component: CommonRoute,
    // component: IoKashmirComponent,
  },
  {
    path: "east_corner/domestic",
    component: DomesticComponent,
  },
  //internal Security
  {
    path: "internal_security/mil",
    component: CommonRoute,
    // component: MilComponent,
  },
  {
    path: "internal_security/pol",
    component: CommonRoute,
    // component:PolComponent
  },
  {
    path: "internal_security/diplo",
    component: CommonRoute,
    // component: DiploComponent,
  },
  {
    path: "internal_security/govt",
    // component: GovtComponent,
    component: CommonRoute,
  },

  {
    path: "internal_security/govt2",
    component: CommonRoute,
  },

  {
    path: "internal_security/isct",
    component: IsctComponent,
  },
  //west corner - afghanistan
  // Commented By Dawood
  // {
  //   path: 'west_corner/afghanistan/government',
  //   component: GovernmentAfgComponent,
  // },
  // {
  //   path: 'west_corner/afghanistan/diplomacy',
  //   component: DiplomacyAfgComponent,
  // },
  // {
  //   path: 'west_corner/afghanistan/isct',
  //   component: IsctAfgComponent,
  // },
  // {
  //   path: 'west_corner/afghanistan/domestic',
  //   component: DomesticAfgComponent,
  // },
  // Paths created for the west
  {
    path: "west_corner/afghanistan/internalEnvmt",
    // component: InternalenvComponent,
    component: CommonRoute,
  },
  {
    path: "west_corner/afghanistan/diplomacy",
    // component: GovernmentAfgComponent,
    component: CommonRoute,
  },
  {
    path: "west_corner/afghanistan/pkCorner",
    // component: IsctAfgComponent,
    component: CommonRoute,
  },
  {
    path: "west_corner/afghanistan/inCorner",
    // component: DomesticAfgComponent,
    component: CommonRoute,
  },

  {
    path: "west_corner/afghanistan/xHair",
    // component: XhairComponent,
    component: CommonRoute,
  },
  //west corner - iran
  {
    path: "west_corner/iran/internalEnvmt",
    // component: InternalenvComponent,
    component: CommonRoute,
  },
  {
    path: "west_corner/iran/diplomacy",
    // component: GovernmentAfgComponent,
    component: CommonRoute,
  },
  {
    path: "west_corner/iran/pkCorner",
    // component: IsctAfgComponent,
    component: CommonRoute,
  },
  {
    path: "west_corner/iran/inCorner",
    component: CommonRoute,

    // component: DomesticAfgComponent,
  },
  {
    path: "west_corner/iran/inCorner",
    // component: DomesticAfgComponent,
    component: CommonRoute,
  },
  {
    path: "west_corner/iran/xHair",
    // component: XhairComponent,
    component: CommonRoute,
  },
  //general routes
  {
    path: "news-details/:origin/:id",
    component: NewsDetailsComponent,
  },
  {
    path: "tweet-details/:origin/:id",
    component: TweetDetailsComponent,
  },
  {
    path: "youtube-details/:origin/:id",
    component: YoutubeDetailsComponent,
  },
  {
    path: "editorial-details/:origin/:id",
    component: EditorialDetailsComponent,
  },
  {
    path: "tag-details/:origin/:tag",
    component: TagDetailsComponent,
  },
  {
    path: "news-history/:origin/:id",
    component: NewsHistoryComponent,
  },
  {
    path: "gen-search/:origin",
    component: GenSearchComponent,
  },
  {
    path: "editorial-source/:origin/:type/:text",
    component: SourceDetailsComponent,
  },
  {
    path: "editorial-author/:origin/:type/:text",
    component: AuthorDetailsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
