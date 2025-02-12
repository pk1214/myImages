import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArtistService, Artist } from '../../services/artist.service';
import { CommissionService } from '../../services/commissions.service';
import { Router } from '@angular/router';

export interface CommissionRequest {
  _id: string;
  title: string;
  description: string;
  status: string;
  price?: number;
  createdAt?: string; // Expect this from backend to sort new requests at the top
}

@Component({
  selector: 'app-custom-work',
  templateUrl: './custom-work.component.html',
  styleUrls: ['./custom-work.component.css'],
})
export class CustomWorkComponent implements OnInit {
  artists: Artist[] = [];
  selectedArtist: Artist | null = null;
  customWorkForm: FormGroup;
  userCommissionRequests: CommissionRequest[] = [];
  showCommissionRequests: boolean = false; // Toggle flag for showing commission requests

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private commissionService: CommissionService,
    private router: Router
  ) {
    this.customWorkForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchArtists();
    this.fetchUserCommissions();
  }

  fetchArtists(): void {
    this.artistService.getAllArtists().subscribe(
      (data: Artist[]) => {
        this.artists = data;
      },
      (error) => {
        console.error('Error fetching artists', error);
      }
    );
  }

  fetchUserCommissions(): void {
    this.commissionService.getCommissionRequestsForUser().subscribe(
      (data: CommissionRequest[]) => {
        // Sort the commission requests so that the newest requests (by createdAt) are on top.
        this.userCommissionRequests = data.sort((a, b) => {
          return (
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
          );
        });
      },
      (error) => {
        console.error('Error fetching user commissions', error);
      }
    );
  }

  selectArtist(artist: Artist): void {
    this.selectedArtist = artist;
  }

  submitRequest(): void {
    if (this.customWorkForm.invalid || !this.selectedArtist) {
      this.customWorkForm.markAllAsTouched();
      return;
    }
    const requestData = {
      artistId: this.selectedArtist._id, // Backend will map this to the "artist" field
      title: this.customWorkForm.value.title,
      description: this.customWorkForm.value.description,
    };
    this.commissionService.submitCommissionRequest(requestData).subscribe(
      (response) => {
        alert('Custom work request submitted successfully!');
        this.fetchUserCommissions(); // Refresh commission requests list
        this.customWorkForm.reset();
        this.selectedArtist = null;
      },
      (error) => {
        console.error('Error submitting request', error);
        alert('Failed to submit request.');
      }
    );
  }

  userDecision(request: CommissionRequest, decision: string): void {
    const newStatus =
      decision === 'accept' ? 'price accepted' : 'declined by user';
    this.commissionService
      .updateCommission(request._id, { status: newStatus })
      .subscribe(
        (response) => {
          if (decision === 'accept') {
            alert('Price accepted! Your request is now in progress.');
          } else {
            alert('Price rejected. The commission request has been declined.');
          }
          this.fetchUserCommissions(); // Refresh the list
        },
        (error) => {
          console.error('Error updating commission status', error);
          alert('Failed to update commission status.');
        }
      );
  }

  toggleCommissionRequests(): void {
    this.showCommissionRequests = !this.showCommissionRequests;
  }
}
