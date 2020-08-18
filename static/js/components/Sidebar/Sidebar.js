import React from 'react';
import styled from 'styled-components';
import SidebarSection from './__internal/SidebarSection';
import TagList from './__internal/TagList';
import LinkList from './__internal/LinkList';
import otherCalendars from '../../other-calendars.json';

const SidebarWrapper = styled.div`
  flex-shrink: 0;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PaddedTagList = styled(TagList)`
  padding-left: 1em;
`;

const Sidebar = (props) => (
  <SidebarWrapper>
    <SidebarSection title="Filters" headerIconSvgContent={<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />}>
      <PaddedTagList {...props} />
    </SidebarSection>
    <SidebarSection title="Other Calendars" headerIconSvgContent={(
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    )}>
      <LinkList items={otherCalendars} />
    </SidebarSection>
  </SidebarWrapper>
);

export default Sidebar;
