/* 
    Created by longdq
*/

import { User } from 'types/user';

export interface ItemUserGroupProps {
  item: User;
  goToChatDetail: (item: User) => void;
  removeUserGr: (item: User) => void;
}
