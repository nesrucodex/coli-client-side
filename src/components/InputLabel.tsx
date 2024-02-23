import { ReactNode } from "react";

type Props = {
  id: string;
  labelText?: string;
  children?: ReactNode;
  color?: string;
  isItalic?: boolean;
};

const InputLabel = ({
  id,
  labelText,
  children,
  isItalic = false,
  color = "",
}: Props) => {
  return (
    <label
      htmlFor={id}
      className="text-[.85rem] font-semibold tracking-wide text-gray-700 mb-1 cursor-pointer"
      style={{ fontStyle: isItalic ? "italic" : "normal", color: color }}
    >
      {labelText}
      {children}
    </label>
  );
};

export default InputLabel;
