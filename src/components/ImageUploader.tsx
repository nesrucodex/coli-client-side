import { ChangeEvent, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import InputLabel from "./InputLabel";
import { useState } from "react";

type IImageUploader = {
  id: string;
  labelText: string;
  initial: File | null;
  imageUploadHandler?: (file: File) => void;
};
const ImageUploader = ({
  id,
  labelText,
  initial,
  imageUploadHandler,
}: IImageUploader) => {
  const [image, setImage] = useState({
    filename: initial?.name || "",
    src: (initial && URL.createObjectURL(initial)) || "",
  });
  const onImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    imageUploadHandler?.(file);
    const url = URL.createObjectURL(file);

    setImage({ filename: file.name, src: url });
  };

  useEffect(() => {
    if (!initial) setImage({ filename: "", src: "" });
  }, [initial]);

  return (
    <div className="relative">
      <InputLabel id={id} labelText={labelText}>
        <div className="text-lg rounded-sm py-2 px-2 text-center flex items-center gap-4 ring-1 ring-gray-200 bg-gray-100 mt-1">
          <span className="text-[20px]">
            <FaUpload />
          </span>
          <span className="text-[14px] not-italic ">
            {image.filename || "Upload Profile"}
          </span>
        </div>
      </InputLabel>
      <input type="file" className="hidden" id={id} onChange={onImageUpload} />

      {image.src && (
        <div className="absolute top-0 right-0 size-[5rem]">
          <img
            src={image.src}
            className="w-full aspect-[1/1] rounded-full object-cover ring-4 ring-slate-600 ring-offset-[.15rem] border-[.1rem]"
            alt="profile"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
