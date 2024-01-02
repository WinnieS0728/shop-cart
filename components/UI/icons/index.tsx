import { HTMLAttributes } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { TbTrashXFilled } from "react-icons/tb";

export function Check(props: HTMLAttributes<SVGAElement>) {
  return <FaCircleCheck {...props} />;
}

function EyeOpen(props: HTMLAttributes<SVGAElement>) {
  return <FaRegEye {...props} />;
}
function EyeClose(props: HTMLAttributes<SVGAElement>) {
  return <FaRegEyeSlash {...props} />;
}

export const eye = {
  open: EyeOpen,
  close: EyeClose
}

export function Trash (props: HTMLAttributes<SVGAElement>){
  return <TbTrashXFilled {...props} />
}