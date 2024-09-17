"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UploadIcon, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"

const CreateInterViewForm = ()=>{
    return (
        
    <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 flex-1">
            <h3 className="text-lg font-semibold">Interview Details</h3>
            {/* <div className="space-y-2">
              <Label htmlFor="interviewer-email">Interviewer Email Address (Required)</Label>
              <Input id="interviewer-email" placeholder="mrnobody@inomadigital.com" />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="interviewee-email">Interviewee Email Address (Required)</Label>
              <Input id="interviewee-email" placeholder="mrnobody@gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="info-url">Interviewee Information URL</Label>
              <Input id="info-url" placeholder="https://www.behance.net/farhanzahid2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interviewer-intro">Interviewer Introduction</Label>
              <Textarea id="interviewer-intro" placeholder="Enter introduction here" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Enter notes here" />
            </div>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upload Resume</h3>
              <div className="flex space-x-2">
                <Button size="icon" variant="ghost">
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-12">
              <div className="text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-blue-500">Click to Upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG or PDF file</p>
              </div>
            </div>
          </div>
          </CardContent>
    )
}

export default CreateInterViewForm