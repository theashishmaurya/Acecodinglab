'use client';

import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  Globe,
  ChevronDown,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  timezones,
  useCreateInterview,
} from './context/createInterview.context';

export default function DarkCalendarTimeSelector() {
  const {
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    timeFormat,
    setTimeFormat,
    duration,
    setDuration,
    sendEmail,
    setSendEmail,
    selectedTimezone,
    setSelectedTimezone,
    selectedTime,
    setSelectedTime,
  } = useCreateInterview();

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(
          `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        );
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const formatTime = (time: string) => {
    if (timeFormat === '12h') {
      const [hours, minutes] = time.split(':');
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      const hours12 = parseInt(hours) % 12 || 12;
      return `${hours12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }
    return time;
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <Card className="flex p-6 rounded-lg w-full">
      <div className="flex-none w-64 pr-6 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-2">Schedule Interview</h2>
        <p className="text-sm text-gray-400 mb-6">
          Please schedule your interview and select the right timezone and time
          when the canditate will be available.
        </p>
        <div className="space-y-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <Select
              value={`${duration}`}
              onValueChange={value => setDuration(+value)}
            >
              <SelectTrigger className="w-full bg-transparent border-gray-700">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="flex items-center">
            <Video className="w-5 h-5 mr-2" />
            <span>Cal Video</span>
          </div> */}
          <div className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  {selectedTimezone}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0">
                <ScrollArea className="h-72">
                  {timezones.map(tz => (
                    <Button
                      key={tz}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setSelectedTimezone(tz)}
                    >
                      {tz}
                    </Button>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center justify-between">
            <span>Send email</span>
            <Switch checked={sendEmail} onCheckedChange={setSendEmail} />
          </div>
        </div>
      </div>
      <div className="flex-1 px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day, dayIdx) => (
            <Button
              key={day.toString()}
              variant="ghost"
              className={cn(
                'h-10 w-10 p-0 font-normal',
                !isSameMonth(day, currentMonth) && 'text-gray-500',
                isSameDay(day, selectedDate) && 'bg-white text-black font-bold',
                isSameDay(day, new Date()) && 'text-blue-500 font-bold',
              )}
              onClick={() => setSelectedDate(day)}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')}>
                {format(day, 'd')}
              </time>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-[0.5] pl-6 border-l border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {format(selectedDate, 'EEE dd')}
          </h3>
          <div className="flex rounded-md bg-gray-800">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'rounded-r-none',
                timeFormat === '12h' && 'bg-gray-700',
              )}
              onClick={() => setTimeFormat('12h')}
            >
              12h
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'rounded-l-none',
                timeFormat === '24h' && 'bg-gray-700',
              )}
              onClick={() => setTimeFormat('24h')}
            >
              24h
            </Button>
          </div>
        </div>
        <ScrollArea className="h-80">
          <div className="space-y-2 pr-4">
            {timeSlots.map(time => (
              <Button
                key={time}
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal border-gray-700 hover:bg-gray-800',
                  selectedTime === time && 'bg-primary text-primary-foreground',
                )}
                onClick={() => handleTimeSelection(time)}
              >
                {formatTime(time)}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
