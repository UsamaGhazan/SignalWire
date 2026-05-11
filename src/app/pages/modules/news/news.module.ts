import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NewsRoutingModule } from "./news-routing.module";
import { NewsListingComponent } from "./news-listing/news-listing.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "src/shared/shared.module";
import { ExploreComponent } from "./explore/explore.component";
import { SpinnerModule } from "../spinner/spinner.module";
import { FormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NewsDetailsComponent } from "./news-details/news-details.component";
import { TweetDetailsComponent } from "./tweet-details/tweet-details.component";
import { TagDetailsComponent } from "./tag-details/tag-details.component";
import { NewsHistoryComponent } from "./news-history/news-history.component";
import { YoutubeDetailsComponent } from "./youtube-details/youtube-details.component";
import { EditorialDetailsComponent } from "./editorial-details/editorial-details.component";
import { InternationalComponent } from "./news-catagory/international/international.component";
import { MilitaryComponent } from "./news-catagory/military/military.component";
import { IoKashmirComponent } from "./news-catagory/io-kashmir/io-kashmir.component";
import { DomesticComponent } from "./news-catagory/domestic/domestic.component";
import { MmCardComponent } from "./mm-card/mm-card.component";
import { NewsFilterComponent } from "./news-filter/news-filter.component";
import { TwitterCardComponent } from "./twitter-card/twitter-card.component";
import { GenSearchComponent } from "./gen-search/gen-search.component";
import { NewsMapComponent } from "./news-map/news-map.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ExploreHeadderComponent } from "./explore-headder/explore-headder.component";
import { MilComponent } from "./internal_security/mil/mil.component";
import { GovtComponent } from "./internal_security/govt/govt.component";
import { PolComponent } from "./internal_security/pol/pol.component";
import { IsctComponent } from "./internal_security/isct/isct.component";
import { DiploComponent } from "./internal_security/diplo/diplo.component";
import { InternalSecurityComponent } from "./explore/internal-security/internal-security.component";
import { EastCornerComponent } from "./explore/east-corner/east-corner.component";
import { WestCornerComponent } from "./explore/west-corner/west-corner.component";
import { SourceDetailsComponent } from "./source-details/source-details.component";
import { EditorialModalComponent } from "./editorial-modal/editorial-modal.component";
import { AuthorDetailsComponent } from "./author-details/author-details.component";
import { AfghanistanComponent } from "./explore/west-corner/afghanistan/afghanistan.component";
import { IranComponent } from "./explore/west-corner/iran/iran.component";
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
import { CustomyoutubesummarymodalComponent } from "src/app/customyoutubesummarymodal/customyoutubesummarymodal.component";
// import { ReportComponent } from '../../report/report.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    NewsListingComponent,
    ExploreComponent,
    NewsDetailsComponent,
    TweetDetailsComponent,
    TagDetailsComponent,
    NewsHistoryComponent,
    YoutubeDetailsComponent,
    EditorialDetailsComponent,
    InternationalComponent,
    MilitaryComponent,
    IoKashmirComponent,
    DomesticComponent,
    MmCardComponent,
    NewsFilterComponent,
    TwitterCardComponent,
    GenSearchComponent,
    NewsMapComponent,
    ExploreHeadderComponent,
    MilComponent,
    GovtComponent,
    PolComponent,
    IsctComponent,
    DiploComponent,
    InternalSecurityComponent,
    EastCornerComponent,
    WestCornerComponent,
    SourceDetailsComponent,
    EditorialModalComponent,
    AuthorDetailsComponent,
    AfghanistanComponent,
    IranComponent,
    GovernmentAfgComponent,
    DiplomacyAfgComponent,
    IsctAfgComponent,
    DomesticAfgComponent,
    GovernmentIrComponent,
    DiplomacyIrComponent,
    IsctIrComponent,
    DomesticIrComponent,
    InternalenvComponent,
    XhairComponent,
    // ReportComponent
    CommonRoute,
    // IntlcloneComponent,
    IntlClone,
    MainpageComponent,
    PremiumSourcesComponent,
    CustomyoutubesummarymodalComponent
  ],
  imports: [
    CommonModule,
    NewsRoutingModule,
    NgbModule,
    SharedModule,
    SpinnerModule,
    FormsModule,
    CalendarModule,
    DragDropModule,
    InfiniteScrollModule,
  ],
})
export class NewsModule {}
