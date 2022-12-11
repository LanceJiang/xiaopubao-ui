import Vue from 'vue'
import { XPBUIComponent, XPBUIComponentSize, XPBUIHorizontalAlignment } from './component'
// 相关ts声明 后续再做 todo...
import { XIcon } from './icon'
// import { XTable } from './table' // todo
// import { XFormConfig } from './formConfig'

export interface InstallationOptions {
  locale: any;
  i18n: any;
  // size: string;
}

/** The version of xiaopubao-ui */
export const version: string

export function install(vue: typeof Vue, options: InstallationOptions): void

/** XPBUI component common definition */
export type Component = XPBUIComponent

/** Component size definition for button, input, etc */
export type ComponentSize = XPBUIComponentSize

/** Horizontal alignment */
export type HorizontalAlignment = XPBUIHorizontalAlignment

/** Icon Component */
export class Icon extends XIcon {}

/** Table Component */
export class Table extends XTable {}
