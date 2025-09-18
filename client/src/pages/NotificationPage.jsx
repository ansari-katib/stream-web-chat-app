import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { accetFriendRequest, getFriendRequest } from '../lib/api';
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from 'lucide-react'
import { getLanguageFlag } from '../components/FriendCard';
import { capaitialize } from './HomePage';
import NoNotificationsFound from '../components/NoNotificationsFound';

const NotificationPage = () => {

  const queryClient = useQueryClient();

  const { data: friendRequest, isLoading } = useQuery({
    queryKey: ["friendRequest"],
    queryFn: getFriendRequest
  });

  const { mutate: accetFriendRequestMutation, isPending } = useMutation({
    mutationFn: accetFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    }
  });

  const incomingRequest = friendRequest?.incomingReqs || []
  const acceptedRequest = friendRequest?.acceptedReqs || []

  return (
    <div className='p-4 sm:p-4 lg:p-8'>
      <div className='container mx-auto max-w-4xl space-y-8'>
        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mb-6'>Notification</h1>
        {isLoading ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-dots loading-lg' />
          </div>
        ) : (
          <>
            {
              incomingRequest.length > 0 && (
                <section className='space-y-4'>
                  <h2 className='text-xl font-semibold flex items-center gap-2'>
                    <UserCheckIcon className='h-5 w-5 text-primary' />
                    Friend Request
                    <span className='badge badge-primary rounded-full ml-2'>{incomingRequest.length}</span>
                  </h2>

                  <div className='space-y-3'>
                    {
                      incomingRequest.map((request) => (
                        <div
                          key={request._id}
                          className='card bg-base-200 shadow-sm hover:shadow-md transition-shadow'
                        >
                          <div className='card-body p-4'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-3'>
                                <div className='avatar w-14 h-14 rounded-full bg-base-300'>
                                  <img src={request.sender.profilePic} alt={request.sender.fullName} />
                                </div>
                                <div>
                                  <h3 className='font-semibold'>{request.sender.fullName}</h3>
                                  <div className='flex flex-wrap gap-1.5 mt-1'>
                                    <span className='badge badge-secondary badge-xs' >
                                      {getLanguageFlag(request.sender.nativeLanguage)}
                                      Native : {capaitialize(request.sender.nativeLanguage)}
                                    </span>
                                    <span className='badge badge-primary badge-xs' >
                                      {getLanguageFlag(request.sender.learningLanguage)}
                                      Learning : {capaitialize(request.sender.learningLanguage)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button className='btn btn-primary btn-sm'
                                onClick={() => accetFriendRequestMutation(request._id)}
                                disabled={isPending}
                              >
                                Accept
                              </button>
                            </div>

                          </div>
                        </div>
                      ))
                    }
                  </div>
                </section>
              )
            }

            {/* accepted notification */}

            {
              acceptedRequest.length > 0 && (
                <section className='space-y-4'>
                  <h2 className='text-xl font-semibold flex items-center gap-2'>
                    <BellIcon className='h-5 w-5 text-success' />
                    New Connections
                  </h2>

                  <div className='space-y-3'>
                    {
                      acceptedRequest.map((notification) => (
                        <div key={notification._id} className='card bg-base-200 shadow-sm'>
                          <div className='card-body p-4'>
                            <div className='flex items-start justify-between p-4'>
                              <div className='flex items-center  gap-3'>
                                <div className='avatar mt-1 size-10 rounded-full bg-base-300'>
                                  <img src={notification.recipient.profilePic} alt={notification.recipient.fullName} />
                                </div>
                                <div className='flex-1'>
                                  <h3 className='font-semibold'>{notification.recipient.fullName}</h3>
                                  <p className='text-sm my-1' >
                                    {notification.recipient.fullName} accepted your friend request
                                  </p>
                                  <p className='text-sm my-1 flex items-center ' >
                                    <ClockIcon className='h-3 w-3 mr-1' />
                                    Recently
                                  </p>
                                </div>
                              </div>
                              <div className='btn btn-primary btn-sm'>
                                <MessageSquareIcon className='h-3 w-3 mr-1' />
                                New Friendt
                              </div>
                            </div>

                          </div>
                        </div>
                      ))
                    }
                  </div>
                </section>
              )
            }

            {incomingRequest.length === 0 && acceptedRequest.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>

    </div>
  )
}

export default NotificationPage
