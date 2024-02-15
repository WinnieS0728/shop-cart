import { HTMLAttributes } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { TbTrashXFilled } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { RiShoppingCartLine } from "react-icons/ri";
import { LuCakeSlice } from "react-icons/lu";
import { MdRestaurantMenu } from "react-icons/md";
import { LuMail } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";

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
  close: EyeClose,
};

export function Trash(props: HTMLAttributes<SVGAElement>) {
  return <TbTrashXFilled {...props} />;
}

export function Close(props: HTMLAttributes<SVGAElement>) {
  return <IoClose {...props} />;
}
export function Cart(props: HTMLAttributes<SVGAElement>) {
  return <RiShoppingCartLine {...props} />;
}
export function Logo(props: HTMLAttributes<SVGAElement>) {
  return <LuCakeSlice {...props} />;
}
export function Menu(props: HTMLAttributes<SVGAElement>) {
  return <MdRestaurantMenu {...props} />;
}
export function Contact(props: HTMLAttributes<SVGAElement>) {
  return <LuMail {...props} />;
}
export function User(props: HTMLAttributes<SVGAElement>) {
  return <FaRegUser {...props} />;
}
