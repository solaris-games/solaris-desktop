import { Notification } from 'electron';

export const postNotification = (title: string, content: string) => {
    new Notification({
        title,
        body: content,
    }).show();
}