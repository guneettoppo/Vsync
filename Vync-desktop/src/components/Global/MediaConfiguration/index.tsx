import { SourceDeviceStateProps } from "@/hooks/useMediaSources";
import { useStudioSettings } from "@/hooks/useStudioSettings";
import { Loader } from "../Loader";
import { Headphones, Monitor, Settings2, ChevronDown } from "lucide-react";

export type UserProfileData = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  clerkId: string;
  subscription: {
    plan: "PRO" | "FREE";
  } | null;
  studio: {
    id: string;
    screen: string | null;
    camera: string | null;
    mic: string | null;
    plan: "PRO" | "FREE";
    preset: "HD" | "SD";
    userId: string;
  } | null;
};

type Props = {
  state: SourceDeviceStateProps;
  user: UserProfileData | null;
};

const MediaConfiguration = ({ state, user }: Props) => {
  const activeScreen = state.displays?.find((screen) => screen.id === user?.studio?.screen);
  const activeAudio = state.audioInput?.find((audio) => audio.deviceId === user?.studio?.mic);

  const { isPending, register, onPresent } = useStudioSettings(
    user?.id || "",
    activeScreen?.id || state.displays?.[0]?.id || null,
    activeAudio?.deviceId || state.audioInput?.[0]?.deviceId || null,
    user?.studio?.preset || undefined,
    user?.subscription?.plan || undefined
  );

  return (
    <form className="flex w-full flex-col gap-y-4 relative h-full">
      
      {/* Saving / Updating Overlay */}
      {isPending && (
        <div className="absolute inset-0 z-50 rounded-xl bg-[#09090B]/80 backdrop-blur-sm flex justify-center items-center">
          <Loader color="#a855f7" />
        </div>
      )}

      {/* Screen Selection */}
      <div className="flex gap-x-3 items-center group w-full">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] group-hover:bg-white/[0.06] transition-all duration-300">
          <Monitor className="text-neutral-400 group-hover:text-white transition-colors" size={20} />
        </div>
        <div className="relative flex-1 min-w-0">
          <select
            {...register("screen")}
            defaultValue={activeScreen?.id || state.displays?.[0]?.id}
            className="w-full appearance-none outline-none cursor-pointer px-4 py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.02] text-neutral-200 hover:bg-white/[0.04] focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm truncate pr-10"
          >
            {state.displays?.map((display) => (
              <option key={display.id} value={display.id} className="bg-[#121212] text-white">
                {display.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none group-hover:text-neutral-300 transition-colors" />
        </div>
      </div>

      {/* Audio Selection */}
      <div className="flex gap-x-3 items-center group w-full">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] group-hover:bg-white/[0.06] transition-all duration-300">
          <Headphones className="text-neutral-400 group-hover:text-white transition-colors" size={20} />
        </div>
        <div className="relative flex-1 min-w-0">
          <select
            {...register("audio")}
            defaultValue={activeAudio?.deviceId || state.audioInput?.[0]?.deviceId}
            className="w-full appearance-none outline-none cursor-pointer px-4 py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.02] text-neutral-200 hover:bg-white/[0.04] focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm truncate pr-10"
          >
            {state.audioInput?.map((audio) => (
              <option key={audio.deviceId} value={audio.deviceId} className="bg-[#121212] text-white">
                {audio.label || "Default Microphone"}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none group-hover:text-neutral-300 transition-colors" />
        </div>
      </div>

      {/* Resolution Selection */}
      <div className="flex gap-x-3 items-center group w-full">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] group-hover:bg-white/[0.06] transition-all duration-300">
          <Settings2 className="text-neutral-400 group-hover:text-white transition-colors" size={20} />
        </div>
        <div className="relative flex-1 min-w-0">
          <select
            {...register("preset")}
            defaultValue={onPresent || user?.studio?.preset || "SD"}
            className="w-full appearance-none outline-none cursor-pointer px-4 py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.02] text-neutral-200 hover:bg-white/[0.04] focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm truncate pr-10"
          >
            <option disabled={user?.subscription?.plan === "FREE"} value="HD" className="bg-[#121212] text-white">
              1080p {user?.subscription?.plan === "FREE" && "(Upgrade to PRO)"}
            </option>
            <option value="SD" className="bg-[#121212] text-white">
              720p Standard
            </option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none group-hover:text-neutral-300 transition-colors" />
        </div>
      </div>

    </form>
  );
};

export default MediaConfiguration;