import LineLoader from "@/app/ui/LineLoader";
import clsx from "clsx";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import crossIcon from "./cross.svg";
import ShowNotificationContext, { ShowNotificationValue } from "./ShowNotificationContext";
import styles from "./styles.module.css";

interface InfoAlertProviderProps {
    children: React.ReactNode
  }
  
  type NotificationType = 'error' | 'info';
  
  interface Notification {
    type: NotificationType,
    text: string,
    autoClose: boolean
  }
  
  export const InfoAlertProvider = ({ children } : InfoAlertProviderProps) => {
    const [notificationsQueue, setNotificationsQueue] = useState<Notification[]>([]);
  
    const showNotification = useCallback(
      (notification: Notification) => setNotificationsQueue((oldState) => [...oldState, notification]),
      []
    );
    const showNotificationsShortcuts = useMemo<ShowNotificationValue>(
      () => ({
        showError: (text, { autoClose = false } = {}) => showNotification({ type: "error", text, autoClose }),
        showInfo: (text, { autoClose = true } = {}) => showNotification({ type: "info", text, autoClose }),
      }),
      [showNotification]
    );
  
    const topMostNotification = notificationsQueue[0];
  
    const handleClose = useCallback(() => {
      setNotificationsQueue((oldNotifications) => oldNotifications.slice(1));
    }, [setNotificationsQueue]);
  
    useEffect(() => {
      if (!topMostNotification || !topMostNotification.autoClose) {
        return () => {};
      }
  
      let closeTimeOut : NodeJS.Timeout | null = setTimeout(() => {
        if (closeTimeOut) {
          handleClose();
          closeTimeOut = null;
        }
      }, 3000);
  
      return () => {
        if (closeTimeOut) {
          clearTimeout(closeTimeOut);
        }
      };
    }, [topMostNotification, handleClose]);
  
    return (
      <ShowNotificationContext.Provider value={showNotificationsShortcuts}>
        {children}
        {!!topMostNotification && (
          <div className={clsx(styles.alert, topMostNotification.type === "error" && styles.error)}>
            {topMostNotification.autoClose && (
              <div className={styles.loading}>
                <LineLoader loadTimeMilliseconds={2500} isLoading />
              </div>
            )}
            {notificationsQueue.length > 1 && `(1/${notificationsQueue.length})`} {topMostNotification.text}
            <button onClick={handleClose} className={styles.close}>
              <Image src={crossIcon} alt="Close" />
            </button>
          </div>
        )}
      </ShowNotificationContext.Provider>
    );
  };
  