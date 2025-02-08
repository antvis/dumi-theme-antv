import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import { useSnapshot } from 'valtio';
import { feedbackStore, invokeSectionFeedback, resetSectionFeedback } from '../../model/feedback';
import { SectionFeedbackCommentForm } from './SectionFeedbackCommentForm';

const StyledWrapper = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 0.5rem 1.2rem #f0f1f2;
  transition: height 0.3s ease-in-out;
  width: 262px;
  position: fixed;
  z-index: 1001;
  padding: 10px 18px;
  border-radius: 8px;
  transition: top 0.3s ease-in-out, right 0.3s ease-in-out;
`;

export const SectionFeedback: React.FC = () => {
  const feedbackState = useSnapshot(feedbackStore);
  const location = useLocation();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const buttons = document.querySelectorAll('.comment-link');
      if (!buttons || buttons.length === 0) return;

      const focusCommentInput = (e) => {
        const button = e.target.closest('.comment-link');
        invokeSectionFeedback(button.getAttribute('data-feedback-hash'));
      };

      buttons.forEach((button) => {
        button.addEventListener('click', focusCommentInput);
      });

      return () => {
        buttons.forEach((button) => {
          button.removeEventListener('click', focusCommentInput);
        });
      };
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  const [position, setPosition] = useState({ top: 0, right: 12 });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestCommentLink = target.closest('.comment-link');

      if (!feedbackState.section || !closestCommentLink) return;

      const escapedSection = CSS.escape(feedbackState.section);
      const elements = document.querySelectorAll(`.comment-link[data-feedback-hash=${escapedSection}]`);

      const closestElement = findClosetElement(e, elements);
      if (closestElement) {
        const rect = closestElement.getBoundingClientRect();
        const top = Math.min(Math.max(rect.top, 0), window.innerHeight - 380);
        setPosition({ top, right: 12 });
      }
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [feedbackState.section]);

  useEffect(() => {
    resetSectionFeedback();
  }, [location.pathname]);

  if (!feedbackState.section) return null;

  return (
    <StyledWrapper style={{ top: position.top, right: position.right }}>
      <SectionFeedbackCommentForm />
    </StyledWrapper>
  );
};

const findClosetElement = (e: MouseEvent, elements: NodeListOf<Element>) => {
  let closestElement = null;
  let closestDistance = Infinity;

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const distance = Math.sqrt(
      Math.pow(rect.left + rect.width / 2 - e.clientX, 2) + Math.pow(rect.top + rect.height / 2 - e.clientY, 2),
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestElement = element;
    }
  });
  return closestElement;
};
