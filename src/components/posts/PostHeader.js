import React, { useEffect, useRef, useState } from "react";
import classes from "./PostHeader.module.css";
import { useDispatch, useSelector } from "react-redux";
import { editPost, savePost, deletePost } from "../../store/slices/postsSlice";
import { CiEdit } from "react-icons/ci";
import { MdOutlineReport, MdDelete } from "react-icons/md";
import { BsBookmark } from "react-icons/bs";
import { BiDotsVerticalRounded } from "react-icons/bi";
import EditPost from "./EditPost";
import Modal from "../../layout/Modal";
import UserChip from "../UserChip";
import {
  formatDistanceToNow,
  parseISO,
  format,
  isToday,
  isYesterday,
} from "date-fns";
import { selectUser } from "../../store/slices/authSlice";
import PostSettings from "./PostSettings";

const PostHeader = ({ post, type }) => {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState();
  const [modalOpen, setModalOpen] = useState();
  const [displayTime, setDisplayTime] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  // const selectPostsStatus = useSelector(selectPostStatus);
  // function to open and close modal

  const loggedInUser = useSelector(selectUser);
  const showModal = () => {
    setModalOpen((prev) => !prev);
  };

  const handleShowOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const onModalActionHandler = ({ action, data }) => {
    if (action === "save") {
      console.log("data", data);
      dispatch(editPost(data));
      showModal();
    }
  };

  const settingsIconRef = useRef();
  const settingsSectionRef = useRef();
  const handleSave = () => {
    dispatch(savePost(post._id));
  };

  useEffect(() => {
    // we get the Notifications element
    const settingsIconClass = settingsIconRef.current?.classList[0];
    const parentClass = settingsSectionRef.current?.classList[0];
    // if the target clicked in not a child of notifications section, or notifications himselft then we close it
    // an extra additional checks is done in case the click is in the icon itself, to prevent from interfering with notification icons handler
    const handleClickOutside = (event) => {
      if (
        !event.target?.closest(`.${parentClass}`) &&
        !event.target?.closest(`.${settingsIconClass}`)
      ) {
        setShowOptions(false);
      }
    };
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);
  const inputDate = parseISO(post.createdAt);
  const timeAgo = formatDistanceToNow(inputDate, { addSuffix: true });

  useEffect(() => {
    if (timeAgo.includes("minutes")) {
      // Display time in minutes
      setDisplayTime(timeAgo);
    } else if (timeAgo.includes("hour")) {
      // Display time in hours
      const hourAgo = timeAgo.replace("hours", "h");
      setDisplayTime(hourAgo);
    } else {
      // Display different formats based on the date
      if (isToday(inputDate)) {
        // Display as "hh:mm" if it's today
        const formattedTime = format(inputDate, "hh:mm");
        setDisplayTime(formattedTime);
      } else if (isYesterday(inputDate)) {
        // Display as "hh:mm" if it's yesterday
        const formattedTime = format(inputDate, "hh:mm");
        setDisplayTime(formattedTime);
      } else {
        // For other dates, display as "dd MMMM" (e.g., "27 October")
        const formattedDate = format(inputDate, "dd MMMM");
        setDisplayTime(formattedDate);
      }
    }
  }, [inputDate, timeAgo]);

  const handleDeleteClick = async () => {
    try {
      if (isDeleting) {
        return;
      }

      setIsDeleting(true);

      const data = {
        _id: post._id,
      };

      console.log(data);
      dispatch(deletePost(data));

      setIsDeleting(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className={classes.PostHeader}>
      <div className={classes["user-and-photo"]}>
        <UserChip url={post.profilePicture} id={post.userId} />
        <div className={classes["user-and-date-posted"]}>
          <p>
            <strong>{post.author}</strong>
          </p>
          <div className={classes["date-and-privacy"]}>
            <span style={{ fontSize: "12px" }}>{displayTime}</span>
          </div>
        </div>
      </div>
      <div className={classes.settings}>
        {/* this check is performed to look if the post is opened, in a modal to show images, there we dont want to have the opstions of edit report etc.(for simplicity case) */}
        {type !== "modal-post" && (
          <span
            style={{ fontSize: "22px" }}
            onClick={handleShowOptions}
            className={classes.button}
            ref={settingsIconRef}
          >
            <BiDotsVerticalRounded />
          </span>
        )}
        <PostSettings
          post={post}
          showModal={showModal}
          settingsSectionRef={settingsSectionRef}
          showOptions={showOptions}
          setShowOptions={handleShowOptions}
        />
        {modalOpen && (
          <Modal
            data={post}
            showActionButtons={true}
            showModal={showModal}
            modal={modalOpen}
            onModalActionHandler={onModalActionHandler}
            type="EDIT"
          >
            <EditPost />
          </Modal>
        )}
        <div
          ref={settingsSectionRef}
          className={`${
            showOptions
              ? `${classes.options} ${classes.showOptions}`
              : classes.options
          }`}
        >
          {loggedInUser?._id === post.userId && (
            <button onClick={showModal}>
              <span>
                <CiEdit />
              </span>
              <p>edit</p>
            </button>
          )}
          <button>
            <span>
              <MdOutlineReport />
            </span>
            <p>report</p>
          </button>
          <button onClick={handleSave}>
            <span>
              <BsBookmark />
            </span>
            <p>save</p>
          </button>
          {loggedInUser?._id === post.userId && (
            <button onClick={handleDeleteClick}>
              <span>
                <MdDelete />
              </span>
              <p>delete</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
