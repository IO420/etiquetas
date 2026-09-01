export const loadCustomFont = async (fontFamily: string, fontUrl: string) => {
  try {
    console.log("download", fontFamily, fontUrl);

    const encodedUrl = encodeURI(fontUrl);

    const font = new FontFace(fontFamily, `url("${encodedUrl}")`);

    const loadedFont = await font.load();
    document.fonts.add(loadedFont);

    console.log(`Fuente ${fontFamily} cargada correctamente`);
  } catch (error) {
    console.error(`Error al cargar la fuente ${fontFamily}:`, error);
  }
};
