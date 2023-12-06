"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";         // changed

interface PreviewProps {            // changed
    value: string;
};

const Preview = ({                  // changed
    value
}: PreviewProps) => {

    // Avoid hydration error
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

    return (
        <ReactQuill                 // changed
            theme="bubble"
            value={value}
            readOnly
        />
    );
};

export default Preview