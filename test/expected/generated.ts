// prettier-ignore
export const I18nKeys = [
  "home.title","home.subtitle","info.another.level"
] as const;

export type I18nKey = typeof I18nKeys[number];
