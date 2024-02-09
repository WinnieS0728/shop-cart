
import { cn } from "@/libs/utils/cn";
import Skeleton from "react-loading-skeleton";

interface blockLoadingProps {
  height?: number;
  className?: string;
}
interface circleLoadingProps {
  r?: number;
  className?: string;
}

function BlockLoading({ height, className }: blockLoadingProps) {
  return (
    <Skeleton
      count={1}
      height={height || 16 * 3}
      className={cn("rounded-md", className)}
    />
  );
}

function CircleLoading({ r, className }: circleLoadingProps) {
  return (
    <Skeleton
      count={1}
      width={r || 16 * 5}
      height={r || 16 * 5}
      className={cn("", className)}
      circle
    />
  );
}

export const Loading = {
  block: BlockLoading,
  circle: CircleLoading,
};
