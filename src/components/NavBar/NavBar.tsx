import './navBar.css';

type NavBarProps = {
  children: React.ReactNode;
};

const NavBar = ({ children }: NavBarProps) => {
  return (
    <nav className='nav-bar'>
      {children}
      
    </nav>
  );
};

export default NavBar;
