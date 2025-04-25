import { Notification, NativeImage } from 'electron';

export const createNotificationHandler = (icon: NativeImage) => (title: string, content: string) => {
    new Notification({
        title,
        body: content,
        icon,
    }).show();
}