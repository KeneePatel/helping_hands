import { FOOTER_LINKS } from "@/lib/constants";
import { HandshakeIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-foreground text-primary py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <div className="flex flex-col items-start gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <HandshakeIcon className="w-8 h-8" />
            <span className="text-2xl font-bold">HelpingHands</span>
          </Link>
          <p className="text-sm text-primary-foreground/80">
            A one-stop platform for both gym owners and users with flexible gym
            access.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          <h4 className="text-lg font-semibold">Quick Links</h4>
          <div className="grid grid-cols-2 gap-2 md:gap-4 size-fit">
            {FOOTER_LINKS.map((link, index) => {
              return (
                <Link
                  key={index}
                  href={link.ref}
                  className="text-sm hover:underline"
                  prefetch={false}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-8 md:mt-12 lg:mt-16 flex justify-between items-center">
        <p className="text-sm text-primary/80">
          &copy; 2024 HelpingHands. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
