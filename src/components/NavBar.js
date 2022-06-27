import styled from "styled-components";
import {Link} from "react-router-dom";


const NavBarRoot = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #C0C0C0;
  border-radius: 10px;
  margin-right: 10px;
`;

const LinkItem = styled(Link)`
  margin: 6px 3px;
  padding: 1em;
  border-radius: 4px;
  background-color: white;
  text-decoration: none;
  :hover {
    background-color: #DADADA;
  }
`;

const NavBar = () => {
    return (
        <NavBarRoot>
            <LinkItem to="/create">Create Projects</LinkItem>
            <LinkItem to="/edit">Edit Projects</LinkItem>
            <LinkItem to="/generate">View Project</LinkItem>
        </NavBarRoot>
    );
}

export default NavBar;
