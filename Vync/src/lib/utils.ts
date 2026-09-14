import { clsx, type ClassValue } from "clsx";
import { sl } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateString = (string: string, slice?: number) => {
  return string.slice(0, slice || 30) + "...";
};

export type GitHubAsset = {
  name: string;
  browser_download_url: string;
};

export type GitHubRelease = {
  assets: GitHubAsset[];
};

export const downloadLatestDesktopApp = async () => {
  try {
    const res = await fetch(
      "https://api.github.com/repos/HarshRajeev/Vync/releases/latest",
    );

    const release: GitHubRelease = await res.json();

    const exeAsset = release.assets.find(
      (asset) =>
        asset.name.endsWith(".exe") && !asset.name.endsWith(".exe.blockmap"),
    );

    if (!exeAsset) {
      throw new Error("Installer not found");
    }

    window.open(exeAsset.browser_download_url, "_blank");
  } catch (error) {
    console.error("Download failed:", error);
  }
};
