declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface AutoTableOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    theme?: 'striped' | 'grid' | 'plain';
    headStyles?: Record<string, any>;
    styles?: Record<string, any>;
    margin?: Record<string, number>;
    [key: string]: any;
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void;

  export = autoTable;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable: { finalY: number };
  }
}
