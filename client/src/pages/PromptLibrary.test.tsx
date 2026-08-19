import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CATALOG_SKELETON_COUNT, CatalogErrorState, CatalogSkeleton, getCatalogRetryLabel } from "./PromptLibrary";

describe("PromptLibrary loading and retry states", () => {
  it("renders the expected accessible skeleton card count", () => {
    const markup = renderToStaticMarkup(<CatalogSkeleton />);

    expect(markup).toContain('aria-label="Loading prompt catalog"');
    expect(markup).toContain('aria-busy="true"');
    expect(markup.match(/skeleton-card/g)?.length).toBe(CATALOG_SKELETON_COUNT);
  });

  it("shows distinct retry labels while idle and fetching", () => {
    expect(getCatalogRetryLabel(false)).toBe("Retry catalog");
    expect(getCatalogRetryLabel(true)).toBe("Retrying…");
  });

  it("renders an actionable retry button and disables it during a retry", () => {
    const onRetry = () => undefined;
    const idleMarkup = renderToStaticMarkup(<CatalogErrorState isFetching={false} onRetry={onRetry} />);
    const fetchingMarkup = renderToStaticMarkup(<CatalogErrorState isFetching={true} onRetry={onRetry} />);

    expect(idleMarkup).toContain('role="alert"');
    expect(idleMarkup).toContain("Retry catalog");
    expect(idleMarkup).not.toContain("disabled");
    expect(fetchingMarkup).toContain("Retrying…");
    expect(fetchingMarkup).toContain("disabled");
    expect(fetchingMarkup).toContain('aria-busy="true"');
  });

  it("wires the idle retry button to the supplied recovery callback", () => {
    const onRetry = vi.fn();
    const element = CatalogErrorState({ isFetching: false, onRetry });
    const children = React.Children.toArray(element.props.children);
    const retryButton = children.find(child => React.isValidElement(child) && child.type === "button");

    expect(retryButton).toBeTruthy();
    if (React.isValidElement(retryButton)) {
      const typedButton = retryButton as React.ReactElement<{ onClick?: () => void }>;
      typedButton.props.onClick?.();
    }
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
