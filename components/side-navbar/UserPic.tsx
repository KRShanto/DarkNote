import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserImage from "@/public/user-image.png";

export default function UserPic() {
  const { data: session } = useSession();

  return (
    <>
      {session && (
        <Link href="/profile" title="Profile" className="profile">
          {session.user?.image ? (
            <Image
              src={session.user?.image || ""}
              alt="Profile Picture"
              width={65}
              height={65}
              className="profile-image"
            />
          ) : (
            <Image
              src={UserImage}
              alt="Profile Picture"
              width={65}
              height={65}
              className="profile-image"
            />
          )}
        </Link>
      )}
    </>
  );
}
