import { Loader2 } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="flex justify-center items-center flex-col h-[80vh] gap-4">
      <span className="relative h-16 w-16">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/30 dark:bg-primary/20 opacity-75" />
        <Loader2 className="relative w-16 h-16 text-primary animate-spin" />
      </span>
      <span className="text-lg text-primary/80 dark:text-primary/90 font-semibold mt-4">
        読み込み中...
      </span>
    </div>
  );
}
