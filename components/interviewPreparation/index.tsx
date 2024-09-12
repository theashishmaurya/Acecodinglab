import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function InterviewPreparation() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="">
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">Interview Preparation Kit</h3>
          <p className="text-sm mb-2">Systematic study plan by industry experts</p>
          <Button variant="link">View Plans →</Button>
        </CardContent>
      </Card>
      {/* <Card className="">
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">Mock Assessment</h3>
          <Button variant="link">Assess your coding skills →</Button>
        </CardContent>
      </Card> */}
      <Card className="col-span-1">
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">Peer Mock Interview</h3>
          <Button variant="link">Live interview practice →</Button>
        </CardContent>
      </Card>
    </div>
  );
}