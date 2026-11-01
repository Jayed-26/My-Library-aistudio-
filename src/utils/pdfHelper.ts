import { jsPDF } from 'jspdf';
import { Ebook } from '../types.ts';

/**
 * Creates an elegant, formatted PDF for an E-book using jsPDF.
 * Used for both initial sample downloads and one-click PDF generation in Admin Dashboard.
 */
export function generateEbookPdf(book: Ebook, isPreview: boolean = false): { blob: Blob; dataUrl: string; fileName: string; fileSize: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // --- Page 1: Cover Page ---
  // Background warm tint
  doc.setFillColor(250, 247, 242); // Warm cream #FAF7F2
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative top accent bar (Amber/Yellow brand theme)
  doc.setFillColor(245, 158, 11); // Amber 500
  doc.rect(0, 0, pageWidth, 12, 'F');

  // Edition Badge
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.roundedRect(margin, 35, 65, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9); // Amber 700
  doc.text(isPreview ? 'FREE SAMPLE PREVIEW' : 'OFFICIAL AUTHOR EDITION', margin + 4, 40.5);

  // Book Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(28, 25, 23); // Stone 900
  const titleLines = doc.splitTextToSize(book.title, contentWidth);
  doc.text(titleLines, margin, 65);

  // Subtitle
  const titleOffset = 65 + titleLines.length * 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(87, 83, 78); // Stone 600
  const subLines = doc.splitTextToSize(book.subtitle, contentWidth);
  doc.text(subLines, margin, titleOffset);

  // Decorative divider line
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1);
  doc.line(margin, titleOffset + 15, margin + 50, titleOffset + 15);

  // Author details
  const authorOffset = titleOffset + 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(28, 25, 23);
  doc.text('Author: Jayed Mahmud', margin, authorOffset);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120, 113, 108);
  doc.text('Official Digital Store · Direct Author Publication', margin, authorOffset + 7);
  doc.text(`Published: ${book.publishedDate} · Category: ${book.category}`, margin, authorOffset + 13);
  doc.text(`Original Price: BDT ৳${book.price}`, margin, authorOffset + 19);

  // Synopsis box
  const boxTop = authorOffset + 32;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, boxTop, contentWidth, 50, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9);
  doc.text('ABOUT THIS PUBLICATION', margin + 6, boxTop + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(68, 64, 60);
  const descLines = doc.splitTextToSize(book.description, contentWidth - 12);
  doc.text(descLines, margin + 6, boxTop + 16);

  // Bottom Footer on Cover
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(168, 162, 158);
  doc.text(
    isPreview
      ? 'This is a free preview excerpt. To unlock full edition, visit jayedmahmud.com'
      : 'Official licensed copy for verified reader. Redistribution prohibited.',
    margin,
    pageHeight - 15
  );

  // --- Subsequent Pages: Chapters Content ---
  const chapters = isPreview
    ? book.previewContent.chapters
    : book.fullContent?.chapters || book.previewContent.chapters;

  chapters.forEach((chapter, index) => {
    doc.addPage('a4', 'portrait');

    // Page Header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(168, 162, 158);
    doc.text(`${book.title} · Jayed Mahmud`, margin, 12);
    doc.text(isPreview ? 'Sample Preview' : 'Full Edition', pageWidth - margin - 25, 12);
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, 14, pageWidth - margin, 14);

    // Chapter Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9);
    doc.text(chapter.number.toUpperCase(), margin, 26);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(28, 25, 23);
    const chTitleLines = doc.splitTextToSize(chapter.title, contentWidth);
    doc.text(chTitleLines, margin, 34);

    // Chapter divider
    const chDividerY = 34 + chTitleLines.length * 8;
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(0.8);
    doc.line(margin, chDividerY, margin + 35, chDividerY);

    // Chapter Body Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81); // Gray 700

    let currentY = chDividerY + 12;
    const paragraphs = [
      chapter.content,
      'When we reflect on high performance and deep creative satisfaction, the key differentiator is rarely raw intelligence or extreme hours. It is the clarity of our frameworks and the intentional elimination of cognitive clutter.',
      'By committing to deliberate constraints and measuring progress based on real output rather than perceived busyness, you reclaim autonomy over your creative energy.',
      'Key Takeaways from this section:',
      '1. Focus is a muscle that strengthens with systematic, frictionless practice.',
      '2. Guard your prime energy hours with uncompromising discipline.',
      '3. Compound small incremental wins into exponential creative leverage.'
    ];

    paragraphs.forEach((p, pIdx) => {
      if (pIdx === 3) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(28, 25, 23);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81);
      }
      const lines = doc.splitTextToSize(p, contentWidth);
      if (currentY + lines.length * 6 > pageHeight - 20) {
        doc.addPage('a4', 'portrait');
        currentY = 25;
      }
      doc.text(lines, margin, currentY);
      currentY += lines.length * 6 + 5;
    });

    // Page Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(168, 162, 158);
    doc.text(`Page ${index + 2}`, pageWidth / 2 - 5, pageHeight - 10);
  });

  const blob = doc.output('blob');
  const dataUrl = doc.output('datauristring');
  const safeTitle = book.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const fileName = `${safeTitle}-${isPreview ? 'preview-sample' : 'full-edition'}.pdf`;
  const sizeInMb = (blob.size / (1024 * 1024)).toFixed(2);
  const fileSize = blob.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(blob.size / 1024)} KB`;

  return { blob, dataUrl, fileName, fileSize };
}

/**
 * Direct file download trigger for any URL or Blob.
 */
export function downloadFile(source: string | Blob, fileName: string): void {
  let url = '';
  let needRevoke = false;

  if (typeof source === 'string') {
    url = source;
  } else {
    url = URL.createObjectURL(source);
    needRevoke = true;
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (needRevoke) {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/**
 * Converts a browser File object to base64 Data URL and returns metadata.
 */
export function readFileAsDataUrl(file: File): Promise<{ dataUrl: string; fileName: string; fileSize: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
      const fileSize = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;
      resolve({
        dataUrl,
        fileName: file.name,
        fileSize
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
