import { useContext } from "react";
import ShowNotificationContext from "./ShowNotificationContext";

export const useShowAlertNotification = () => {
  return useContext(ShowNotificationContext);
};
