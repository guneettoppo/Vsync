"use client";
import FolderDuotone from "@/components/icons/folder-duotone";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import Folder from "./folder";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkspaceFolders } from "@/actions/workspace";
import { useMutationDataState } from "@/hooks/useMutationData";
import Videos from "../videos";
import { useDispatch } from "react-redux";
import { FOLDERS } from "@/redux/slices/folders";

type Props = {
  workspaceId: string;
};

export type FoldersProps = {
  status: number;
  data: ({
    _count: {
      videos: number;
    };
  } & {
    id: string;
    name: string;
    createdAt: Date;
    workSpaceId: string | null;
  })[];
};

const Folders = ({ workspaceId }: Props) => {
  const dispatch = useDispatch();
  const [showAllFolders, setShowAllFolders] = useState(false);

  const handleSeeAll = () => setShowAllFolders(true);
  const handleHideAll = () => setShowAllFolders(false);

  //get folders
  const { data, isFetched } = useQueryData(["workspace-folders"], () =>
    getWorkspaceFolders(workspaceId),
  );

  const { latestVariables } = useMutationDataState(["create-folder"]);

  const { status, data: folders } = data as FoldersProps;
  const visibleFolders = showAllFolders ? folders : folders?.slice(0, 3);

  if (isFetched && folders) {
    dispatch(FOLDERS({ folders: folders }));
  }

  return (
    <div className="flex flex-col gap-4" suppressHydrationWarning>
      <div className="flex items-center  justify-between">
        <div className="flex items-center gap-4">
          <FolderDuotone />
          <h2 className="text-[#BDBDBD] text-xl"> Folders</h2>
        </div>
        <button
          type="button"
          onClick={showAllFolders ? handleHideAll : handleSeeAll}
          className="flex items-center gap-2 text-[#BDBDBD] hover:text-white transition-colors"
        >
          <span>{showAllFolders ? "Hide all" : "See all"}</span>
          <ArrowRight color="#707070" />
        </button>
      </div>
      <div
        className={cn(
          status !== 200 && "justify-center",
          showAllFolders
            ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {status !== 200 ? (
          <p className="text-neutral-300">No folders in workspace</p>
        ) : (
          <>
            {latestVariables && latestVariables.status === "pending" && (
              <Folder
                name={latestVariables.variables.name}
                id={latestVariables.variables.id}
                optimistic
              />
            )}
            {visibleFolders?.map((folder) => (
              <Folder
                name={folder.name}
                count={folder._count.videos}
                id={folder.id}
                key={folder.id}
              />
            ))}
          </>
        )}
      </div>
      <Videos
        workspaceId={workspaceId}
        folderId={workspaceId}
        videosKey="user-videos"
      />
    </div>
  );
};

export default Folders;
