// Convierte valores RGB a Hexadecimal
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// Devuelve el color exacto del píxel según las coordenadas de clic
export async function getPixelColorAt(
  imageUrl: string,
  targetX: number,
  targetY: number,
  imageWidth: number,
  imageHeight: number
): Promise<{ r: number; g: number; b: number; hex: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("No ctx");

      ctx.drawImage(img, 0, 0);

      // Mapear las coordenadas de la pantalla a la escala natural del archivo
      const scaleX = img.naturalWidth / imageWidth;
      const scaleY = img.naturalHeight / imageHeight;
      const pixelX = Math.floor(targetX * scaleX);
      const pixelY = Math.floor(targetY * scaleY);

      const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
      const r = pixel[0], g = pixel[1], b = pixel[2];

      resolve({ r, g, b, hex: rgbToHex(r, g, b) });
    };

    img.onerror = (err) => reject(err);
  });
}

// Remueve el color seleccionado y devuelve una imagen Base64 PNG transparente
export async function makeColorTransparent(
  imageUrl: string,
  targetR: number,
  targetG: number,
  targetB: number,
  tolerance: number = 30
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("No ctx");

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Evaluar cada píxel (RGBA)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calcular la distancia cromática (tolerancia)
        if (
          Math.abs(r - targetR) <= tolerance &&
          Math.abs(g - targetG) <= tolerance &&
          Math.abs(b - targetB) <= tolerance
        ) {
          data[i + 3] = 0; // Vuelve el píxel transparente
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = (err) => reject(err);
  });
}