import React, { useState } from 'react';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse
} from 'mdbreact';
import { useWalletSelector } from '../../contexts/WalletSelectorContext'
import { BrowserRouter as Router } from 'react-router-dom';
import { useGlobalState, useGlobalMutation } from '../../utils/container';
import useRouter from '../../utils/use-router';
import useChangeDao from '../../hooks/useChangeDao';

import "@near-wallet-selector/modal-ui/styles.css"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const stateCtx = useGlobalState();
  const mutationCtx = useGlobalMutation();
  const routerCtx = useRouter();

  const handleDaoChange = useChangeDao({ routerCtx, mutationCtx });

  const { modal, selector, accountId } = useWalletSelector();

  const isSignedIn = selector?.isSignedIn();

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const handleSignIn = async () => {
    console.log(modal, 'modal1');

    if(selector) {
      modal.show();
    }
  }

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  };

  return (
    <Router>
      <MDBNavbar color="stylish-color-dark" dark expand="md" className="mb-2">
        <MDBNavbarBrand>
          <MDBNavLink className="white-text mr-2" to="/" onClick={handleDaoChange}>
            <img
              className="d-inline-block"
              style={{ filter: 'brightness(0) invert(1)' }}
              height="30"
              src="https://gov.near.org/uploads/default/original/1X/7aa6fc28cbccdc2242717e8fe4c756829d90aaec.png"
            />
            sputnik v2 beta
          </MDBNavLink>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
          <MDBNavbarNav className="white-text" left>
            <MDBNavItem className="">
              <MDBNavbarBrand>{stateCtx.config.contract}</MDBNavbarBrand>
            </MDBNavItem>
          </MDBNavbarNav>
          <MDBNavbarNav right>
            <MDBNavItem>{/* <DaoSearch /> */}</MDBNavItem>
            {!isSignedIn ? (
              <MDBNavItem active>
                <MDBNavLink to="#" onClick={handleSignIn}>
                  Sign In
                </MDBNavLink>
              </MDBNavItem>
            ) : (
              <>
                <MDBNavItem active>
                  <MDBNavbarBrand>{accountId}</MDBNavbarBrand>
                </MDBNavItem>
                <MDBNavItem active>
                  <MDBNavLink to="#" onClick={handleSignOut}>
                    Sign Out
                  </MDBNavLink>
                </MDBNavItem>
              </>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    </Router>
  );
};

export default Navbar;
