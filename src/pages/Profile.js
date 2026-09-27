import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUsersCtx } from "@/context/UsersContext";
import { HeartsPageLoader } from "@/primitives/spinners";
import { ProfileBlock } from "@/components/profile/ProfileBlock";
import { PostsSection } from "@/components/posts/PostsSection";
import profileStyles from "@/style-modules/pages/profile.module.css";

export function Profile() {
  const { currentUser } = useAuth();
  const { usersData, postsData, currentUserData } = useUsersCtx();
  const { userId } = useParams();
  const isOwner = userId === currentUser.uid;

  const dataLoaded = isOwner
    ? postsData && currentUserData
    : postsData && usersData;

  if (!dataLoaded) {
    return <HeartsPageLoader />;
  }

  const user = isOwner ? currentUserData : usersData[userId];
  if (!isOwner && !user) {
    return <Navigate to="/" />;
  }

  const userPosts = postsData.filter((post) => post.userId === userId);

  return (
    <div className={profileStyles.container}>
      <ProfileBlock user={user} canEdit={isOwner} />
      <PostsSection user={user} isOwner={isOwner} posts={userPosts} />
    </div>
  );
}
