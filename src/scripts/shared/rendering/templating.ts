export const IfStateCSS = (text: string, condition: boolean): string => (condition ? text : '');

export const MapAndJoin = <T>(array: T[], fn: (arg0: T, arg1?: number) => string): string => array.map(fn).join('');
