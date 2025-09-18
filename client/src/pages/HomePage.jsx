import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { use, useEffect, useState } from 'react'
import { getRecomendedUsers, getUsersFriends, getOutgoingFriendRequest, sendFriendRequest } from '../lib/api.js';
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router'
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react'
import FriendCard, { getLanguageFlag } from '../components/FriendCard.jsx';
import NoFriendsFound from '../components/NoFriendsFound.jsx';


const HomePage = () => {

  const queryClient = useQueryClient();
  const [outGoingRequestIds, setOutGoingRequestIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriend, error: friendError } = useQuery({
    queryKey: ['friends'],
    queryFn: getUsersFriends
  });
  // console.log("friends error : ", friendError);

  const { data: recomendedUsers = [], isLoading: loadingUsers, error: recomendedUsersError } = useQuery({
    queryKey: ['users'],
    queryFn: getRecomendedUsers,
  });
  // console.log("recomendedUsersError error : ", recomendedUsersError);

  const { data: outgoingFriendRequest = [], error: outgoingFriendRequestError } = useQuery({
    queryKey: ['outgoingFriendRequest'],
    queryFn: getOutgoingFriendRequest
  });
  // console.log("outgoingFriendRequestError error : ", outgoingFriendRequestError);

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequest"] })
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendRequest && outgoingFriendRequest.length > 0) {
      outgoingFriendRequest.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      })
      setOutGoingRequestIds(outgoingIds);
    }
  }, [outgoingFriendRequest])



  return (
    <div className='p-4 sm:p-4 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to={'/notification'} className='btn btn-outline btn-sm'>
            <UsersIcon className='mr-2 size-4' />
            Friend Requests
          </Link>
        </div>

        {
          loadingFriend ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gp-4'>
              {
                friends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))
              }

            </div>
          )}

        <section>
          <div className='mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Meet New Learners</h2>
                <p className='opacity-70'>
                  Discover perfect language exchange partners base on your profile
                </p>
              </div>
            </div>
          </div>

          {
            loadingUsers ? (
              <div className='flex justify-center py-12'>
                <span className='loading loading-spinner loading-lg' />
              </div>
            ) : recomendedUsers.length === 0 ? (
              <div className='card bg-base-200 p-6 text-center'>
                <h3 className='font-semibold text-lg mb-2'>No recomendations available</h3>
                <p className='text-base-content opacity-70'>
                  Check back later for new language partners!
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {
                  recomendedUsers.map((user) => {
                    const hasRequestBeenSent = outGoingRequestIds.has(user._id);
                    return (
                      <div key={user._id} className='card bg-base-200 hover:shadow-lg transition-all duration-300'>
                        <div className='card-body p-5 space-y-4'>
                          <div className='flex items-center gap-3'>
                            <div className='avatar size-16 rounded-full'>
                              <img src={user.profilePic} alt={user.fullName} />
                            </div>

                            <div>
                              <h3 className='font-semibold text-lg'>{user.fullName}</h3>
                              {
                                user.location && (
                                  <div className='flex items-center text-xs opacity-70 mt-1'>
                                    <MapPinIcon className='size-3 mr-1' />
                                    {user.location}
                                  </div>
                                )
                              }
                            </div>
                          </div>

                          {/*  capatalize languages first word */}
                          <div className='flex flex-wrap gap-2 mb-3'>
                            <span className='badge badge-secondary text-xs' >
                              {getLanguageFlag(user.nativeLanguage)}
                              Native : {capaitialize(user.nativeLanguage)}
                            </span>
                            <span className='badge badge-secondary text-xs' >
                              {getLanguageFlag(user.learningLanguage)}
                              Learning : {capaitialize(user.learningLanguage)}
                            </span>
                          </div>

                          {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}

                          {/*  action button */}
                          <button className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                            }`}
                            onClick={() => sendRequestMutation(user._id)}
                            disabled={hasRequestBeenSent || isPending}
                          >
                            {
                              hasRequestBeenSent ? (
                                <>
                                  <CheckCircleIcon className='size-4 mr-2' />
                                  Request Sent
                                </>
                              ) : (
                                <>
                                  <UserPlusIcon className='size-4 mr-2' />
                                  Send Friend Request
                                </>
                              )}
                          </button>

                        </div>
                      </div>
                    )
                  })
                }

              </div>
            )
          }
        </section>

      </div>
    </div>
  )
}

export default HomePage


export const capaitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
