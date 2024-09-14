import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { CookieService } from '../cookie.service';
import { User } from '../classes/User';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { FileSizePipe } from '../file-size.pipe';
import { BackendUrlService } from '../backend-url.service';
import { Notification } from '../../notification/Notification';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ImageCropperComponent,
    FileSizePipe,
    FormsModule,
  ],
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

  displayPhotoModal: boolean = false;
  uploadPhotoModal: boolean = false;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  @ViewChild('uniqueId', { static: false }) uniqueIdEl!: ElementRef;
  @ViewChild('firstName', { static: false }) firstNameEl!: ElementRef;
  @ViewChild('lastName', { static: false }) lastNameEl!: ElementRef;
  @ViewChild('userDesc', { static: false }) userDescEl!: ElementRef;

  fileName!: string;
  fileSize!: number;

  imageChangedEvent!: Event;
  croppedImage: Blob | null | undefined;

  @ViewChild('uniqueId') uniqueId!: ElementRef;

  changePassModal: boolean = false;

  changePass = {
    cur_pass: '',
    new_pass: '',
    confirm_new_pass: '',
  };

  async handleChangePass(e: Event) {
    e.preventDefault();

    const changePassRequest = await fetch(
      `${this.backendUrlService.backendURL}/user/change-pass`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.cookieService.getCookieValue('token')}`,
        },
        body: JSON.stringify(this.changePass),
      }
    );

    const changePassResponse = await changePassRequest.json();

    this.changePassModal = false;

    const changePassNotification = new Notification(changePassResponse.message);
    changePassNotification.handleCreate();

    if (changePassRequest.ok) {
      document.cookie =
        'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      this.router.navigate(['/login']);
      this.userService.user = null;

      const uniqueIdNotification = new Notification(
        'Your password has been changed. You need to sign in again'
      );
      uniqueIdNotification.handleCreate();
    }
  }

  handleToggleChangePassModal() {
    this.changePassModal = !this.changePassModal;
  }

  async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const userRequest = await fetch(
      `${this.backendUrlService.backendURL}/user/update`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.cookieService.getCookieValue('token')}`,
        },
        body: JSON.stringify({
          unique_id: this.uniqueId.nativeElement.value,
          first_name: this.firstNameEl.nativeElement.value,
          last_name: this.lastNameEl.nativeElement.value,
          user_desc: this.userDescEl.nativeElement.value,
        }),
      }
    );

    const userData = await userRequest.json();
    const userNotification = new Notification(userData.message);
    userNotification.handleCreate();

    if (
      this.uniqueId.nativeElement.value !== this.userService.user?.unique_id &&
      userRequest.ok
    ) {
      document.cookie =
        'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      this.router.navigate(['/login']);
      this.userService.user = null;

      const uniqueIdNotification = new Notification(
        'Your login has been changed. You need to sign in again'
      );
      uniqueIdNotification.handleCreate();
    }
  }

  handleFileChange(event: any): void {
    const input = event.target as HTMLInputElement;

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

      this.ngOnInit();

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
      this.router.navigate(['/login']);
      this.userService.user = null;
    }

    if (this.unique_id === this.userService.user?.unique_id) {
      this.userLoading = false;

      return;
    }

    if (this.unique_id)
      this.user = await this.userService.handleUnprotectedGetUser(
        this.unique_id
      );

    this.userLoading = false;
  }

  handleToggleDisplayPhotoModal = () => {
    this.displayPhotoModal = !this.displayPhotoModal;
  };

  handleToggleUploadPhotoModal = () => {
    this.uploadPhotoModal = !this.uploadPhotoModal;
  };
}
