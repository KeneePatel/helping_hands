import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LogoutLink from "./logout-link";

export function LogoutConfirmationDialogLink() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <LogoutLink />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Flexing Out?</DialogTitle>
          <DialogDescription>
            Are you sure you want to flex out of FlexiGym?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Yes!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
