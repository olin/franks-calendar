import React from 'react';
import styled from 'styled-components';

const TagContainer = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 1em;
  margin: 8px;
`;

const TagChildrenContainer = styled.div`
  margin-left: 1em;
`

const TagToggle = styled.span`
  background-color: ${(props) => props.checked ? `${props.color}33` : 'unset'};
  border-top-right-radius: 0.25em;
  border-bottom-right-radius: 0.25em;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.2em 0.2em 0.2em 12px;
  position: relative;
  user-select: none;
  word-break: keep-all;
  
  &::before {
    background-color: ${(props) => props.checked ? props.color : 'unset'};
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 8px;
  }
`;

const ExpandCollapseCaret = (props) => (
  <StyledExpandCollapseCaretSVG viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </StyledExpandCollapseCaretSVG>
);

const StyledExpandCollapseCaretSVG = styled.svg.attrs({
  xmlns: 'http://www.w3.org/2000/svg',
})`
  height: 20px;
  width: 20px;
  fill: none;
  stroke: currentColor;
  transform: rotate(${(props) => props.expanded ? 90 : 0}deg);
`;

const TagText = styled.span`
  flex-grow: 1;
`;

const Tag = (props) => {
  const {
    tag,
    onTagClicked,
    onTagCaretClick,
  } = props;
  const {
    children,
    displayName,
    expanded,
    visible,
  } = tag;
  return (
  <TagContainer>
    <TagToggle
      aria-checked={visible}
      checked={visible}
      color={tag.color}
      className={visible ? 'checked' : ''}
      role="checkbox"
    >
      <TagText onClick={() => onTagClicked(tag)}>{displayName}</TagText>
      {children && <ExpandCollapseCaret expanded={expanded} onClick={() => onTagCaretClick(tag)}/>}
    </TagToggle>
  </TagContainer>
  );
};

const TagFamily = (props) => (
  <>
    <Tag {...props} />
    {props.tag.children && props.tag.expanded && (
      <TagChildrenContainer>
        {props.tag.children.map(childTagId => <TagFamily {...props} tag={props.tags[childTagId]}/>)}
      </TagChildrenContainer>
    )}
  </>
);

const SidebarWrapper = styled.div`
  flex-shrink: 0;
`;

const getTopLevelTags = (tags) => Object.values(tags).filter(t => t.id.indexOf(':') === -1);

const Sidebar = (props) => (
  <SidebarWrapper>
    <h2 className="Sidebar__header">
      <svg className="Sidebar__header__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
      FILTERS
    </h2>
    {getTopLevelTags(props.tags).map(tag => <TagFamily tag={tag} {...props} />)}
    <section className="Sidebar__section">
        <h2 className="Sidebar__header">
            <svg className="Sidebar__header__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            OTHER CALENDARS
        </h2>
        <ul className="Sidebar__filter__list">
            <li><p className="Sidebar__body">&#183;<a href="https://www.foundry.babson.edu/events-calendar" target="_blank"> The Weissman Foundry</a></p></li>
            <li><p className="Sidebar__body">&#183;<a href="http://calendar.babson.edu/" target="_blank"> Babson College</a></p></li>
            <li><p className="Sidebar__body">&#183;<a href="https://www.wellesley.edu/publiccalendar#/?i=1" target="_blank"> Wellesley College</a></p></li>
        </ul>
    </section>
  </SidebarWrapper>
);

export default Sidebar;
