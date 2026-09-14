"use client";
import { getAllUserVideos } from "@/actions/workspace";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";
import { useQueryData } from "@/hooks/useQueryData";
import { cn } from "@/lib/utils";
import { VideosProps } from "@/types/index.type";
import React, { useEffect } from "react";
import VideoCard from "./video-card";

type Props = {
  folderId: string;
  videosKey: string;
  workspaceId: string;
};

const Videos = ({ folderId, videosKey, workspaceId }: Props) => {
  const { data: videoData, refetch } = useQueryData([videosKey], () =>
    getAllUserVideos(folderId),
  );

  const { status: videosStatus, data: videos } = videoData as VideosProps;

  useEffect(() => {
    const hasProcessingVideos =
      videos?.some((video) => video.processing) ?? false;

    if (!hasProcessingVideos) return;

    const interval = setInterval(() => {
      console.log("Refetching videos...");
      refetch();
    }, 1000);

    return () => clearInterval(interval);
  }, [videos, refetch]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <VideoRecorderDuotone />
          <h2 className="text-[#BdBdBd] text-xl">Videos</h2>
        </div>
      </div>
      <section
        className={cn(
          videosStatus !== 200
            ? "p-5"
            : "grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
        )}
      >
        {videosStatus === 200 ? (
          videos.map((video) => (
            <VideoCard
              key={video.id}
              workspaceId={workspaceId}
              videosKey={videosKey}
              {...video}
            />
          ))
        ) : (
          <p className="text-[#BDBDBD]"> No videos in workspace</p>
        )}
      </section>
    </div>
  );
};

export default Videos;
