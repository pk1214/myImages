import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ArtService } from './services/art.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { LandingComponent } from './components/landing/landing.component';
import { ArtistDashboardComponent } from './components/artist-dashboard/artist-dashboard.component';
import { ArtistProfileComponent } from './components/artist-profile/artist-profile.component';
import { UploadArtworkComponent } from './components/upload-artwork/upload-artwork.component';
import { ViewDetailsComponent } from './components/view-details/view-details.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { CustomWorkComponent } from './components/custom-work/custom-work.component';
import { ArtistCustomWorkComponent } from './components/artist-custom-work/artist-custom-work.component';
import { FooterComponent } from './components/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SignupComponent,
    LoginComponent,
    LandingComponent,
    ArtistDashboardComponent,
    ArtistProfileComponent,
    UploadArtworkComponent,
    ViewDetailsComponent,
    FavouritesComponent,
    CheckoutComponent,
    PurchaseHistoryComponent,
    PromotionsComponent,
    CustomWorkComponent,
    ArtistCustomWorkComponent,
    FooterComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [ArtService],
  bootstrap: [AppComponent],
})
export class AppModule {}
