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
import { BackendUrlService } from '../backend-url.service';
import { Notification } from '../../notification/Notification';

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
    private router: Router,
    private backendUrlService: BackendUrlService
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
  croppedImage: Blob | null | undefined;

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
    this.croppedImage = event.blob;
  }

  async handleUploadCroppedImage(event: Event): Promise<void> {
    event.preventDefault();

    if (this.croppedImage) {
      const formData = new FormData();

      const fileExtension = this.fileName.split('.').pop() || 'jpg'; // Default to jpg if no extension

      if (
        fileExtension !== 'jpg' &&
        fileExtension !== 'png' &&
        fileExtension !== 'gif'
      ) {
        const extensionNotification = new Notification(
          'Invalid file extension'
        );
        extensionNotification.handleCreate();

        this.uploadPhotoModal = false;
        return;
      }

      formData.append(
        'file',
        this.croppedImage,
        `${this.userService.user?.unique_id}.${fileExtension}`
      );

      console.log(formData.get('file'));

      const fileRequest = await fetch(
        `${this.backendUrlService.backendURL}/profile-pic/img`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.cookieService.getCookieValue(
              'token'
            )}`,
          },
          body: formData,
        }
      );

      const fileRequestData = await fileRequest.json();

      this.uploadPhotoModal = false;

      this.router.navigate([`/user/${this.userService.user?.unique_id}`]);

      const fileNotification = new Notification(fileRequestData.message);
      fileNotification.handleCreate();
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
