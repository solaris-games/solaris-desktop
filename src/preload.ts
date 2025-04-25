import {contextBridge, ipcRenderer} from 'electron';
import {type MessageData} from "./integration/messages";
import {CONVERSATION_MESSAGE_RECEIVED} from "./integration/events";

interface MessageIntegration {
    onConversationMessageReceived: (message: MessageData) => void;
}

interface SolarisIntegration {
    messages: MessageIntegration;
}

const solaris: SolarisIntegration = {
    messages: {
        onConversationMessageReceived: (message: MessageData) => {
            ipcRenderer.send(CONVERSATION_MESSAGE_RECEIVED, message);
        },
    }
};

contextBridge.exposeInMainWorld('solaris', solaris);