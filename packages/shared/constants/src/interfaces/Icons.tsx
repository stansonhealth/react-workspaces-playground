import * as icons from 'react-feather';

export type IconNameType = keyof typeof icons;

export type IconPropsType = {
  name: IconNameType;
  color?: string;
  size?: string | number;
};
