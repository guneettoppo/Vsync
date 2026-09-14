"use client";

import React from "react";
import Modal from "../modal";
import { Move, Trash2 } from "lucide-react";
import ChangeVideoLocation from "@/components/forms/change-video-location";
import { deleteVideo } from "@/actions/workspace";
import { useMutationData } from "@/hooks/useMutationData";
import { Button } from "@/components/ui/button";

type Props = {
  videoId: string;
  currentWorkspace?: string;
  currentFolder?: string;
  currentFolderName?: string;
  videosKey?: string;
};

const CardMenu = ({
  videoId,
  currentFolder,
  currentFolderName,
  currentWorkspace,
  videosKey = "user-videos",
}: Props) => {
  const { mutate: onDeleteVideo, isPending: isDeleting } = useMutationData(
    ["delete-video", videoId],
    () => deleteVideo(videoId),
    videosKey,
  );

  return (
    <>
      <Modal
        className="flex items-center cursor-pointer gap-x-2"
        title="Move to new Workspace/Folder"
        description="Choose a new location for your video."
        trigger={<Move size={20} fill="#4f4f4f" className="text-[#4f4f4f]" />}
      >
        <ChangeVideoLocation
          currentFolder={currentFolder}
          currentWorkSpace={currentWorkspace}
          videoId={videoId}
          currentFolderName={currentFolderName}
        />
      </Modal>

      <Modal
        className="flex items-center cursor-pointer gap-x-2"
        title="Delete Video"
        description="Are you sure you want to delete this video? This action cannot be undone."
        trigger={<Trash2 size={20} fill="#dc2626" className="text-[#dc2626]" />}
      >
        <div className="flex gap-4 justify-end">
          <Button variant="outline" disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDeleteVideo({})}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CardMenu;
