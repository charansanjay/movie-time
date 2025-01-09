import './logo.css';
import appLogo from '../../../images/cinema.svg';

const Logo = () => {
  return (
    <div className='logo'>
      <img alt='action cut' src={appLogo} />
      <h1>Movie Time</h1>
    </div>
  );
};

export default Logo;
