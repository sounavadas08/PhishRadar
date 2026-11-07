import React, { useEffect, useRef } from 'react';

export const CyberGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>/?;:"[]{}\\|!@#$%^&*()_+-=';
    let columns = 0;
    let rows = 0;

    const createTile = () => {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.textContent = chars[Math.floor(Math.random() * chars.length)];

      tile.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        target.textContent = chars[Math.floor(Math.random() * chars.length)];
        target.classList.add('glitch');
        setTimeout(() => target.classList.remove('glitch'), 250);
      });

      return tile;
    };

    const createGrid = () => {
      grid.innerHTML = '';
      const size = 64;
      columns = Math.max(10, Math.floor(window.innerWidth / size));
      rows = Math.max(10, Math.floor(window.innerHeight / size));

      grid.style.setProperty('--columns', columns.toString());
      grid.style.setProperty('--rows', rows.toString());

      const totalTiles = columns * rows;
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < totalTiles; i++) {
        fragment.appendChild(createTile());
      }
      grid.appendChild(fragment);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const radius = Math.min(window.innerWidth, window.innerHeight) / 3;

      const children = grid.children;
      for (let i = 0; i < children.length; i++) {
        const tile = children[i] as HTMLElement;
        const rect = tile.getBoundingClientRect();
        const tileX = rect.left + rect.width / 2;
        const tileY = rect.top + rect.height / 2;

        const distance = Math.hypot(mouseX - tileX, mouseY - tileY);
        const intensity = Math.max(0, 1 - distance / radius);
        tile.style.setProperty('--intensity', intensity.toFixed(2));
      }
    };

    window.addEventListener('resize', createGrid);
    window.addEventListener('mousemove', handleMouseMove);

    createGrid();

    return () => {
      window.removeEventListener('resize', createGrid);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={gridRef} id="tiles" aria-hidden="true" />;
};

