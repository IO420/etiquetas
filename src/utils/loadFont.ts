export const loadCustomFont = async (fontFamily: string, fontUrl: string) => {
  try {
    console.log("dowload",fontFamily,fontUrl)
    const font = new FontFace(fontFamily, `url(${fontUrl})`);
    const loadedFont = await font.load();
    document.fonts.add(loadedFont);
  } catch (error) {
    console.error(`Error al cargar la fuente ${fontFamily}:`, error);
  }
};