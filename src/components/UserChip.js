import React, { useRef } from "react";
import classes from "./UserChip.module.css";
const UserChip = ({ url, width, heigth }) => {
  const userChipRef = useRef(null);
  console.log("userChip: ", userChipRef);
  return (
    <div style={{ width: width, height: heigth }} className={classes.UserChip}>
      <img src={url} alt="userphoto" />
    </div>
  );
};

export default UserChip;
