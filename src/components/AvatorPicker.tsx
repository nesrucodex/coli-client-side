import { useState } from "react";
import { AVATORS } from "../constants/data";
import InputLabel from "./InputLabel";

type IAvatorPickerProps = {
  onAvatorPick?: (avator: string) => void;
};

const AvatorPicker = ({ onAvatorPick }: IAvatorPickerProps) => {
  const [selectedAvator, setSelectedAvator] = useState(0);

  return (
    <section>
      <InputLabel id="avatorId" labelText="Choice Avator" />
      <div className="flex gap-[1.4rem] overflow-x-scroll overflow-y-hidden scroll-bar-none pt-2 pb-3 px-4 ">
        {AVATORS.map((av) => (
          <span
            key={av.id}
            onClick={() => {
              setSelectedAvator(av.id);
              onAvatorPick?.(av.avator);
            }}
            className={`text-[2.75rem] cursor-pointer transition-all duration-200  ${
              selectedAvator === av.id
                ? "ring-red-400 ring-[.3rem] scale-[1.05] "
                : "ring-[.2rem] ring-slate-400 hover:scale-[1.05] "
            } rounded-full size-[4rem] grid place-items-center active:ring-red-400`}
          >
            {av.avator}
          </span>
        ))}
      </div>
    </section>
  );
};

export default AvatorPicker;
