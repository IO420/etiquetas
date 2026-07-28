'use client';

import { useState } from 'react';
import ImageCard from '@/components/ImageCard';
import styles from './page.module.css';
import ModalDownload from '@/components/ModalDownload';

export interface TemplateItem {
  id: string;
  title: string;
  layersData: {
    canvasWidth?: number;
    canvasHeight?: number;
    layers: any[];
  };
}

//just to test
const TEMPLATES:TemplateItem[] = [
  {
    id: 'flores-stitch',
    title: 'Portada Flores & Stitch',
    layersData: {
      canvasWidth:600,
      canvasHeight:850,
      layers: [
        { type: 'image', image: 'wallPaperFlowers.webp', position: { x: 0, y: 0 } },
        { type: 'wave', position: { x: -280, y: -8 }, fillColor: '#ff751f', strokeWidth: 6 },
        { type: 'image', image: 'stichSentadoSobreFlores.webp', position: { x: 180, y: -110 }, width: 500, height: 760 },
        { type: 'text', text: 'Materia', position: { x: 75, y: 400 }, color: '#fff', fontSize: 90, rotation: -90 },
        { type: 'rectangle', position: { x: 230, y: 530 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Nombre:', position: { x: 300, y: 510 }, fontSize: 35, fontWeight: 'bold' },
        { type: 'rectangle', position: { x: 230, y: 630 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Grado:', position: { x: 300, y: 610 }, fontSize: 35, fontWeight: 'bold' },
        { type: 'rectangle', position: { x: 230, y: 730 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Maestro:', position: { x: 300, y: 710 }, fontSize: 35, fontWeight: 'bold' },
      ],
    },
  },
  {
    id: 'tiburon-leonardo',
    title: 'Etiqueta Tiburón Leonardo',
    layersData: {
      canvasWidth:600,
      canvasHeight:350,
      layers: [
        { type: 'image', image: 'tiburon.png', position: { x: 150, y: 20 }, width: 300, height: 260 },
        { type: 'text', text: 'LEONARDO', textFont: 'Shark.ttf', position: { x: 300, y: 270 }, color: '#005580', fontSize: 90,strokeWidth:8 },
        { type: 'text', text: 'Mendez Saucedo', textFont: 'Hickory Jack.ttf', position: { x: 380, y: 310 }, fontSize: 45,strokeWidth:8 }
      ]
    }
  },
    {
    id: 'flores-stitch azul',
    title: 'Portada Flores & Stitch',
    layersData: {
            canvasWidth:600,
      canvasHeight:850,
      layers: [
        { type: 'image', image: 'wallPaperFlowers.webp', position: { x: 0, y: 0 } },
        { type: 'wave', position: { x: -280, y: -8 }, fillColor: 'blue', strokeWidth: 6 },
        { type: 'image', image: 'stichSentadoSobreFlores.webp', position: { x: 180, y: -110 }, width: 500, height: 760 },
        { type: 'text', text: 'Materia', position: { x: 75, y: 400 }, color: '#fff', fontSize: 90, rotation: -90 },
        { type: 'rectangle', position: { x: 230, y: 530 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Nombre:', position: { x: 300, y: 510 }, fontSize: 35, fontWeight: 'bold' },
        { type: 'rectangle', position: { x: 230, y: 630 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Grado:', position: { x: 300, y: 610 }, fontSize: 35, fontWeight: 'bold' },
        { type: 'rectangle', position: { x: 230, y: 730 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Maestro:', position: { x: 300, y: 710 }, fontSize: 35, fontWeight: 'bold' },
      ],
    },
  },
    {
    id: 'flores-stitch verde',
    title: 'Portada Flores & Stitch',
    layersData: {
            canvasWidth:600,
      canvasHeight:850,
      layers: [
        { type: 'image', image: 'wallPaperFlowers.webp', position: { x: 0, y: 0 } },
        { type: 'wave', position: { x: -280, y: -8 }, fillColor: 'green', strokeWidth: 6 },
        { type: 'image', image: 'stichSentadoSobreFlores.webp', position: { x: 180, y: -110 }, width: 500, height: 760 },
        { type: 'text', text: 'Materia', position: { x: 75, y: 400 }, color: '#fff', fontSize: 90, rotation: -90 },
        { type: 'rectangle', position: { x: 230, y: 530 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Nombre:', position: { x: 300, y: 510 }, fontSize: 35, fontWeight: 'bold' },
        { type: 'rectangle', position: { x: 230, y: 630 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Grado:', position: { x: 300, y: 610 }, fontSize: 35, fontWeight: 'bold' },
        { type: 'rectangle', position: { x: 230, y: 730 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Maestro:', position: { x: 300, y: 710 }, fontSize: 35, fontWeight: 'bold' },
      ],
    },
  },
    {
    id: 'flores-stitch rojo',
    title: 'Portada Flores & Stitch',
    layersData: {
            canvasWidth:600,
      canvasHeight:850,
      layers: [
        { type: 'image', image: 'wallPaperFlowers.webp', position: { x: 0, y: 0 } },
        { type: 'wave', position: { x: -280, y: -8 }, fillColor: 'red', strokeWidth: 6 },
        { type: 'image', image: 'stichSentadoSobreFlores.webp', position: { x: 180, y: -110 }, width: 500, height: 760 },
        { type: 'text', text: 'Materia', position: { x: 75, y: 400 }, color: '#fff', fontSize: 90, rotation: -90 },
        { type: 'rectangle', position: { x: 230, y: 530 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Nombre:', position: { x: 300, y: 510 }, fontSize: 35, fontWeight: 'bold' },
        { type: 'rectangle', position: { x: 230, y: 630 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Grado:', position: { x: 300, y: 610 }, fontSize: 35, fontWeight: 'bold' },
        { type: 'rectangle', position: { x: 230, y: 730 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Maestro:', position: { x: 300, y: 710 }, fontSize: 35, fontWeight: 'bold' },
      ],
    },
  },
    {
    id: 'flores-stitch morado',
    title: 'Portada Flores & Stitch',
    layersData: {
      canvasWidth:600,
      canvasHeight:850,
      layers: [
        { type: 'image', image: 'wallPaperFlowers.webp', position: { x: 0, y: 0 } },
        { type: 'wave', position: { x: -280, y: -8 }, fillColor: 'purple', strokeWidth: 6 },
        { type: 'image', image: 'goku.webp', position: { x: 120, y: 0 }, width: 500, height: 760 },
        { type: 'text', text: 'Materia', position: { x: 75, y: 400 }, color: '#fff', fontSize: 90, rotation: -90 },
        { type: 'rectangle', position: { x: 230, y: 530 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Nombre:', position: { x: 300, y: 510 }, fontSize: 35, fontWeight: 'bold' },
        { type: 'rectangle', position: { x: 230, y: 630 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Grado:', position: { x: 300, y: 610 }, fontSize: 35, fontWeight: 'bold' },
        { type: 'rectangle', position: { x: 230, y: 730 }, fillColor: '#fff', height: 50, width: 350, borderRadius: 30, strokeWidth: 2, strokeColor: '#000', dash: [5, 5] },
        { type: 'text', text: 'Maestro:', position: { x: 300, y: 710 }, fontSize: 35, fontWeight: 'bold' },
      ],
    },
  },
      {
    id: 'demondHunters',
    title: 'Portada Flores & Stitch',
    layersData: {
      canvasWidth:400,
      canvasHeight:200,
      layers: [
        { type: 'image', image: 'demondHuntersBack.webp', position: { x: 0, y: 0 }, width: 400 },
        { type: 'rectangle', position: { x: 30, y: 30 }, fillColor: '#fff', height:145, width: 345, borderRadius: 30 },
        { type: 'image', image: 'gerrerasKpop3.webp', position: { x: 300, y: 0 }, width: 100 },
        { type: 'rectangle', position: { x: 50, y: 120 }, fillColor: '#cba4d3', height: 40, width: 200, borderRadius: 30 },
        { type: 'image', image: 'gerrerasKpopAbraso3.webp', position: { x: 0, y: 90 }, width: 150 },
        { type: 'rectangle', position: { x: 260, y: 120 }, fillColor: '#b5dffe', height: 40, width: 100, borderRadius: 30 },

        { type: 'text', text: 'Grado', position: { x: 508, y: 228 }, fontSize: 35, fontWeight: 'bold' },
      ],
    },
  },
];
export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);

  const NUM_COLUMNS = 4;
const columns = Array.from({ length: NUM_COLUMNS }, () => [] as TemplateItem[]);
  TEMPLATES.forEach((item, index) => {
    columns[index % NUM_COLUMNS].push(item);
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Plantillas de Etiquetas</h1>

        <div className={styles.masonryContainer}>
          {columns.map((col, colIndex) => (
            <div 
              key={colIndex} 
              className={`${styles.masonryColumn} ${styles[`col${colIndex}`]}`}
            >
              {col.map((item:TemplateItem) => (
                <ImageCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedTemplate(item)}
                />
              ))}
            </div>
          ))}
        </div>

        {selectedTemplate && (
          <ModalDownload
            item={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
          />
        )}
      </main>
    </div>
  );
}
//IO