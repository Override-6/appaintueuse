import {useState} from 'react';

// Liste dynamique de saisies (zones retirées) : ajout d'une case vide, modification par index
export function useZones() {
  const [zones, setZones] = useState<string[]>([]);

  const addZone = () => setZones(zs => [...zs, '']);

  const setZone = (index: number, value: string) =>
    setZones(zs => zs.map((z, i) => (i === index ? value : z)));

  return {zones, addZone, setZone};
}
