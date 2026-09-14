import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import { Loader } from "../Loader";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/lib/utils";
import { useMediaSources } from "@/hooks/useMediaSources";
import MediaConfiguration, { UserProfileData } from "../MediaConfiguration";
import { Settings2 } from "lucide-react";

export type UserProfileResponse = {
  status: number;
  user: UserProfileData | null;
};

const Widget = () => {
  const { user } = useUser();
  const { state, fetchMediaResources } = useMediaSources();
  
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    const initializeWidget = async () => {
      setIsLoading(true);
      try {
        const [fetchedProfile] = await Promise.all([
          fetchUserProfile(user.id),
          fetchMediaResources(),
        ]);
        if (isMounted) setProfile(fetchedProfile);
      } catch (error) {
        console.error("Failed to fetch widget data", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeWidget();
    return () => { isMounted = false; };
  }, [user?.id]);

  return (
    <div className="w-full h-full flex flex-col p-5 bg-transparent">
      <ClerkLoading>
        <div className="flex flex-col justify-center items-center h-full gap-3 opacity-70">
          <Loader color="#a855f7" />
          <p className="text-xs font-medium text-neutral-400 animate-pulse">Authenticating...</p>
        </div>
      </ClerkLoading>

      <SignedIn>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-full gap-4 animate-in fade-in duration-300">
             <div className="relative">
                <Settings2 className="w-6 h-6 text-purple-500/80 animate-spin-slow" />
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
              </div>
            <p className="text-xs font-medium text-neutral-400">Loading your studio...</p>
          </div>
        ) : profile?.user ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out h-full w-full">
            <MediaConfiguration state={state} user={profile.user} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-red-400 text-lg">!</span>
            </div>
            <p className="text-sm font-medium text-neutral-300">Connection Error</p>
            <p className="text-xs text-neutral-500">Failed to load profile data.</p>
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;