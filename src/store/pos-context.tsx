/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { ServiceMode } from "@/types"

export type OrderType = "running" | "reservation"

export type Reservation = {
  tables: string[]
  orderType: OrderType
  time?: string
  date?: string
}

type PosContextValue = {
  cart: Record<string, number>
  customerName: string
  tables: string[]
  orderType: OrderType
  reservationTime?: string
  reservationDate?: string
  note: string
  mode: ServiceMode
  setCustomerName: (name: string) => void
  setReservation: (r: Reservation) => void
  clearTables: () => void
  setNote: (note: string) => void
  setMode: (mode: ServiceMode) => void
  incrementItem: (id: string) => void
  decrementItem: (id: string) => void
  clearOrder: () => void
}

const PosContext = createContext<PosContextValue | null>(null)

export function PosProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [customerName, setCustomerName] = useState("")
  const [tables, setTables] = useState<string[]>([])
  const [orderType, setOrderType] = useState<OrderType>("running")
  const [reservationTime, setReservationTime] = useState<string | undefined>(undefined)
  const [reservationDate, setReservationDate] = useState<string | undefined>(undefined)
  const [note, setNote] = useState("")
  const [mode, setMode] = useState<ServiceMode>("dine-in")

  const setReservation = useCallback((r: Reservation) => {
    setTables(r.tables)
    setOrderType(r.orderType)
    setReservationTime(r.time)
    setReservationDate(r.date)
  }, [])

  const clearTables = useCallback(() => {
    setTables([])
    setOrderType("running")
    setReservationTime(undefined)
    setReservationDate(undefined)
  }, [])

  const incrementItem = useCallback((id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }, [])

  const decrementItem = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev }
      const curr = next[id] ?? 0
      if (curr <= 1) delete next[id]
      else next[id] = curr - 1
      return next
    })
  }, [])

  const clearOrder = useCallback(() => {
    setCart({})
    setCustomerName("")
    setTables([])
    setOrderType("running")
    setReservationTime(undefined)
    setReservationDate(undefined)
    setNote("")
  }, [])

  const value = useMemo<PosContextValue>(
    () => ({
      cart,
      customerName,
      tables,
      orderType,
      reservationTime,
      reservationDate,
      note,
      mode,
      setCustomerName,
      setReservation,
      clearTables,
      setNote,
      setMode,
      incrementItem,
      decrementItem,
      clearOrder,
    }),
    [
      cart,
      customerName,
      tables,
      orderType,
      reservationTime,
      reservationDate,
      note,
      mode,
      setReservation,
      clearTables,
      incrementItem,
      decrementItem,
      clearOrder,
    ]
  )

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>
}

export function usePos() {
  const ctx = useContext(PosContext)
  if (!ctx) throw new Error("usePos must be used inside <PosProvider>")
  return ctx
}
