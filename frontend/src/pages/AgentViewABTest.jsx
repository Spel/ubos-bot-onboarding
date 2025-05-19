import React from "react";
import ABTestWrapper from "../components/ABTestWrapper";
import AgentView from "./AgentView";
import AgentViewImproved from "./AgentViewImproved";

/**
 * AgentViewABTest component
 * Wraps the original and improved versions in the A/B test wrapper
 */
const AgentViewABTest = () => {
  return (
    <ABTestWrapper
      variantA={AgentView}
      variantB={AgentViewImproved}
    />
  );
};

export default AgentViewABTest;
