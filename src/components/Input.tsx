import { ChangeEvent, useState } from "react";
import InputLabel from "./InputLabel";
import { FaEye, FaEyeSlash } from "react-icons/fa";
type IInput = {
  id?: string;
  type?: string;
  labelText?: string;
  onInputChangeHandler?: (value: string) => void;
  initial?: string;
  error?: {
    message: string;
    status: boolean;
  };
  color?: string;
  isItalic?: boolean;
  borderBottomColor?: string;
};
const Input = ({
  id = "id",
  type = "text",
  labelText = "Some label",
  initial = "Initail value...",
  onInputChangeHandler = () => {
    console.log("you are typing on the input... ");
  },
  error = { message: "something went wrong", status: false },
  color = "",
  borderBottomColor = "",
  isItalic = false,
}: IInput) => {
  const [showPassword, setShowPassword] = useState(false);
  const showPasswordHandler = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="flex flex-col relative w-full">
      <InputLabel
        id={id}
        labelText={error.status ? error.message : labelText}
        isItalic={isItalic}
        color={color}
      />
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        value={initial}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onInputChangeHandler?.(e.target.value)
        }
        id={id}
        className={`outline-none border-b-2 ${
          borderBottomColor ||
          " border-b-slate-200 transition-all duration-200 hover:border-blue-200 focus:border-blue-400 "
        } text-slate-700  px-2 py-2 rounded-sm bg-gray-100`}
      />
      {type === "password" && (
        <span
          className="absolute right-2 top-[2.3rem] text-slate-600 text-lg transition-all duration-200 hover:scale-[1.1] active:scale-[1] cursor-pointer"
          onClick={showPasswordHandler}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  );
};

export default Input;
