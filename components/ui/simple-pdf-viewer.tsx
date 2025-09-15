'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type PDFPageProxy } from 'pdfjs-dist';

// Configure PDF.js worker from a CDN matching the installed version
// This avoids bundler complexities with module workers in Next.js
GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';

interface SimplePDFViewerProps {
  src: string; // URL or Object URL to the PDF file
  className?: string;
}

// Utility: create absolutely positioned anchors over link annotations
function createLinkOverlay(
  container: HTMLElement,
  viewport: any,
  annotations: any[]
) {
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.pointerEvents = 'none';
  overlay.className = 'pdf-link-overlay';

  for (const ann of annotations) {
    if (ann?.subtype === 'Link' && ann?.url) {
      const rect = viewport.convertToViewportRectangle(ann.rect);
      const x = Math.min(rect[0], rect[2]);
      const y = Math.min(rect[1], rect[3]);
      const w = Math.abs(rect[0] - rect[2]);
      const h = Math.abs(rect[1] - rect[3]);

      const a = document.createElement('a');
      a.href = ann.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.position = 'absolute';
      a.style.left = `${x}px`;
      a.style.top = `${y}px`;
      a.style.width = `${w}px`;
      a.style.height = `${h}px`;
      a.style.pointerEvents = 'auto';
      a.style.background = 'rgba(0,0,0,0)';
      a.title = ann.url;
      overlay.appendChild(a);
    }
  }

  container.appendChild(overlay);
}

export default function SimplePDFViewer({ src, className }: SimplePDFViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);

  const renderPage = useCallback(async (pdf: PDFDocumentProxy, pageNumber: number) => {
    const page: PDFPageProxy = await pdf.getPage(pageNumber);
    const container = containerRef.current!;

    const pageWrapper = document.createElement('div');
    pageWrapper.style.position = 'relative';
    pageWrapper.style.margin = '12px auto';
    pageWrapper.style.width = 'fit-content';

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    // Compute scale to fit container width (minus some padding)
    const maxWidth = Math.min(container.clientWidth - 16, 1200); // cap width
    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = Math.max(0.5, Math.min(2.0, maxWidth / unscaledViewport.width));
    const viewport = page.getViewport({ scale });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    (canvas.style as any).maxWidth = '100%';
    canvas.style.display = 'block';

    pageWrapper.style.height = `${canvas.height}px`;

    pageWrapper.appendChild(canvas);
    container.appendChild(pageWrapper);

    await page.render({ canvasContext: context, viewport }).promise;

    // Add transparent anchors for external links
    try {
      const annotations = await page.getAnnotations({ intent: 'display' });
      createLinkOverlay(pageWrapper, viewport, annotations);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!src || !containerRef.current) return;

      // Cleanup previous content
      containerRef.current.innerHTML = '';
      setDoc(null);

      try {
        const loadingTask = getDocument({ url: src, withCredentials: false });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        setDoc(pdf);

        for (let i = 1; i <= pdf.numPages; i++) {
          // Render sequentially for simplicity
          // eslint-disable-next-line no-await-in-loop
          await renderPage(pdf, i);
          if (cancelled) break;
        }
      } catch (e) {
        console.error('PDF load/render error:', e);
        if (containerRef.current) {
          const err = document.createElement('div');
          err.textContent = 'Erreur de lecture du PDF';
          err.style.color = '#991b1b';
          err.style.padding = '8px';
          containerRef.current.appendChild(err);
        }
      }
    }
    load();

    const containerEl = containerRef.current;
    return () => {
      cancelled = true;
      if (containerEl) containerEl.innerHTML = '';
      if (doc) {
        try { doc.destroy(); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Re-render on resize (basic): re-load document to fit width
  useEffect(() => {
    const handler = () => {
      if (!doc) return;
      // Trigger re-render by resetting src (via state is complex); simplest: rerun effect by updating a data-key
      // Instead, we clear and re-render pages with current doc
      if (!containerRef.current) return;
      const container = containerRef.current;
      container.innerHTML = '';
      (async () => {
        for (let i = 1; i <= doc.numPages; i++) {
          // eslint-disable-next-line no-await-in-loop
          await renderPage(doc, i);
        }
      })();
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [doc, renderPage]);

  return (
    <div className={className} style={{ width: '100%', height: '100%', overflow: 'auto', background: '#f9fafb' }}>
      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }} />
    </div>
  );
}
