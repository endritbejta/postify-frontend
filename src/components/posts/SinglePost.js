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

const SinglePost = ({ post }) => {
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
    <div className={classes.SinglePost}>
      <PostHeader post={post} />

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
        <PostContent post={post} />
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
