"use client";

import { ImagePlusIcon, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "./button";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    values: string[];
}
const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    values,
}) => {
    const [mounted, isMounted] = useState(false);

    useEffect(() => {
        isMounted(true);
    }, []);

    const onUpload = async (result: any) => {
        onChange(result.info.secure_url);
    };
    if (!mounted) return null;

    return (
        <div>
            <div className="mb-4 flex gap-x-4 items-center">
                {values.map((url) => (
                    <div
                        key={url}
                        className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
                    >
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                variant={"destructive"}
                                onClick={() => onRemove(url)}
                                size={"icon"}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            src={url}
                            fill
                            className="rounded-md object-cover"
                            alt="image"
                        />
                    </div>
                ))}
            </div>

            <CldUploadWidget onUpload={onUpload} uploadPreset="jpsnc2o6">
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            onClick={onClick}
                            variant={"secondary"}
                        >
                            <ImagePlusIcon className="h-4 w-4 mr-2" />
                            Upload an Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload;
