export default interface UsersModel {
  user_id: string;
  email: string;
  display_name: string;
  profile_image_url?: string; // 'text null' suggests this is optional
  balance: number;
  created_at?: string; // Assuming ISO date string format, optional due to default value
  updated_at?: string; // Assuming ISO date string format, optional due to default value
  bio?: string; // 'character varying null' suggests this is optional
  lw_username: string;
}
export interface UserProfileForm {
  user_id: string;
  displayName: string;
  lwUsername?: string;
  bio?: string;
}
