"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Heart,
  ThumbsUp,
  Laugh,
  Star,
  Image as ImageIcon,
  Video,
  Send,
  User,
  Clock,
  MoreHorizontal,
} from "lucide-react";

interface LoungePost {
  _id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  reactions: Array<{
    userId: string;
    type: "like" | "support" | "love" | "laugh";
  }>;
  commentCount: number;
}

interface LoungeComment {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export default function LoungePage() {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState<LoungePost[]>([]);
  const [comments, setComments] = useState<{
    [postId: string]: LoungeComment[];
  }>({});
  const [newPost, setNewPost] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchPosts();
    }
  }, [isLoaded, user]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/lounge/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.trim()) return;

    try {
      const response = await fetch("/api/lounge/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          content: newPost.trim(),
        }),
      });

      if (response.ok) {
        setNewPost("");
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !newComment.trim()) return;

    try {
      const response = await fetch("/api/lounge/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId: user.id,
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchPosts(); // Refresh posts to update comment count
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReaction = async (
    postId: string,
    reactionType: "like" | "support" | "love" | "laugh"
  ) => {
    if (!user) return;

    try {
      const response = await fetch("/api/lounge/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId: user.id,
          reactionType,
        }),
      });

      if (response.ok) {
        fetchPosts(); // Refresh posts to update reactions
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  const getReactionCount = (post: LoungePost, type: string) => {
    return post.reactions.filter((r) => r.type === type).length;
  };

  const getUserReaction = (post: LoungePost) => {
    if (!user) return null;
    return post.reactions.find((r) => r.userId === user.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">
          Please sign in to access the Lounge.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">The Lounge</h1>
          <p className="text-gray-300 text-lg">
            Share your thoughts, connect with others
          </p>
        </div>

        {/* Post Form */}
        <Card className="bg-black/20 backdrop-blur-md border-red-500/20 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-400" />
              Share Something
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 bg-white/5 border border-red-500/30 text-white placeholder-gray-400 rounded-lg resize-none focus:border-red-400 focus:ring-red-400/20"
                rows={3}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">
                    {newPost.length}/1000
                  </span>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading posts...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-400">Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card
                key={post._id}
                className="bg-black/20 backdrop-blur-md border-red-500/20 shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {post.userId === user?.id ? "You" : "User"}
                        </div>
                        <div className="text-gray-400 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white text-lg leading-relaxed">
                    {post.content}
                  </p>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post image"
                      className="w-full rounded-lg"
                    />
                  )}

                  {post.videoUrl && (
                    <video controls className="w-full rounded-lg">
                      <source src={post.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* Reactions */}
                  <div className="flex items-center gap-4 pt-2 border-t border-red-500/20">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(post._id, "like")}
                      className={`flex items-center gap-2 ${
                        getUserReaction(post)?.type === "like"
                          ? "text-blue-400"
                          : "text-gray-400"
                      } hover:text-blue-400`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {getReactionCount(post, "like")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(post._id, "love")}
                      className={`flex items-center gap-2 ${
                        getUserReaction(post)?.type === "love"
                          ? "text-red-400"
                          : "text-gray-400"
                      } hover:text-red-400`}
                    >
                      <Heart className="w-4 h-4" />
                      {getReactionCount(post, "love")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(post._id, "support")}
                      className={`flex items-center gap-2 ${
                        getUserReaction(post)?.type === "support"
                          ? "text-green-400"
                          : "text-gray-400"
                      } hover:text-green-400`}
                    >
                      <Star className="w-4 h-4" />
                      {getReactionCount(post, "support")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(post._id, "laugh")}
                      className={`flex items-center gap-2 ${
                        getUserReaction(post)?.type === "laugh"
                          ? "text-yellow-400"
                          : "text-gray-400"
                      } hover:text-yellow-400`}
                    >
                      <Laugh className="w-4 h-4" />
                      {getReactionCount(post, "laugh")}
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <div className="pt-4 border-t border-red-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">
                        Comments ({post.commentCount})
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSelectedPost(
                            selectedPost === post._id ? null : post._id
                          )
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        {selectedPost === post._id ? "Hide" : "Show"} Comments
                      </Button>
                    </div>

                    {selectedPost === post._id && (
                      <div className="space-y-4">
                        {/* Add Comment */}
                        <div className="flex gap-2">
                          <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-white/5 border-red-500/30 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20"
                            maxLength={500}
                          />
                          <Button
                            onClick={() => handleAddComment(post._id)}
                            disabled={!newComment.trim()}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-3">
                          {/* Placeholder comments - in real app, fetch from API */}
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                U
                              </div>
                              <span className="text-white text-sm font-medium">
                                User
                              </span>
                              <span className="text-gray-400 text-xs">
                                2h ago
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">
                              Great post! Thanks for sharing.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}