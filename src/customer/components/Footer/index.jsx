import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t, i18n } = useTranslation('common')

    return ( 
         <footer className='border-4 border-blue-400 mt-10'>
      <div>
        <h2>Hotel</h2>

        <p>
          Experience comfort, hospitality, and unforgettable stays.
        </p>
      </div>

      <nav>
        <Link to="/">{t('home')}</Link>
        <Link to="/rooms">{t('rooms')}</Link>
        <Link to="/about">{t('about')}</Link>
        <Link to="/contact">{t('contact')}</Link>
      </nav>

      <p>
        © 2026 Hotel. All rights reserved.
      </p>
    </footer>
     );
}
 
export default Footer;