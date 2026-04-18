/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: string
  onSave: (note: string) => void
}

export function AddNoteDialog({ open, onOpenChange, note, onSave }: Props) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(note)

  useEffect(() => {
    if (open) setDraft(note)
  }, [open, note])

  const handleSave = () => {
    onSave(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-bold">
            {t("note_dialog.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="order-note" className="text-sm font-semibold">
            {t("note_dialog.label")}
          </Label>
          <Textarea
            id="order-note"
            placeholder={
              "• Crispy dory sambal matah : Medium – Not spicy\n• Spicy tuna nachos : Medium – Not spicy"
            }
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={7}
            className="bg-muted/40 resize-none rounded-xl h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-full font-medium"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className={cn(
              "h-11 rounded-full bg-blue-600 font-semibold text-white shadow-none",
              "hover:bg-blue-700 focus-visible:ring-blue-600"
            )}
          >
            {t("note_dialog.save_button")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
