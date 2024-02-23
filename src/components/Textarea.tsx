import { ChangeEvent } from "react";
import InputLabel from "./InputLabel";

type ITextarea = {
  id: string;
  labelText: string;
  onTextareaChangeHandler?: (value: string) => void;
  initial: string;
};
const Textarea = ({
  id,
  labelText,
  initial,
  onTextareaChangeHandler,
}: ITextarea) => {
  return (
    <div className="flex flex-col">
      <InputLabel id={id} labelText={labelText} />
      <textarea
        id={id}
        value={initial}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onTextareaChangeHandler?.(e.target.value)
        }
        className="outline-none border-b-2 border-b-slate-200 transition-all duration-300 hover:border-blue-200 focus:border-blue-400 origin-center px-2 py-2 rounded-sm bg-gray-100 resize-none h-[7rem] text-slate-700"
      />
    </div>
  );
};

export default Textarea;
