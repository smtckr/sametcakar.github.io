/**
 * Client-side high-quality image compressor and optimizer.
 * Resizes large camera photos to safe web dimensions and compresses to lightweight JPEG.
 * Prevents localStorage quota errors and eliminates upload lag.
 */

export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 900,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG, return as data url directly
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => {
        // Fallback: If image constructor fails to decode (e.g. HEIC or raw), return standard data url
        if (typeof e.target?.result === "string") {
          resolve(e.target.result);
        } else {
          reject(new Error("Görsel yüklenemedi. Lütfen geçerli bir JPG veya PNG dosyası seçin."));
        }
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio scaled dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(width, 10);
        canvas.height = Math.max(height, 10);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight JPEG data URL
        try {
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(reader.result as string);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
