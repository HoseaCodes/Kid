export const ToastType = {
// export interface ToastType {
  id,
  title,  
  color
  // id: string;
  // title: string;
  // color: "success" | "primary" | "warning" | "danger" | undefined;
}

export const BreadCrumbsType = {
  text,
  href,
  onClick
}
// export interface BreadCrumbsType {
//   text: string;
//   href?: string;
//   onClick?: () => void;
// }

// export type MeetingJoinType = "anyone-can-join" | "video-conference" | "1-on-1";

export const MeetingJoinType = "anyone-can-join" | "video-conference" | "1-on-1";

export const MeetingType = {
  docId,
  createdBy,
  invitedUsers,
  maxUsers,
  meetingDate,
  meetingId,
  meetingName,
  meetingType,
  status
}

// export interface MeetingType {
//   docId?: string;
//   createdBy: string;
//   invitedUsers: Array<string>;
//   maxUsers: number;
//   meetingDate: string;
//   meetingId: string;
//   meetingName: string;
//   meetingType: MeetingJoinType;
//   status: boolean;
// }

export const UserType = {
  email,
  name,
  uid,
  label
}
// export interface UserType {
//   email: string;
//   name: string;
//   uid: string;
//   label?: string;
// }

export const FieldErrorType = {
  show,
  message
}

// export interface FieldErrorType {
//   show: boolean;
//   message: Array<string>;
// }
