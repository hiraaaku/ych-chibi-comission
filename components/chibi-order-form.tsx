"use client"

import type React from "react"

import { useState } from "react"
import { useForm, ValidationError } from "@formspree/react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

const hairHighlights = [
  {
    id: "cross",
    label: "Cross",
    image: "/images/highlight1.png",
  },
  {
    id: "swirl",
    label: "Swirl",
    image: "/images/highlight2.png",
  },
  {
    id: "sparkle",
    label: "Sparkle",
    image: "/images/highlight3.png",
  },
  {
    id: "star",
    label: "Star",
    image: "/images/highlight4.png",
  },
  {
    id: "wave",
    label: "Wave",
    image: "/images/highlight5.png",
  },
]

const claspColors = [
  "brown",
  "orange",
  "pink",
  "benhur",
  "black",
  "green",
  "purple",
  "light purple",
  "white",
  "blue",
  "tosca",
  "red",
  "silver",
  "gold",
  "light yellow",
  "yellow",
  "peach",
  "grey",
]

const starCharmColors = [
  "Green",
  "Light green",
  "Red",
  "Purple",
  "Yellow",
  "White (transparent)",
  "Light Blue",
  "Dark Blue",
  "Fuchsia",
  "Black",
  "Brown",
  "Orange",
  "Peach",
]

export default function ChibiOrderForm() {
  const [state, handleFormspreeSubmit] = useForm("xykgnvyr")

  const [formData, setFormData] = useState({
    nickname: "",
    username: "",
    characterName: "",
    referenceImage: "",
    type: "" as "fullset" | "png" | "",
    outlineColor: "",
    handPose: "",
    hairHighlights: [] as { type: string; position: string }[],
    clasp: "",
    charmColor: "",
  })
  const [hairHighlightError, setHairHighlightError] = useState("")

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setFormData({ ...formData, outlineColor: color.replace("#", "") })
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace("#", "").toUpperCase()
    if (value.length <= 6 && /^[0-9A-F]*$/.test(value)) {
      setFormData({ ...formData, outlineColor: value })
    }
  }

  const handleHighlightToggle = (type: string, position: "R" | "L") => {
    const existing = formData.hairHighlights.find((h) => h.type === type && h.position === position)

    if (existing) {
      setFormData({
        ...formData,
        hairHighlights: formData.hairHighlights.filter((h) => !(h.type === type && h.position === position)),
      })
      if (formData.hairHighlights.length - 1 <= 2) {
        setHairHighlightError("")
      }
    } else {
      if (formData.hairHighlights.length >= 2) {
        setHairHighlightError("You can select at most 2 boxes.")
        return
      }
      setFormData({
        ...formData,
        hairHighlights: [...formData.hairHighlights, { type, position }],
      })
      setHairHighlightError("")
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.type === "fullset" && (!formData.clasp || !formData.charmColor)) {
      alert("Please select both Clasp and Star Charm Color for Fullset type")
      return
    }

    const hairHighlightsFormatted = hairHighlights.reduce((acc, highlight) => {
      const positions = formData.hairHighlights.filter((h) => h.type === highlight.id).map((h) => h.position)

      if (positions.length > 0) {
        acc.push(`${highlight.label}: ${positions.join(", ")}`)
      }
      return acc
    }, [] as string[])

    const formElement = e.currentTarget
    const formDataToSubmit = new FormData(formElement)

    // Add hair highlights to form data if any are selected
    if (hairHighlightsFormatted.length > 0) {
      formDataToSubmit.set("hairHighlights", hairHighlightsFormatted.join(" | "))
    } else {
      formDataToSubmit.set("hairHighlights", "None")
    }

    // Submit to Formspree with the modified FormData
    handleFormspreeSubmit(formDataToSubmit as any)
  }

  if (state.succeeded) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-12 bg-white/80 backdrop-blur border-2 border-rose-200 text-center">
          <h2 className="font-mono text-2xl md:text-4xl font-bold text-rose-900 mb-4">Thank you for your order!</h2>
          <p className="font-mono text-rose-700">
            Your commission request has been submitted successfully. We'll contact you soon via your X DM.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6 font-mono bg-rose-500 hover:bg-rose-600 text-white"
          >
            Submit Another Order
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-mono text-3xl md:text-5xl font-bold text-center mb-2 text-rose-900 text-balance">
        YCH Chibi Commission Form
      </h1>
      <p className="text-center font-mono text-rose-900 mb-6">
        by{" "}
        <a href="https://x.com/yuuepye" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          yuuepye
        </a>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Reference Image */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur border-2 border-rose-200">
              <div className="relative aspect-video w-full">
                <Image
                  src="/images/chibi-3.png"
                  alt="Chibi reference showing hair highlights, outline color, and hand pose options"
                  fill
                  className="object-contain"
                />
              </div>
            </Card>

            {/* Hair Highlights Section */}
            <Card className="p-6 bg-white/80 backdrop-blur border-2 border-rose-200">
              <Label className="text-lg font-mono font-semibold text-rose-900 leading-none mb-0 block">Hair Highlights</Label>
              <p className="text-xs font-mono text-rose-600 mt-0">Select up to 2 boxes total.</p>
              <div className="space-y-2 mt-0.5">
                {hairHighlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className="flex items-center gap-2.5 p-1.5 rounded hover:bg-rose-50/50 transition-colors"
                  >
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={highlight.image || "/placeholder.svg"}
                        alt={highlight.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-mono text-sm min-w-[72px] text-rose-800">{highlight.label}</span>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <Checkbox
                          checked={formData.hairHighlights.some((h) => h.type === highlight.id && h.position === "L")}
                          onCheckedChange={() => handleHighlightToggle(highlight.id, "L")}
                        />
                        <span className="font-mono text-sm text-rose-700">L</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <Checkbox
                          checked={formData.hairHighlights.some((h) => h.type === highlight.id && h.position === "R")}
                          onCheckedChange={() => handleHighlightToggle(highlight.id, "R")}
                        />
                        <span className="font-mono text-sm text-rose-700">R</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {hairHighlightError && <p className="text-sm font-mono text-rose-600 mt-2">{hairHighlightError}</p>}
            </Card>
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="p-6 bg-white/80 backdrop-blur border-2 border-rose-200">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="nickname" className="font-mono text-rose-900">
                    Nickname
                  </Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="mt-1.5 font-mono border-rose-300 focus:border-rose-500"
                    placeholder="Your nickname"
                    required
                  />
                  <ValidationError prefix="Nickname" field="nickname" errors={state.errors} />
                </div>

                <div>
                  <Label htmlFor="username" className="font-mono text-rose-900 block mb-0.5">
                    Username (X)
                  </Label>
                  <p className="text-xs font-mono text-rose-600 my-0.5">Please make sure your DMs are open</p>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="mt-0.5 font-mono border-rose-300 focus:border-rose-500"
                    placeholder="@username"
                    required
                  />
                  <ValidationError prefix="Username" field="username" errors={state.errors} />
                </div>

                <div>
                  <Label htmlFor="characterName" className="font-mono text-rose-900 block mb-0.5">
                    Character Name
                  </Label>
                  <p className="text-xs font-mono text-rose-600 my-0.5">Please write OC if the character is an OC</p>
                  <Input
                    id="characterName"
                    name="characterName"
                    value={formData.characterName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        characterName: e.target.value,
                      })
                    }
                    className="mt-0.5 font-mono border-rose-300 focus:border-rose-500"
                    placeholder="Character name"
                    required
                  />
                  <ValidationError prefix="Character Name" field="characterName" errors={state.errors} />
                </div>

                <div>
                  <Label htmlFor="referenceImage" className="font-mono text-rose-900">
                    Reference Image
                  </Label>
                  <Input
                    id="referenceImage"
                    name="referenceImage"
                    value={formData.referenceImage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenceImage: e.target.value,
                      })
                    }
                    className="mt-1.5 font-mono border-rose-300 focus:border-rose-500"
                    placeholder="Please enter a publicly accessible link"
                    type="url"
                    required
                  />
                  <ValidationError prefix="Reference Image" field="referenceImage" errors={state.errors} />
                </div>
              </div>
            </Card>

            {/* Commission Details */}
            <Card className="p-6 bg-white/80 backdrop-blur border-2 border-rose-200">
              <div className="space-y-4">
                <div>
                  <Label className="font-mono text-rose-900 block mb-2">Type</Label>
                  <input type="hidden" name="type" value={formData.type} />
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.type === "fullset"}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            type: checked ? "fullset" : "",
                            clasp: "",
                            charmColor: "",
                          })
                        }}
                      />
                      <span className="font-mono text-sm text-rose-800">Fullset</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.type === "png"}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            type: checked ? "png" : "",
                            clasp: "",
                            charmColor: "",
                          })
                        }}
                      />
                      <span className="font-mono text-sm text-rose-800">PNG only</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="outlineColor" className="font-mono text-rose-900">
                    Outline Color
                  </Label>
                  <input type="hidden" name="outlineColor" value={`#${formData.outlineColor}`} />
                  <div className="flex gap-2 mt-1.5">
                    <div className="relative w-16 h-10 flex-shrink-0">
                      <input
                        type="color"
                        value={`#${formData.outlineColor.padEnd(6, "0")}`}
                        onChange={handleColorChange}
                        className="absolute inset-0 w-full h-full cursor-pointer border-2 border-rose-300 rounded"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-rose-600">#</span>
                      <Input
                        id="outlineColor"
                        value={formData.outlineColor}
                        onChange={handleHexInputChange}
                        className="font-mono border-rose-300 focus:border-rose-500 pl-7"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                  <ValidationError prefix="Outline Color" field="outlineColor" errors={state.errors} />
                </div>

                <div>
                  <Label htmlFor="handPose" className="font-mono text-rose-900">
                    Hand Pose
                  </Label>
                  <Textarea
                    id="handPose"
                    name="handPose"
                    value={formData.handPose}
                    onChange={(e) => setFormData({ ...formData, handPose: e.target.value })}
                    className="mt-1.5 font-mono border-rose-300 focus:border-rose-500 min-h-[120px]"
                    placeholder="Describe the hand pose you want"
                    required
                  />
                  <ValidationError prefix="Hand Pose" field="handPose" errors={state.errors} />
                </div>

                {formData.type === "png" && (
                  <div>
                    <Label htmlFor="clasp" className="font-mono text-rose-900">
                      Clasp
                    </Label>
                    <input type="hidden" name="clasp" value={formData.clasp} />
                    <Select
                      value={formData.clasp}
                      onValueChange={(value) => setFormData({ ...formData, clasp: value })}
                      required
                    >
                      <SelectTrigger className="mt-1.5 font-mono border-rose-300">
                        <SelectValue placeholder="Select clasp color" />
                      </SelectTrigger>
                      <SelectContent>
                        {claspColors.map((color) => (
                          <SelectItem key={color} value={color} className="font-mono capitalize">
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.type === "fullset" && (
                  <>
                    <div>
                      <Label htmlFor="clasp" className="font-mono text-rose-900">
                        Clasp
                      </Label>
                      <input type="hidden" name="clasp" value={formData.clasp} />
                      <Select
                        value={formData.clasp}
                        onValueChange={(value) => setFormData({ ...formData, clasp: value })}
                        required
                      >
                        <SelectTrigger className="mt-1.5 font-mono border-rose-300">
                          <SelectValue placeholder="Select clasp color" />
                        </SelectTrigger>
                        <SelectContent>
                          {claspColors.map((color) => (
                            <SelectItem key={color} value={color} className="font-mono capitalize">
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="charmColor" className="font-mono text-rose-900">
                        Star Charm Color
                      </Label>
                      <input type="hidden" name="starCharmColor" value={formData.charmColor} />
                      <Select
                        value={formData.charmColor}
                        onValueChange={(value) => setFormData({ ...formData, charmColor: value })}
                        required
                      >
                        <SelectTrigger className="mt-1.5 font-mono border-rose-300">
                          <SelectValue placeholder="Select star charm color" />
                        </SelectTrigger>
                        <SelectContent>
                          {starCharmColors.map((color) => (
                            <SelectItem key={color} value={color} className="font-mono">
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Button
              type="submit"
              disabled={state.submitting}
              className="w-full h-12 text-base font-mono font-semibold bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50"
            >
              {state.submitting ? "Submitting..." : "Submit Order"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
