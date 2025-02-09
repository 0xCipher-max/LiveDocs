/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react'
import React, { useRef, useState, useEffect } from 'react'
import Loader from './Loader'
import Header from './Header';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Editor } from './editor/Editor';
import ActiveCollaboratorsList from './ActiveCollaboratorsList';
import { Input } from './ui/input';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';

const CollaborativeRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {
  const currentUserType = 'editor';

  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const updateTitleHndler = (e: React.KeyboardEvent<HTMLInputElement>) => {

  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    }
  }, [])
  

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <Header>
          <div ref = {containerRef} className="flex w-fit items-center justify-center gap-2">
            {editing && !loading ? (
              <Input 
                type = "text"
                value = {documentTitle}
                ref = {inputRef}
                placeholder='Enter Title'
                onChange={(e) => setDocumentTitle(e.target.value)}
                onKeyDown = {updateTitleHndler}
                disable = {!editing}
                className='document-title-input'
              />
            ) : (
              <>
                <p className='document-title'>{documentTitle}</p>
              </>
            ) }

            {currentUserType === 'editor' && !editing &&(
              <Image 
                src = "/assets/icons/edit.svg"
                alt = "edit"
                width = {24}
                height={24}
                onClick={()=> setEditing(true)}
                className='cursor-pointer'
              />
            )}

            {currentUserType !== 'editor' && !editing &&(
              <p className='view-only-tag'>View Only</p>
            )}

            {loading && <p className='text-sm text-gray-400'>Saving...</p>}
          </div>
          <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
            <ActiveCollaboratorsList />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          </div>
        </Header>
        <Editor />
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export default CollaborativeRoom 