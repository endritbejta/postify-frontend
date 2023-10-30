import React, { useEffect, useRef } from "react";
import classes from "./Notifications.module.css";
import SingleNotification from "./SingleNotification";

import { notifications } from "../../api/dummyData";
const Notifications = ({
  showNotifications,
  setShowNotifications,
  toggleClass,
  notificationsRef,
  notificationsSectionRef,
}) => {
  const onClearHandler = () => {};
  const onMarkAllAsReadHandler = () => {};

  useEffect(() => {
    // we get the Notifications element
    const notificationIconClass = notificationsRef.current.classList[0];
    const parentClass = notificationsSectionRef.current.classList[0];
    // if the target clicked in not a child of notifications section, or notifications himselft then we close it
    // an extra additional checks is done in case the click is in the icon itself, to prevent from interfering with notification icons handler
    const handleClickOutside = (event) => {
      event.stopPropagation();

      if (
        !event.target.closest(`.${notificationIconClass}`) &&
        !event.target.closest(`.${parentClass}`)
      ) {
        setShowNotifications((prev) => !prev);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <div
      ref={notificationsSectionRef}
      className={
        toggleClass
          ? `${classes.Notifications} ${classes.showNotifications}`
          : classes.Notifications
      }
    >
      <div className={classes["notifications-actions"]}>
        <p onClick={onClearHandler} className={classes.clear}>
          Clear
        </p>
        <p onClick={onMarkAllAsReadHandler} className={classes.markRead}>
          Mark all as read
        </p>
      </div>
      <div className={classes.notifications}>
        {notifications.map((notification) => (
          <SingleNotification
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
