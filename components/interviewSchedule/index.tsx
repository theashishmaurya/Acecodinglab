import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function InterviewSchedule() {
  const interviews = [
    { name: 'Thamas Alva', post: 'Developer', designation: 'Backend', time: '11:30 AM', status: 'Incompleted' },
    { name: 'Masum Billah', post: 'Designer', designation: 'UI/UX', time: '12:00 PM', status: 'Completed' },
    { name: 'Smith Liwes', post: 'Content writer', designation: 'Writer', time: '12:30 PM', status: 'Processing' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate Name</TableHead>
              <TableHead>Post Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.map((interview, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`/avatars/${index + 1}.png`} />
                      <AvatarFallback>{interview.name[0]}</AvatarFallback>
                    </Avatar>
                    {interview.name}
                  </div>
                </TableCell>
                <TableCell>{interview.post}</TableCell>
                <TableCell>{interview.designation}</TableCell>
                <TableCell>{interview.time}</TableCell>
                <TableCell>
                  <Badge variant={interview.status === 'Completed' ? 'default' : interview.status === 'Incompleted' ? 'destructive' : 'outline'}>
                    {interview.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}