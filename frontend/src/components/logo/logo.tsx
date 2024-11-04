import { Handshake } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex place-items-center gap-1 text-lg font-semibold">
      <span>Helping</span>
      <Handshake className="w-10 h-10" />
      <span className="text-red-600">Hands</span>
    </div>
  );
}
