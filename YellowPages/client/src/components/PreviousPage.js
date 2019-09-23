import React from 'react'
import { Link } from 'react-router-dom';
// import LanguageContext from '../context/language-context';

export default ({ page }) => {
  // const { language } = useContext(LanguageContext);
  // const link = language === 'en' ? `/en/${page}` : `/de/${page}`;
  // console.log('Link back', link, page);

  return (
      <Link to={page || '/'}>
          <button className="navigation-btn back icon-arrow-left">
              back
          </button>
      </Link>
  )
}
