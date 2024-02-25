export const AVATORS = [
  "😎",
  "😁",
  "😍",
  "😒",
  "😉",
  "🥰",
  "😘",
  "😍",
  "🙂",
  "🤗",
  "🤩",
  "🤔",
  "🫥",
  "🫡",
  "🤨",
  "😐",
  "🙄",
  "😏",
  "😥",
  "🥱",
  "😫",
  "😪",
  "😛",
  "😌",
  "😝",
].map((avator, index) => ({ avator, id: index }));

export const BACKEND_URL = "http://localhost:5050/api/v1";

export const TODO_STATUS = {
  CREATED: "CREATED",
  TODO: "TODO",
  IN_PROGRESS: "IN PROGRESS",
  COMPLETED: "COMPLETED",
  APPROVED: "APPROVED",
};
