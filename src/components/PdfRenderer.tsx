"use client";
import React, { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css"; // Zoom plugin styles

interface PdfRendererProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  useEffect(() => {
    // Ensure this runs on client-side only and sets the correct worker path
    pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;
  }, []);

  const { width, ref } = useResizeDetector();
  const [scale, setScale] = useState<number>(1);

  // Use the zoom plugin
  const zoomPluginInstance = zoomPlugin();

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      {/* Top bar */}
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" aria-label="previous page">
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input className="w-12 h-8" />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>5</span>
            </p>
          </div>
          <Button variant="ghost" aria-label="next page">
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" aria-label="zoom" variant="ghost">
                <Search className="h-4 w-4" />
                {scale * 100}%<ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(1);
                  zoomPluginInstance.zoomTo(1); // Zoom to 100%
                }}
              >
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(1.5);
                  zoomPluginInstance.zoomTo(1.5); // Zoom to 150%
                }}
              >
                150%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(2);
                  zoomPluginInstance.zoomTo(2); // Zoom to 200%
                }}
              >
                200%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(2.5);
                  zoomPluginInstance.zoomTo(2.5); // Zoom to 250%
                }}
              >
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 w-full h-full p-4 overflow-auto">
        <div ref={ref}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.min.js">
            <div className="mx-auto border border-gray-300 rounded shadow-sm" style={{ width: width ? `${width}px` : '750px' }}>
              {/* Apply the zoom plugin to the Viewer */}
              <Viewer fileUrl={`https://utfs.io/f/${url}`} plugins={[zoomPluginInstance]} />
            </div>
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
