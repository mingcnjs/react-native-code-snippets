import {useAppDispatch, useAppSelector} from '../../redux/store';
import {useCallback, useRef, useState} from 'react';
import {
  addUsersAction,
  CustomUserEntity,
  setUsersAction,
} from '../../redux/slices/chatSlice';
import {usePubNub} from 'pubnub-react';
import {useMount} from '../../hooks/useMount';

const USERS_FETCH_LIMIT = 15;
const USERS_FETCH_OPTIONS = {
  include: {
    customFields: true,
    totalCount: true,
  },
  sort: {
    name: 'asc',
  },
  limit: USERS_FETCH_LIMIT,
};

export function useUserList() {
  const pubnub = usePubNub();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const users = useAppSelector(state => state.chat.users);

  const next = useRef<string>();

  const fetch = useCallback(
    (nextToken?: string) => {
      pubnub.objects
        .getAllUUIDMetadata({
          ...USERS_FETCH_OPTIONS,
          ...(nextToken ? {page: {next: nextToken}} : {}),
        })
        .then(result => {
          next.current = result.next;
          if (nextToken) {
            dispatch(addUsersAction(result.data as CustomUserEntity[]));
          } else {
            dispatch(setUsersAction(result.data as CustomUserEntity[]));
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [pubnub.objects, dispatch],
  );

  const fetchMore = useCallback(() => {
    if (next.current) {
      fetch(next.current);
    }
  }, [fetch]);

  useMount(() => {
    fetch();
  });

  return {
    users: Object.values(users),
    fetchMore,
    isLoading,
    refetch: () => {
      setIsLoading(true);
      fetch();
    },
  };
}
