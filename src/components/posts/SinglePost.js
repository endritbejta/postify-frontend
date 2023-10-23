import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editPost,
  startEdit,
  finishEdit,
  selectEditState,
} from "../../store/slices/postsSlice";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import WritePostComment from "./WritePostComment";
import PostContent from "./PostContent";
import classes from "./SinglePost.module.css";
import PostComments from "./PostComments";

// type will change some internal post specs, check PostHeader and it will add some conditional cases
const SinglePost = ({ post, type }) => {
  const dispatch = useDispatch();
  const editState = useSelector(selectEditState);
  const isEditing = editState === post.id;
  const [editedContent, setEditedContent] = useState(post.content);

  const currentUser = useSelector((state) => state.user); // You need to get the user from your state or adjust this part accordingly
  const isOwner = currentUser && currentUser.id === post.owner.id;

  const handleEditClick = () => {
    dispatch(startEdit(post.id));
  };

  const handleEditSave = () => {
    dispatch(editPost({ id: post.id, content: editedContent }));

    dispatch(finishEdit());
  };
  return (
    <div
      className={`${classes.SinglePost} ${
        // we and this class that removes, borderradius, shadow, so it shows nice in the modal, without the need to recreate a singlepost from scratch again
        type === "modal-post" ? classes.SinglePostModal : ""
      }`}
    >
      {/* post header needs type to make it possible to show or not the options of the post(editing, report, delete) */}
      <PostHeader post={post} type={type} />

      {isOwner && !isEditing ? (
        <button onClick={handleEditClick}>Edit</button>
      ) : null}

      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleEditSave}>Save</button>
          <button onClick={() => dispatch(finishEdit())}>Cancel</button>
        </div>
      ) : (
        <PostContent post={post} type={type} />
      )}

      <hr />
      <PostActions post={post} />
      <hr />
      <section>
        <PostComments post={post} />
        <WritePostComment />
      </section>
    </div>
  );
};

export default SinglePost;
