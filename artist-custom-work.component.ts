import { Component, OnInit } from '@angular/core';
import { CommissionService } from '../../services/commissions.service';
import { Router } from '@angular/router';

export interface CommissionRequest {
  _id: string;
  title: string;
  description: string;
  userName: string;
  status: string;
  price?: number;
  createdAt?: string; //this field is provided by the backend
}

@Component({
  selector: 'app-artist-custom-work',
  templateUrl: './artist-custom-work.component.html',
  styleUrls: ['./artist-custom-work.component.css'],
})
export class ArtistCustomWorkComponent implements OnInit {
  commissionRequests: CommissionRequest[] = [];

  constructor(
    private commissionService: CommissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCommissionRequests();
  }

  fetchCommissionRequests(): void {
    this.commissionService.getCommissionRequestsForArtist().subscribe(
      (data: CommissionRequest[]) => {
        // Sort descending by createdAt so newest requests appear at the top
        this.commissionRequests = data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      },
      (error) => {
        console.error('Error fetching commission requests', error);
      }
    );
  }

  acceptRequest(request: CommissionRequest): void {
    this.commissionService
      .updateCommission(request._id, { status: 'accepted' })
      .subscribe(
        (response) => {
          request.status = 'accepted';
        },
        (error) => {
          console.error('Error accepting commission request', error);
        }
      );
  }

  rejectRequest(request: CommissionRequest): void {
    this.commissionService
      .updateCommission(request._id, { status: 'declined by artist' })
      .subscribe(
        (response) => {
          request.status = 'declined by artist';
        },
        (error) => {
          console.error('Error rejecting commission request', error);
        }
      );
  }

  submitPrice(request: CommissionRequest): void {
    if (request.price == null || request.price < 0) {
      alert('Please enter a valid price.');
      return;
    }
    // When the artist sets a price, update the status to "price proposed"
    this.commissionService
      .updateCommission(request._id, {
        status: 'price proposed',
        price: request.price,
      })
      .subscribe(
        (response) => {
          request.status = 'price proposed';
        },
        (error) => {
          console.error('Error setting commission price', error);
        }
      );
  }

  updateStatus(request: CommissionRequest, status: string): void {
    this.commissionService.updateCommission(request._id, { status }).subscribe(
      (response) => {
        request.status = status;
      },
      (error) => {
        console.error('Error updating commission status', error);
      }
    );
  }
}
