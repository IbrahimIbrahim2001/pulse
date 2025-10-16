import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
    selectedImage: File;
    removeSelectedImage: () => void;
}

export const ImagePreview = ({ selectedImage, removeSelectedImage }: ImagePreviewProps) => {
    return (
        <div className="mb-2 p-2 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-xs bg-black">IMG</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{selectedImage.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {(selectedImage.size / 1024).toFixed(2)} KB
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeSelectedImage}
                    className="h-6 text-muted-foreground hover:text-destructive"
                >
                    Remove
                </Button>
            </div>
        </div>
    )
}