import { HTMLAttributes } from "react";
import { FaCircleCheck } from "react-icons/fa6";

export function Check(props: HTMLAttributes<SVGAElement>) {
  return <FaCircleCheck {...props} />;
}
