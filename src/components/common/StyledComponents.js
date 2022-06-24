import styled from "styled-components";
import {Typography} from "@mui/material";

export const Confirmation = styled.div`
  display: flex;
  align-items: center;
  padding: 14px;
  margin: 6px;
  border-radius: 10px;
  background-color: #BBBBFF;
`;

export const TypographyTextCentered = styled(Typography)`
  text-align: center;
`;

export const CustomHr = styled.hr`
  border: none;
  height: ${props => props.height};
  border-radius: ${props => `calc(${props.height} / 3)`};
  background-color: rgba(0, 0, 0, 0.24);
`;
