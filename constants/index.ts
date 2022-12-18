export const CARD_LEARN_CSS_VAR = '--card-learn-height';
export const TOKEN_KEY = 'login-token';
export const CARD_TYPE = {
  question: 'question',
  answer: 'answer',
  explain: 'explain',
} as const;

export const CARD_LEAN_TYPE = {
  hard: 'hard',
  good: 'good',
  repeat: 'repeat',
} as const;

export const KEY_NAME = {
  Backspace: 'Backspace',
  Control: 'Control',
  Meta: 'Meta',
  Alt: 'Alt',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  Shift: 'Shift',
  Enter: 'Enter',
  Escape: 'Escape',
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',
  Tab: 'Tab',
  CapsLock: 'CapsLock',
} as const;

export const SPECIAL_KEY = /** @type {{
  Shift: "shift;",
  Ctrl: "ctrl;",
  Alt: "alt;",
  Command: "command;"
} as const } */ {
  Shift: 'shift;',
  Ctrl: 'ctrl;',
  Alt: 'alt;',
  Command: 'command;',
} as const;

export const ATTRIBUTE_SHORTCUT_BUTTON = 'datashortcutexplain';

export const SHORTCUT_UNDO = SPECIAL_KEY.Ctrl + 'z';
export const SHORTCUT_RE_UNDO = SPECIAL_KEY.Ctrl + 'u';
export const SHORTCUT_CARD_FLIP = SPECIAL_KEY.Ctrl + 'f';
export const SHORTCUT_CARD_VIEW_RESULT = SPECIAL_KEY.Ctrl + KEY_NAME.Enter;
export const SHORTCUT_CARD_ACTION_REPEAT = SPECIAL_KEY.Ctrl + 'r';
export const SHORTCUT_CARD_ACTION_GOOD = SPECIAL_KEY.Ctrl + 'g';
export const SHORTCUT_CARD_ACTION_HARD = SPECIAL_KEY.Ctrl + 'h';
export const SHORTCUT_TOGGLE_GUILD_SHORTCUT = SPECIAL_KEY.Command + 'p';
export const SHORTCUT_ESCAPE = KEY_NAME.Escape;
export const SHORTCUT_TOGGLE_WORD_DEFINITION = SPECIAL_KEY.Ctrl + 's';
export const SHORTCUT_WORD_DEFINITION_BACK =
  SPECIAL_KEY.Command + KEY_NAME.ArrowLeft;
export const SHORTCUT_WORD_DEFINITION_NEXT =
  SPECIAL_KEY.Command + KEY_NAME.ArrowRight;
export const SHORTCUT_ACCEPT = KEY_NAME.Enter;

export const SHORTCUT_TOGGLE_TRANSLATE = SPECIAL_KEY.Ctrl + 't';
export const SHORTCUT_TYPING_TRANSLATE_TOGGLE_PLACEHOLDER =
  SPECIAL_KEY.Shift + KEY_NAME.Enter;

export const SHORTCUT_VIDEO_PLAYER_REPEAT = SPECIAL_KEY.Ctrl + 'r';
export const SHORTCUT_VIDEO_PLAYER_NEXT = KEY_NAME.ArrowRight;
export const SHORTCUT_VIDEO_PLAYER_PREV = KEY_NAME.ArrowLeft;

export const SHORTCUT_VIDEO_PLAYER_FULLSCREEN =
  SPECIAL_KEY.Command + KEY_NAME.F11;

export const SHORTCUT_VIDEO_PLAYER_CHANGE_MODE = SPECIAL_KEY.Ctrl + 'm';

export const SHORTCUT_VIDEO_PLAYER_TRANSCRIPT_FOCUS =
  SPECIAL_KEY.Ctrl + KEY_NAME.Enter;

export const ALL_SHORTCUT = {
  SHORTCUT_UNDO,
  SHORTCUT_RE_UNDO,
  SHORTCUT_CARD_FLIP,
  SHORTCUT_CARD_VIEW_RESULT,
  SHORTCUT_CARD_ACTION_REPEAT,
  SHORTCUT_CARD_ACTION_GOOD,
  SHORTCUT_CARD_ACTION_HARD,
  SHORTCUT_TOGGLE_GUILD_SHORTCUT,
  SHORTCUT_ESCAPE,
  SHORTCUT_TOGGLE_WORD_DEFINITION,
  SHORTCUT_WORD_DEFINITION_BACK,
  SHORTCUT_WORD_DEFINITION_NEXT,
  SHORTCUT_ACCEPT,
  SHORTCUT_TOGGLE_TRANSLATE,
  SHORTCUT_TYPING_TRANSLATE_TOGGLE_PLACEHOLDER,
  SHORTCUT_VIDEO_PLAYER_REPEAT,
  SHORTCUT_VIDEO_PLAYER_FULLSCREEN,
  SHORTCUT_VIDEO_PLAYER_CHANGE_MODE,
  SHORTCUT_VIDEO_PLAYER_TRANSCRIPT_FOCUS,
};

export const ROUTER = {
  login: '/login',
  home: '/',
};
