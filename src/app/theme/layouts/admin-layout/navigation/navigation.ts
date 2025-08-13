export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Home',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'challanbook',
    title: 'Challan Book',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'newcontractorchallan',
        title: 'New Challan (Contractor)',
        type: 'item',
        classes: 'nav-item',
        url: '/newcontractorchallan',
        icon: 'ant-design'
      },
      // {
      //   id: 'searchcontractorchallan',
      //   title: 'Search Challan (Contractor)',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: '/searchcontractorchallan',
      //   icon: 'profile'
      // },
      {
        id: 'newpartychallan',
        title: 'New Challan (Party)',
        type: 'item',
        classes: 'nav-item',
        url: '/newpartychallan',
        icon: 'ant-design'
      }
      // ,
      // {
      //   id: 'searchpartychallan',
      //   title: 'Search Challan (Party)',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: '/searchpartychallan',
      //   icon: 'profile'
      // }
    ]
  },
  {
    id: 'register',
    title: 'Register',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'stockregister',
        title: 'Stock',
        type: 'item',
        classes: 'nav-item',
        url: '/stockregister',
        icon: 'profile'
      },
      {
        id: 'contractorstockregister',
        title: 'Contractor Stock',
        type: 'item',
        classes: 'nav-item',
        url: '/contractorstockregister',
        icon: 'profile'
      },
      {
        id: 'partychallanregister',
        title: 'Party Challan Register',
        type: 'item',
        classes: 'nav-item',
        url: '/partychallanregister',
        icon: 'profile'
      },
      {
        id: 'contractorchallanregister',
        title: 'Contractor Challan Register',
        type: 'item',
        classes: 'nav-item',
        url: '/contractorchallanregister',
        icon: 'profile'
      }
    ]
  },
  {
    id: 'masterdata',
    title: 'Master Data',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'color',
        title: 'Color',
        type: 'item',
        classes: 'nav-item',
        url: '/color',
        icon: 'ant-design'
      },
      {
        id: 'design',
        title: 'Design',
        type: 'item',
        classes: 'nav-item',
        url: '/design',
        icon: 'ant-design'
      },
      {
        id: 'party',
        title: 'Party',
        type: 'item',
        classes: 'nav-item',
        url: '/party',
        icon: 'ant-design'
      },
      {
        id: 'contractor',
        title: 'Contractor',
        type: 'item',
        classes: 'nav-item',
        url: '/contractor',
        icon: 'ant-design'
      }
    ]
  },
  // {
  //   id: 'color',
  //   title: 'Color',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'newcolor',
  //       title: 'New Color',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/newcolor',
  //       icon: 'bg-colors'
  //     },
  //     {
  //       id: 'searchcolor',
  //       title: 'Search Color',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/searchcolor',
  //       icon: 'profile'
  //     }
  //   ]
  // },
  // {
  //   id: 'design',
  //   title: 'Design',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'newdesign',
  //       title: 'New Design',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/newdesign',
  //       icon: 'ant-design'
  //     },
  //     {
  //       id: 'searchdesign',
  //       title: 'Search Design',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/searchdesign',
  //       icon: 'profile'
  //     }
  //   ]
  // },
  // {
  //   id: 'party',
  //   title: 'Party',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'newparty',
  //       title: 'New Party',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/newparty',
  //       icon: 'ant-design'
  //     },
  //     {
  //       id: 'searchparty',
  //       title: 'Search Party',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/searchparty',
  //       icon: 'profile'
  //     }
  //   ]
  // },
  // {
  //   id: 'contractor',
  //   title: 'Contractor',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'newcontractor',
  //       title: 'New Contractor',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/newcontractor',
  //       icon: 'ant-design'
  //     },
  //     {
  //       id: 'searchcontractor',
  //       title: 'Search Contractor',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/searchcontractor',
  //       icon: 'profile'
  //     }
  //   ]
  // },
  {
    id: 'user',
    title: 'User Management',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'newuser',
        title: 'New User',
        type: 'item',
        classes: 'nav-item',
        url: '/newuser',
        icon: 'ant-design'
      },
      {
        id: 'searchuser',
        title: 'Search User',
        type: 'item',
        classes: 'nav-item',
        url: '/searchuser',
        icon: 'ant-design'
      }

      // {
      //   id: 'users',
      //   title: 'Users',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: '/users',
      //   icon: 'ant-design'
      // }

    ]
  }
];
