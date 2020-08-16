import React from "react";
import styled from "styled-components";

const SidebarHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.5em;
`;

const SidebarHeaderIconSVG =  styled.svg.attrs({
  xmlns: 'http://www.w3.org/2000/svg',
})`
  height: 20px;
  width: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  margin-right: 0.25em;
`;

const SidebarHeaderText = styled.h2`
  font-family: "din-2014", sans-serif;
  font-weight: 600;
  font-size: 1.25em;
  text-transform: uppercase;
`;

const SidebarSectionHeader = (props) => (
  <SidebarHeaderContainer>
    <SidebarHeaderIconSVG viewBox="0 0 24 24">
      {props.svg}
    </SidebarHeaderIconSVG>
    <SidebarHeaderText>{props.title}</SidebarHeaderText>
  </SidebarHeaderContainer>
)

const SidebarSection = (props) => (
  <div>
    <SidebarSectionHeader title={props.title} svg={props.headerIconSvgContent} />
    {props.children}
  </div>
);

export default SidebarSection;
