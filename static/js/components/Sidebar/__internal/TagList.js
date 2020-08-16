import React from 'react';
import styled from 'styled-components';

const TagContainer = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 1em;
  margin: 8px;
`;

const TagChildrenContainer = styled.div`
  margin-left: 1em;
`;

const TagToggle = styled.span`
  background-color: ${(props) => props.checked ? `${props.color}33` : 'unset'};
  border-top-right-radius: 0.25em;
  border-bottom-right-radius: 0.25em;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
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
  margin-right: 0.2em;
`;

const TagText = styled.span`
  flex-grow: 1;
  padding: 0.2em;
`;

const Tag = (props) => {
  const {
    tag,
    onTagClicked,
    onTagCaretClick,
  } = props;
  return (
  <TagContainer>
    <TagToggle
      aria-checked={tag.visible}
      checked={tag.visible}
      color={tag.color}
      className={tag.visible ? 'checked' : ''}
      role="checkbox"
    >
      <TagText onClick={() => onTagClicked(tag)}>{tag.displayName}</TagText>
      {tag.children && <ExpandCollapseCaret expanded={tag.expanded} onClick={() => onTagCaretClick(tag)}/>}
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

const TagsContainer = styled.div``;

const getTopLevelTags = (tags) => Object.values(tags).filter(t => t.id.indexOf(':') === -1);

const TagList = (props) => (
  <TagsContainer className={props.className}>
    {getTopLevelTags(props.tags).map(tag => <TagFamily tag={tag} {...props} />)}
  </TagsContainer>
);

export default TagList;
