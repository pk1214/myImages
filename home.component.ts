import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArtService } from '../../services/art.service';
import { Artwork } from '../../services/art.service'; // Use your interface

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  artworks: Artwork[] = [];
  featuredArtworks: Artwork[] = [];
  filteredArts: Artwork[] = []; 
  selectedCategory: string = ''; 
  selectedMedium: string = ''; 
  minPrice: number = 0; 
  maxPrice: number = Infinity; 

  constructor(private router: Router, private artService: ArtService) {}

  ngOnInit(): void {
    this.getAllArtworks();
  }

  getAllArtworks(): void {
    this.artService.getArtworks().subscribe(
      (data: Artwork[]) => {
        this.artworks = data;
        console.log("From home ", this.artworks)
        // Extract promoted artworks as featured
        this.featuredArtworks = this.artworks.filter(art => art.isPromoted);
        console.log('Featured artworks:', this.featuredArtworks);
        this.filteredArts = this.artworks;
        console.log('Artworks fetched:', this.artworks);
      },
      (error) => {
        console.error('Error fetching artworks', error);
      }
    );
  }

  onFilterChange(): void {
    this.filteredArts = this.artworks.filter((art) => {
      const categoryMatch = this.selectedCategory ? art.style === this.selectedCategory : true;
      const artistMatch = this.selectedMedium ? art.medium === this.selectedMedium : true;
      const priceMatch = art.price >= this.minPrice && art.price <= this.maxPrice;
      return categoryMatch && artistMatch && priceMatch;
    });
  }
}
