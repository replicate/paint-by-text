import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon } from "lucide-react";

export default function Dropzone(props) {
  const onImageDropped = props.onImageDropped;
  const onDrop = useCallback(
    (acceptedFiles) => {
      onImageDropped(acceptedFiles[0]);
    },
    [onImageDropped]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="lil-button cursor-pointer select-none" {...getRootProps()}>
      <div className="m-auto">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>
            <UploadIcon className="icon" />
            Upload an image
          </p>
        )}
      </div>
    </div>
  );
}
