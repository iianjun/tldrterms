"use client";
import Appearance from "@/components/account/general/Appearnace";
import Credentials from "@/components/account/general/Credentials";
import ProfileInformation from "@/components/account/general/ProfileInformation";

export default function GeneralTabContent() {
  return (
    <div className="space-y-4 md:space-y-8">
      <ProfileInformation />
      <Credentials />
      <Appearance />
    </div>
  );
}
