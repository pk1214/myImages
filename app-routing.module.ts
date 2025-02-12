import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ArtistDashboardComponent } from './components/artist-dashboard/artist-dashboard.component';
import { ArtistGuard } from './guards/artist.guard';
import { UserGuard } from './guards/user.guard';
import { LandingComponent } from './components/landing/landing.component';
import { ArtistProfileComponent } from './components/artist-profile/artist-profile.component';
import { UploadArtworkComponent } from './components/upload-artwork/upload-artwork.component';
import { ViewDetailsComponent } from './components/view-details/view-details.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';
import { CustomWorkComponent } from './components/custom-work/custom-work.component';
import { ArtistCustomWorkComponent } from './components/artist-custom-work/artist-custom-work.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'user/home', component: HomeComponent, canActivate: [UserGuard] },
  {
    path: 'artist/dashboard',
    component: ArtistDashboardComponent,
    canActivate: [ArtistGuard],
  },
  {
    path: 'artist/profile',
    component: ArtistProfileComponent,
    canActivate: [ArtistGuard],
  },
  {
    path: 'artist/upload',
    component: UploadArtworkComponent,
    canActivate: [ArtistGuard],
  },
  {
    path: 'user/viewdetails/:id',
    component: ViewDetailsComponent,
    canActivate: [UserGuard],
  },
  // Commission route for artists (commission component)
  {
    path: 'artist/commissions',
    component: ArtistCustomWorkComponent,
    canActivate: [ArtistGuard],
  },
  {
    path: 'user/favorites',
    component: FavouritesComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'user/checkout/:id',
    component: CheckoutComponent,
    canActivate: [UserGuard],
  },
  // Custom work route for users. Optionally, you can add an :id parameter if needed.
  {
    path: 'user/custom-work',
    component: CustomWorkComponent,
    canActivate: [UserGuard],
  },

  {
    path: 'user/purchase-history',
    component: PurchaseHistoryComponent,
    canActivate: [UserGuard],
  },
  { path: 'user/login', component: LoginComponent },
  { path: 'artist/login', component: LoginComponent },
  { path: 'user/signup', component: SignupComponent },
  { path: 'artist/signup', component: SignupComponent },
  { path: '**', component: LandingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
