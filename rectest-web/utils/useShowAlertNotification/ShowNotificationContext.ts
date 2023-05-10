import React from "react";

export interface NotificationConfiguration {
  autoClose?: boolean;
}

export interface ShowNotificationValue {
  showError(text: string, options?: NotificationConfiguration): void;
  showInfo(text: string, options?: NotificationConfiguration): void;
}

const ShowNotificationContext = React.createContext<ShowNotificationValue>({} as ShowNotificationValue);
export default ShowNotificationContext;
