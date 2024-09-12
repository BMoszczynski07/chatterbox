export class Notification {
  private message: string;
  private timeout: any;

  constructor(message: string) {
    this.message = message;
  }

  handleCreate() {
    const notification = document.createElement('div');
    notification.classList.add('notification');

    const notificationContent = document.createElement('h1');
    notificationContent.classList.add('notification__content');
    notificationContent.textContent = this.message;

    const notificationClose = document.createElement('button');
    notificationClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    notificationClose.classList.add('notification__close');
    notificationClose.addEventListener('click', () => {
      clearTimeout(this.timeout);
      this.handleClose(notification);
    });

    const notificationBar = document.createElement('span');
    notificationBar.classList.add('notification__bar');

    notification.appendChild(notificationContent);
    notification.appendChild(notificationClose);
    notification.appendChild(notificationBar);

    document.body.appendChild(notification);

    this.timeout = setTimeout(() => {
      this.handleClose(notification);
    }, 3000);
  }

  handleClose(notificationEl: HTMLDivElement) {
    document.body.removeChild(notificationEl);
  }
}
