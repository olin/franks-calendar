import React from "react";
import styled from "styled-components";

const OtherCalendarsListWrapper = styled.ul`
  list-style: none;
  padding-left: 1em;
`;

const CalendarListItem = styled.li`
  &::before {
    content: '·';
    margin-right: 0.5em;
  }
`;

// Maybe this should be extracted from this file and saved in a
// place where it's shared with other components for a consistent
// link appearance
const Link = styled.a`
  color: #009BDF;
  font-family: "Lato", sans-serif;
  text-decoration: none;
  transition-duration: 0.3s;
  
  &:hover {
    opacity: 60%;
  }
`;

const ListItemLink = (props) => (
  <CalendarListItem>
    <Link href={props.item.url} target="_blank">{props.item.displayName}</Link>
  </CalendarListItem>
)

const LinkList = (props) => (
  <OtherCalendarsListWrapper>
    {props.items.map(item => <ListItemLink item={item} />)}
  </OtherCalendarsListWrapper>
);

export default LinkList;
