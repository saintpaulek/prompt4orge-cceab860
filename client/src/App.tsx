/* Workshop Noir style: the app defaults to a charcoal workbench so ember-orange actions and steel surfaces carry the hierarchy. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SeoHead from "./components/SeoHead";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return <><SeoHead/><Switch><Route path="/" component={Home}/><Route path="/library" component={Home}/><Route path="/pricing" component={Home}/><Route path="/about" component={Home}/><Route path="/contact" component={Home}/><Route path="/auth" component={Home}/><Route path="/account" component={Home}/><Route path="/admin/unlocks*" component={Home}/><Route path="/404" component={NotFound}/><Route component={NotFound}/></Switch></>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark" switchable><TooltipProvider><Toaster/><Router/></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
