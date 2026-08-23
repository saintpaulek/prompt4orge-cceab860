import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CATALOG_SKELETON_COUNT, CatalogEmptyState, CatalogErrorState, CatalogSkeleton, buildCatalogInput, getCatalogRetryLabel, getRetryFeedback } from "./PromptLibrary";

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

  it("renders a useful empty shelf state and clear-filters action when filtered", () => {
    const onClear = vi.fn();
    const markup = renderToStaticMarkup(<CatalogEmptyState hasFilters onClear={onClear} />);
    const element = CatalogEmptyState({ hasFilters: true, onClear });
    const children = React.Children.toArray(element.props.children);
    const clearButton = children.find(child => React.isValidElement(child) && child.type === "button");

    expect(markup).toContain("No work orders match this search.");
    expect(markup).toContain("Clear filters");
    expect(markup).toContain("empty-illustration");
    if (React.isValidElement(clearButton)) {
      const typedButton = clearButton as React.ReactElement<{ onClick?: () => void }>;
      typedButton.props.onClick?.();
    }
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("builds trimmed search and category filters for the catalog query", () => {
    expect(buildCatalogInput("  carousel  ", "SMM", "FREE")).toEqual({ search: "carousel", category: "SMM", access: "FREE", sort: "NEWEST", limit: 60, offset: 0 });
    expect(buildCatalogInput("   ", "ALL", "ALL").search).toBeUndefined();
    expect(buildCatalogInput("", "ALL", "ALL", "OLDEST", 60).sort).toBe("OLDEST");
    expect(buildCatalogInput("", "ALL", "ALL", "POPULAR", 120).offset).toBe(120);
  });

  it("formats clear retry feedback for success and failure outcomes", () => {
    expect(getRetryFeedback(true, 12)).toEqual({ title: "Catalog refreshed", description: "12 work orders are ready." });
    expect(getRetryFeedback(false)).toEqual({ title: "Catalog refresh failed", description: "Check your connection and try again." });
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
