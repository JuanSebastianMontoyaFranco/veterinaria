import React from 'react';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
    return (
        <Container className="mt-5">
            {children}
        </Container>
    );
};

export default Layout;
