import {IconNameType} from "./Icons";

export interface ISideNavLink {
  location: string;
  name: string;
  path: string;
  paramNav?: IParamNavLink;
  group?: string;
  regexp?: string;
  isNew?: boolean;
  newCount?: number;
  roles?: string | string[];
  featureToggles?: string | string[];
  sourceSystems?: number | number[];
  actions?: INavAction[];
}

export interface IParamNavLink {
  featureToggle: string;
  roles?: string | string[];
  sourceSystems?: number | number[];
  links: {
    name: string;
    param: string;
  }[];
  location: string;
  navPath: string;
}

export interface INavAction {
  name: string;
  icon: string;
  link: string;
}

export interface IAppConfig {
  theme: {
    name: string;
    title: string;
    subTitle: string;
    printWebsite: string;
    printAddress: string;
    supportEmail: string;
    copyright: string;
  };
  sharedConfig: ISharedConfig;
  navigation: ISideNavLink[];
  navigationGroups: NavigationGroupModel[];
}

export interface NavigationGroupModel {
  name: string;
  label: string;
  icon: IconNameType;
  roles: string | string[];
  featureToggles?: string | string[];
}

interface ISharedConfig {
  multipliers: {
    [key: string]: number;
  };
  minZxcvbnScore: number;
  passwordPopupDays: number;
  cadenStagingEnvironments: string[];
}
