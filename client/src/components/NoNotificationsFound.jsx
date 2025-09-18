import { BellIcon } from 'lucide-react'
import React from 'react'

const NoNotificationsFound = () => {
    return (
        <div className='flex flex-col items-center justify-center py-16 text-center'>
            <div className='size-16 rounded-full bg-base-300 flex items-center justify-center mb-4'>
                <BellIcon className='size-8 text-base-content opacity-40' />
            </div>
            <h3 className='font-semibold text-lg mb-2'>No notification yet</h3>
            <p className='text-base-content opacity-70 max-w-md'>
                when you recieve friend request or message , they'll appear here.
            </p>
        </div>
    )
}

export default NoNotificationsFound
