import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RecommendedJobs() {
  const jobs = [
    { title: 'UI/UX Designer', company: 'Globex Corporation', logo: 'N', remote: true, fullTime: true },
    { title: 'Web Developer', company: 'Sterling Cooper', logo: 'S', remote: true, fullTime: true },
    { title: 'Graphic Designer', company: 'Soylent Corp', logo: 'S', remote: false, fullTime: true },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recommended Job</CardTitle>
        <Badge variant="outline">SEE ALL</Badge>
      </CardHeader>
      <CardContent>
        {jobs.map((job, index) => (
          <div key={index} className="flex items-center space-x-4 mb-4">
            <div className={`w-10 h-10 rounded-full bg-${index === 0 ? 'green' : 'blue'}-500 flex items-center justify-center text-white font-bold`}>
              {job.logo}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company}</p>
            </div>
            <div className="space-x-2">
              {job.remote && <Badge variant="secondary">Remote</Badge>}
              {job.fullTime && <Badge variant="secondary">Full Time</Badge>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}