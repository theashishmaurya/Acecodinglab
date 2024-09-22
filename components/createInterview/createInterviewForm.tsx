"use client"
import React, { useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon, PencilIcon, TrashIcon, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useCreateInterview } from './context/createInterview.context';

const CreateInterviewForm = () => {
  const {
    intervieweeEmail, setIntervieweeEmail,
    infoUrl, setInfoUrl,
    interviewerIntro, setInterviewerIntro,
    notes, setNotes,
    file, setFile,
    filePreview, setFilePreview
  } = useCreateInterview();

  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
  };

  const handleFile = (selectedFile: File) => {
    const fileType = selectedFile.type;
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (fileType === 'application/pdf' || fileExtension === 'pdf') {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setFileError(null);
    } else if (
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileExtension === 'doc' ||
      fileExtension === 'docx'
    ) {
      setFile(selectedFile);
      setFilePreview(null); // We can't preview DOC/DOCX files
      setFileError(null);
    } else {
      setFileError('Please upload only PDF or DOC/DOCX files.');
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleDelete = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <CardContent className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4 flex-1">
        <h3 className="text-lg font-semibold">Interview Details</h3>
        <div className="space-y-2">
          <Label htmlFor="interviewee-email" >Interviewee Email Address (Required)</Label>
          <Input 
            id="interviewee-email" 
            placeholder="mrnobody@gmail.com" 
            value={intervieweeEmail}
            required
            onChange={(e) => setIntervieweeEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="info-url">Interviewee Information URL (Required)</Label>
          <Input 
            required
            id="info-url" 
            placeholder="https://www.behance.net/farhanzahid2" 
            value={infoUrl}
            onChange={(e) => setInfoUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interviewer-intro">Interviewee Introduction</Label>
          <Textarea 
            id="interviewer-intro" 
            placeholder="Enter introduction here" 
            value={interviewerIntro}
            onChange={(e) => setInterviewerIntro(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            placeholder="Enter notes here" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upload Resume (Required)</h3>
          <div className="flex space-x-2">
            <Button size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()}>
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleDelete}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div 
          className="flex items-center justify-center rounded-lg border-2 border-dashed p-12"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? (
            <div className="text-center">
              {filePreview ? (
                <embed src={filePreview} type="application/pdf" width="100%" height="200px" />
              ) : (
                <FileIcon className="mx-auto h-12 w-12 text-blue-500" />
              )}
              <p className="mt-2 text-sm">{file.name}</p>
            </div>
          ) : (
            <div className="text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-blue-500">Click to Upload or drag and drop</p>
              <p className="text-xs text-gray-500">PDF </p>
            </div>
          )}
        </div>
        {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
        <input 
          required
          type="file" 
          ref={fileInputRef}
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
        />
      </div>
    </CardContent>
  );
};

export default CreateInterviewForm;