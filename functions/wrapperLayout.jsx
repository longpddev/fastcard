'use client';

import { useCallback } from 'react';
import componentToWrapper from './componentToWrapper';

// transform Layout Component to wrapper component for easy to using
// sample:
//  const Layout = () => (<main>layout</main>)
//  const wrapper = wrapperLayout(Layout)
//
//  -- page file--
//  const page = ({titlePage}) => {
//    titlePage('home page')
//    return (<page></page>)
//  }
//  export default wrapper(page)
export default function wrapperLayout(Layout) {
  return function LayoutTemplate(Page) {
    // current we want add title feature for page
    function AddSomeMethodForPage(props) {
      const titlePage = useCallback((title) => {
        if (document.title !== title) document.title = title;
      }, []);
      return <Page {...props} titlePage={titlePage} />;
    }

    return componentToWrapper(Layout, AddSomeMethodForPage);
  };
}
