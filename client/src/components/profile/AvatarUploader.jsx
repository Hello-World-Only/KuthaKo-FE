import { useState } from "react";

export default function AvatarUploader({ onChange }) {
    const [preview, setPreview] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);

        onChange(file);
    };

    return (
        <div style={{ textAlign: "center" }}>
            <label>
                <div
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: "#eee",
                        overflow: "hidden",
                        cursor: "pointer",
                        margin: "auto",
                    }}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="avatar"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                fontSize: 14,
                                color: "#666",
                            }}
                        >
                            Upload
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    style={{ display: "none" }}
                />
            </label>
        </div>
    );
}
