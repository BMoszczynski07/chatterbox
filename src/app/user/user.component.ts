import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { CookieService } from '../cookie.service';
import { User } from '../classes/User';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { FileSizePipe } from '../file-size.pipe';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule, CommonModule, ImageCropperComponent, FileSizePipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  constructor(
    public userService: UserService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  unique_id: string | null = null;

  userLoading: boolean = true;

  user: User | null = null;

  displayPhoto: boolean = false;

  uploadPhotoModal: boolean = false;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  fileName!: string;
  fileSize!: number;

  imageChangedEvent!: Event;
  croppedImage: string | null | undefined;
  croppedImageBlob!: Blob;

  handleFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    console.log('handleFileChange');

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      console.log(file);

      this.fileName = file.name;
      this.fileSize = file.size;

      this.imageChangedEvent = event;
    }
  }

  handleImageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.objectUrl;

    if (this.croppedImage) {
      const byteString = atob(this.croppedImage.split(',')[1]);
      const mimeString = this.croppedImage
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      this.croppedImageBlob = new Blob([ab], { type: mimeString });
    }
  }

  handleUploadCroppedImage(): void {
    if (this.croppedImage) {
      console.log('Uploading cropped image:', this.croppedImage);
    }
  }

  handleCustomLabelClick() {
    this.fileInput.nativeElement.click();
  }

  async ngOnInit(): Promise<void> {
    this.unique_id = this.route.snapshot.paramMap.get('unique_id');

    try {
      await this.userService.handleGetUser(
        this.cookieService.getCookieValue('token')
      );
    } catch (err) {
      console.error(err);

      this.router.navigate(['/login']);
      this.userService.user = null;
    }

    if (this.unique_id === this.userService.user) {
      this.userLoading = false;
      return;
    }

    if (this.unique_id)
      this.user = await this.userService.handleUnprotectedGetUser(
        this.unique_id
      );

    this.userLoading = false;
  }

  handleToggleDisplayPhoto = () => {
    this.displayPhoto = !this.displayPhoto;
  };

  handleToggleUploadPhotoModal = () => {
    this.uploadPhotoModal = !this.uploadPhotoModal;
  };
}
