import { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { FiUser } from 'react-icons/fi';
import { TbLogout2 } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import {
  AvatarMenuContainer,
  AvatarMenuButton,
  AvatarMenuContent,
  AvatarMenuItem,
} from './Styles';

export default function AvatarMenu({
  imageUrl,
  initials,
  profileTo,
  onLogout,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleNavigateProfile = () => {
    navigate(profileTo);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <AvatarMenuContainer ref={containerRef}>
      <AvatarMenuButton
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        $imageUrl={imageUrl}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Menu do usuário"
      >
        {!imageUrl && initials}
      </AvatarMenuButton>

      {isOpen && (
        <AvatarMenuContent role="menu">
          <AvatarMenuItem
            type="button"
            onClick={handleNavigateProfile}
            role="menuitem"
          >
            <FiUser />
            Meu perfil
          </AvatarMenuItem>

          <AvatarMenuItem
            type="button"
            onClick={handleLogout}
            role="menuitem"
            $variant="danger"
          >
            <TbLogout2 />
            Sair
          </AvatarMenuItem>
        </AvatarMenuContent>
      )}
    </AvatarMenuContainer>
  );
}

AvatarMenu.propTypes = {
  imageUrl: PropTypes.string,
  initials: PropTypes.string.isRequired,
  profileTo: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

AvatarMenu.defaultProps = {
  imageUrl: null,
};
