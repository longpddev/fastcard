'use client';

import React, { memo, use } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import logo from '@/assets/logo-120.png';
import { useLogin } from '@/hooks/useLogin';
import { changeSettings, logout } from '@/services/auth/authSlice';
import IconCircle from '../IconCircle';
import { pushToast } from '../Toast';
import Submenu from './Submenu';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export type MenuLink = {
  path: string;
  label: string;
  icon: string;
  props?: {
    onClick: () => void;
  };
};
// const cachePromise = getGroupCard();
const Header = () => {
  const { isLogin } = useLogin();
  const dispatch = useDispatch();
  const navigate = useRouter();
  // const data = use(cachePromise);
  const menu: Array<MenuLink> = [
    {
      path: '/create-card',
      label: 'Create Card',
      icon: 'fa-brands fa-leanpub',
    },
    {
      path: '/list-card',
      label: 'List Card',
      icon: 'fas fa-list-ul',
    },
    {
      path: '/video',
      label: 'Video transcript',
      icon: 'fab fa-youtube',
    },

    {
      path: '/account',
      label: 'Account',
      icon: 'fas fa-user-gear',
    },
    {
      path: '',
      label: 'Logout',
      icon: 'fa-solid fa-arrow-right-from-bracket',
      props: {
        onClick: () => {
          pushToast.success('Logout success');
        },
      },
    },
  ];
  return (
    <header className="header sticky top-0 z-30 bg-slate-800 shadow-sm shadow-black">
      <div className="c-container flex h-full ">
        <Link href={'/'}>
          <Image
            src={logo}
            width={100}
            className="h-full object-contain py-2"
            height={100}
            title="logo site"
            alt="logo site"
          />
        </Link>
        <div className="ml-auto py-2"></div>
        <div
          className="group relative py-2"
          // force init element for submenu auto close
          key={Math.random().toString(32).slice(2, 7)}
        >
          {isLogin ? (
            <>
              <IconCircle
                className="fas fa-user-gear relative left-[2px] "
                wrapClass="block-up"
              ></IconCircle>
              <Submenu
                className="invisible absolute right-0 top-[85%] opacity-0 transition-all group-hover:visible group-hover:top-full group-hover:opacity-100"
                list={menu}
              />
            </>
          ) : (
            <IconCircle
              onClick={() => navigate.push('/login')}
              className="fa-solid fa-arrow-right-to-bracket relative left-[2px] "
              wrapClass="block-up"
            ></IconCircle>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
