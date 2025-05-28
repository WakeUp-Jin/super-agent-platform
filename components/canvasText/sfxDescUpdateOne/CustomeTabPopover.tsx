'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface CustomeTabPopoverProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onConfirm: (reason: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CustomeTabPopover({
  children,
  title = '删除标签',
  description = '请输入删除理由以确认操作',
  placeholder = '删除理由（可选）',
  buttonText = '确认',
  onConfirm,
  open,
  onOpenChange,
}: CustomeTabPopoverProps) {
  const [reason, setReason] = useState<string>('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onOpenChange?.(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold">{title}</h4>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            <button
              type="button"
              className="ring-offset-background focus:ring-ring cursor-pointer rounded-full opacity-70 transition-opacity hover:opacity-100"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div>
            <Input
              placeholder={placeholder}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <Button size="sm" onClick={handleConfirm} className="w-24 cursor-pointer">
              {buttonText}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
