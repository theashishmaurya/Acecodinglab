import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Leaderboard() {
  const leaders = [
    { name: 'Abhishek Shar...', score: 181039, avatar: 'AS' },
    { name: 'Shaikh Tabrez', score: 147475, avatar: 'ST' },
    { name: 'Pradeep Sury...', score: 140403, avatar: 'PS' },
    { name: 'Pradeep Sury...', score: 140403, avatar: 'PS' },

  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">LEADERBOARD</CardTitle>
      </CardHeader>
      <CardContent>
        {leaders.map((leader, index) => (
          <div key={index} className="flex items-center space-x-4 mb-4">
            <div className="font-bold">#{index + 1}</div>
            <Avatar>
              <AvatarImage src={`/avatars/${index + 1}.png`} />
              <AvatarFallback>{leader.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">{leader.name}</div>
              <div className="text-sm text-gray-500">{leader.score}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}