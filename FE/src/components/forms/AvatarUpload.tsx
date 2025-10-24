"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateProfile } from "@/lib/api/hooks/auth";
import { useRef, useState } from "react";
// Note: Using console.log for now, replace with proper toast implementation
import { Camera, Loader2, Upload, User, X } from "lucide-react";

interface AvatarUploadProps {
  currentAvatar?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AvatarUpload({
  currentAvatar,
  onClose,
  onSuccess,
}: AvatarUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfileMutation = useUpdateProfile();

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("Vui lòng chọn ảnh để upload");
      return;
    }

    try {
      // Convert file to base64 for now (in real app, you'd upload to server)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        await updateProfileMutation.mutateAsync({
          avatar: base64,
        });

        console.log("Cập nhật avatar thành công!");
        onSuccess();
      };
      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      console.error("Upload avatar error:", error);
      console.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi upload avatar"
      );
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật avatar</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Avatar */}
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Ảnh hiện tại</div>
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mx-auto">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Current avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {preview ? (
              <div className="space-y-4">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mx-auto">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Xóa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Chọn khác
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Kéo thả ảnh vào đây hoặc
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Chọn ảnh
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF tối đa 5MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={updateProfileMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Cập nhật
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
