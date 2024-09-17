import React from 'react';
import Messages from './Messages';
import ChatInput from './ChatInput';
import { trpc } from '@/app/_trpc/client';
import { Loader2 } from 'lucide-react';
import { UploadStatus } from '@prisma/client'; // Import the UploadStatus enum

interface ChatWrapperProps {
  fileId: string;
}

// Define the type for the upload status response
interface UploadStatusResponse {
  status: UploadStatus;
}

const ChatWrapper = ({
  fileId
}: ChatWrapperProps) => {

  // Handle loading or no data
  if (false) {
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-zinc-500 text-sm">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render the chat interface and handle different file statuses
  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
      <div className="flex-1 justify-between flex flex-col mb-28">
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatWrapper;
