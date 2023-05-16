type PartialKeys<T extends string> = Partial<Record<T, number | string>>;

type common = 'pos' | 'bgColor' | 'bdrs' | 'op' | 'zI';
type spacings = 'm' | 'mt' | 'mr' | 'mb' | 'ml' | 'mh' | 'mv' | 'p' | 'pt' | 'pr' | 'pb' | 'pl' | 'ph' | 'pv';
type flexbox = 'flex' | 'ai' | 'jc' | 'fd' | 'as';
type size = 'w' | 'minW' | 'maxW' | 'h' | 'minH' | 'maxH';

export const spacingsProps: PartialKeys<spacings> = {
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mh: 'marginHorizontal',
  mv: 'marginVertical',
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  ph: 'paddingHorizontal',
  pv: 'paddingVertical',
};

export const flexboxProps: PartialKeys<flexbox> = {
  flex: 'flex',
  ai: 'alignItems',
  jc: 'justifyContent',
  fd: 'flexDirection',
  as: 'alignSelf',
};

export const sizeProps: PartialKeys<size> = {
  w: 'width',
  minW: 'minWidth',
  maxW: 'maxWidth',
  h: 'height',
  minH: 'minHeight',
  maxH: 'maxHeight',
};

export const commonProps: PartialKeys<common> = {
  pos: 'position',
  bdrs: 'borderRadius',
  bgColor: 'backgroundColor',
  op: 'opacity',
  zI: 'zIndex',
};

type stylePropsKeys = common | spacings | flexbox | size;
export type StylePropsKeys = Partial<Record<stylePropsKeys, number | string>>;
export const styleProps: StylePropsKeys = { ...commonProps, ...spacingsProps, ...flexboxProps, ...sizeProps };
