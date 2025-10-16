/**
 * Application Constants
 */

export const PAGINATION_LIMITS = {
  TODOS: 100,
  THREADS: 50,
  MESSAGES: 100,
} as const;

export const MAX_LENGTHS = {
  TODO_TEXT: 500,
  THREAD_TITLE: 200,
  MESSAGE_CONTENT: 10000,
} as const;

export const RATE_LIMITS = {
  CREATE_TODO: 20, // per minute
  UPDATE_TODO: 30, // per minute
  DELETE_TODO: 20, // per minute
  CREATE_THREAD: 5, // per minute
  SEND_MESSAGE: 10, // per minute
} as const;
