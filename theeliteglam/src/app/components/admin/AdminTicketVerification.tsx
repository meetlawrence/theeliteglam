"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import QRCode from "qrcode";
import { AdminButton } from "./AdminButton";
import type { TicketVerificationRecord } from "./AdminTicketTypes";

interface AdminTicketVerificationProps {
  history: TicketVerificationRecord[];
  onVerify: (code: string) => void;
}

export default function AdminTicketVerification({ history, onVerify }: AdminTicketVerificationProps) {
  const [code, setCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [sampleQRCode, setSampleQRCode] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastRecord = history[0];

  useEffect(() => {
    QRCode.toDataURL("TK-86001").then(setSampleQRCode).catch(() => setSampleQRCode(null));

    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = () => {
    if (scanIntervalRef.current !== null) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  };

  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;
    if (video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    const result = jsQR(imageData.data, width, height, { inversionAttempts: "attemptBoth" });

    if (result?.data) {
      stopScanner();
      const scannedCode = result.data.trim();
      setCode(scannedCode);
      setScanMessage(`Scanned ticket code: ${scannedCode}`);
      onVerify(scannedCode);
    }
  };

  const startScanner = async () => {
    setScanError(null);
    setScanMessage(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setScanError("Camera access is not supported by this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setIsScanning(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      scanIntervalRef.current = window.setInterval(scanFrame, 500);
    } catch (error) {
      setScanError("Unable to access camera. Please allow camera permission and try again.");
    }
  };

  return (
    <div className="border border-[#1a170e] bg-[#080808] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[#F5EDD6] font-serif text-lg">Ticket Verification</h2>
          <p className="text-muted-foreground text-xs">Scan or enter a ticket code to verify access.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter ticket code"
            className="flex-1 p-2 bg-[#0D0D0D] border border-[#1a170e] text-[#F5EDD6]"
          />
          <div className="flex gap-3 flex-wrap">
            <AdminButton
              label="Verify"
              variant="filled"
              onClick={() => {
                onVerify(code.trim());
                setCode("");
                setScanMessage(null);
              }}
            />
            <AdminButton
              label={isScanning ? "Stop Scanner" : "Scan QR"}
              variant="ghost"
              onClick={() => {
                if (isScanning) {
                  stopScanner();
                } else {
                  startScanner();
                }
              }}
            />
          </div>
        </div>

        {isScanning && (
          <div className="overflow-hidden rounded-none border border-[#1a170e] bg-black">
            <video ref={videoRef} className="h-64 w-full object-cover" muted playsInline />
            <div className="p-3 text-xs text-muted-foreground">Point your camera at a QR code to scan.</div>
          </div>
        )}

        {scanError && <div className="rounded-none border border-[#1a170e] bg-[#0D0D0D] p-3 text-sm text-[#ef4444]">{scanError}</div>}
        {scanMessage && <div className="rounded-none border border-[#1a170e] bg-[#0D0D0D] p-3 text-sm text-[#F5EDD6]">{scanMessage}</div>}

        {sampleQRCode && (
          <div className="space-y-3 rounded-none border border-[#1a170e] bg-[#0D0D0D] p-4">
            <div className="text-sm font-semibold text-[#F5EDD6]">Sample QR Code</div>
            <p className="text-xs text-muted-foreground">Use this sample code to test the scanner: <span className="text-[#F5EDD6]">TK-86001</span></p>
            <img src={sampleQRCode} alt="Sample ticket QR code" className="mx-auto h-40 w-40 object-contain" />
          </div>
        )}

        {lastRecord ? (
          <div className="border border-[#1a170e] bg-[#0D0D0D] p-3">
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Last Scan</div>
            <div className="mt-2 text-sm text-[#F5EDD6]">{lastRecord.code}</div>
            <div className="text-xs text-muted-foreground">{lastRecord.buyer} · {lastRecord.ticketType}</div>
            <div className={`mt-2 text-sm ${lastRecord.status === "Valid" ? "text-[#4ade80]" : lastRecord.status === "Already Used" ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
              {lastRecord.status}
            </div>
            <div className="text-[0.7rem] text-muted-foreground mt-1">{lastRecord.timestamp}</div>
          </div>
        ) : (
          <div className="border border-[#1a170e] bg-[#0D0D0D] p-3 text-muted-foreground">No verification attempts yet.</div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-4 overflow-x-auto border-t border-[#1a170e] pt-3">
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-2">Verification History</div>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#1a170e] text-[0.7rem] uppercase text-muted-foreground">
              <tr>
                <th className="px-2 py-2">Code</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 4).map((record) => (
                <tr key={record.code + record.timestamp} className="border-b border-[#1a170e]">
                  <td className="px-2 py-2 text-[#F5EDD6]">{record.code}</td>
                  <td className="px-2 py-2 text-muted-foreground">{record.status}</td>
                  <td className="px-2 py-2 text-muted-foreground">{record.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
