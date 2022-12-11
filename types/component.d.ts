import Vue from 'vue'

/** XPBUI component common definition */
export declare class XPBUIComponent extends Vue {
  /** Install component into Vue */
  static install (vue: typeof Vue): void
}

/** Component size definition for button, input, etc */
export type XPBUIComponentSize = 'large' | 'small'

/** Horizontal alignment */
export type XPBUIHorizontalAlignment = 'left' | 'center' | 'right'
