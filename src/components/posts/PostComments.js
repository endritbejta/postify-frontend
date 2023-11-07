import React from "react";
import classes from "./PostComments.module.css";
import SingleComment from "./SingleComment";

const PostComments = ({ post }) => {
  const comments = post.comments?.map((comment) => (
    <SingleComment key={comment?._id} comment={comment} />
  ));
  return <div className={classes.Comments}>{comments}</div>;
};

export default PostComments;
