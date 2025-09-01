"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type OptionsInputProps = {
  initialOptions?: string[]
}

export default function OptionsInput({ initialOptions = ["", ""] }: OptionsInputProps) {
  const [options, setOptions] = useState<string[]>(initialOptions)

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)))
  }

  const addOption = () => {
    setOptions((prev) => [...prev, ""])
  }

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {options.map((value, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder={`Option ${index + 1}`}
            value={value}
            onChange={(e) => updateOption(index, e.target.value)}
            name="options"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => removeOption(index)}
            aria-label={`Remove option ${index + 1}`}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="link" onClick={addOption}>
        + Add Option
      </Button>
      {/* Hidden inputs to submit all options values */}
      <div className="hidden">
        {options.map((value, idx) => (
          <input key={idx} type="hidden" name="options" value={value} />
        ))}
      </div>
    </div>
  )
}


