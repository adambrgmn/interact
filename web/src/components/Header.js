import React from 'react';
import { Link } from '@reach/router';

function Header() {
  return (
    <header>
      <div>
        <h1>
          <Link to="/">Interact</Link>
        </h1>
      </div>
    </header>
  );
}

export default Header;
