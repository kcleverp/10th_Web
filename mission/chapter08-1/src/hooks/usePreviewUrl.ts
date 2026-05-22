import { useCallback, useEffect, useState, type ChangeEvent } from 'react';

function revokeIfBlob(url: string | null) {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
}

export function usePreviewUrl(isActive: boolean, remoteUrl: string | null) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isActive) {
      setPreviewUrl((prev) => {
        revokeIfBlob(prev);
        return null;
      });
      setSelectedFile(null);
      return;
    }

    setSelectedFile(null);
    setPreviewUrl((prev) => {
      revokeIfBlob(prev);
      return remoteUrl;
    });
  }, [isActive, remoteUrl]);

  useEffect(() => {
    return () => {
      revokeIfBlob(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl((prev) => {
      revokeIfBlob(prev);
      return URL.createObjectURL(file);
    });
  }, []);

  return { previewUrl, selectedFile, handleFileChange };
}
