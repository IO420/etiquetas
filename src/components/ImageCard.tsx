'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ImageCard.module.css';

interface ImageCardProps {
  item: {
    id: string;
    title: string;
    layersData: any;
  };
  onClick: () => void;
}

export default function ImageCard({ item, onClick }: ImageCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchPreview = async () => {
      try {
        const response = await axios.post(
          'http://localhost:3001/image/label',
          item.layersData,
          { responseType: 'blob' }
        );
        
        if (active) {
          const url = URL.createObjectURL(response.data);
          setImageUrl(url);
        }
      } catch (error) {
        console.error('Error al cargar vista previa:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPreview();

    return () => {
      active = false;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [item]);

  return (
    <div className={styles.card} onClick={onClick}>
      {loading ? (
        <div className={styles.skeleton}>Cargando plantilla...</div>
      ) : (
        <img src={imageUrl || ''} alt={item.title} className={styles.cardImage} />
      )}
      <div className={styles.overlay}>
        <span>{item.title}</span>
      </div>
    </div>
  );
}