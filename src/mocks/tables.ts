import type { DiningTable } from "@/types"

export const TABLES: DiningTable[] = [
  // Zone A
  { id: "t-01", name: "T-01", seats: 2, status: "available", size: "small", zone: "A" },
  { id: "t-02", name: "T-02", seats: 2, status: "occupied", size: "small", zone: "A" },
  { id: "t-03", name: "T-03", seats: 8, status: "available", size: "large", zone: "A" },
  { id: "t-04", name: "T-04", seats: 2, status: "available", size: "small", zone: "A" },
  { id: "t-05", name: "T-05", seats: 2, status: "occupied", size: "small", zone: "A" },
  // Zone B
  { id: "t-06", name: "T-06", seats: 2, status: "available", size: "small", zone: "B" },
  { id: "t-07", name: "T-07", seats: 2, status: "occupied", size: "small", zone: "B" },
  { id: "t-08", name: "T-08", seats: 8, status: "reserved", size: "large", zone: "B" },
  { id: "t-09", name: "T-09", seats: 2, status: "available", size: "small", zone: "B" },
  { id: "t-10", name: "T-10", seats: 2, status: "reserved", size: "small", zone: "B" },
  // Zone C
  { id: "t-11", name: "T-11", seats: 2, status: "reserved", size: "small", zone: "C" },
  { id: "t-12", name: "T-12", seats: 2, status: "reserved", size: "small", zone: "C" },
  { id: "t-13", name: "T-13", seats: 8, status: "available", size: "large", zone: "C" },
  { id: "t-14", name: "T-14", seats: 2, status: "occupied", size: "small", zone: "C" },
  { id: "t-15", name: "T-15", seats: 2, status: "available", size: "small", zone: "C" },
]
