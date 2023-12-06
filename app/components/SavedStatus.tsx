'use client'
import React from 'react'
import { CheckMarkInCircle, Cross, CrossInCircle } from './Icons'

export enum SavedNotificationStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

const SavedStatus = ({
  state,
  handleClose,
}: {
  state: { status: SavedNotificationStatus; message?: string | undefined }
  handleClose: () => void
}) => (
  <div className="absolute min-w-10 top-0 space-between right-0 bg-neutral-100 m-8 rounded-md drop-shadow-2xl">
    <div className="p-4">
      <div className="flex items-start">
        <div className="shrink-0">
          {state.status === SavedNotificationStatus.SUCCESS ? (
            <CheckMarkInCircle />
          ) : (
            <CrossInCircle />
          )}
        </div>
        <div className="ml-2 text-s">
          {state.status === SavedNotificationStatus.SUCCESS && (
            <p className="mb-1 text-s">Successfully saved!</p>
          )}
          {state.status === SavedNotificationStatus.FAILURE && (
            <>
              <p className="mb-1 text-s">Save Failed</p>
              <p className="color-gray-50 text-xs">
                {state.message || 'An error happened, Please try again!'}
              </p>
            </>
          )}
        </div>
        <div className="flex shrink-0 ml-2">
          <button type="button" onClick={handleClose}>
            <Cross />
          </button>
        </div>
      </div>
    </div>
  </div>
)

export default SavedStatus
