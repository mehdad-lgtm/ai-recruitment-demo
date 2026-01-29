"use client";

import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Copy,
    Download,
    Eye,
    Plus,
    QrCode,
    Search,
    Trash2
} from "lucide-react";
import { useState } from "react";

// Mock data - replace with real API calls
const mockQRCodes = [
  {
    id: "qr-001",
    code: "QR-001",
    location: "Mall Event - Orchard",
    createdAt: "2026-01-15",
    scans: 145,
    conversions: 89,
    status: "active",
  },
  {
    id: "qr-002",
    code: "QR-002",
    location: "Job Fair - Expo Center",
    createdAt: "2026-01-20",
    scans: 278,
    conversions: 156,
    status: "active",
  },
  {
    id: "qr-003",
    code: "QR-003",
    location: "University - NUS",
    createdAt: "2026-01-22",
    scans: 67,
    conversions: 45,
    status: "active",
  },
  {
    id: "qr-004",
    code: "QR-004",
    location: "Community Center",
    createdAt: "2026-01-10",
    scans: 34,
    conversions: 12,
    status: "inactive",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-600",
  inactive: "bg-gray-500/10 text-gray-600",
};

export default function QRCodesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  const filteredQRCodes = mockQRCodes.filter(
    (qr) =>
      qr.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalScans = mockQRCodes.reduce((acc, qr) => acc + qr.scans, 0);
  const totalConversions = mockQRCodes.reduce((acc, qr) => acc + qr.conversions, 0);
  const conversionRate = ((totalConversions / totalScans) * 100).toFixed(1);

  return (
    <ProtectedDashboard allowedRoles={["admin", "recruiter"]}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">QR Code Management</h1>
        <p className="text-muted-foreground mt-1">
          Generate, manage, and track your recruitment QR codes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground">Total QR Codes</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{mockQRCodes.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground">Total Scans</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{totalScans}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground">Total Conversions</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{totalConversions}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{conversionRate}%</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search QR codes..."
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button size="sm" className="text-xs sm:text-sm shrink-0">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Generate</span> New QR
        </Button>
      </div>

      {/* QR Code List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <ScrollArea className="w-full">
          <table className="w-full min-w-[800px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Code
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Location
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Created
                </th>
                <th className="text-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Scans
                </th>
                <th className="text-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Conv.
                </th>
                <th className="text-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Rate
                </th>
                <th className="text-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredQRCodes.map((qr) => (
                <tr key={qr.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground text-sm sm:text-base">{qr.code}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-foreground">{qr.location}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground">
                    {new Date(qr.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-medium text-foreground">
                    {qr.scans}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-medium text-foreground">
                    {qr.conversions}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-medium text-green-600">
                    {((qr.conversions / qr.scans) * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                    <span
                      className={cn(
                        "px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize",
                        statusColors[qr.status]
                      )}
                    >
                      {qr.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                        <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 text-destructive">
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {filteredQRCodes.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <QrCode className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No QR codes found</p>
          </div>
        )}
      </div>
    </ProtectedDashboard>
  );
}
