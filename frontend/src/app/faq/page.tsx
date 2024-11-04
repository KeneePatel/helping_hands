import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_CONTENT } from "@/lib/constants";

export default function FAQPage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-12 md:py-20">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            HelpingHands FAQ
          </h1>
          <p className="mt-4 text-muted-foreground">
            Get answers to your questions about the HelpingHands platform.
          </p>
        </div>
      </div>
    </div>
  );
}
